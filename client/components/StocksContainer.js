/* this will contain the stocks that are currently displayed
 * the user will be able to remove stocks 
 */
import React from 'react';

const StocksContainer = (props) => {
  const stocks = props.stocks.map(stock =>
    <div className='stock-tile' key={stock}>
      {stock}
      <i
        // removes stock and passes stock name to function
        onClick={props.removeStock.bind(this, stock)} 
        className="fa fa-times-circle" 
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
