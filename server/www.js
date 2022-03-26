// TO START SERVER: npm run start:dev
// Ref: https://medium.com/swlh/angular-node-and-postgresql-4a07d597be07

require("dotenv").config();

const express = require('express');
const bodyParser = require("body-parser");
const app = express();

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

let tag = [];
const rootUrl = '/api';

app.use(bodyParser.json());

app.get(`${rootUrl}/tags`, (req, res) => {
  ;(async () => {
    const { rows } = await pool.query('SELECT * FROM tag')
    res.json(rows);
  })().catch(err => {
    res.json(err.stack)
  })
});

/*app.post('${rootUrl}/tag', (req, res) => {
  const reqTag = req.body.tag;
  tag = [];
  tag.push(reqTag);
  res.json(tag);
});*/


app.post(`${rootUrl}/add-tag`, (req, res) => {
 const { 
   title 
 } = JSON.parse(req.body.user);
;(async () => {
  const client = await pool.connect();
  try {
    let results = await client.query(
      `INSERT INTO tags (
          title
      ) VALUES ($1) 
      ON CONFLICT DO NOTHING 
      RETURNING title`,
      [title]);
    if (results.rowCount === 0) { 
      results = { 
        title 
      };
    }
    res.status(201).json(results);
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error.
    client.release();
  }
 })().catch(err => {
   res.status(500).json({
     "code": err.code,
     "message": err.message
   });
  });
});


app.get('/api/status', (req, res) => {
  res.json({info: 'Node.js, Express, and Postgres API'});
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Listen to the specified port, otherwise 3080
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