import React, { Component } from 'react';
import axios from 'axios';

import Chart from './Chart';
import SearchStock from './SearchStock';
import StocksContainer from '../components/StocksContainer';
import Header from '../components/Header';
import Footer from '../components/Footer';

import extractStockNames from '../../helpers/extractStockNames';

import '../styles/normalize.css';
import '../styles/app.css';

// create socket connections with socket.io
const io = require('socket.io-client');

const socket = io();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // keeps a list of stocks, populated from server
      stocks: [],
      stockData: [],
    };

    this.removeStock = this.removeStock.bind(this);
  }

  componentDidMount() {
    socket.on('stocks', (stockData) => {
      console.log('Stock List: ', stockData);
      this.setState({
        stockData,
        stocks: extractStockNames(stockData)
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
          stocks: extractStockNames(data.stockData),
        });
      });
  }

  // removes a stock when user clicks on the 'x'
  removeStock(stock) {
    console.log(stock);
    const url = `/removeStock/${stock}`;
    axios.delete(url)
      .then(({ data }) => {
        console.log(data);
      });
  }

  render() {
    return (
      <div>
        <Header />
        <Chart
          stockData={this.state.stockData}
        />
        <SearchStock
          socket={socket}
        />
        <StocksContainer
          stocks={this.state.stocks}
          removeStock={this.removeStock}
        />
        <Footer />
      </div>
    );
  }
}

export default App;
