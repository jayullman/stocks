import React, { Component } from 'react';
import axios from 'axios';

import Chart from '../containers/Chart';
import SearchStock from '../containers/SearchStock';

// create socket connections with socket.io
const io = require('socket.io-client');

const socket = io();

socket.on('stocks', (stocks) => {
  console.log('Stock List: ', stocks);
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // keeps a list of stocks, populated from server
      stocks: []
    };
  }

  componentDidMount() {
    // retrieve list of stocks from database
    axios('/getStockList')
      .then(({ data }) => {
        console.log(data.stocks);
      });
  }

  render() {
    return (
      <div>
        <Chart />
        <SearchStock
          socket={socket}
        />
      </div>
    );
  }
  
}

export default App;
