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
  res.status(200);
  res.json({ message: 'Awaiting io.emit' });  
  const symbol = req.body.symbol;
  // perform symbol lookup to see if any data is returned, otherwise ignore
  validateSymbol(symbol).then((result) => {
    // if symbol is valid
    if (result) {
      console.log('symbol is valid');
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
          console.log('list exists');
          const stocksList = [...list.stocks];

          // check if stock is unique to list
          // add to list if unique, otherwise ignore
          if (stocksList.indexOf(symbol) === -1) {
            stocksList.push(symbol);
            list.stocks = stocksList;

            // save list to database, then perform lookup on all stocks in list,
            // then emit to all sockets
            list.save((err, updatedList) => {
              // console.log('updatedList: ', updatedList);
              // lookupSymbols(updatedList.stocks)
              //   .then((results) => {
              //     // console.log('results: ', results);
              //     /* Parse results which will be the series object for the chart
              //      * resuling format:
              //      * [{
              //      *    name: nflx,
              //      *    data: [
              //      *      1222344, // UNIX time   
              //      *      34       // stock value
              //      *    ]        
              //      * }]
              //      */
                   
              //     const stockData = Object.keys(results);
                  
              //     const seriesData = stockData.map((key) => {
              //       const mappedData = results[key].map((item) => {
              //         return [
              //           // convert string to unix time
              //           new Date(item.date).getTime() / 1000,
              //           item.close
              //         ];
              //       });
              //       return {
              //         name: key,
              //         data: mappedData
              //       }
              //     });
              //     console.log(seriesData);
              //     io.emit('stocks', seriesData);
              //   });
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
      res.json({ error: 'Symbol is not valid' });
      io.emit('error', 'Stock is not valid');
    }
  });
  
});

// no longer used
app.get('/getStockList', (req, res) => {
  StockList.findOne({}).then((results) => {
    res.json({
      stocks: results.stocks
    })
  });
});

// requests stock data in json format
app.get('/getStockData', (req, res) => {
  StockList.findOne({}, (err, list) => {
    if (list) {
      parseStockData(list).then((results) => {
        res.json({ stockData: results });
      });
    } else {
      res.json({ stockData: [] });      
    }
  });
});

http.listen(port, () => {
  console.log('App is listening on port: ', port);
});
