import React,{Component} from 'react';
import { ProgressBar } from "react-bootstrap";
import cl from "../../../../../Hoc/multiclass";
import Aux from "../../../../../Hoc/wrapper";
import classes from './style.scss';
import NodataSvg from './svg/noDataSvg'
import shortNum from 'short-number';
class MapDistribution extends Component{
    constructor(props) {
        super(props);
        this.visitorSocket = this.props.visiSocket
        this.state = {
            mapInitialData:[],
            mapSpecificData:null,
            hasVisitor:false,
            worldAlarm:false,
            dataLoading:true
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
            }else{ this.mapInitialData({ mapSpecificData:null, worldAlarm:false }) }

        }
        if(this.state.mapInitialData !== prevState.mapInitialData 
            || this.state.mapSpecificData !== prevState.mapSpecificData){
                this.setState({dataLoading:false})
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
    mapInitialData =(config=null)=>{
        this.visitorSocket.emit('visitorsTopCountry',{mapType:this.props.mapType})
        this.visitorSocket.on('visitorsTopCountry_callback',countries=>{
            this.setState({ mapInitialData:countries,...config})
        })
    }
    mainData=()=>{
        let {mapSpecificData,mapInitialData} = this.state
        let mapData = mapSpecificData ? mapSpecificData : mapInitialData ;
        // TODO:remove nodatasvg when data had been initilized
        console.log(mapData)
        if(Object.keys(mapData).length === 0 ){ return <NodataSvg/> }
        return mapData.map(data =>(
            <div key={data.region} className={this.cn(['MapData-info'])}>
                <h5 className={this.cn(["mb-5"])} title={+data.count}>{shortNum(+data.count)}</h5>
                <small className={this.cn(["small-grey-med"])}> Visitors From {data.region} </small>
                <span className={this.cn(["percent-span"])}>{data.percent}%</span>
                <div className={this.cn(["progress-bar"])}> <ProgressBar animated now={data.percent} /> </div>
            </div>
        ));
    }
    backBtn = ()=>{
        return this.state.worldAlarm && (Object.keys(this.state.mapInitialData).length === 0 || this.state.mapSpecificData ) 
        ? <button 
            onClick={()=>this.props.clearSelectedCountry(true)} 
            className={this.cn(['MapData-backToWorld'])}
            >World Distribution</button>
        : ''
    }
    headerData =()=>{
        return <div className={this.cn(['MapData-header'])}> 
        {this.props.mapClicked && this.state.hasVisitor 
            ?   this.props.mapClicked.dataset.tip
            :   "World"
        }</div>
    }

    render(){
        if(!this.state.dataLoading){
            return <Aux>
                {this.headerData()}
                {this.mainData()}
                {this.backBtn()}
            </Aux>
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
}
export default MapDistribution;