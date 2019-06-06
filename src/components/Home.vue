<template>
  <v-layout>
    <v-container grid-list-xl>
      <v-card>

        <v-layout row wrap>
          <v-flex d-flex>
            <v-layout row>
              <v-container grid-list-xs>
                <v-flex xs12 sm12 md12>
                  <v-card>
                    <div
                      class="titleCard"
                      style="background-color: #FFA000; border-color: #FFA000;"
                    >
                      <h2>Produtos</h2>
                    </div>

                    <v-data-table
                      :headers="headers"
                      :items="produtos"
                      :search="search"
                      class="elevation-1"
                    >
                      <template v-slot:items="props">
                        <td class="justify-center">{{ props.item.nome }}</td>
                        <td class="justify-center">{{ props.item.quantidade }}</td>
                        <td class="justify-center">{{ props.item.precoCompra }}</td>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-flex>
              </v-container>

              <v-container grid-list-xs>
                <v-flex xs12 sm12 md12>
                  <v-card>
                    <div
                      class="titleCard"
                      style="background-color: #3f51b5; border-color: #3f51b5;"
                    >
                      <h2>Proximos Jogos</h2>
                    </div>

                    <v-data-table
                      :headers="agendaHeaders"
                      :items="agendas"
                      :search="search"
                      class="elevation-1"
                    >
                      <template v-slot:items="props">
                        <td class="justify-center">{{ props.item.date }}</td>
                        <td class="justify-center">{{ props.item.time }}</td>
                        <td class="justify-center">{{ props.item.timeEnd }}</td>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-flex>
              </v-container>
            </v-layout>
          </v-flex>
        </v-layout>

        <v-layout row wrap>
          <v-flex d-flex>
            <v-layout row>
              <v-container grid-list-xs>
                <v-flex xs12 sm12 md12>
                  <v-card>
                    <div
                      class="titleCard"
                      style="background-color: #546e7a; border-color: #546e7a;"
                    >
                      <h2>Ultimos Pagamentos</h2>
                    </div>

                    <v-data-table
                      :headers="contasHeaders"
                      :items="pagamentos"
                      :search="search"
                      class="elevation-1"
                    >
                      <template v-slot:items="props">
                        <td class="justify-center">{{ props.item.descricao }}</td>
                        <td class="justify-center">{{ props.item.vencimento }}</td>
                        <td class="justify-center">{{ props.item.valor }}</td>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-flex>
              </v-container>

              <v-container grid-list-xs>
                <v-flex xs12 sm12 md12>
                  <v-card>
                    <div
                      class="titleCard"
                      style="background-color: #009688; border-color: #009688;"
                    >
                      <h2>Ultimos Recebimentos</h2>
                    </div>

                    <v-data-table
                      :headers="contasHeaders"
                      :items="recebimentos"
                      :search="search"
                      class="elevation-1"
                    >
                      <template v-slot:items="props">
                        <td class="justify-center">{{ props.item.descricao }}</td>
                        <td class="justify-center">{{ props.item.vencimento }}</td>
                        <td class="justify-center">{{ props.item.valor }}</td>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-flex>
              </v-container>
            </v-layout>
          </v-flex>
        </v-layout>

      </v-card>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      search: "",
      headers: [
        { text: "Nome", value: "nome" },
        { text: "Quantidade", value: "quantidade" },
        { text: "Preco(R$)", value: "preco" }
      ],

      agendaHeaders: [
        { text: "Data", value: "date" },
        { text: "Inicio", value: "time" },
        { text: "Termino", value: "timeEnd" }
      ],

      contasHeaders: [
        { text: "Descrição", value: "descricao" },
        { text: "Vencimento", value: "vencimento" },
        { text: "Valor(R$)", value: "valor" }
      ],
      produtos: [],
      agendas:[],
      recebimentos: [],
      pagamentos:[],

    };
  },
  methods: {
    getProdutos() {
      this.$http
        .get("https://vuejs-250c3.firebaseio.com/produtos.json")
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = [];
          for (let key in data) {
              console.log(data[key]);
              var aux = parseInt(data[key]['quantidade']);
              console.log(aux);
              if (aux <= 15) {
                  if (resultArray.length > 4) {
                      this.produtos = resultArray;
                      return;
                  }
                  resultArray.push(data[key]);
              }
            
          }
          this.produtos = resultArray;
        });
    },
    getRecebimentos() {
      this.$http
        .get("https://vuejs-250c3.firebaseio.com/recebimentos.json?orderBy=%22id%22&limitToLast=5")
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = [];
          for (let key in data) {
            resultArray.push(data[key]);
          }
          this.recebimentos = resultArray;
        });
    },
    getPagamentos() {
      this.$http
        .get("https://vuejs-250c3.firebaseio.com/pagamentos.json?orderBy=%22id%22&limitToLast=5")
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = [];
          for (let key in data) {
            resultArray.push(data[key]);
          }
          this.pagamentos = resultArray;
        });
    },
    getAgendas() {
      this.$http
        .get("https://vuejs-250c3.firebaseio.com/agenda.json")
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = [];
          const today = new Date ();

          for (let key in data) {
              var aux = this.transformToDate(data[key]['date'])
              if (aux.getTime() > today.getTime()) {
                  if (resultArray.length >4) {
                      this.agendas = resultArray;
                      return;
                  }
                  resultArray.push(data[key]);
              }
          }
          this.agendas = resultArray;
        });
    },
    transformToDate(obj) {
        var ano = obj.split('-')[0];
        var mes = obj.split('-')[1];
        var dia = obj.split('-')[2];
        var data = new Date(ano, (mes - 1), dia);

        return data;
    },
    navigateTo() {
      this.$router.push({ name: "addproduto" });
    }
  },
  created() {
    this.getProdutos();
    this.getRecebimentos();
    this.getPagamentos();
    this.getAgendas();
  }
};
</script>