<template>
  <div id="app">
    <v-app>
      <NavBar></NavBar>
      <NavDrawer></NavDrawer>
      <v-content>
        <v-container fluid>
          <img alt="Vue logo" src="./assets/logo.png">
          <HelloWorld msg="Welcome to Your Vue.js App"/>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import NavBar from './components/NavBar.vue'
import NavDrawer from './components/NavDrawer.vue'
export default {
  name: 'app',
  components: {
    HelloWorld,
    NavBar,
    NavDrawer
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
