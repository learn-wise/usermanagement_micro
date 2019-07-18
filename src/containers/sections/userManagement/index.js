import React, { Component } from "react";
import cl from "../../../Hoc/multiclass";
import classes from "./style.scss";
import WorldMap from "./map/worldMap";
import { ProgressBar } from "react-bootstrap";
import ChatNotification from './chat'
import MicroState from "./chart/microState";
import MonthlyState from './chart/monthlyState'

class UserManagement extends Component {
  constructor(props){
    super(props)
    this.state={}
  }
  onlineUsers = () => { return 1000; }; 
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
          <h3>online Users</h3>
          <div>{this.onlineUsers()}</div>
          <MicroState type="online_users" color="#4caf50"/>
        </div>

        <div className={cn(["visitors-Online","card"])}>
          <h3>online visitors</h3>
          <div>{this.onlineVisitors()}</div>
          <MicroState type="online_visitors" color="#D7263D"/>
        </div>

        <div className={cn(["section-Count"])}>
          <div className={cn(["users-Count","card"])}>
            <h3>Total users</h3> 
            <div>{this.totalUsers()}</div>
            <MicroState type="users_count" color="#00B1F2"/>
          </div>

          <div className={cn(["visitors-Count","card"])}>
            <h3>Total visitors</h3> 
            <div>{this.totalVisitors()}</div>
            <MicroState type="visitors_count" color="#F9C80E"/>

          </div>

          <div className={cn(["users-New","card"])}>
            <h3>New users</h3> 
            <div>{this.newUsers()}</div>
            <MicroState type="users_New" color="#5A2A27"/>

          </div>

          <div className={cn(["users-Verified","card"])}>
            <h3>Verified users</h3> 
            <div>{this.verifiedUsers()}</div>
            <MicroState type="users_verified" color="#662E9B"/>
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

        <div className={cn(["section-UsersList","card"])}>usersList</div>
      </div>
    );
  }
}

export default UserManagement;
