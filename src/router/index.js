import vue from 'vue'
import router from 'vue-router'

import index from '../views/Index';
import login from '../views/Login';
import customer from "../components/customer";
import warehouse from "../components/warehouse";
import product from "../components/product";
import user from "../components/user";
import store from "../components/store";

vue.use(router);

export default new router({
  mode: 'history',
  routes:[
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/index',
      component: index,
      // redirect: '/customer',
      children: [
        {
          path: '/customer',
          component: customer
        },
        {
          path: '/warehouse',
          component: warehouse
        },
        {
          path: '/product',
          component: product
        },
        {
          path: '/user',
          component: user
        },
        {
          path: '/store',
          component: store
        }
      ]
    }
  ]
});
