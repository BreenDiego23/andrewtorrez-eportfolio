const fs = require('fs');
const path = require('path');

const roomsPage = (req, res) => {
  const dataPath = path.join(__dirname, '../../data/rooms.json');
  const rawData = fs.readFileSync(dataPath);
  const rooms = JSON.parse(rawData);

  res.render('rooms', {
    title: 'Rooms & Rates',
    rooms: rooms
  });
};

module.exports = { roomsPage };
