import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'


//Remover isso - Utilizar Vuex. Utilizando em NavDrawner e NavBar
export const eventBus = new Vue();

Vue.use(Vuetify, {
  iconfont: 'md'
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
