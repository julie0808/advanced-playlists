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
  const {id, parent_tag_id, title, color, description} = req.body;
 ;(async () => {
   const client = await pool.connect();
   try {
     let results = await client.query(
       `INSERT INTO tag (
           title,
           parent_tag_id,
           color,
           description
       ) VALUES ($1, $2, $3, $4)
       RETURNING tag_id`,
       [title, parent_tag_id, color, description]);
     if (results.rowCount === 0) { 
       results = { 
         title,
         parent_tag_id,
         color,
         description
       };
     }
     const newTag = {
       title: title,
       parent_tag_id: parent_tag_id,
       color: color,
       description: description,
       id: results.rows[0].tag_id
     };
     res.status(201).json(newTag);
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
  ;(async () => {
    const { rows } = await pool.query(`
      SELECT 
        tag_id as id, 
        title, 
        CASE WHEN parent_tag_id is null THEN 0 ELSE parent_tag_id END as parent_tag_id, 
        color, 
        description
      FROM tag
      ORDER BY title`
      )
    res.json(rows);
  })().catch(err => {
    res.json(err.stack)
  })
});

app.get(`${rootUrl}/tags/associations`, (req, res) => {
  ;(async () => {
    const { rows } = await pool.query(`
      SELECT 
        tag_id, 
        youtube_id as "youtubeId"
      FROM video_tag`
      )
    res.json(rows);
  })().catch(err => {
    res.json(err.stack)
  })
});

app.put(`${rootUrl}/tags`, (req, res) => {
  const {id, title, parent_tag_id, color, description} = req.body;
 ;(async () => {
   const client = await pool.connect();
   try {
    let results = await client.query(
       `UPDATE tag
        SET 
          title = ($1),
          parent_tag_id = ($2),
          color = ($3),
          description = ($4)
       WHERE tag_id = ($5) `,
       [title, parent_tag_id, color, description, id]);
     if (results.rowCount === 0) { 
       results = { 
         title,
         id,
         parent_tag_id,
         color
       };
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
//// PLAYSLIST ////////////////////
///////////////////////////////////

app.get(`${rootUrl}/playlist/`, (req, res) => {
  ;(async () => {
    const { rows } = await pool.query(`
      SELECT  
        p.id,
        p.title
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

// for now, simply store the initial title of the video as fetched on
// youtube, so if it's deleted, we can retrace it
app.post(`${rootUrl}/video/update`, (req, res) => {
  const videos = req.body;
  ;(async () => {
    const client = await pool.connect();
    try {  

      const rows = 'todo';

      // TECHNICAL DEBT TODO batchinsert
      for (var k in videos){
        const field_youtubeId = videos[k].youtubeId;
        const field_title = videos[k].title;
        const field_uniqueYoutubeId = videos[k].uniqueYoutubeId;

        if (videos.hasOwnProperty(k)) {

          let insertQry = `INSERT INTO video (youtube_id, title, unique_youtube_id) 
                      VALUES ($1, $2, $3)
                      ON CONFLICT DO NOTHING`;
          
          // if I need to do a mass update
          /*let updateQry = 
            `UPDATE video  
            SET
              unique_youtube_id = ($1)
            WHERE youtube_id = ($2)`;*/

            await client.query(insertQry, [
            field_youtubeId,
            field_title,
            field_uniqueYoutubeId]);

          /*await client.query(updateQry, [
            field_uniqueYoutubeId,
            field_youtubeId]);*/
        }
      }

      res.status(201).json(rows);
    } finally {
      client.release();
    }
  })().catch(err => {
    res.json(err.stack)
  })
});

app.put(`${rootUrl}/video/tags/update/:id`, (req, res) => {
  const { id } = req.params;
  const videoInfo = req.body;
  const videoTags = req.body.tags;
  const videoArtists = req.body.artists;
  const videoAllTags = videoTags.concat(videoArtists);

  ;(async () => {
    const client = await pool.connect();

    try {  

      let rows = 'todo';

      const deleteQry = `
        DELETE FROM   video_tag 
        WHERE         youtube_id = $1
        `;
      await client.query(deleteQry, [id]);

      for (var k in videoAllTags){
        if (videoAllTags.hasOwnProperty(k)) {
          const insertQry = `
            INSERT INTO   video_tag (youtube_id, tag_id)
            VALUES ($1, $2)
            `;
          await client.query(insertQry, [`${id}`, videoAllTags[k].id ]);
        }
      }

      const videoInfoRating = videoInfo.rating;
      let resultsCustomInfo = await client.query(
        `UPDATE video
          SET 
            rating = ($1)
        WHERE youtube_id = ($2) `,
        [videoInfoRating, id]);
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

app.get(`${rootUrl}/video/tags`, (req, res) => {
  ;(async () => {
    const { rows } = await pool.query(`
      SELECT DISTINCT 
        vt.youtube_id as "youtubeId", 
        ( SELECT jsonb_agg(json_ressource)
          FROM (
            SELECT
              -- map to ITag model
              t.tag_id as id,
              t.title
              FROM 		video_tag vt_agg
              LEFT JOIN 	tag t ON t.tag_id = vt_agg.tag_id
            WHERE 		vt_agg.youtube_id = vt.youtube_id
          ) json_ressource
        ) as tags
      FROM video_tag vt
    `)
    res.json(rows);
  })().catch(err => {
    res.json(err.stack)
  })
});


app.get(`${rootUrl}/video/information`, (req, res) => {
  ;(async () => {
    const { rows } = await pool.query(`
      SELECT  
        v.youtube_id as "youtubeId", 
        v.rating,
        v.title
      FROM video v
    `)
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