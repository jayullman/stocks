import React from 'react';

// create socket connections with socket.io
const io = require('socket.io-client');

const socket = io();

const App = () => {
  function handlePress() {
    socket.emit('button', 'button presson on client');
  }

  socket.on('message', (msg) => {
    console.log('message from server: ', msg);
  })
  return (
    <div>
      <div>Hello from React!</div>
      <button onClick={handlePress}>press!</button>
    </div>
  )
};

export default App;
