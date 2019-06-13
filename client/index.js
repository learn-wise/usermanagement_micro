import 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import routes from './Routes';
import {BrowserRouter,Route} from 'react-router-dom';

ReactDOM.render(
<BrowserRouter>
   <Route path='/' component={routes}/>
</BrowserRouter>
,document.getElementById('root'));