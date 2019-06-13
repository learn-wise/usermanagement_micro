import React from 'react';
import {Route,Switch,Redirect} from 'react-router-dom'
// import Aux from './Hoc/wrapper';
import Login from './containers/Auth/Login'
export default (props)=>(
    <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" exact render={props=><h1>hellll</h1>} />
        <Redirect to="/" />
  </Switch>
)