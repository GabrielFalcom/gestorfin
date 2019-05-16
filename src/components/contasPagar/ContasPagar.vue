<template>
  <v-layout>
    <v-container grid-list-xl>
      <!-- <DialogFornecedor v-on:event_dialog="getFornecedores"></DialogFornecedor> -->
      <v-card>
        <div class="titleCard" style="background-color: #546E7A">
          <h2>Contas A Pagar</h2>
        </div>
        <v-card-title>
          <v-btn @click="navigateTo" color="blue-grey" style="text-transform: none; color: white">
            <v-icon style="padding-right: 5px">add_circle</v-icon>Adicionar Pagamento
          </v-btn>
          <v-spacer></v-spacer>

          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn color="blue-grey" dark v-on="on" style="text-transform: none; color: white">
                <v-icon style="padding-right: 5px"> arrow_drop_down_circle </v-icon>{{itemSelect}}
              </v-btn>
            </template>
            <v-list>
              <v-list-tile v-for="(item, index) in items" :key="index" @click="getPeriodo(item.id,item.title)">
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>

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
              <td class="text-xs-right">{{ props.item.nome }}</td>
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
// import DialogFornecedor from "./DialogFornecedor.vue";
import { eventBus } from "../../main";

export default {
  data() {
    return {
      dialog: false,
      search: "",
      headers: [
        {
          text: "Descrição",
          sortable: true,
          value: "nome",
          align: "center"
        },
        { text: "Data Vencimento", value: "telefone" },
        { text: "Data Emissão", value: "dataCadastro" },
        { text: "Valor", value: "email" },
        { text: "Tipo", value: "tipoFornecedor" },
        { text: "Situação", value: "celular" },
        { text: "Ações", value: "" }
      ],
      fornecedores: [],
       itemSelect: "",
       items: [
        {id: 1, title: 'JAN' },
        {id: 2, title: 'FEV' },
        {id: 3, title: 'MAR' },
        {id: 4, title: 'ABR' },
        {id: 5, title: 'MAI' },
        {id: 6, title: 'JUN' },
        {id: 7, title: 'JUL' },
        {id: 8, title: 'AGO' },
        {id: 9, title: 'SET' },
        {id: 10, title: 'OUT' },
        {id: 11, title: 'NOV' },
        {id: 12, title: 'DEZ' },
      ]
    };
  },
  methods: {
    getPeriodo(mes, mesNome){
      const year = new Date().getFullYear();
      let aux = new Date(year, mes, 0).getDate();
      this.itemSelect = "01 "+mesNome+ " "+year+ " - "+aux+ " " + mesNome + " "+year;
    },
    openModal(row) {
      let rowOfDialog = row;
      this.dialog = true;
      eventBus.$emit("dialogTrigged", {
        dialog: this.dialog,
        row: rowOfDialog,
        deleteRow: false
      });
    },
    getFornecedores() {
      this.$http
        .get("https://vuejs-http-6fd57.firebaseio.com/fornecedores.json")
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
      this.$router.push({ name: "addpagamento" });
    },
    deadSpot() {
      event.stopPropagation();
    },
    editItem(row) {
      console.log(row);
      this.$router.push({ name: "editfornecedor", params: { content: row } });
      // https://vuejs-http-6fd57.firebaseio.com/fornecedores.json?orderBy="id"&equalTo=9&print=pretty
      // https://vuejs-http-6fd57.firebaseio.com/fornecedores.json?orderBy="id"&limitToLast=1&print=pretty
      // https://vuejs-http-6fd57.firebaseio.com/fornecedores.json?orderBy="id"&limitToFirst=1&print=pretty
    },
    deleteItem(row) {
      console.log(row);
      let rowOfDialog = row;
      this.dialog = true;
      eventBus.$emit("dialogTrigged", {
        dialog: this.dialog,
        row: rowOfDialog,
        deleteRow: true
      });
    }
  },
  components: {
    // DialogFornecedor
  },
  created() {
    this.getFornecedores();
    this.getPeriodo(new Date().getMonth(), new Date().toLocaleDateString('pt-br', {month: 'long'}));
  }
};
</script>