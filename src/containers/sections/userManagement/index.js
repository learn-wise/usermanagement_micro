import React, { Component } from "react";
import cl from "../../../Hoc/multiclass";
import classes from "./style.scss";
import WorldMap from "./map/worldMap";
import MapDistribution from "./map/distribution";
import ChatNotification from './chat'
import MonthlyState from './chart/monthlyState';
import UsersList from './table/usersList';
import { OnlineUsers, OnlineVisitors, TotalUsers, VerifiedUsers } from './chart/microState/main'
class UserManagement extends Component {
  constructor(props){
    super(props)
    this.state={
      mapClicked : false
    }
  }
  usersSocket    = this.props.socket('users')
  visitorsSocket = this.props.socket('visitors')
  render() {
    this.visitorsSocket.connect()
    this.usersSocket.connect()
    this.usersSocket.on('connect', () => {
      console.log('usersSocket connected')
    });
    this.visitorsSocket.on('connect', () => {
      console.log('visitorsSocket connected')
    });
    this.usersSocket.on('connect_error', (error) => {
      console.log('[_usersSocket_]',error)
      this.usersSocket.close()
    });
    this.visitorsSocket.on('connect_error', (error) => {
      console.log('[_visitorsSocket_]',error)
      this.visitorsSocket.close()
    });
    function cn(elem) { return cl(elem, classes); }

    return (
      <div className={cn(["userManagement"])}>
        <div className={cn(["section-Count"])}>
          <div className={cn(["users-Online","card"])}> <OnlineUsers socket={this.usersSocket}/> </div>
          <div className={cn(["visitors-Online","card"])}> <OnlineVisitors socket={this.visitorsSocket}/> </div>
          <div className={cn(["users-Count","card"])}> <TotalUsers socket={this.usersSocket}/> </div>
          <div className={cn(["users-Verified","card"])}> <VerifiedUsers socket={this.usersSocket}/> </div>
        </div>

        <div className={cn(["users-Distribution","card"])}>
          <WorldMap 
            socket={this.visitorsSocket} 
            mapChoosed={(el)=>this.setState({mapClicked:el})}/>
        </div>
        <div className={cn(["section-MapStatistic","card"])}>
          <MapDistribution mapClicked={this.state.mapClicked}/>
        </div>
        <div className={cn(["section-Notification"])}> <ChatNotification/> </div>
        <div className={cn(["section-MonthlyState","card"])}> <MonthlyState/> </div>
        <div className={cn(["section-UsersList","card"])}> <UsersList/> </div>
      </div>
    );
  }
}

export default UserManagement;
