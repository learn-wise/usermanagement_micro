import React,{Component} from 'react';
import { ProgressBar } from "react-bootstrap";
import cl from "../../../../../Hoc/multiclass";
import classes from './style.scss';
class MapDistribution extends Component{
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
            console.log(window.localStorage.getItem('worldMap-selected-regions'))
        }
        return <div>{this.mainData()}</div>
    }
}

export default MapDistribution;