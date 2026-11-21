// TO START SERVER: npm run start:dev
// view swagger : http://localhost:3080/api-docs/
// Ref: https://medium.com/swlh/angular-node-and-postgresql-4a07d597be07

// sql standard ref : https://towardsdatascience.com/10-sql-standards-to-make-your-code-more-readable-in-2021-4410dc50b909

require("dotenv").config();

const express = require('express');
const bodyParser = require("body-parser");
const format = require("pg-format");
const app = express();
const rootUrl = '/api/v1';

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');

// Postgres Configuration
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected Error:', err);
  process.exit(-1);
});

app.use(bodyParser.json());





///////////////////////////////////
//// TAGS /////////////////////////
///////////////////////////////////

app.post(`${rootUrl}/tags`, (req, res) => {
  const {parent_tag_id, title, color, description, playlist_id} = req.body;
  const requestedIsShared = req.body.is_shared === undefined ? false : req.body.is_shared;

  if (typeof requestedIsShared !== 'boolean') {
    return res.status(400).json({ error: 'is_shared must be a boolean.' });
  }

 ;(async () => {
   const client = await pool.connect();
   let transactionStarted = false;
   try {
     await client.query('BEGIN');
     transactionStarted = true;

     let isShared = requestedIsShared;
     if (parent_tag_id !== 0) {
       const parentResult = await client.query(
         `SELECT is_shared
          FROM tag
          WHERE tag_id = $1 AND parent_tag_id = 0
          FOR SHARE`,
         [parent_tag_id]
       );

       if (parentResult.rowCount === 0) {
         await client.query('ROLLBACK');
         transactionStarted = false;
         return res.status(400).json({ error: 'The selected parent must be a tag group.' });
       }

       isShared = parentResult.rows[0].is_shared;
     }

     const { rows } = await client.query(
       `INSERT INTO tag (
           title,
           parent_tag_id,
           color,
           description,
           playlist_id,
           is_shared
       ) VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING tag_id as id, title, parent_tag_id, color, description, playlist_id, is_shared`,
       [title, parent_tag_id, color, description, playlist_id, isShared]);

     await client.query('COMMIT');
     transactionStarted = false;
     res.status(201).json(rows[0]);
   } catch (err) {
     if (transactionStarted) {
       await client.query('ROLLBACK');
     }
     throw err;
   } finally {
     client.release();
   }
  })().catch(err => {
    res.status(500).json({
      "code": err.code,
      "message": err.message
    });
   });
 });

app.get(`${rootUrl}/tags`, (req, res) => {
  const {playlist_id} = req.query;
  const childPlaylistFilter = playlist_id === 'none'
    ? ''
    : ` AND (tt.playlist_id = ($1) OR tt.is_shared OR t.is_shared)`;
  const rootPlaylistFilter = playlist_id === 'none'
    ? ''
    : ` AND (
        t.playlist_id = ($1)
        OR t.is_shared
        OR EXISTS (
          SELECT 1
          FROM tag visible_child
          WHERE visible_child.parent_tag_id = t.tag_id
            AND (visible_child.playlist_id = ($1) OR visible_child.is_shared)
        )
      )`;

  ;(async () => {

    qry = `
    SELECT 
      t.tag_id as id, 
      t.title, 
      t.unique_code,
      t.color,
      parent_tag_id, 
      ( SELECT jsonb_agg(json_ressource)
        FROM (
          SELECT
            tt.tag_id as id, 
            tt.title, 
            tt.unique_code,
            t.unique_code as parent_unique_code,
            t.color, -- parent's color
            tt.parent_tag_id, 
            null as lst_children_tag,
            tt.description,
            tt.playlist_id,
            tt.is_shared,
            'unchanged' as status
          FROM 		  tag tt
          WHERE 		tt.parent_tag_id = t.tag_id${childPlaylistFilter}
          ORDER BY  tt.title
        ) json_ressource
      ) as lst_children_tag,
      t.description,
      t.playlist_id,
      t.is_shared,
      'unchanged' as status
    FROM    tag t
    WHERE   t.parent_tag_id = 0${rootPlaylistFilter}
    `;

    qry += `ORDER BY t.title `;

    if (playlist_id !== 'none'){
      const { rows } = await pool.query(qry, [playlist_id]);
      res.json(rows);
    } else {
      const { rows } = await pool.query(qry);
      res.json(rows);
    }
    
  })().catch(err => {
    res.json(err.stack)
  })
});

app.put(`${rootUrl}/tags`, (req, res) => {
  const {id, title, parent_tag_id, color, description, is_shared} = req.body;

  if (is_shared !== undefined && typeof is_shared !== 'boolean') {
    return res.status(400).json({ error: 'is_shared must be a boolean.' });
  }

 ;(async () => {
   const client = await pool.connect();
   let transactionStarted = false;
   try {
    await client.query('BEGIN');
    transactionStarted = true;

    let isShared = is_shared;
    if (parent_tag_id !== 0) {
      const parentResult = await client.query(
        `SELECT is_shared
         FROM tag
         WHERE tag_id = $1 AND parent_tag_id = 0
         FOR SHARE`,
        [parent_tag_id]
      );

      if (parentResult.rowCount === 0) {
        await client.query('ROLLBACK');
        transactionStarted = false;
        return res.status(400).json({ error: 'The selected parent must be a tag group.' });
      }

      isShared = parentResult.rows[0].is_shared;
    }

    const updateResult = await client.query(
       `UPDATE tag
        SET 
          title = ($1),
          parent_tag_id = ($2),
          color = ($3),
          description = ($4),
          is_shared = COALESCE($5, is_shared)
       WHERE tag_id = ($6)
       RETURNING tag_id as id, title, parent_tag_id, color, description, playlist_id, is_shared`,
       [title, parent_tag_id, color, description, isShared ?? null, id]);

    if (updateResult.rowCount === 0) {
      await client.query('ROLLBACK');
      transactionStarted = false;
      return res.status(404).json({ error: 'Tag not found.' });
    }

    const updatedTag = updateResult.rows[0];
    if (updatedTag.parent_tag_id === 0) {
      await client.query(
        `UPDATE tag
         SET is_shared = $1
         WHERE parent_tag_id = $2`,
        [updatedTag.is_shared, updatedTag.id]
      );
    }

    await client.query('COMMIT');
    transactionStarted = false;
    res.status(200).json(updatedTag);
   } catch (err) {
     if (transactionStarted) {
       await client.query('ROLLBACK');
     }
     throw err;
   } finally {
     client.release();
   }
  })().catch(err => {
    res.status(500).json({
      "code": err.code,
      "message": err.message
    });
   });
 });

app.delete(`${rootUrl}/tags/:id`, (req, res) => {
  const { id } = req.params;
 ;(async () => {
   const client = await pool.connect();
   try {

     let results = await client.query(
       `DELETE FROM tag 
        WHERE tag_id = ($1)`,
        [id]);
        
     if (results.rowCount === 0) { 
      console.log('no results')
     }

     const deleteQry = `
        DELETE FROM   video_tag 
        WHERE         tag_id = $1
        `;
      await client.query(deleteQry, [id]);

     res.status(201).json(results);
   } finally {
     client.release();
   }
  })().catch(err => {
    res.status(500).json({
      "code": err.code,
      "message": err.message
    });
   });
 });




///////////////////////////////////
//// PLAYLIST ////////////////////
///////////////////////////////////

app.get(`${rootUrl}/playlist/`, (req, res) => {
  ;(async () => {
    const { rows } = await pool.query(`
      SELECT  
        p.id,
        p.title,
        p.is_youtube
      FROM playlist p
    `)
    res.json(rows);
  })().catch(err => {
    res.json(err.stack)
  })
});




///////////////////////////////////
//// VIDEO ////////////////////////
///////////////////////////////////

app.post(`${rootUrl}/video/update`, async (req, res) => {
  const videos = req.body;
  const maxBatchSize = 250;

  if (!Array.isArray(videos) || videos.length === 0) {
    return res.status(400).json({ error: 'Request body must be a non-empty array of videos.' });
  }

  if (videos.length > maxBatchSize) {
    return res.status(400).json({ error: `A batch can contain at most ${maxBatchSize} videos.` });
  }

  const invalidVideoIndex = videos.findIndex(video =>
    !video ||
    typeof video !== 'object' ||
    Array.isArray(video) ||
    typeof video.youtubeId !== 'string' ||
    typeof video.title !== 'string' ||
    typeof video.uniqueYoutubeId !== 'string'
  );

  if (invalidVideoIndex !== -1) {
    return res.status(400).json({
      error: `Video at index ${invalidVideoIndex} must include string youtubeId, title, and uniqueYoutubeId fields.`
    });
  }

  const parameters = [];
  const valueGroups = videos.map((video, index) => {
    const firstParameter = index * 3 + 1;
    parameters.push(video.youtubeId, video.title, video.uniqueYoutubeId);
    return `($${firstParameter}, $${firstParameter + 1}, $${firstParameter + 2}, true, true)`;
  });

  try {
    const result = await pool.query(
      `INSERT INTO video (youtube_id, title, unique_youtube_id, youtube_active, needs_review)
       VALUES ${valueGroups.join(', ')}
       ON CONFLICT DO NOTHING`,
      parameters
    );

    return res.status(201).json({
      received: videos.length,
      inserted: result.rowCount
    });
  } catch (error) {
    console.error('Failed to batch update videos:', error);
    return res.status(500).json({ error: 'Failed to batch update videos.' });
  }
});

app.put(`${rootUrl}/video/tags/update/:id`, (req, res) => {
  const { id } = req.params;
  const videoInfo = req.body;
  const videoTags = req.body.tags;
  const videoArtists = req.body.artists;
  const videoCustomPlaylists = req.body.customPlaylists;
  const videoAllTags = videoTags.concat(videoArtists);
  const playlist_id = req.body.playlistId;
  const unique_youtube_id = req.body.uniqueYoutubeId;
  const needsReview = videoInfo.needsReview;

  if (needsReview !== undefined && typeof needsReview !== 'boolean') {
    return res.status(400).json({ error: 'needsReview must be a boolean.' });
  }

  ;(async () => {
    const client = await pool.connect();

    try {  

      let rows = 'todo';


      // 1) begin by updating Tags
      const deleteTagsQry = `
        DELETE FROM   video_tag 
        WHERE         youtube_id = $1
        AND           tag_id IN 
          (
            SELECT tag_id
            FROM tag
            WHERE playlist_id = ($2)
          )
        `;
      await client.query(deleteTagsQry, [id, playlist_id]);

      for (var k in videoAllTags){
        if (videoAllTags.hasOwnProperty(k)) {
          const insertQry = `
            INSERT INTO   video_tag (youtube_id, tag_id)
            VALUES ($1, $2)
            `;
          await client.query(insertQry, [`${id}`, videoAllTags[k].id ]);
        }
      }



      // 2) then update custom Playlists
      const deletePlaylistsQry = `
        DELETE FROM   playlist_video 
        WHERE         unique_youtube_id = $1
        `;
      await client.query(deletePlaylistsQry, [unique_youtube_id]);

      for (var k in videoCustomPlaylists){
        if (videoCustomPlaylists.hasOwnProperty(k)) {
          const insertQry = `
            INSERT INTO   playlist_video (unique_youtube_id, playlist_id)
            VALUES ($1, $2)
            `;
          await client.query(insertQry, [`${unique_youtube_id}`, videoCustomPlaylists[k].id ]);
        }
      }


      // 3) finish with video info

      const videoInfoRating = videoInfo.rating.ratingValue;
      let resultsCustomInfo = await client.query(
        `UPDATE video
          SET 
            rating = ($1),
            needs_review = COALESCE($2, needs_review)
        WHERE youtube_id = ($3) `,
        [videoInfoRating, needsReview ?? null, id]);
      if (resultsCustomInfo.rowCount === 0) { 
        resultsCustomInfo = { 
          videoInfoRating,
          id
        };
      }

      res.status(201).json(rows);
    } finally {
      client.release();
    }
  })().catch(err => {
    res.json(err.stack)
  })
});

app.get(`${rootUrl}/video`, (req, res) => {
  const {playlist_id} = req.query;
  ;(async () => {

    req = `
      SELECT 
        v.rating,
        v.needs_review as "needsReview",
        v.title,
        v.youtube_id as "youtubeId", 

        ( SELECT jsonb_agg(json_ressource)
          FROM (
            SELECT
              -- map to Tag model
              t.tag_id as id,
              t.title,
              t.unique_code,
              (SELECT parent.unique_code FROM tag parent WHERE parent.tag_id = t.parent_tag_id) as parent_unique_code,
              t.parent_tag_id,
              t.color,
              t.playlist_id
              FROM 		video_tag vt_agg
              LEFT JOIN 	tag t ON t.tag_id = vt_agg.tag_id
            WHERE 		vt_agg.youtube_id = v.youtube_id
              AND     NOT EXISTS (
                SELECT 1
                FROM tag artist_group
                WHERE artist_group.unique_code = 'artist'
                  AND artist_group.tag_id = t.parent_tag_id
              )
          ) json_ressource
        ) as tags,

        ( SELECT jsonb_agg(json_ressource)
          FROM (
            SELECT
              -- map to Tag model
              t.tag_id as id,
              t.title,
              t.unique_code,
              (SELECT parent.unique_code FROM tag parent WHERE parent.tag_id = t.parent_tag_id) as parent_unique_code,
              t.parent_tag_id,
              t.color,
              t.playlist_id
              FROM 		video_tag vt_agg
              LEFT JOIN 	tag t ON t.tag_id = vt_agg.tag_id
            WHERE 		vt_agg.youtube_id = v.youtube_id
              AND     EXISTS (
                SELECT 1
                FROM tag artist_group
                WHERE artist_group.unique_code = 'artist'
                  AND artist_group.tag_id = t.parent_tag_id
              )
              AND     t.playlist_id = ($1)
          ) json_ressource
        ) as artists,

        ( SELECT jsonb_agg(json_ressource)
          FROM (
            SELECT
              -- map to Playlist model
              p.id,
              p.title,
              p.is_youtube
              FROM 		playlist_video pl_agg
              LEFT JOIN 	playlist p ON p.id = pl_agg.playlist_id
            WHERE 		pl_agg.unique_youtube_id = v.unique_youtube_id
          ) json_ressource
        ) as "customPlaylists"

      FROM    video v
      WHERE   1 = 1
    `;

    // Le ID de la playlist d'origine n'est pas enregistr�. 
    // dette technique, car on load plus de vid�os que n�cessaire
    /*if (playlist_id !== 'none'){
      req += ` AND playlist_id = ($1) `;
    }*/

    const { rows } = await pool.query(req, [playlist_id]);
    res.json(rows);
  })().catch(err => {
    res.json(err.stack)
  })
});

app.delete(`${rootUrl}/video/:id`, (req, res) => {
  const { id } = req.params;
 ;(async () => {
   const client = await pool.connect();
   try {

      let results = await client.query(
       `DELETE FROM video 
        WHERE unique_youtube_id = ($1)`,
        [id]);

     if (results.rowCount === 0) { 
      console.log('no results')
     }
     res.status(201).json(results);
   } finally {
     client.release();
   }
  })().catch(err => {
    res.status(500).json({
      "code": err.code,
      "message": err.message
    });
   });
 });




///////////////////////////////////
//// DEBUG ////////////////////////
///////////////////////////////////

app.get('/api/status', (req, res) => {
  res.json({info: 'Node.js, Express, and Postgres API'});
});

app.get('/', (req, res) => {
  res.send('<a href="api-docs">Go to swagger UI</a>');
});

// health check for database connectivity
app.get(`${rootUrl}/health`, async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ db: 'ok' });
  } catch (err) {
    console.error('DB ping failed', err);
    res.status(500).json({ db: 'down', error: err.message });
  }
});

// Listen to the specified port, otherwise 3080
app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

const PORT = process.env.PORT || 3080;
const server = app.listen(PORT, () => {
  console.log(`Server Running: http://localhost:${PORT}`);
}); 

/**
 * The SIGTERM signal is a generic signal used to cause program 
 * termination. Unlike SIGKILL , this signal can be blocked, 
 * handled, and ignored. It is the normal way to politely ask a 
 * program to terminate. The shell command kill generates 
 * SIGTERM by default.
 */
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server Close: Process Terminated!');
    });
});