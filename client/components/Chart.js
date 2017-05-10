import React, { Component } from 'react';

const Highcharts = require('highcharts/highstock');
// require('highcharts/modules/exporting')(Highcharts);

class Chart extends Component {

  componentDidMount() {
    Highcharts.stockChart(this.container, {
      series: [{
        name: 'test1',
        data: [1, 2, 3, 4, 8, 3, 2]
      }, {
        name: 'test2',
        data: [12, 33, 11, 44]
      }]
    });
  }

  render() {
    return (
      <div ref={container => { this.container = container; }}>

      </div>
    );
  }
}

export default Chart;
