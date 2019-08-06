import React,{Component} from 'react';
import MicroState from '../index';
import classes from './style.scss';
import {ReactComponent as DownArrow} from '../../../../../../assets/icons/arrows_down_double.svg'
import {ReactComponent as UpArrow} from '../../../../../../assets/icons/arrows_up_double.svg'
class TotalVisitors extends Component{
    constructor(props){
        super(props)
        this.state={
            statistic:{
                onlinesCount:523,
                diffCount:0
            },
            error:null,
            increase:false,
            decrease:false
        }
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
                <h5 className={classes.header}>Total visitors</h5>
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
                <MicroState type="online_users" color="#F9C80E" series={this.series()}/>
            </div>
        )
    }
}

export default TotalVisitors;