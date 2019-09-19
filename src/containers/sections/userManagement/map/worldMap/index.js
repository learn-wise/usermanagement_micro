import React, { Component } from "react";
import classes from "./style.scss";
import $ from "jquery"
import Color from "color";
import { Draggable, TweenLite } from "gsap/all";
import WorldMapSvg from './svg';
import ReactTooltip from 'react-tooltip';
class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      zoomLevel: 1,
      minZoom:1,
      maxZoom:3,
      draggable: false,
      container: null
    };
  }
  componentDidMount() {
    this.setState({ container:$("#container") });
    let list = {
      IR: 200,
      AL: 200,
      GL: 100,
      CA: 8000,
      RU: 500
    };
    let totalSum = Object.values(list).reduce((sum, num) => sum + num);
    for (let el in list) {
      let val = list[el];
      let percent = +((val / totalSum) * 6).toFixed(3);
      var color = Color("rgb(0, 255, 255)")
        .lighten(percent)
        .mix(Color("blue"), percent)
        .cmyk()
        .string();
        TweenLite.to($(`#${el}`), 1, { fill: `${color}` });
    }
    this.draggableFunc = Draggable.create(this.mapRef.current, {
      type: "x,y",
      bounds:{width:600, height:600},
      edgeResistance: .5,
      onDragEnd: () => { console.log("Drag END!"); },
      onPress: () => { console.log("draggable clicked!!!"); },
      onDragStart: () => { console.log("Dragging!!!"); }
    });
    this.draggableFunc[0].disable();
  }
  componentDidUpdate(prevProps, prevState) {
    if( prevState.zoomLevel !== this.state.zoomLevel ){
      if (this.state.zoomLevel >= this.state.minZoom && this.state.zoomLevel <= this.state.maxZoom ) {
        this.draggableFunc[0].enable();
        TweenLite.to(this.state.container, 0.3, { transform: `scale(${this.state.zoomLevel})` });
      }
      if (this.state.zoomLevel <= this.state.minZoom  ) {
        this.draggableFunc[0].disable();
        TweenLite.to($(`.${classes.svg_WorldMap}`), 1, { transform:"none",scaleX:1,scaleY:1 });
        TweenLite.to($("#container"), 1, { transform:"none",scaleX:1,scaleY:1 });
      }
    }
  }
  clickHandler = i => {
    $(i.target).toggleClass(classes.selected);
  };
  onHoverHandler = i => {
    $(i.target).toggleClass(classes.hovered);
  };
  offHoverHandler = i => {
    $(i.target).toggleClass(classes.hovered);
  };
  zoomInHandler = () => {
    let zoomLevel = +this.state.zoomLevel + 0.3;
    this.setState({ zoomLevel });
  };
  zoomOutHandler = () => {
    let zoomLevel = +this.state.zoomLevel - 0.3;
    this.setState({ zoomLevel });
  };
  onWheel = e => {
    e.preventDefault();
    let scale = +this.state.zoomLevel;
    let zoomLevel = +((e.deltaY / 3) * 0.1).toFixed(1);
    scale = this.state.zoomLevel + zoomLevel;
    if (scale <= (this.state.maxZoom + .5) && scale >= (this.state.minZoom - .1)) {
      this.setState({ zoomLevel: scale });
    }
  };
  render() {
    return (
      <div>
        <div className={classes.App}>
          <div className={classes.controller}>
            <button
              className={classes.zoomIn}
              onClick={this.zoomInHandler}
              disabled={this.state.zoomLevel < this.state.maxZoom ? false : true} >+</button>
            <button
              className={classes.zoomOut}
              onClick={this.zoomOutHandler}
              disabled={this.state.zoomLevel > this.state.minZoom ? false : true} >-</button>
          </div>
          <ReactTooltip className={classes.toolTip}/>
          <figure id="container" className={classes.container} style={{margin:"none"}}>
              <svg
                className={classes.svg_WorldMap}
                strokeLinejoin="round"
                onWheel={this.onWheel}
                ref={this.mapRef}
                viewBox="0 0 1020 700" 
                preserveAspectRatio="xMidYMid meet"
                >
                  {WorldMapSvg(this.onHoverHandler,this.clickHandler,this.offHoverHandler)}
              </svg>
          </figure>
        </div>
      </div>
    );
  }
}

export default WorldMap;
