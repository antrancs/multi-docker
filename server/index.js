const keys = require('./keys');
const express = require('express');
const uuid = require('uuid');

const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Postgres
const { Pool } = require('pg');

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on('error', () => console.log('Lost Pg connection'));

pgClient
  .query(
    `CREATE TABLE IF NOT EXISTS todos(
  id VARCHAR PRIMARY KEY,
  text VARCHAR NOT NULL
)`
  )
  .catch((err) => console.log(err));

// Redis

const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

// Express
app.get('/', (req, res) => {
  res.send('hi');
});

app.get('/todos/all', async (req, res) => {
  const todos = await pgClient.query('SELECT * from todos');

  const rows = todos.rows;

  const getVal = (id) =>
    new Promise((resolve, reject) => {
      redisClient.get(id, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });

  for (const row of rows) {
    row.emoji = await getVal(row.id);
  }

  res.send(rows);
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;

  const id = uuid.v4();

  console.log(id, text);

  redisPublisher.publish('insert', id);
  await pgClient.query('INSERT INTO todos(id, text) VALUES($1, $2)', [
    id,
    text,
  ]);

  res.send(true);
});

app.listen(5000, () => {
  console.log('Server is running');
});
