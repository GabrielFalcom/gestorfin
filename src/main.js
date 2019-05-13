import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import { routes } from './routes.js'
import money from 'v-money'

//Remover isso - Utilizar Vuex. Utilizando em NavDrawner e NavBar
export const eventBus = new Vue();

const router = new VueRouter({
  routes: routes,
  mode: 'history',
  scrollBehavior(to,from,savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash};
    }
    return {x:0, y:0};
  }
});

Vue.use(Vuetify, {
  iconfont: 'md'
});

Vue.use(VueResource);

Vue.use(VueRouter);

Vue.use(money);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
