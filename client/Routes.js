import Login from './containers/Auth/Login';
import mainPage from './containers/mainPage';
export default [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    name: 'mainPage',
    component: mainPage,
  },
];