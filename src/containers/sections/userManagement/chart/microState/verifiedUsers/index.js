import React,{Component} from 'react';
import MicroState from '../index';
import classes from './style.scss';
import {ReactComponent as DownArrow} from '../../../../../../assets/icons/arrows_down_double.svg'
import {ReactComponent as UpArrow} from '../../../../../../assets/icons/arrows_up_double.svg'
import moment from 'moment';
import { graphql } from 'react-apollo'
import verifiedUserCount from '../../../../../../Graphql/queries/verifiedUsers';

class VerifiedUsers extends Component{
    constructor(props){
        super(props)
        this.state={
            verifiedCount:0,
            diffCount:null,
            error:null,
            chartData:null,
            increase:false,
            decrease:false
        }
    }
    componentWillMount(){
        const usersSocket = this.props.socket
        usersSocket.on('totalVerifiedUsersList',list=>{
            if(!list){ list = {key:0} }
            if(!this.state.diffCount){
                this.setState({diffCount:Object.values(list)})
            }else{
                let prevCount       = this.state.diffCount;
                let verifiedCount   = this.state.verifiedCount;
                let currentCount    = Object.values(list);
                if( prevCount<currentCount ){ this.setState({increase:true,decrease:false,diffCount:currentCount,verifiedCount:++verifiedCount}) }
                if( prevCount>currentCount ){ this.setState({decrease:true,increase:false,diffCount:currentCount,verifiedCount:--verifiedCount}) }   
            }
            if(Object.values(list)[0] === 0){ return null }
            let chartData = list;
            let resultData = [];
            let current_Month = moment().format('MM');
            let current_Day   = moment().format('D');
            let current_Year  = moment().format('YYYY');
            let Days_Of_Month = moment().daysInMonth()
            let i = 0;
            let j = +current_Day;
    
            while(i < current_Day){
                let specificDay =  `${current_Year}/${current_Month}/${i+1}`;
                chartData[specificDay] === undefined
                    ?resultData[i] = 0
                    :resultData[i] = chartData[specificDay];
                i++
            }
            while(j<Days_Of_Month){ resultData[j] = 0; j++ }
            this.setState({chartData:[{data:resultData}]})
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
    initialCount =()=> this.props.data.verifiedUsersCount?this.props.data.verifiedUsersCount.count : 0 ; 
    render(){
        return(
            <div className={classes.container}>
                <h5 className={classes.header}>Verified users</h5>
                <div className={classes.counter_section}>
                    <span className={classes.counter}>
                    {this.initialCount()}
                    </span>
                    <span className={this.arrowUpHandler()}>
                        <UpArrow width="15px" height="15px"/>
                    </span>
                    <span className={this.arrowDownHandler()}>
                        <DownArrow width="15px" height="15px"/>
                    </span>
                </div>
                <MicroState 
                    type="users_verified" 
                    color="#662E9B" 
                    series={this.state.chartData}/>
            </div>
        )
    }
}

export default graphql(verifiedUserCount)(VerifiedUsers);