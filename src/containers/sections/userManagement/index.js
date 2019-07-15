import React, { Component } from "react";
import cl from "../../../Hoc/multiclass";
import classes from "./style.scss";
import Map from "./map";
import { ProgressBar } from "react-bootstrap";
import ChatNotification from './chat'
class UserManagement extends Component {
  onlineUsers = () => { return 1000; }; 
  onlineVisitors = () => { return 5000; }; 
  totalUsers = () => { return 150436; }; 
  totalVisitors = () => { return 64481231; }; 
  newUsers = () => { return 100; }; 
  verifiedUsers = () => { return 1500; };
  mapDataDistro = () => {
    const mapData = [
      {
        count: "100K",
        region: "USA",
        percent: "50"
      },
      {
        count: "1M",
        region: "Europe",
        percent: "80"
      },
      {
        count: "450K",
        region: "Australia",
        percent: "40"
      },
      {
        count: "1B",
        region: "India",
        percent: "90"
      }
    ];
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
    function cn(elem) {
      return cl(elem, classes);
    }
    return (
      <div className={cn(["userManagement"])}>
        <div className={cn(["users-Online","card"])}>
          <h3>online Users</h3> <div>{this.onlineUsers()}</div>
        </div>
        <div className={cn(["visitors-Online","card"])}>
          <h3>online visitors</h3> <div>{this.onlineVisitors()}</div>
        </div>
        <div className={cn(["section-Count"])}>
          <div className={cn(["users-Count","card"])}>
            <h3>Total users</h3> <div>{this.totalUsers()}</div>
          </div>
          <div className={cn(["visitors-Count","card"])}>
            <h3>Total visitors</h3> <div>{this.totalVisitors()}</div>
          </div>
          <div className={cn(["users-New","card"])}>
            <h3>New users</h3> <div>{this.newUsers()}</div>
          </div>
          <div className={cn(["users-Verified","card"])}>
            <h3>Verified users</h3> <div>{this.verifiedUsers()}</div>
          </div>
        </div>
        <div className={cn(["users-Distribution","card"])}>
          <Map />
        </div>
        <div className={cn(["section-MapStatistic","card"])}>
          {this.mapDataDistro()}
        </div>
        <div className={cn(["section-UsersList","card"])}>usersList</div>
        <div className={cn(["section-Notification"])}>
          <ChatNotification/>
        </div>
        <div className={cn(["section-UsersComments","card"])}>usersComments</div>
      </div>
    );
  }
}
export default UserManagement;
