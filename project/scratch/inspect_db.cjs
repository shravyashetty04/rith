const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'server', 'db.json');
try {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  console.log('titles array type:', Array.isArray(data.titles));
  console.log('Length of titles:', data.titles.length);
  console.log('Sample IDs:', data.titles.slice(0, 15).map(x => x.id));
  const t = data.titles.find(x => x.id === 't_katv');
  console.log('Found t_katv:', t);
} catch (err) {
  console.error(err);
}
