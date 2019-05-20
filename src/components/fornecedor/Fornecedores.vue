<template>
  <v-layout>
    <v-container grid-list-xl>
        <DialogFornecedor v-on:event_dialog="getFornecedores"></DialogFornecedor>
      <v-card>
         <div class="titleCard" style="background-color: #00C853; border-color: #00C853">
            <h2>Fornecedores</h2>
        </div>
        <v-card-title>
          <v-btn @click="navigateTo" color="success" style="text-transform: none;">
            <v-icon style="padding-right: 5px">add_circle</v-icon>Adicionar Fornecedor
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
          :items="fornecedores"
          :search="search"
          class="elevation-1"
          hide-actions
        >
          <template v-slot:items="props">
            <tr @click.stop="openModal(props.item)" class="rowTable">
              <td class="text-xs-right"> {{ props.item.nome }}</td>
              <td class="justify-center">{{ props.item.tipoFornecedor }}</td>
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
import DialogFornecedor from "./DialogFornecedor.vue";
import { eventBus } from '../../main';

export default {
  data() {
    return {
      dialog: false,
      search: "",
      headers: [
        {
          text: "Nome",
          sortable: true,
          value: "nome",
          align: "center"
        },
        { text: "Tipo", value: "tipoFornecedor" },
        { text: "Telefone", value: "telefone" },
        { text: "Celular", value: "celular" },
        { text: "Email", value: "email" },
        { text: "Data Cadastro", value: "dataCadastro" },
        { text: "Ações", value: "" }
      ],
      fornecedores: []
    };
  },
  methods: {
    openModal(row) {
      let rowOfDialog = row;
      this.dialog = true;
      eventBus.$emit('dialogTrigged', {'dialog':this.dialog, 'row':rowOfDialog, 'deleteRow': false });
    },
    getFornecedores() {
      this.$http
        .get("https://vuejs-250c3.firebaseio.com//fornecedores.json")
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = [];
          for (let key in data) {
            resultArray.push(data[key]);
          }
          this.fornecedores = resultArray;
          console.log(this.fornecedores);
        });
    },
    navigateTo() {
      this.$router.push({ name: "addfornecedor" });
    },
    deadSpot() {
        event.stopPropagation();
    },
    editItem(row){
      console.log(row);
      this.$router.push({ name: "editfornecedor", params: { content: row } });
    },
    deleteItem(row) {
      console.log(row);
      let rowOfDialog = row;
      this.dialog = true;
      eventBus.$emit('dialogTrigged', {'dialog':this.dialog, 'row':rowOfDialog, 'deleteRow': true});
    }
  },
  components: {
    DialogFornecedor
  },
  created() {
    this.getFornecedores();
  }
};
</script>

<style>
     /* .titleCard{
      background-color: #00C853 !important;
      border-color: #00C853 !important;
    } */

     /* .rowTable:hover { 
      background-color: #81C784;
    }  */
</style>
