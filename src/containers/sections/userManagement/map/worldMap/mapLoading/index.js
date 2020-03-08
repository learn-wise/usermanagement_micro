import React, { Component } from 'react';
import classes from './style.scss';
import dataPath from './data.json';
class mapLoading extends Component {
  render() {
    return (
      <div className={classes.container}>
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
          className="lds-earth"
        >
          <defs>
            <clipPath id="cut-off">
              <circle cx="50" cy="50" r="35"></circle>
            </clipPath>
          </defs>
          <circle cx="50" cy="50" r="35" fill="#545454"></circle>
          <g clipPath="url(#cut-off)">
            <path transform="scale(2) translate(-25 -25)" fill="#f7f7f7" d={dataPath.pathOne}>
              <animateTransform
                attributeName="transform"
                type="translate"
                calcMode="linear"
                values="-100 0;0 0"
                keyTimes="0;1"
                dur="1.9s"
                begin="0s"
                repeatCount="indefinite"
              ></animateTransform>
            </path>
            <path transform="scale(2)" fill="#f7f7f7" d={dataPath.pathTwo}>
              <animateTransform
                attributeName="transform"
                type="translate"
                calcMode="linear"
                values="0 0;100 0"
                keyTimes="0;1"
                dur="1.9s"
                begin="0s"
                repeatCount="indefinite"
              ></animateTransform>
            </path>
          </g>
        </svg>
      </div>
    );
  }
}
export default mapLoading;
