import Login from './containers/Auth/Login';
import Hello from './containers/hello'
export default [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '*',
    name: 'notfound',
    component: Hello,
  },
];