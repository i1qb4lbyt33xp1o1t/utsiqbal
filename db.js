// db.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');

// Inisialisasi file db.json jika belum ada
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ comments: [], ratings: [] }, null, 2));
}

// Fungsi untuk membaca data
function getData() {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
}

// Fungsi untuk menulis data
function saveData(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { getData, saveData };