const express = require('express');
const app = express();
const http = require('http').Server(app);

// import and use body-parser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// imports socket.io for server
const io = require('socket.io')(http);

const path = require('path');
const mongoose = require('mongoose');

// set up port for production and development environments
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
  console.log('Connected to database');
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const StockList = require('./models/stockList');

app.post('/addStock', (req, res) => {
  const symbol = req.body.symbol;
  StockList.findOne({}, (err, list) => {
    if (err) throw err;

    // if stock list does not exist in db, create new one
    if (!list) {
      const newStockList = new StockList({
          stocks: [symbol]
        });
        newStockList.save().then(() => {
          console.log('saved to database');
        });
    } else {
      const stocksList = [...list.stocks];
      
      // check if stock is unique to list
      // add to list if unique, otherwise ignore
      if (stocksList.indexOf(symbol) === -1) {
        stocksList.push(symbol);
        list.stocks = stocksList;
        
        // save list to database, then emit new stock list to all sockets
        list.save((err, updatedList) => {
          io.emit('stocks', updatedList.stocks);
        });
      } 
    }
  });
});

app.get('/getStockList', (req, res) => {
  StockList.findOne({}).then((results) => {
    console.log(results);
    res.json({
      stocks: results.stocks
    })
  });
});

http.listen(port, () => {
  console.log('App is listening on port: ', port);
});
