<template>
  <v-layout>
    <v-container grid-list-xl>
      <DialogRecebimento v-on:event_dialog="getRecebimentos"></DialogRecebimento>
      <v-card>
        <div class="titleCard" style="background-color: #009688">
          <h2>Contas A Receber</h2>
        </div>
        <v-card-title>
          <v-btn @click="navigateTo" color="teal lighten-1" style="text-transform: none; color: white">
            <v-icon style="padding-right: 5px">add_circle</v-icon>Adicionar Recebimento
          </v-btn>
          <v-spacer></v-spacer>

          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn color="teal lighten-1" dark v-on="on" style="text-transform: none; color: white">
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
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="recebimentos"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <tr @click.stop="openModal(props.item)" class="rowTable">
              <td class="justify-center">{{ props.item.descricao }}</td>
              <td class="justify-center">{{ props.item.vencimento }}</td>
              <td class="justify-center">{{ props.item.emissao }}</td>
              <td class="justify-center">{{ props.item.valor }}</td>
              <td class="justify-center">{{ props.item.formaPagSelected }}</td>
              <td class="justify-center"> <v-chip :color="checkChip(props.item)[0]" disabled text-color="white">{{checkChip(props.item)[1]}}</v-chip></td>
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
import DialogRecebimento from "./DialogRecebimento.vue";
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
          value: "descricao",
          align: "center"
        },
        { text: "Data Vencimento", value: "vencimento" },
        { text: "Data Emissão", value: "emissao" },
        { text: "Valor(R$)", value: "valor" },
        { text: "Forma Pag.", value: "formaPagSelected" },
        { text: "Situação", value: "status" },
        { text: "Ações", value: "" }
      ],
      recebimentos: [],
       itemSelect: "",
       items: [
        {id: 1, title: 'Jan' },
        {id: 2, title: 'Fev' },
        {id: 3, title: 'Mar' },
        {id: 4, title: 'Abr' },
        {id: 5, title: 'Mai' },
        {id: 6, title: 'Jun' },
        {id: 7, title: 'Jul' },
        {id: 8, title: 'Ago' },
        {id: 9, title: 'Set' },
        {id: 10, title: 'Out' },
        {id: 11, title: 'Nov' },
        {id: 12, title: 'Dez' },
      ]
    };
  },
  methods: {
     checkChip(item){
      if (item.status == 'Pago') {
        return ["success", "Pago"]
      } 
        var ano = item.vencimento.split('-')[0];
        var mes = item.vencimento.split('-')[1];
        var dia = item.vencimento.split('-')[2];
        
        var vencimento = new Date(ano,(mes - 1), dia);
        console.log('vencimento: '+vencimento.getTime())
        console.log('hoje: '+new Date().getTime());
        if  (vencimento.getTime() < new Date().getTime()) {
          return ["error", "Atrasado"]
        } else if (vencimento.getTime() > new Date().getTime()) {
          return ["warning", "Em Aberto"]
        }
    },
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
    getRecebimentos() {
      this.$http
        .get("https://vuejs-250c3.firebaseio.com/recebimentos.json")
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = [];
          for (let key in data) {
            resultArray.push(data[key]);
          }
          this.recebimentos = resultArray;
          console.log(this.recebimentos);
        });
    },
    navigateTo() {
      this.$router.push({ name: "addreceita" });
    },
    deadSpot() {
      event.stopPropagation();
    },
    editItem(row) {
      console.log(row);
      this.$router.push({ name: "editreceita", params: { content: row } });
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
    DialogRecebimento
  },
  created() {
    this.getRecebimentos();
    this.getPeriodo(new Date().getMonth(), new Date().toLocaleDateString('pt-br', {month: 'long'}));
  }
};
</script>