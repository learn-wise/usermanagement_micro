import { hot } from 'react-hot-loader/root';
import React,{Component} from 'react';
import Routes from './Routes';
// import Aux from './Hoc/wrapper';
// import {Link} from 'react-router-dom'
class App extends Component{

    render(){
        return(
            <div>
                <Routes/>
            </div>
        )
    }

}
export default hot(App);