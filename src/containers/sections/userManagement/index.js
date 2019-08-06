import React, { Component } from "react";
import cl from "../../../Hoc/multiclass";
import classes from "./style.scss";
import WorldMap from "./map/worldMap";
import { ProgressBar } from "react-bootstrap";
import ChatNotification from './chat'
import MonthlyState from './chart/monthlyState';
import UsersList from './table/usersList';
import { 
  OnlineUsers,
  OnlineVisitors,
  TotalUsers,
  TotalVisitors,
  NewUsers,
  VerifiedUsers
} from './chart/microState/main'
class UserManagement extends Component {
  // Socket is accessible from:: this.props.socket

  constructor(props){
    super(props)
    this.state={}
  }
  onlineVisitors = () => { return 5000; }; 
  totalUsers = () => { return 150436; }; 
  totalVisitors = () => { return 64481231; }; 
  newUsers = () => { return 100; }; 
  verifiedUsers = () => { return 1500; };
  mapDataDistro = () => {
    const mapData = [ { count: "100K", region: "USA", percent: "50" }, { count: "1M", region: "Europe", percent: "80" }, { count: "450K", region: "Australia", percent: "40" }, { count: "1B", region: "India", percent: "90" } ];
    return mapData.map(data => {
      function cn(elem) { return cl(elem, classes); }
      return (
        <div key={data.region} className={cn(['MapData-info'])}>
          <h5 className={cn(["mb-5"])}>{data.count}</h5>
          <small className={cn(["small-grey-med"])}> Visitors From {data.region} </small>
          <span className={cn(["percent-span"])}>{data.percent}%</span>
          <div className={cn(["progress-bar"])}>
            <ProgressBar animated now={data.percent} />
          </div>
        </div>
      );
    });
  };
  render() {
    function cn(elem) { return cl(elem, classes); }
    return (
      <div className={cn(["userManagement"])}>

        <div className={cn(["users-Online","card"])}>
          <OnlineUsers socket={this.props.socket}/>
        </div>

        <div className={cn(["visitors-Online","card"])}>
          <OnlineVisitors socket={this.props.socket}/>
        </div>

        <div className={cn(["section-Count"])}>
          <div className={cn(["users-Count","card"])}>
            <TotalUsers socket={this.props.socket}/>
          </div>

          <div className={cn(["visitors-Count","card"])}>
            <TotalVisitors socket={this.props.socket}/>
          </div>

          <div className={cn(["users-New","card"])}>
            <NewUsers socket={this.props.socket}/>
          </div>

          <div className={cn(["users-Verified","card"])}>
            <VerifiedUsers socket={this.props.socket}/>
          </div>

        </div>
        <div className={cn(["users-Distribution","card"])}>
          <WorldMap />
        </div>
        <div className={cn(["section-MapStatistic","card"])}>
          {this.mapDataDistro()}
        </div>
        <div className={cn(["section-Notification"])}>
          <ChatNotification/>
        </div>

        <div className={cn(["section-MonthlyState","card"])}>
          <MonthlyState/>
        </div>

        <div className={cn(["section-UsersList","card"])}>
          <UsersList/>
        </div>
      </div>
    );
  }
}

export default UserManagement;
