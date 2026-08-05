import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'server', 'db.json');

try {
  const fileContent = fs.readFileSync(DB_PATH, 'utf8');
  const db = JSON.parse(fileContent);

  if (!db.titles) {
    db.titles = [];
  }

  // Clear isFeatured from all titles first
  db.titles.forEach(t => {
    t.isFeatured = false;
  });

  const rithamayaTitle = {
    id: "t_custom_rithamaya",
    title: "Rithamaya: From Soil to Soul",
    type: "original",
    year: 2026,
    rating: "U",
    imdb: 9.2,
    match: 99,
    duration: "5m 12s",
    genres: [
      "Documentary"
    ],
    languages: [
      "Kannada",
      "English",
      "Tamil",
      "Telugu"
    ],
    description: "An organic journey of wellness. Discover the ancient secret of 35+ natural ingredients blended to nourish your body, mind, and soul.",
    longDescription: "Rithamaya: From Soil to Soul takes you on a visually spectacular journey through the organic fields where 6 types of millets, rare grains, rich nuts, and medicinal leaves like Jamun and Guava are harvested. Learn how this 100% natural health mix powder is crafted without preservatives, added colors, or sugar to deliver pure calcium, immunity, and energy to your family.",
    cast: [
      "Naveen Kumar",
      "Dr. Shalini Hegde"
    ],
    director: "Santhosh Rai",
    studio: "StreamVerse Health & Wellness",
    poster: "/images/rithamaya_promo.jpg",
    backdrop: "/images/rithamaya_promo.jpg",
    logo: "RITHAMAYA",
    badge: "MUST WATCH",
    trending: true,
    isOriginal: true,
    isNew: true,
    isPremium: false,
    isFeatured: true,
    isComingSoon: false,
    tags: [
      "4K Ultra HD",
      "Dolby Atmos",
      "100% Natural"
    ],
    videoUrl: "/uploads/video_1785327490474_422.mp4",
    trailerUrl: "/uploads/video_1785327490474_422.mp4",
    created_at: new Date().toISOString()
  };

  // Find if it exists and replace or insert at start
  const index = db.titles.findIndex(t => t.id === 't_custom_rithamaya');
  if (index !== -1) {
    db.titles[index] = rithamayaTitle;
  } else {
    db.titles.unshift(rithamayaTitle);
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log('Successfully updated db.json with Rithamaya as featured title');
} catch (error) {
  console.error('Error modifying db.json:', error);
  process.exit(1);
}
