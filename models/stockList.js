const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const StockListScheme = new mongoose.Schema({
  stocks: [String]
});

module.exports = mongoose.model('stock-list', StockListScheme);
