import React,{Component} from 'react';
import { ProgressBar } from "react-bootstrap";
import cl from "../../../../../Hoc/multiclass";
import Aux from "../../../../../Hoc/wrapper";
import classes from './style.scss';
import shortNum from 'short-number';
class MapDistribution extends Component{
    constructor(props) {
        super(props);
        this.visitorSocket = this.props.visiSocket
        this.state = {
            mapInitialData:[],
            mapSpecificData:null,
            hasVisitor:false,
            worldAlarm:false
        }
        this.cn = (elem)=>cl(elem, classes)
    }
    
    componentWillMount() {
        this.mapInitialData() 
    }
    
    componentDidUpdate(prevProps,prevState){
        if( 
            this.props.mapClicked !== prevProps.mapClicked 
        ||  this.props.mapType    !== prevProps.mapType 
        ){       
            if(this.props.mapClicked.id !== 'world'){
                this.visitorSocket.emit('visitorsCountryDetail',{
                    countryId:this.props.mapClicked.id,
                    mapType:this.props.mapType
                })
                this.setState({worldAlarm:true})
            }else{ this.mapInitialData() }
        }
    }
    componentDidMount(){
        this.visitorSocket.on('visitorsCountryDetail_receive',reply=>{
            if(reply && reply !== "{}"){
                reply= JSON.parse(reply)
                this.setState({ mapSpecificData:reply, hasVisitor:true })
            }else{ this.setState({ hasVisitor:false }) }
        })
    }
    mapInitialData =()=>{
        this.visitorSocket.emit('visitorsTopCountry',{mapType:this.props.mapType})
        this.visitorSocket.on('visitorsTopCountry_callback',countries=>{
            this.setState({mapInitialData:countries})
        })
    }
    mainData=()=>{
        let {mapSpecificData} = this.state
        let mapData = mapSpecificData ? mapSpecificData : this.state.mapInitialData ;
        return mapData.map(data =>(
            <div key={data.region} className={this.cn(['MapData-info'])}>
                <h5 className={this.cn(["mb-5"])} title={+data.count}>{shortNum(+data.count)}</h5>
                <small className={this.cn(["small-grey-med"])}> Visitors From {data.region} </small>
                <span className={this.cn(["percent-span"])}>{data.percent}%</span>
                <div className={this.cn(["progress-bar"])}> <ProgressBar animated now={data.percent} /> </div>
            </div>
        ));
    }
    render(){
        return <Aux>
            <div className={this.cn(['MapData-header'])}> 
            {this.props.mapClicked && this.state.hasVisitor 
                ?   this.props.mapClicked.dataset.tip
                :   "World"
            }</div>
            {this.mainData()}
            <div onClick={()=>this.setState({mapSpecificData:null})}>{this.state.worldAlarm ? 'back to world' : ''}</div>
        </Aux>
    }
}

export default MapDistribution;