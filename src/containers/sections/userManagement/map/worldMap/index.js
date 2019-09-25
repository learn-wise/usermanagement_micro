import React, { Component } from "react";
import classes from "./style.scss";
import $ from "jquery"
import Color from "color";
import { Draggable, TweenLite } from "gsap/all";
import WorldMapSvg from './worldMap_svg';
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
      container: null,
      selectedCountry:{dataset:{tip:'World'},id:"world"},
      visitors:{
        mapData:{
          monthly:{},
          yearly:{},
        }
      },
      users:{
        mapData:{
          monthly:{},
          yearly :{}
        }
      },
      mapType:'monthly'
    };
  };
  componentWillMount(){
    this.props.socket.emit('mapType','monthly')
  };
  componentDidMount() {
    this.socketHandler()
    this.DragHandler()
  };
  componentDidUpdate(prevProps, prevState) {
    this.updateZoom(prevProps, prevState)
    this.colorizeCountry()
    this.mapSwitchHandler(prevState)
    this.returnToDefault(prevProps)
  };
  returnToDefault=(prevProps)=>{
    if(this.props.returnToDefault !== prevProps.returnToDefault){
      let selectedCountry={dataset:{tip:'World'},id:"world"}
      this.setState({selectedCountry})
      this.props.selectedCountry(selectedCountry,this.state.mapType)
    }
  };
  mapSwitchHandler=(prevState)=>{
    if(this.state.mapType !== prevState.mapType){
      this.props.socket.emit('mapType',this.state.mapType)
      this.props.selectedCountry(this.state.selectedCountry,this.state.mapType,false)
    }
  };
  colorizeCountry=()=>{
    let seriesData = this.state.visitors.mapData.monthly
    if(this.state.mapType === 'yearly'){
      seriesData = this.state.visitors.mapData.yearly
    }
    TweenLite.to($(`.${classes.svg_WorldMap} path`), 1, { fill:"#ccc" });
    if(Object.keys(seriesData).length > 0){
      let totalSum = Object.values(seriesData).reduce((sum, num) =>Number(sum) + Number(num));
      for (let el in seriesData) {
        let val = seriesData[el];
        let percent = +((val / totalSum) * 6).toFixed(3);
        var color = Color("rgb(0, 255, 255)")
          .lighten(percent)
          .mix(Color("blue"), percent)
          .cmyk()
          .string();
          TweenLite.to($(`#${el}`),1, { fill: `${color}` });
      }
    }else{ TweenLite.to($(`.${classes.svg_WorldMap} path`), 1, { fill:"#ccc" }); }
  };
  updateZoom=(prevPros,prevState)=>{
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
  };
  DragHandler=()=>{
    this.setState({ container:$("#container") });
    this.draggableFunc = Draggable.create(this.mapRef.current, {
      type: "x,y",
      bounds:{width:600, height:600},
      edgeResistance: .5,
      onDragEnd: () => { console.log("Drag END!"); },
      onPress: () => { console.log("draggable clicked!!!"); },
      onDragStart: () => { console.log("Dragging!!!"); }
    });
    this.draggableFunc[0].disable();
  };
  socketHandler = ()=>{
      this.props.socket.on('visitorsMonthlyStateCountry',monthly=>{ 
        let mapData = { ...this.state.visitors.mapData, monthly }
        let visitors = { ...this.state.visitors, mapData }
        this.setState({visitors})
      })
      this.props.socket.on('visitorsYearlyStateCountry',yearly=>{ 
        let mapData = { ...this.state.visitors.mapData, yearly }
        let visitors = { ...this.state.visitors, mapData }
        this.setState({visitors})
      })
  };
  clickHandler = i => {
    $(i.target).toggleClass(classes.selected);
    this.setState({selectedCountry:i.target})
    this.props.selectedCountry(i.target,this.state.mapType)
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
  btnHandler = ()=>{
    if( Object.keys(this.state.visitors.mapData.monthly).length > 0 ){
      return <div className={classes.btn}>
        <button 
          className={classes['btn--year']} 
          onClick={()=>this.setState({mapType:"yearly"})} 
          disabled={this.state.mapType === "yearly"?true:false}>year</button>
        <button 
          className={classes['btn--month']} 
          onClick={()=>this.setState({mapType:"monthly"})} 
          disabled={this.state.mapType === "monthly"?true:false}>month</button>
      </div>
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
                >{WorldMapSvg(this.onHoverHandler,this.clickHandler,this.offHoverHandler)}
              </svg>
          </figure>
        </div>
        {this.btnHandler()}
      </div>
    );
  };
}
export default WorldMap;
