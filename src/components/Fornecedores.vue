<template>
  <v-layout>
    <v-container grid-list-xl>
      <v-card>
          <v-card-title style="padding:0">
          <v-btn @click="navigateTo" color="success" style="text-transform: none;">
              <v-icon style="padding-right: 5px">add_circle</v-icon>
              Adicionar Fornecedor 
          </v-btn>
        </v-card-title>
        <v-card-title>
          <h2>Fornecedores</h2>
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
            <td class="text-xs-right">{{ props.item.nome }}</td>
            <td class="justify-center">{{ props.item.tipoFornecedor }}</td>
            <td class="justify-center">{{ props.item.telefone }}</td>
            <td class="justify-center">{{ props.item.celular }}</td>
            <td class="justify-center">{{ props.item.email }}</td>
            <td class="justify-center">{{ props.item.dataCadastro }}</td>
            <td class="justify-center">
              <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      headers: [
        {
          text: "Nome",
          sortable: true,
          value: "nome",
          align: "center"
        },
        { text: "Tipo", value: "tipo" },
        { text: "Telefone", value: "telefone" },
        { text: "Celular", value: "celular" },
        { text: "Email", value: "email" },
        { text: "Data Cadastro", value: "dataCadastro" },
        { text: "Ações", value: "" }
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          tipoFornecedor: "Pessoa Juridica",
          telefone: "34999818100",
          celular: "34999818100",
          email: "emailmeiogrande@provendorqualquer.com.br",
          dataCadastro: "null"
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: "1%"
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%"
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: "8%"
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: "16%"
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%"
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: "2%"
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%"
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%"
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%"
        }
      ],
      fornecedores: [],
    }
  },
    methods: {
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
            this.$router.push({ name: 'addfornecedor'});
        }
    },
    created(){
        this.getFornecedores();
    }
};
</script>