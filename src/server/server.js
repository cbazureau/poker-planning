const express = require('express');
const path = require('path');
const http = require('http');
const sio = require('socket.io');
const compression = require('compression');

const rooms = {};

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app).listen(port);
const io = sio(server, { origins: '*:*' });

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../build')));
  app.use((req, res) => res.sendFile(path.join(__dirname, '../../build/index.html')));
} else {
  app.get('/', (req, res) => res.json({ status: 'ok' }));
}
app.use(compression());
// Switch off the default 'X-Powered-By: Express' header
app.disable('x-powered-by');
io.sockets.on('connection', (socket) => {
	let currentRoomId = '';
  // socket.on('message', (message) => socket.broadcast.to(room).emit('message', message));

  // Find
	socket.on('find', roomId => {
    console.log('[server] find', socket.id)
		currentRoomId = roomId;
    const sr = io.sockets.adapter.rooms[currentRoomId];
    console.log({sr, currentRoomId})
		if (sr === undefined) {
			// no room with such name is found so create it
      socket.join(currentRoomId);
      rooms[currentRoomId] = {
        date: new Date(),
        admin: {
          id: socket.id,
        },
        users: [],
      }
			socket.emit('update', {you: socket.id, data: rooms[currentRoomId]});
		} else {
      rooms[currentRoomId].users.push({
        id: socket.id,
      })
			socket.emit('update', {you: socket.id, data: rooms[currentRoomId]});
		}
  });
  // Leave
	socket.on('leave', () => {

  });

});
