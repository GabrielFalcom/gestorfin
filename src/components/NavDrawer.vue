<template>
  <v-navigation-drawer :clipped="clipp" stateless :value="drawer.value" app>
    <div class="container fluid pb-0">
        <div class="text-xs-center">
          <img alt="Vue logo" src="../assets/Vue.webp" width="90" height="90" class="center">
        </div>
    </div>
    <v-list>
      <v-list-group prepend-icon="list_alt" value="true" no-action>
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>Cadastros</v-list-tile-title>
          </v-list-tile>
        </template>
            <v-list-tile v-for="(cad, i) in cadastro" :key="i" @click>
            <v-list-tile-title v-text="cad[0]"></v-list-tile-title>
            <v-list-tile-action>
              <v-icon v-text="cad[1]"></v-icon>
            </v-list-tile-action>
          </v-list-tile>
      </v-list-group>

      <!-- <v-list-group prepend-icon="account_circle" value="true">
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>Users</v-list-tile-title>
          </v-list-tile>
        </template>
        <v-list-group no-action sub-group value="true">
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>Admin</v-list-tile-title>
            </v-list-tile>
          </template>

          <v-list-tile v-for="(admin, i) in admins" :key="i" @click>
            <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
            <v-list-tile-action>
              <v-icon v-text="admin[1]"></v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>

        <v-list-group sub-group no-action>
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>Actions</v-list-tile-title>
            </v-list-tile>
          </template>
          <v-list-tile v-for="(crud, i) in cruds" :key="i" @click>
            <v-list-tile-title v-text="crud[0]"></v-list-tile-title>
            <v-list-tile-action>
              <v-icon v-text="crud[1]"></v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list-group> -->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { eventBus } from "../main.js";

export default {
  data: () => ({
    clipp: true,
    drawer: {
      value: true
    },
    cadastro: [["Clientes","people"], ["Fornecedores","poll"], ["Produtos","shopping_cart"]],
    admins: [["Management", "people_outline"], ["Settings", "settings"]],
    cruds: [
      ["Create", "add"],
      ["Read", "insert_drive_file"],
      ["Update", "update"],
      ["Delete", "delete"]
    ]
  }),
  created() {
    eventBus.$on("showDrawer", drawer => {
      this.drawer.value = drawer;
    });
  }
};
</script>