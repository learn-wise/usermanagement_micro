import React,{Component} from 'react';
import { ProgressBar } from "react-bootstrap";
import cl from "../../../../../Hoc/multiclass";
import classes from './style.scss';
class MapDistribution extends Component{


    // socketHandler = ()=>{
    //     this.props.socket.on('visitorsMonthlyState',reply=>{ 
    //       let monthly_country  = {}
    //       let monthly_city   = {}
    
    //       for(let el in reply){
    //         if(!el.search(/(count:)\w+/)){
    //           let country = el.split(':')[1]
    //           monthly_country[country]=+reply[el]
    //         }else{
    //           let arr = el.split(":") 
    //           let cityContainer = monthly_city[arr[0]] || {}
    //           cityContainer[arr[1]] = +reply[el]
    //           monthly_city[arr[0]] = cityContainer   
    //         }
    //       }
    //       let mapData = { ...this.state.visitors.mapData, monthly_country, monthly_city }
    //       let visitors = { ...this.state.visitors, mapData }
    //       this.setState({visitors})
    //       console.log(this.state)
    //     })
    // };
    mainData=()=>{
        const mapData = [ 
            { count: "100K", region: "USA", percent: "50" }, 
            { count: "1M", region: "Europe", percent: "80" }, 
            { count: "450K", region: "Australia", percent: "40" }, 
            { count: "1B", region: "India", percent: "90" } 
        ];
        return mapData.map(data => {
            function cn(elem) { return cl(elem, classes); }
            return (
                <div key={data.region} className={cn(['MapData-info'])}>
                <h5 className={cn(["mb-5"])}>{data.count}</h5>
                <small className={cn(["small-grey-med"])}> Visitors From {data.region} </small>
                <span className={cn(["percent-span"])}>{data.percent}%</span>
                <div className={cn(["progress-bar"])}> <ProgressBar animated now={data.percent} /> </div>
                </div>
            );
        });
    }
    render(){
        if(this.props.mapClicked){
            console.log(this.props.mapClicked)
        }
        return <div>{this.mainData()}</div>
    }
}

export default MapDistribution;