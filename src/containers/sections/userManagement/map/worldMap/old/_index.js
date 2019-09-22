import React,{Component} from 'react';
import { VectorMap } from "react-jvectormap";
import classes from './style.scss';
/* TODO: MAP
  * by each click on regions show (today visitors|users|total visitors)
  * show online and visitors by markers on map
  * initial show (3 most country that visitors come from of it by showing percent of them )
  * adjust the color + hover effect
*/


class Map extends Component{

  state={
    visitors:{
      mapData:{
        monthly_country:{},
        monthly_city:{},
        yearly_country:{},
        yearly_city:{},
      }
    },
    users:{
      mapData:{
        monthly:{},
        yearly :{}
      }
    },
    mapType:'monthly',
  }
  componentDidMount() {
    this.props.socket.on('visitorsMonthlyState',reply=>{ 
      let monthly_country  = {}
      let monthly_city   = {}

      for(let el in reply){
        if(!el.search(/(count:)\w+/)){
          let country = el.split(':')[1]
          monthly_country[country]=+reply[el]
        }else{
          let arr = el.split(":") 
          let cityContainer = monthly_city[arr[0]] || {}
          cityContainer[arr[1]] = +reply[el]
          monthly_city[arr[0]] = cityContainer   
        }
      }
      let mapData = { ...this.state.visitors.mapData, monthly_country, monthly_city }
      let visitors = { ...this.state.visitors, mapData }
      this.setState({visitors})
    })
  }
  // markers = ()=>{
  //   if(this.state.mapType === 'monthly'){
  //     return this.state.visitors.mapData.monthly_city
  //   }
  // }
  handleClick = (e, countryCode) => { 
    // console.log(this.state.visitors.mapData.monthly_city[countryCode])
    // window.localStorage.setItem( 'worldMap-selected-regions', countryCode );
    this.setState({mapType:true})
  };
  onRegionTipShow = (e, el, code) => {
    if(Object.keys(this.state.visitors.mapData.monthly_country).length > 0){
      if(this.state.visitors.mapData.monthly_country[code]){
        el.html(el.html() + "||" + this.state.visitors.mapData.monthly_country[code]);
      }
    }
  }
  // onMarkerTipShow = (e, el, code) => { 
  //   if(this.state.mapType === 'monthly'){
  //     el.html(el.html() +"("+this.state.visitors.mapData.monthly_city_count[el.html()]+")"); 
  //   }
  // }
  //  onRegionSelected = () => { 
  //   console.log('onRegionSelected')
  // }
  // onMarkerSelected = () => { console.log('onMarkerSelected') }
  // markerStyle=()=>({ initial: { fill: '#F8E23B', stroke: '#383f47' }, hover: { cursor:"pointer" }, selected: { fill: '#CA0020' } })
  regionStyle=()=>({ initial: { fill: "#e4e4e4", "fill-opacity": 0.9, stroke: "none", "stroke-width": 0, "stroke-opacity": 0 }, hover: { "fill-opacity": 0.8, cursor: "pointer" }, selected: { fill: "#2938bc"}, selectedHover: {} })
  series=()=>{
    let seriesData = this.state.visitors.mapData.monthly_country
    if(this.state.mapType === 'yearly'){
      seriesData = this.state.visitors.mapData.yearly_country
    }
    return {
      regions: [{
        values: seriesData, 
        scale: ["#ccc", "#00000"], 
        normalizeFunction: "polynomial"
      }]
    }
  }
  changeHandler = ()=>{
    
  }
  WorldMap = ()=>{
    if( Object.keys(this.state.visitors.mapData.monthly_country).length > 0 ){

      return <VectorMap
        map={"world_mill"}
        backgroundColor="transparent"
        regionsSelectable={true}
        markersSelectable={true}
        zoomOnScroll={true}
        containerStyle={{ width: "100%", height: "50rem" }}
        onRegionTipShow={this.onRegionTipShow}
        // onMarkerTipShow={this.onMarkerTipShow}
        // markers={this.markers()}
        // onRegionSelected={this.onRegionSelected}
        // onMarkerSelected={this.onMarkerSelected}
        onRegionClick={this.handleClick}
        containerClassName={classes.map}
        zoomAnimate={true}
        // markerStyle={this.markerStyle()}
        regionStyle={this.regionStyle()}
        series={this.series()}
      />
    }else{
      return <div className={classes.wrapper}>
        <div className={classes.circle}></div>
        <div className={classes.circle}></div>
        <div className={classes.circle}></div>
        <div className={classes.shadow}></div>
        <div className={classes.shadow}></div>
        <div className={classes.shadow}></div>
        <span>Loading</span>
      </div>
    }
  }
  btnHandler = ()=>{
    if( Object.keys(this.state.visitors.mapData.monthly_country).length > 0 ){
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
  }

  render(){
    return  <div className={classes.boxContainer}> 
      {this.WorldMap()}
     
    </div> ;
  }
}


export default Map;