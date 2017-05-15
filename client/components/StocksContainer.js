/* this will contain the stocks that are currently displayed
 * the user will be able to remove stocks 
 */
import React from 'react';

import '../styles/stocksContainer.css';

const StocksContainer = (props) => {
  const stocks = props.stocks.map(stock =>
    <div className='stock-tile' key={stock}>
      {stock.toUpperCase()}
      <i
        // removes stock and passes stock name to function
        onClick={props.removeStock.bind(this, stock)} 
        className="delete-icon fa fa-times-circle fa-1x" 
        aria-hidden="true"
      >
      </i>
    </div>
  );

  return (
    <div className='stocks-container'>
      {stocks}
    </div>
  );
};

export default StocksContainer;
