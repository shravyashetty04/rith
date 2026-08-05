const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'server', 'db.json');
try {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  if (data.titles) {
    const title = data.titles.find(t => t.id === 't_katv');
    if (title) {
      title.poster = '/uploads/hero_banner.png';
      title.backdrop = '/uploads/hero_banner.png';
      console.log('Found and updated t_katv title in db.json!');
    } else {
      console.log('Title t_katv not found in db.json, checking base array...');
    }
  } else if (Array.isArray(data)) {
    const title = data.find(t => t.id === 't_katv');
    if (title) {
      title.poster = '/uploads/hero_banner.png';
      title.backdrop = '/uploads/hero_banner.png';
      console.log('Found and updated t_katv title in root array of db.json!');
    }
  }

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully wrote updates back to db.json!');
} catch (err) {
  console.error('Error updating db.json:', err);
}
