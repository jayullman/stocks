/* this module parses the stock data into a format that the Highcharts chart is expecting
 * resuling format:
 *  [{
 *     name: nflx,
 *     data: [
 *       1222344, // UNIX time   
 *       34       // stock value
 *     ]        
 *  }]
 */

const lookupSymbols = require('./lookupSymbols');

module.exports = function parseStockData(stockList) {
  return lookupSymbols(stockList.stocks)
    .then((results) => {
      const stockData = Object.keys(results);
      const seriesData = stockData.map((key) => {
        const mappedData = results[key].map((item) => {
          return [
            // convert string to unix time
            new Date(item.date).getTime(),
            item.close
          ];
        });
        return {
          name: key,
          data: mappedData
        }
      });
    return seriesData;
    });
}
