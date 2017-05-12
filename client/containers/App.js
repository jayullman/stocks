import React, { Component } from 'react';
import axios from 'axios';

import Chart from './Chart';
import SearchStock from './SearchStock';
import StocksContainer from '../components/StocksContainer';
import extractStockNames from '../../helpers/extractStockNames';

// create socket connections with socket.io
const io = require('socket.io-client');

const socket = io();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // keeps a list of stocks, populated from server
      stocks: [],
      stockData: []
    };
  }

  componentDidMount() {
    socket.on('stocks', (stockData) => {
      console.log('Stock List: ', stockData);
      this.setState({
        stockData
      });
    });

    // if client receives socket error message
    socket.on('error', (error) => {
      console.log('error from server: ', error);
    });

    // retrieve list of stocks from database
    axios('/getStockData')
      .then(({ data }) => {
        // console.log(data.stockData);
        this.setState({
          stockData: data.stockData,
          stocks: extractStockNames(data.stockData)
        });

        // once client receives updated stock list from server,
        // client will retrieve stock data
        // retrieveStockData
      });
  }

  render() {
    return (
      <div>
        <Chart
          stockData={this.state.stockData}
        />
        <SearchStock
          socket={socket}
        />
        <StocksContainer
          stocks={this.state.stocks}
        />
      </div>
    );
  }
}

export default App;
