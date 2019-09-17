import React, { Component } from "react";
import $ from "jquery";
import classes from "./style.scss";
import Color from "color";
import { Draggable, TweenLite } from "gsap/all";
import WorldMapSvg from './svg'
class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      currentState: null,
      zoomLevel: 0.9,
      draggable: false,
      container: null
    };
  }
  componentDidMount() {
    this.setState({ container: $("#container") });
    let list = this.props.countryList;
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
      bounds: this.state.container,
      edgeResistance: 1,
      onDragEnd: () => { console.log("Drag END!"); },
      onPress: () => { console.log("draggable clicked!!!"); },
      onDragStart: () => { console.log("Dragging!!!"); }
    });
    this.draggableFunc[0].disable();
  }
  componentDidUpdate(prevProps, prevState) {
    if( prevState.zoomLevel !== this.state.zoomLevel ){
      if (this.state.zoomLevel > 0.8 ) {
        this.draggableFunc[0].enable();
        TweenLite.to(this.state.container, 0.3, { transform: `scale(${this.state.zoomLevel})` });
      }
      if (this.state.zoomLevel < 0.9 ) {
        this.draggableFunc[0].disable();
        TweenLite.to($("#svg_WorldMap"), 1, { transform: "none" });
      }
    }
  }
  clickHandler = i => {
    $(i.target).toggleClass(classes.selected);
  };
  onHoverHandler = i => {
    $(i.target).toggleClass("hovered");
    let countryName = $(i.target).attr("title");
    this.setState({ currentState: countryName });
  };
  offHoverHandler = i => {
    $(i.target).toggleClass("hovered");
    this.setState({ currentState: null });
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
    if (scale < 3.1 && scale > 0.8) {
      this.setState({ zoomLevel: scale });
    }
  };

  render() {
    return (
      <div>
        <div className="state">&nbsp;{this.state.currentState}</div>
        <div className="App">
          <div className="controller">
            <button
              className="zoomIn"
              onClick={this.zoomInHandler}
              disabled={this.state.zoomLevel < 3 ? false : true} >+</button>
            <button
              className="zoomOut"
              onClick={this.zoomOutHandler}
              disabled={this.state.zoomLevel > 0.9 ? false : true} >-</button>
          </div>
          <div id="container">
            <svg
              height="100%"
              width="100%"
              id="svg_WorldMap"
              strokeLinejoin="round"
              onWheel={this.onWheel}
              ref={this.mapRef} >
                {WorldMapSvg(this.onHoverHandler,this.clickHandler,this.offHoverHander)}
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default WorldMap;
