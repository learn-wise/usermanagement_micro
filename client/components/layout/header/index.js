import React,{Component} from 'react';
import classes from './style.scss';
import Ipad from '../../../assets/icons/basic_message.svg';
import cl from '../../../Hoc/multiClass'
class header extends Component{
    state = {
        profileSub:false
    }
    profileHandler=()=>{ console.log('ok')}
    messageHandler=()=>{ console.log('ok')}

    render(){
    function cn(elem){ return cl(elem,classes) }
       const Profile_submenu = ()=>{
           if(this.state.profileSub){
               return  <div className={classes.profileSub}>
                   <a href="/">Dashboard</a>
                   <a href="/profile">profile</a>
                   <a href="/signout">SignOut</a>
               </div>
           }
       }
        return(
            <div className={classes.header}>
                <div className={classes.intro}>Intro</div>
                <div className={classes.toolbar}>
                    <div 
                        onClick={this.messageHandler} 
                        className={cn([
                            'icon_wrapper_alt'
                            ,'icon_wrapper'
                            ,'rounded_circle'
                        ])}>
                        <Ipad className={classes.svg} />
                    </div>
                    <div 
                        className={cn([ 
                            'icon_wrapper_alt',
                            'profile',
                            'rounded_circle'
                        ])}
                        onClick={this.profileHandler}>
                    </div>
                        {Profile_submenu()}
                    <span className={classes.arrowDown}></span>
                </div>
            </div>
        )
    }
}

export default header