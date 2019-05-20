<template>
  <v-layout>
    <v-container grid-list-xl>
        <DialogCliente v-on:event_dialog="getClientes"></DialogCliente>
      <v-card>
        <div class="titleCard" style="background-color: #448AFF; border-color: #448AFF;">
            <h2>Clientes</h2>
        </div>
        <v-card-title>
          <v-btn @click="navigateTo" color="#64B5F6"  style="text-transform: none; color:#ffffff">
            <v-icon style="padding-right: 5px">add_circle</v-icon>Adicionar Cliente
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Pesquisar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="clientes"
          :search="search"
          class="elevation-1"
          hide-actions
        >
          <template v-slot:items="props">
            <tr @click.stop="openModal(props.item)" class="rowTable">
              <td class="text-xs-center"> 
                   <v-avatar size="100px" :tile="true">
                       <v-img :src="$url(props.item.imagem)"></v-img>
                   </v-avatar>
                </td>
              <td class="text-xs-right"> {{ props.item.nome }}</td>
              <td class="justify-center">{{ props.item.telefone }}</td>
              <td class="justify-center">{{ props.item.celular }}</td>
              <td class="justify-center">{{ props.item.email }}</td>
              <td class="justify-center">{{ props.item.dataCadastro }}</td>
              <td class="justify-center" @click="deadSpot">
                <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>

import { eventBus } from '../../main';
import DialogCliente from './DialogCliente.vue';

export default {
  data() {
    return {
      dialog: false,
      search: "",
      headers: [
        {value: "imagem",sortable: false},
        {
          text: "Nome",
          sortable: true,
          value: "nome",
          align: "center"
        },
        { text: "Telefone", value: "telefone" },
        { text: "Celular", value: "celular" },
        { text: "Email", value: "email" },
        { text: "Data Cadastro", value: "dataCadastro" },
        { text: "Ações", value: "" }
      ],
      clientes: []
    };
  },
  methods: {
    openModal(row) {
      let rowOfDialog = row;
      this.dialog = true;
      eventBus.$emit('dialogTrigged', {'dialog':this.dialog, 'row':rowOfDialog, 'deleteRow': false });
    },
    getClientes() {
      this.$http
        .get("https://vuejs-250c3.firebaseio.com/clientes.json")
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = [];
          for (let key in data) {
            resultArray.push(data[key]);
          }
          this.clientes = resultArray;
          console.log(this.clientes);
        });
    },
    navigateTo() {
      this.$router.push({ name: "addcliente" });
    },
    deadSpot() {
        event.stopPropagation();
    },
    editItem(row){
      console.log(row);
      this.$router.push({ name: "editcliente", params: { content: row } });
    },
    deleteItem(row) {
      console.log(row);
      let rowOfDialog = row;
      this.dialog = true;
      eventBus.$emit('dialogTrigged', {'dialog':this.dialog, 'row':rowOfDialog, 'deleteRow': true});
    }
  },
  components: {
    DialogCliente
  },
  created() {
    this.getClientes();
  }
};
</script>

<style>
     /* .rowTable:hover { 
        background-color: #ffe2e2;
    } */

    /* .titleCard {
      background-color: #448AFF !important;
      border-color: #448AFF !important;
    }  */
</style>
