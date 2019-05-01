<template>
  <div id="app">
    <v-app>
      <NavBar></NavBar>
      <NavDrawer></NavDrawer>
      <v-content>
        <!-- Criar um Nav-Header Auxiliar para indicar a pagina que esta -->
        <!-- <v-toolbar>
          <v-toolbar-title>Adicionar Fornecedor</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-breadcrumbs :items="breadcrumbsItems" divider=">"></v-breadcrumbs>
        </v-toolbar> -->
        <v-container fluid>
          <router-view msg="Welcome to Your Vue.js App"></router-view>
          <!-- <addFornecedor></addFornecedor> -->
          <!-- <Fornecedores></Fornecedores> -->
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import NavBar from './components/NavBar.vue'
import NavDrawer from './components/NavDrawer.vue'
import Fornecedores from './components/Fornecedores.vue'
import AddFornecedor from './components/AddFornecedor.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    NavBar,
    NavDrawer,
    AddFornecedor,
    Fornecedores
  },
  data: () => ({
      breadcrumbsItems: [
        {
          text: 'Dashboard',
          disabled: false,
          href: 'breadcrumbs_dashboard'
        },
        {
          text: 'Link 1',
          disabled: false,
          href: 'breadcrumbs_link_1'
        },
        {
          text: 'Link 2',
          disabled: true,
          href: 'breadcrumbs_link_2'
        }
      ]
    })
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
