const yahooFinance = require('yahoo-finance');

// module returns promise of stock results
module.exports = function lookupSymbols(symbols) {
  return yahooFinance.historical({
    symbols: symbols,
    from: '2012-01-01',
    to: '2012-02-02',
    // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
  }); 
}