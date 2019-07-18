import React,{Component} from 'react'
import classes from './style.scss';
import cl from '../../../../../Hoc/multiclass';
import MonthlyUsersState from "./users";
import MonthlyVisitorsState from "./visitors";
import {ReactComponent as Leftarrow} from '../../../../../assets/icons/arrows_left.svg';
import {ReactComponent as Rightarrow} from '../../../../../assets/icons/arrows_right.svg';

function cn(elem) { return cl(elem, classes); }

class MonthlyState extends Component{
    constructor(props){
        super(props)
        this.state={
            showVisitorsChart:true,
            showUsersChart:false
        }
    }
    nexButtonHandler=()=>{
        this.setState({
            showUsersChart:true,
            showVisitorsChart:false
        })
    }
    prevButtonHandler=()=>{
        this.setState({
            showUsersChart:false,
            showVisitorsChart:true
        })
    }
    leftButton=()=>{
    if(this.state.showUsersChart){
        return (
            <button 
                type="button"
                className={cn(['slick-prev','slick-arrow'])}
                onClick={this.prevButtonHandler}
            ><Leftarrow  width="20px" height="20px"/></button>
        )
    }
    }
    rightButton=()=>{
        if(this.state.showVisitorsChart){
            return(
                <button 
                    type="button"
                    className={cn(['slick-next','slick-arrow'])}
                    onClick={this.nexButtonHandler}
                > <Rightarrow width="20px" height="20px"/></button>
            )
        }
    }
    render(){
        return(
            <div className={classes['monthlyState-container']}>
                {this.leftButton()}
                {this.rightButton()}
                <MonthlyVisitorsState show={this.state.showVisitorsChart} />
                <MonthlyUsersState show={this.state.showVisitorsChart} />
            </div>
        )
    }
}

export default MonthlyState;