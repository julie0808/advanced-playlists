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
  const {id, parent_tag_id, title, color} = req.body;
 ;(async () => {
   const client = await pool.connect();
   try {
     let results = await client.query(
       `INSERT INTO tag (
           title,
           parent_tag_id,
           color
       ) VALUES ($1, $2, $3)
       RETURNING tag_id`,
       [title, parent_tag_id, color]);
     if (results.rowCount === 0) { 
       results = { 
         title,
         parent_tag_id,
         color 
       };
     }
     const newTag = {
       title: title,
       parent_tag_id: parent_tag_id,
       color: color,
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
      SELECT tag_id as id, title, parent_tag_id, color
      FROM tag
      ORDER BY title`
      )
    res.json(rows);
  })().catch(err => {
    res.json(err.stack)
  })
});

app.put(`${rootUrl}/tags`, (req, res) => {
  const {id, title, parent_tag_id, color} = req.body;
 ;(async () => {
   const client = await pool.connect();
   try {
    let results = await client.query(
       `UPDATE tag
        SET 
          title = ($1),
          parent_tag_id = ($2),
          color = ($3)
       WHERE tag_id = ($4) `,
       [title, parent_tag_id, color, id]);
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
//// VIDEO ////////////////////////
///////////////////////////////////

// for now, simply store the initial title of the video as fetched on
// youtube, so if it's deleted, we can retrace it
app.post(`${rootUrl}/video/update`, (req, res) => {
  const videos = req.body;
  ;(async () => {
    const client = await pool.connect();
    try {  
      
      let rows = 'todo';

      for (var k in videos){
        if (videos.hasOwnProperty(k)) {
          let insertQry = `INSERT INTO video (youtube_id, title) 
                      VALUES ($1, $2)
                      ON CONFLICT DO NOTHING`;

          await client.query(insertQry, [`${videos[k].youtubeId}`,`${videos[k].title}`]);
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
  ;(async () => {
    const client = await pool.connect();

    try {  

      let rows = 'todo';

      const deleteQry = `
        DELETE FROM   video_tag 
        WHERE         youtube_id = $1
        `;
      await client.query(deleteQry, [id]);

      for (var k in videoTags){
        if (videoTags.hasOwnProperty(k)) {
          const insertQry = `
            INSERT INTO   video_tag (youtube_id, tag_id)
            VALUES ($1, $2)
            `;
          await client.query(insertQry, [`${id}`, videoTags[k].id ]);
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
        vt.youtube_id, 
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
        v.youtube_id, 
        v.rating
      FROM video v
    `)
    res.json(rows);
  })().catch(err => {
    res.json(err.stack)
  })
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