<template>
  <v-layout>
    <v-container grid-list-xl>
        <DialogProduto v-on:event_dialog="getProdutos"></DialogProduto>
      <v-card>
        <div class="titleCard" style="background-color: #FFA000; border-color: #FFA000;">
            <h2>Produtos</h2>
        </div>
        <v-card-title>
          <v-btn @click="navigateTo" color="#FFC107"  style="text-transform: none; color:#ffffff">
            <v-icon style="padding-right: 5px">add_circle</v-icon>Adicionar Produto
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
          :items="produtos"
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
              <td class="text-xs-right"> {{ props.item.quantidade }}</td>
              <td class="justify-center">{{ props.item.preco }}</td>
              <td class="justify-center">{{ props.item.fornecedor }}</td>
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
import DialogProduto from './DialogProduto.vue';

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
        { text: "Quantidade", value: "quantidade" },
        { text: "Preco", value: "preco" },
        { text: "Fornecedor", value: "fornecedor" },
        { text: "Data Cadastro", value: "dataCadastro" },
        { text: "Ações", value: "" }
      ],
      produtos: []
    };
  },
  methods: {
    openModal(row) {
      let rowOfDialog = row;
      this.dialog = true;
      eventBus.$emit('dialogTrigged', {'dialog':this.dialog, 'row':rowOfDialog, 'deleteRow': false });
    },
    getProdutos() {
      this.$http
        .get("https://vuejs-http-6fd57.firebaseio.com/produtos.json")
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = [];
          for (let key in data) {
            resultArray.push(data[key]);
          }
          this.produtos = resultArray;
          console.log(this.produtos);
        });
    },
    navigateTo() {
      this.$router.push({ name: "addproduto" });
    },
    deadSpot() {
        event.stopPropagation();
    },
    editItem(row){
      console.log(row);
      this.$router.push({ name: "editproduto", params: { content: row } });
    },
    deleteItem(row) {
      console.log(row);
      let rowOfDialog = row;
      this.dialog = true;
      eventBus.$emit('dialogTrigged', {'dialog':this.dialog, 'row':rowOfDialog, 'deleteRow': true});
    }
  },
  components: {
    DialogProduto
  },
  created() {
    this.getProdutos();
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
