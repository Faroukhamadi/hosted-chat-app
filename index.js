const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const { Server } = require('socket.io');
const io = new Server(server);

const userToSocketId = {};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('connection');

  socket.on('disconnect', () => {
    console.log('before disconnect delete', userToSocketId);
    delete userToSocketId[socket.id];
    console.log('after disconnect delete', userToSocketId);
    io.emit('user disconnect', socket.user_name, userToSocketId);
    io.emit('users', userToSocketId);
  });

  socket.on('join', ({ username }) => {
    socket.join(username);
  });

  socket.on('chat message', (message) => {
    // io.emit('chat message', { username: userToSocketId[socket.id], message });
    socket
      .in('farouk')
      .emit('new_msg', { username: userToSocketId[socket.id], message });

    console.log('username: ', userToSocketId[socket.id], 'message: ', message);
    console.log('executing chat message');
  });

  socket.on('register username', (username) => {
    userToSocketId[socket.id] = username;
    socket.user_name = username;
    io.emit('users', userToSocketId);
  });
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});
