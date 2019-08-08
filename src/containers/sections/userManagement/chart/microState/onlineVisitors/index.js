import React,{Component} from 'react';
import MicroState from '../index';
import classes from './style.scss';
import {ReactComponent as DownArrow} from '../../../../../../assets/icons/arrows_down_double.svg'
import {ReactComponent as UpArrow} from '../../../../../../assets/icons/arrows_up_double.svg'
class OnlineVisitors extends Component{
    constructor(props){
        super(props)
        this.state={
            statistic:{
                onlinesCount:0,
                diffCount:0
            },
            error:null,
            increase:false,
            decrease:false
        }
    }
    componentWillMount(){
        const visitorsSocket = this.props.socket('visitors')
        visitorsSocket.on('connect_error',(err)=>{ 
            if(err){ this.setState({error:'socket server is down'}) }
        })
        
        visitorsSocket.on('onlineVisitorsCount',count=>{
            if(!count){return null}
            let prevCount = +this.state.statistic.onlinesCount;
            let nexCount = +count.onlinesCount;
            if(prevCount<nexCount){ this.setState({increase:true,decrease:false}) }
            if(prevCount>nexCount){ this.setState({decrease:true,increase:false}) }
            let statistic= { ...this.state.statistic, ...count }
            this.setState({statistic})
        })

        visitorsSocket.on('onlineVisitorsInitial',count=>{
            if(!count){return null}
            let statistic= { ...this.state.statistic, ...count }
            this.setState({statistic})
        })
    }
    arrowDownHandler=()=>{
        let classArray = [classes.arrow_down]
        if(this.state.decrease){
            classArray.push(classes.visible)
        }
        return classArray.join(' ')
    }
    arrowUpHandler=()=>{
        let classArray = [classes.arrow_up]
        if(this.state.increase){
            classArray.push(classes.visible)
        }
        return classArray.join(' ')
    }
    series=()=>{
        return[{ data: [70, 41, 35, 51, 20, 62, 69, 10, 30,10, 41, 35, 51, 20, 62, 69, 10, 30,20, 62, 69, 10, 30,10, 41, 35,27,28,29,30 ] }]
    };
    render(){
        return(
            <div className={classes.container}>
                <h5 className={classes.header}>online visitors</h5>
                <div className={classes.counter_section}>
                    <span className={classes.counter}>
                    {this.state.statistic.onlinesCount}
                    </span>
                    <span className={this.arrowUpHandler()}>
                        <UpArrow width="15px" height="15px"/>
                    </span>
                    <span className={this.arrowDownHandler()}>
                        <DownArrow width="15px" height="15px"/>
                    </span>
                </div>
                <MicroState type="online_visitors" color="#D7263D" series={this.series()}/>
            </div>
        )
    }
}

export default OnlineVisitors;