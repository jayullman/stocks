import React, { Component } from 'react';

const Highcharts = require('highcharts/highstock');
// require('highcharts/modules/exporting')(Highcharts);

let chart;

function createChart(seriesData) {
  let data = seriesData;
  console.log(data);
  // ensures chart is drawn even when there are no stocks selected
  if (seriesData.length === 0) {
    data = [{ name: '', data: [0] }];
  }
  chart = Highcharts.stockChart(this.container, {
    series: data
  });
}  

class Chart extends Component {
  componentDidMount() {
    createChart.call(this, this.props.stockData);
    
    // if (stocks.length > 0) {
    //   lookupSymbols(stocks)
    //     .then(() => {
    //     });
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stockData.length > 0) {
      // this.forceUpdate();
      createChart.call(this, nextProps.stockData);
      // chart.series.setData(nextProps.stockData);
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
