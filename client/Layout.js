import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './routes';
import { hot } from 'react-hot-loader/root';
const Layout = () => (
    <div className="container">
    {/* <Route path='/' component={Hello}/> */}
      <Switch>
        {routes.map(route => <Route key={`route-${route.name}`} {...route} />)}
      </Switch>
    </div>
);

export default hot(Layout);