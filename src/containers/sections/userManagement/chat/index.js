import React, { Component } from "react";
import classes from "./style.scss";
import cl from "../../../../Hoc/multiclass";
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';
import randomColor from 'randomcolor';

function cn(elem) { return cl(elem, classes); }
function logEvent(type) { console.log(`event '${type}' triggered!`); }
class ChatNotification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onXReachEnd: null,
    };
  }

  mainChat=()=>{
    const Notification=[ {num:'1'}, {num:'2'}, {num:'3'}, {num:'4'}, {num:'5'}, {num:'6'}, {num:'7'}, {num:'8'}, {num:'9'}, {num:'10'}, {num:'1'}, {num:'1'}, {num:'1'}, {num:'1'}, ]
    return Notification.map(noti=>(
      <div className={cn(["message"])} key={Math.random()*124*Math.random()}>
        <span 
        className={cn(["message-ico"])} 
        style={{
          background:randomColor({
            luminosity:"bight",
            hue: 'random',
          })
        }}
        ></span>
        <div className={cn(["message-content"])}>
            <h4 className={cn(["message-title"])}>All Hands Meeting</h4>
        </div>
      </div>
    ))
  }
  handleYReachEnd = () => { logEvent('onYReachEnd'); }
  render() {
    return (
      <div className={cn(['card'])}>
        <div className={cn(['card-header'])}></div>
        <PerfectScrollbar onYReachEnd={this.handleYReachEnd} component="div">
        <div className={cn(["chat"])}>
          <div className={cn(["chat-vertical-timeline"])}>
              <div className={cn(["chat-message"])}>
                {this.mainChat()}
              </div>
          </div>
        </div>
        </PerfectScrollbar>
        <div className={cn(['chat-footer'])}>
          <button className={cn(['chat-button'])}>
            <span className={cn(['message-badge','badge','message-badge-dot','message-badge-warring'])}></span>
            view Messages
          </button>
        </div>
      </div>
    );
  }
}

export default ChatNotification;
