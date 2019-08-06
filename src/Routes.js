import Login from './containers/Auth/Login';
import mainPage from './containers/mainPage';
import UserManagement from './containers/sections/userManagement';
import React from 'react'
export default (props)=>[
  {
    path: '/usermanagement',
    name: 'usermanagement',
    exact:true,
    component: ()=><UserManagement socket={props.socket}/>,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    name: 'mainPage',
    exact:true,
    component: mainPage,
  },
];