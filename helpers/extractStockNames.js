/* this module will extract the names of the stocks and
 * place in an array to be saved in the app's state
 */ 

const extractStockNames = (stockData) => {
  const stockNames = stockData.map(stock => 
    stock.name
  );

  return stockNames;
};

export default extractStockNames;
