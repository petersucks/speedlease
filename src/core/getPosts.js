import redis from 'redis';

const client = redis.createClient();
client.on('error', (err) => console.error(err));

function getPosts({ site, type, hood }) {

  return new Promise((resolve, reject) => {
    let query = ['posts', site, type, hood].join(':');

    client.lrange(query, 0, -1, (err, res) => {
      if (err) return reject(err);
      let data = res.map(post => JSON.parse(post));
      resolve(data);
    });
  });

}

export default getPosts;