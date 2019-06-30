import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './routes';
import { hot } from 'react-hot-loader/root';
import "./components/scss/main.scss";
import Aux from './Hoc/wrapper';
import Header from './components/layout/header';
import Sidebar from './components/layout/sidebar';
const Layout = () => (
    <Aux>
      <Header/>
      <Sidebar/>
      <main>
        <Switch>
          {routes.map(route => <Route key={`route-${route.name}`} {...route} />)}
        </Switch>
      </main>
    </Aux>
);

export default hot(Layout);