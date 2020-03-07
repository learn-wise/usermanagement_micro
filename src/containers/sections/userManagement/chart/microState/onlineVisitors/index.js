import React, { Component } from 'react';
import MicroState from '../index';
import classes from './style.scss';
import { ReactComponent as DownArrow } from '../../../../../../assets/icons/arrows_down_double.svg';
import { ReactComponent as UpArrow } from '../../../../../../assets/icons/arrows_up_double.svg';
import moment from 'moment';

class OnlineVisitors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statistic: {
        onlinesCount: 0,
        diffCount: 0,
      },
      chartData: null,
      error: null,
      increase: false,
      decrease: false,
    };
  }
  componentWillMount() {
    const visitorsSocket = this.props.socket;
    visitorsSocket.on('connect_error', err => {
      if (err) this.setState({ error: 'socket server is down' });
    });

    visitorsSocket.on('onlineVisitorsCount', count => {
      console.log(count);
      if (!count) return null;

      let prevCount = +this.state.statistic.onlinesCount;
      let nexCount = +count.onlinesCount;

      if (prevCount < nexCount) this.setState({ increase: true, decrease: false });
      if (prevCount > nexCount) this.setState({ decrease: true, increase: false });

      let statistic = { ...this.state.statistic, ...count };
      this.setState({ statistic });
    });

    visitorsSocket.on('onlineVisitorsInitial', count => {
      if (!count.onlinesCount) count = { onlinesCount: 0 };

      let statistic = { ...this.state.statistic, ...count };
      this.setState({ statistic });
    });
    visitorsSocket.on('onlineVisitorsTList', list => {
      if (!list) return null;

      let chartData = list;
      let resultData = [];
      let current_Month = moment().format('MM');
      let current_Day = moment().format('D');
      let current_Year = moment().format('YYYY');
      let Days_Of_Month = moment().daysInMonth();
      let i = 0;
      let j = +current_Day;

      while (i < current_Day) {
        let specificDay = `${current_Year}/${current_Month}/${i + 1}`;
        chartData[specificDay] === undefined
          ? (resultData[i] = 0)
          : (resultData[i] = Object.keys(JSON.parse(chartData[specificDay])).length);
        i++;
      }
      while (j < Days_Of_Month) {
        resultData[j] = 0;
        j++;
      }
      this.setState({ chartData: [{ data: resultData }] });
    });
  }
  arrowDownHandler = () => {
    let classArray = [classes.arrow_down];
    if (this.state.decrease) {
      classArray.push(classes.visible);
    }
    return classArray.join(' ');
  };
  arrowUpHandler = () => {
    let classArray = [classes.arrow_up];
    if (this.state.increase) {
      classArray.push(classes.visible);
    }
    return classArray.join(' ');
  };
  render() {
    return (
      <div className={classes.container}>
        <h5 className={classes.header}>online visitors</h5>
        <div className={classes.counter_section}>
          <span className={classes.counter}>{this.state.statistic.onlinesCount}</span>
          <span className={this.arrowUpHandler()}>
            <UpArrow width="15px" height="15px" />
          </span>
          <span className={this.arrowDownHandler()}>
            <DownArrow width="15px" height="15px" />
          </span>
        </div>
        <MicroState type="online_visitors" color="#D7263D" series={this.state.chartData} />
      </div>
    );
  }
}

export default OnlineVisitors;
