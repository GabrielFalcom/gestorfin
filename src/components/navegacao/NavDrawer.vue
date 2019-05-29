<template>
  <v-navigation-drawer :clipped="clipp" stateless :value="drawer.value" app>
    <div class="container fluid pb-0">
      <div class="text-xs-center" style="cursor: pointer" @click="navigateTo('home')">
        <img alt="Vue logo" src="../../assets/Vue.webp" width="90" height="90" class="center">
      </div>
    </div>
    <v-list>
      <v-list-group prepend-icon="list_alt" :value="true" no-action>
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>Cadastros</v-list-tile-title>
          </v-list-tile>
        </template>
        <v-list-tile v-for="(cad, i) in cadastro" :key="i" @click="navigateTo(cad.hrefName)">
          <v-list-tile-title v-text="cad.label"></v-list-tile-title>
          <v-list-tile-action>
            <v-icon v-text="cad.icon"></v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-group>

      <v-list-group prepend-icon="monetization_on" :value="false" no-action>
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>Finanças</v-list-tile-title>
          </v-list-tile>
        </template>
        <v-list-tile v-for="(fin, i) in financa" :key="i" @click="navigateTo(fin.hrefName)">
          <v-list-tile-title v-text="fin.label"></v-list-tile-title>
          <v-list-tile-action>
            <v-icon v-text="fin.icon"></v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-group>

        <v-list style="cursor: pointer">
            <v-list-tile>
              <v-list-tile-action>
                <v-icon> business </v-icon>
              </v-list-tile-action>
              <v-list-tile-title @click="navigateTo('addestoque')">Gerenciar Estoque</v-list-tile-title>
            </v-list-tile>
        </v-list>

        <v-list style="cursor: pointer">
            <v-list-tile>
              <v-list-tile-action>
                <v-icon> calendar_today </v-icon>
              </v-list-tile-action>
              <v-list-tile-title @click="navigateTo('agenda')">Agenda</v-list-tile-title>
            </v-list-tile>
        </v-list>
        <!-- <v-list-tile v-for="(fin, i) in financa" :key="i" @click="navigateTo(fin.hrefName)">
          <v-list-tile-title v-text="fin.label"></v-list-tile-title>
          <v-list-tile-action>
            <v-icon v-text="fin.icon"></v-icon>
          </v-list-tile-action>
        </v-list-tile> -->

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
      </v-list-group>-->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { eventBus } from '../../main.js';

export default {
  data: () => ({
    clipp: true,
    drawer: {
      value: true
    },
    cadastro: [
      {
        label: "Clientes",
        icon: "people",
        hrefName: "cliente"
      },
      {
        label: "Fornecedores",
        icon: "poll",
        hrefName: "fornecedor"
      },
      {
        label: "Produtos",
        icon: "shopping_cart",
        hrefName: "produto"
      }
    ],
     financa: [
      {
        label: "Contas a Pagar",
        icon: "money_off",
        hrefName: "contaspay"
      },
      {
        label: "Contas a Receber",
        icon: "attach_money",
        hrefName: "contasrcb"
      },
    ],
    admins: [["Management", "people_outline"], ["Settings", "settings"]],
    cruds: [
      ["Create", "add"],
      ["Read", "insert_drive_file"],
      ["Update", "update"],
      ["Delete", "delete"]
    ]
  }),
  methods: {
    navigateTo(nomeRota) {
      this.$router.push({ name: nomeRota});
    }
  },
  created() {
    eventBus.$on("showDrawer", drawer => {
      this.drawer.value = drawer;
    });
  }
};
</script>