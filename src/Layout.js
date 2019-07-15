import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './Routes';
import "./components/scss/main.scss";
import Header from './components/layout/header';
import Sidebar from './components/layout/sidebar';
const Layout = () => (
    <div style={{display:"grid",gridTemplateColumns:"min-content 1fr"}}>
    <Header/> 
      <Sidebar/> 
      <main style={{background:'#f1f4f6'}}>
        <Switch>
          {routes.map(route => <Route key={`route-${route.name}`} {...route} />)}
        </Switch>
      </main>
    </div>
);

export default Layout;