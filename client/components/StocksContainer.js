/* this will contain the stocks that are currently displayed
 * the user will be able to remove stocks 
 */
import React from 'react';

const StocksContainer = (props) => {
  const stocks = props.stocks.map(stock =>
    <div key={stock}>
      {stock}
      <i className="fa fa-times-circle" aria-hidden="true"></i>
    </div>
  );

  return (
    <div className='stocks-container'>
      {stocks}
    </div>
  );
};

export default StocksContainer;
