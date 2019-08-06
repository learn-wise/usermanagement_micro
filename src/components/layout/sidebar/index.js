import React,{Component} from 'react';
import classes from './style.scss';
import cl from '../../../Hoc/multiclass'
import { Link } from 'react-router-dom';
class sidebar extends Component{
    consol=()=>{
        // console.log('ok')
    }
    render(){
        function cn(elem){ return cl(elem,classes) }
        return(
            <div className={classes.app_sidebar} onMouseEnter={this.consol}>
                <ul className={classes.sidebar}>
                    <li className={cn(['board','parent'])}>
                    <div className={cn(['sidebaricon','boardico'])}></div>
                    <span className={cn(['mainCat'])}>board</span>
                    
                        <ul className={cn(['sub'])}>
                            <li className={cn(['sub_ele'])}>mainAdmin</li>
                            <li className={cn(['sub_ele'])}>Co-Admin</li>
                            <li className={cn(['sub_ele'])}>R&D Admin</li>
                        </ul>
                    </li>
                    <li className={cn(['section','parent'])}>
                    <div className={cn(['sidebaricon','sectionsico'])}></div>
                    <span className={cn(['mainCat'])}>sections</span>
                        <ul className={cn(['sub'])}>
                            <li className={cn(['sub_ele'])}><Link to="/usermanagement">users</Link></li>
                            <li className={cn(['sub_ele'])}>shop</li>
                            <li className={cn(['sub_ele'])}>mainSite</li>
                        </ul>
                    </li>
                    <li className={cn(['projects','parent'])}>
                    <div className={cn(['sidebaricon','projectsico'])}></div>
                    <span className={cn(['mainCat'])}>projects</span>
                        <ul className={cn(['sub'])}>
                            <li className={cn(['sub_ele'])}>mainAdmin</li>
                            <li className={cn(['sub_ele'])}>Co-Admin</li>
                            <li className={cn(['sub_ele'])}>R&D Admin</li>
                        </ul>
                    </li>
                    <li className={cn(['settings','parent'])}>
                    <div className={cn(['sidebaricon','settingsico'])}></div>
                    <span className={cn(['mainCat'])}>settings</span>
                        <ul className={cn(['sub'])}>
                            <li className={cn(['sub_ele'])}>mainAdmin</li>
                            <li className={cn(['sub_ele'])}>Co-Admin</li>
                            <li className={cn(['sub_ele'])}>R&D Admin</li>
                        </ul>
                    </li>

                </ul>
            </div>
        )
    }
}

export default sidebar

