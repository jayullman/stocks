const express = require('express');
const app = express();
const http = require('http').Server(app);

// imports socket.io for server
const io = require('socket.io')(http);

const path = require('path');
const mongoose = require('mongoose');


const port = process.env.PORT || 3000;

require('dotenv').config();

// connect to database
const url = process.env.MONGOLAB_URI;
const db = mongoose.connection;
const options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};
mongoose.connect(url, options);
db.on('open', () => {
  console.log('Connected to databse');
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('button', (msg) => {
    console.log('button pressed!');
    io.emit('message', 'this is from the server');
  });
});



http.listen(port, () => {
  console.log('App is listening on port: ', port);
});