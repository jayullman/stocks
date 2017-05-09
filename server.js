const express = require('express');
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

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log('App is listening on port: ', port);
});