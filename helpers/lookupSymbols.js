const yahooFinance = require('yahoo-finance');

// this function will create a date range from today to one year ago as a string
// returns an array ['date-one-year-ago', 'todays-date']
function createDateRange() {

  // this function will append a zero to a number < 10
  function prependZero(num) {
    if (num < 10) {
      return '0' + num;
    } else {
      return num;
    }
  }

  // create today's date
  const time = new Date();
  const todayString = `${time.getFullYear()}-${prependZero(time.getMonth() + 1)}-${prependZero(time.getDate())}`;
  
  // create date one year ago
  const timeToSubract = 1000 * 60 * 60 * 24 * 365;
  const oneYearAgo = time.getTime() - timeToSubract;
  const newTime = new Date(oneYearAgo);
  const oneYearAgoString = `${newTime.getFullYear()}-${prependZero(newTime.getMonth() + 1)}-${prependZero(newTime.getDate())}`;
  return [
    oneYearAgoString,
    todayString
  ];
}

// module returns promise of stock results
module.exports = function lookupSymbols(symbols) {
  const range = createDateRange();
  return yahooFinance.historical({
    symbols: symbols,
    from: range[0],
    to: range[1],
    // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
  }); 
}
