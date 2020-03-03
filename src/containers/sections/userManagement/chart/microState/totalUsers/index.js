import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import moment from 'moment';
import MicroState from '../index';
import classes from './style.scss';
import { ReactComponent as DownArrow } from '../../../../../../assets/icons/arrows_down_double.svg';
import { ReactComponent as UpArrow } from '../../../../../../assets/icons/arrows_up_double.svg';
import userCountQuery from '../../../../../../Graphql/queries/usersCount';
class TotalUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TotalsCount: 0,
      diffCount: null,
      chartData: null,
      error: null,
      increase: false,
      decrease: false,
    };
  }
  componentDidMount() {
    let res = [];
    let k = 0;

    while (k < moment().daysInMonth()) {
      res.push(0);
      k++;
    }

    this.setState({ chartData: [{ data: res }] });

    const usersSocket = this.props.socket;
    usersSocket.on('totalUsersList', list => {
      if (!list) {
        list = { key: 0 };
      }
      if (!this.state.diffCount) {
        this.setState({ diffCount: Object.values(list) });
      } else {
        let prevCount = this.state.diffCount;
        let TotalsCount = this.state.TotalsCount;
        let currentCount = Object.values(list);
        if (prevCount < currentCount) {
          this.setState({
            increase: true,
            decrease: false,
            diffCount: currentCount,
            TotalsCount: ++TotalsCount,
          });
        }
        if (prevCount > currentCount) {
          this.setState({
            decrease: true,
            increase: false,
            diffCount: currentCount,
            TotalsCount: --TotalsCount,
          });
        }
      }
      if (Object.values(list)[0] === 0) {
        return null;
      }
      let chartData = list,
        resultData = [],
        current_Month = moment().format('MM'),
        current_Day = moment().format('D'),
        current_Year = moment().format('YYYY'),
        Days_Of_Month = moment().daysInMonth(),
        i = 0,
        j = +current_Day;

      while (i < current_Day) {
        let specificDay = `${current_Year}/${current_Month}/${i + 1}`;
        chartData[specificDay] === undefined
          ? (resultData[i] = 0)
          : (resultData[i] = chartData[specificDay]);
        i++;
      }

      while (j < Days_Of_Month) {
        resultData[j] = 0;
        j++;
      }
      this.setState({ chartData: [{ data: resultData }] });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.data.usersCount && this.props.data.usersCount !== prevProps.data.usersCount) {
      let currentCount = this.props.data.usersCount.count;
      this.setState({ TotalsCount: currentCount });
    }
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
        <h5 className={classes.header}>Total users</h5>
        <div className={classes.counter_section}>
          <span className={classes.counter}>{this.state.TotalsCount}</span>
          <span className={this.arrowUpHandler()}>
            <UpArrow width="15px" height="15px" />
          </span>
          <span className={this.arrowDownHandler()}>
            <DownArrow width="15px" height="15px" />
          </span>
        </div>
        <MicroState type="users_count" color="#00B1F2" series={this.state.chartData} />
      </div>
    );
  }
}

export default graphql(userCountQuery)(TotalUsers);
