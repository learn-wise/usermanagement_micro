import Login from './containers/Auth/Login';
import mainPage from './containers/mainPage';
import userManagement from './containers/sections/userManagement';

export default [
  {
    path: '/usermanagement',
    name: 'usermanagement',
    exact:true,
    component: userManagement,
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