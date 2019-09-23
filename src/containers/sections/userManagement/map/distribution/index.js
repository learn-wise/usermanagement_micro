import React,{Component} from 'react';
import { ProgressBar } from "react-bootstrap";
import cl from "../../../../../Hoc/multiclass";
import Aux from "../../../../../Hoc/wrapper";
import classes from './style.scss';
class MapDistribution extends Component{
    constructor(props) {
        super(props);
        this.visitorSocket = this.props.visiSocket
        this.state = {
            mapInitialData:[ 
                { count: "100K", region: "USA", percent: "50" }, 
                { count: "1M", region: "Europe", percent: "80" }, 
                { count: "450K", region: "Australia", percent: "40" }, 
                { count: "1B", region: "India", percent: "90" } 
            ], mapSpecificData:null , hasVisitor:false
        }
        this.cn = (elem)=>cl(elem, classes)
    }
    componentDidUpdate(prevProps,prevState){
        if(this.props.mapClicked !== prevProps.mapClicked){
            this.visitorSocket.emit('visitorsCountryDetail',this.props.mapClicked.id)
        }
    }
    componentDidMount(){
        this.visitorSocket.on('visitorsCountryDetail_receive',reply=>{
            if(reply){
                reply= JSON.parse(reply)
                let totalSum = Object.values(reply).reduce((sum, num) =>Number(sum) + Number(num));
                let arrContainer= []
                for(let el in reply){
                    let obj = {}
                    obj.count   = reply[el]
                    obj.region  = el
                    obj.percent = +( ( reply[el] / totalSum ) * 100 ).toFixed(0)
                    arrContainer.push(obj)
                }
                console.log(arrContainer)
                this.setState({
                    mapSpecificData:arrContainer,
                    hasVisitor:true
                })
            }else{
                this.setState({ hasVisitor:false })
            }
        })
    }
    mainData=()=>{
        let {mapInitialData,mapSpecificData} = this.state
        let mapData = mapSpecificData ? mapSpecificData : mapInitialData ;
        return mapData.map(data =>(
                <div key={data.region} className={this.cn(['MapData-info'])}>
                <h5 className={this.cn(["mb-5"])}>{data.count}</h5>
                <small className={this.cn(["small-grey-med"])}> Visitors From {data.region} </small>
                <span className={this.cn(["percent-span"])}>{data.percent}%</span>
                <div className={this.cn(["progress-bar"])}> <ProgressBar animated now={data.percent} /> </div>
                </div>
            )
        );
    }
    render(){
        return <Aux>
            <div className={this.cn(['MapData-header'])}> {this.props.mapClicked && this.state.hasVisitor ? this.props.mapClicked.dataset.tip:"World"} </div>
            {this.mainData()}
        </Aux>
    }
}

export default MapDistribution;