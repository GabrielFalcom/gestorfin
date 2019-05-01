<template>
  <v-toolbar app v-bind:clippedLeft="clipped" color="info" dark>
    <v-toolbar-side-icon 
        @click="toogleDrawer">
    </v-toolbar-side-icon>
    <v-toolbar-title>Vuetify</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-menu offset-x offset-y>
        <v-btn slot="activator" flat>
          <v-toolbar-title style="text-transform:none;">
            <v-icon>person</v-icon>
            <span>Usuario</span>
            <v-icon>arrow_drop_down</v-icon>
          </v-toolbar-title>
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="item in items"
            :key="item"
            avatar
            @click=""
          >
            <v-list-tile-content>
              <v-list-tile-title v-text="item">
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

      </v-menu>
    </v-toolbar-items>
    

      

  </v-toolbar>
</template>
<script>
import { eventBus } from '../main.js';

export default {
    data() {
        return {
          items: ["Perfil", "Sair"],
          clipped: true,
          drawer: true
        }
    },
    methods: {
        toogleDrawer() {
            this.drawer = !this.drawer;
            eventBus.$emit("showDrawer", this.drawer);
        }
    }
}
</script>