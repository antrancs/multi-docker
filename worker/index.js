const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

const emojis = ['🤤', '🤗', '☕️', '😎', '😇', '🤩', '🥳', '🤑', '🥴'];

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

sub.on('message', (channel, message) => {
  const idx = getRandom(0, emojis.length);

  console.log({ idx });
  console.log(emojis[idx]);
  redisClient.set(message, emojis[idx], (error, result) => {
    if (error) {
      console.log(error);
      throw error;
    }
    console.log('GET result ->' + result);
  });
});

sub.subscribe('insert');
