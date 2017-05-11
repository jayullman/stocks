import React, { Component } from 'react';
import axios from 'axios';

const Highcharts = require('highcharts/highstock');
// require('highcharts/modules/exporting')(Highcharts);

function createChart(seriesData) {
  Highcharts.stockChart(this.container, {
    series: seriesData
  });
}  

class Chart extends Component {
  componentDidMount() {
    console.log(this.props.stockData);
    createChart.call(this, this.props.stockData);
    
    // if (stocks.length > 0) {
    //   lookupSymbols(stocks)
    //     .then(() => {
    //     });
    // }
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps: ', nextProps);
    if (nextProps.stockData.length > 0) {
      console.log('this should update');
      // this.forceUpdate();
      createChart.call(this, nextProps.stockData);
    }
  }

  render() {
    return (
      <div ref={(container) => { this.container = container; }}>
      {this.props.stockData.length > 0 && <p>hello!</p>}
      </div>
    );
  }
}

export default Chart;
