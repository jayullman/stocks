const express = require('express');
const app = express();
const http = require('http').Server(app);

const parseStockData = require('./helpers/parseStockData');
const validateSymbol = require('./helpers/validateSymbol');

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
  // perform symbol lookup to see if any data is returned, otherwise ignore
  validateSymbol(symbol).then((result) => {
    // if symbol is valid
    if (result) {
      res.json({ message: 'Awaiting io.emit' });        
      console.log('symbol is valid');
      StockList.findOne({}, (err, list) => {
        if (err) throw err;

        // if stock list does not exist in db, create new one
        if (!list) {
          const newStockList = new StockList({
            stocks: [symbol]
          });
          newStockList.save().then(() => {
          });
        } else {
          const stocksList = [...list.stocks];

          // check if stock is unique to list
          // add to list if unique, otherwise ignore
          if (stocksList.indexOf(symbol) === -1) {
            stocksList.push(symbol);
            list.stocks = stocksList;

            // save list to database, then perform lookup on all stocks in list,
            // then emit to all sockets
            list.save((err, updatedList) => {
              parseStockData(updatedList).then((results) => {
                io.emit('stocks', results);
              });
            });
          }
        }
      });
    // symbol is not valid, emit error to client
  } else {
      console.log('symbol is not valid');
      res.json({ error: 'No information found for entered symbol' });
    }
  });
  
});

// requests stock data in json format
app.get('/getStockData', (req, res) => {
  StockList.findOne({}, (err, list) => {
    if (list) {
      if (list.stocks.length === 0) {
        res.json({ stockData: [] });    
      } else {
        parseStockData(list).then((results) => {
          res.json({ stockData: results });
        });
      }
    } else {
      res.json({ stockData: [] });      
    }
  });
});

app.delete('/removeStock/:stockName', (req, res) => {
  res.json({ message: 'Awaiting io.emit' });    
  const stockName = req.params.stockName;
  StockList.findOne({}, (err, list) => {
    if (list) {
      const stocks = [...list.stocks];  
      const index = stocks.indexOf(stockName);
      stocks.splice(index, 1);
      console.log(stocks);
      list.stocks = stocks;
      console.log(list);
      list.save((err, updatedList) => {
        console.log(updatedList);
        parseStockData(updatedList).then((results) => {
          io.emit('stocks', results);
        });
      });
    }
  });
});

http.listen(port, () => {
  console.log('App is listening on port: ', port);
});
