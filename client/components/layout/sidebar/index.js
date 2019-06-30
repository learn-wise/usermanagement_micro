import React,{Component} from 'react';
import classes from './style.scss';
import cl from '../../../Hoc/multiClass'
class sidebar extends Component{
    render(){
        function cn(elem){ return cl(elem,classes) }
        return(
            <div className={classes.app_sidebar}>
                <ul className={classes.sidebar}>
                    <li className={cn(['board','parent'])}>
                    <span className={cn(['mainCat'])}>board</span>
                    
                        <ul className={cn(['sub'])}>
                            <li className={cn(['sub_ele'])}>mainAdmin</li>
                            <li className={cn(['sub_ele'])}>Co-Admin</li>
                            <li className={cn(['sub_ele'])}>R&D Admin</li>
                        </ul>
                    </li>
                    <li className={cn(['section','parent'])}>
                    <span className={cn(['mainCat'])}>sections</span>
                        <ul className={cn(['sub'])}>
                            <li className={cn(['sub_ele'])}>mainAdmin</li>
                            <li className={cn(['sub_ele'])}>Co-Admin</li>
                            <li className={cn(['sub_ele'])}>R&D Admin</li>
                        </ul>
                    </li>
                    <li className={cn(['projects','parent'])}>
                    <span className={cn(['mainCat'])}>projects</span>
                        <ul className={cn(['sub'])}>
                            <li className={cn(['sub_ele'])}>mainAdmin</li>
                            <li className={cn(['sub_ele'])}>Co-Admin</li>
                            <li className={cn(['sub_ele'])}>R&D Admin</li>
                        </ul>
                    </li>
                    <li className={cn(['settings','parent'])}>
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

