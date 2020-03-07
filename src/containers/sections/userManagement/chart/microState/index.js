import React, { Component } from 'react';
import moment from 'moment';
import Chart from 'react-apexcharts';
import classes from './style.scss';
function getDaysArrayByMonth() {
  var daysInMonth = moment().daysInMonth();
  var arrDays = [];

  while (daysInMonth) {
    var current = moment()
      .date(daysInMonth)
      .format('MM/DD');
    arrDays.push(current);
    daysInMonth--;
  }
  return arrDays.reverse();
}
class MicroState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xaxis: {
        categories: getDaysArrayByMonth(),
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false,
        },
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 1 },
      grid: {
        show: false,
        yaxis: { lines: { show: false } },
        xaxis: { lines: { show: false } },
      },

      theme: {
        mode: 'light',
        palette: 'palette7',
        monochrome: {
          enabled: true,
          color: this.props.color,
          shadeTo: 'light',
          shadeIntensity: 0.65,
        },
      },
    };
  }

  tooltip = () => {
    let custom = ({ series, seriesIndex, dataPointIndex, w }) => {
      const categories = getDaysArrayByMonth();
      let xIndex = categories[dataPointIndex];
      let yIndex = series[seriesIndex][dataPointIndex];
      return `<div class=${classes.tooltip}>
                    <div class=${classes.xIndex}>${xIndex}</div>
                    <div class=${classes.yIndex}>${yIndex}</div>
                </div>`;
    };
    return {
      custom,
      enabled: true,
      shared: false,
      x: { show: true },
      y: { title: { formatter: seriesName => 0 } },
      marker: { show: false },
      style: { fontSize: '7px' },
      fixed: { enabled: true, position: 'bottomleft', offsetX: 0, offsetY: 40 },
    };
  };
  options = () => {
    const { chart, dataLabels, xaxis, theme, stroke, grid } = this.state;
    return { chart, dataLabels, xaxis, tooltip: this.tooltip(), theme, stroke, grid };
  };
  chart = () => {
    if (this.props.series) {
      return (
        <Chart
          options={this.options()}
          height="120px"
          width="100%"
          series={this.props.series}
          type="area"
        />
      );
    } else {
      return <div className={classes.loader}>Loading...</div>;
    }
  };
  render() {
    return <div className={classes.microState}>{this.chart()}</div>;
  }
}

export default MicroState;
