<template>
  <v-container grid-list-xl>
    <v-card>
      <v-form ref="form" v-model="valid">
        <v-card-title
          style="background-color:#673AB7; color: white; padding: 8px"
          class="justify-center"
        >Comprar Estoque</v-card-title>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex d-flex xs12 sm6 md6>
              <v-layout row wrap>
                <v-select
                  v-model="produto"
                  :items="produtos"
                  item-text="nome"
                  :rules="[v => !!v || 'Produto é obrigatorio']"
                  label="Produto"
                  return-object
                  required
                ></v-select>

                <v-flex d-flex xs6 sm6>
                  <v-text-field v-model="quantidade" label="Quantidade" required></v-text-field>
                </v-flex>

                <v-flex d-flex xs6 sm6>
                  <v-text-field v-model="produto.preco" label="Valor Unitario (R$)" disabled></v-text-field>
                </v-flex>

                <v-flex d-flex xs6 sm6>
                  <v-text-field v-model="produto.fornecedor" label="Fornecedor" disabled></v-text-field>
                </v-flex>

                <v-flex d-flex xs6 sm6>
                  <v-text-field v-model="total" label="Valor Total (R$)" disabled></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex d-flex xs12 sm6 md6>
              <img :src="$url(produto.imagem)" style="height:220px;">
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex d-flex xs12 md3>
              <v-text-field v-model="descricao" label="Descrição  Pagamento"></v-text-field>
            </v-flex>

            <v-flex d-flex xs12 md3>
              <v-select
                v-model="formaPagSelected"
                :items="formaPag"
                label="Forma de Pagamento"
                required
              ></v-select>
            </v-flex>

            <v-flex d-flex xs12 sm6 md3>
              <v-menu
                ref="menuVencimento"
                v-model="menuVencimento"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    readonly
                    label="Data Vencimento"
                    prepend-icon="event"
                    v-on="on"
                    v-model="date.vencimento"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date.vencimento" no-title @input="menuVencimento = false"></v-date-picker>
              </v-menu>
            </v-flex>

            <v-flex xs12 md3>
              <v-menu
                ref="menuEmissao"
                v-model="menuEmissao"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    readonly
                    label="Data Emissão"
                    prepend-icon="event"
                    v-on="on"
                    v-model="date.emissao"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date.emissao" no-title @input="menuEmissao = false"></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-title style="background-color:#673AB7"></v-card-title>
      </v-form>
    </v-card>
    <br>

    <v-btn
      color="success"
      @click="submit"
      :loading="loading"
      :disabled="loading"
    >Registrar Aquisição</v-btn>

    <v-btn color="warning" @click="reset" :disabled="loading">Limpar Formulario</v-btn>

    <v-snackbar v-model="snackbar" :bottom="true" :timeout="1750">{{snackResponse}}</v-snackbar>
  </v-container>
</template>

<script>
import { eventBus } from "../../main";

export default {
  data: () => ({
    formaPag: [
      "Dinheiro",
      "Cheque",
      "Carne",
      "Cartão Crédito",
      "Cartão Débito"
    ],
    menuVencimento: "",
    menuEmissao: "",
    date: {
      vencimento: "",
      emissao: ""
    },
    loading: false,
    snackbar: false,
    snackResponse: "",
    valid: true,
    chaveFirebase: "",
    produtos: [],
    produto: {
      preco:"",
      fornecedor:"",
      imagem:"",
      quantidade:"",
      id: "",
    },
    preco: "",
    quantidade: "",
    descricao: "",
    formaPagSelected: "",
    total: "0",
    dialog: false,
    dataCadastro: ""
  }),
  methods: {
    submit() {
      this.formatDate();

      this.loading = true;

      this.$http
        .get(
          "https://vuejs-250c3.firebaseio.com/produtos.json?orderBy=%22id%22&equalTo=" +
            this.produto.id
        )
        .then(response => {
          this.chaveFirebase = Object.keys(response.body)[0];
          console.log(response.body);
        })
        .then(function() {
          var data = {};
          data.quantidade = parseInt(this.quantidade) + parseInt(this.produto.quantidade);
          this.$http
            .patch(
              "https://vuejs-250c3.firebaseio.com/produtos/" +
                this.chaveFirebase +
                ".json",
              data
            )
            .then(
              response => {
                this.snackbar = true;
                this.snackResponse = "Cadastro Atualizado com Sucesso!";
                console.log(response);
                setTimeout(() => {
                  this.loading = false;
                  this.snackbar = false;
                  this.reset();
                }, 1750);
              },
              error => {
                this.snackbar = true;
                this.snackResponse = "Não foi possivel atualizar o cadastro";
                console.log(error);
                setTimeout(() => {
                  this.loading = false;
                  this.snackbar = false;
                }, 1750);
              }
            );
        })
        .then(function() {
          var data = {};
          data.dataCadastro = this.dataCadastro;
          data.formaPagSelected = this.formaPagSelected;
          data.descricao = this.descricao;
          data.fornecedor = this.produto.fornecedor;

          data.valor = this.total;
          data.vencimento = this.date.vencimento;
          data.emissao = this.date.emissao;

          this.$http
            .get(
              "https://vuejs-250c3.firebaseio.com/pagamentos.json?orderBy=%22id%22&limitToLast=1"
            )
            .then(response => {
              console.log(response);
              if (response.body != null) {
                const resultArray = [];
                for (let key in response.body) {
                  resultArray.push(response.body[key]);
                }
                data.id = resultArray[0].id + 1;
              } else {
                data.id = 1;
              }
            })
            .then(function() {
              this.$http
                .post(
                  "https://vuejs-250c3.firebaseio.com/pagamentos.json",
                  data
                )
                .then(
                  response => {
                    this.snackbar = true;
                    this.snackResponse = "Cadastro Realizado com Sucesso!";
                    console.log(response);
                    setTimeout(() => {
                      this.loading = false;
                      this.snackbar = false;
                    }, 1750);
                  },
                  error => {
                    this.snackbar = true;
                    this.snackResponse = "Não foi possivel efetuar o cadastro";
                    console.log(error);
                    setTimeout(() => {
                      this.loading = false;
                      this.snackbar = false;
                    }, 1750);
                  }
                );
            });
        });
    },
    reset() {
      this.$refs.form.reset();
      this.produto = {
        preco:"",
        fornecedor:"",
        imagem:"",
        quantidade:"",
        id: "",
      },
      this.getProdutos();
    },
    formatDate() {
      var todayTime = new Date();
      var month = todayTime.getMonth() + 1;
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      this.dataCadastro = day + "/" + month + "/" + year;
    },
    getProdutos() {
      this.$http
        .get("https://vuejs-250c3.firebaseio.com/produtos.json")
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
    }
  },
  watch: {
    produto() {
      this.quantidade = 0;
    },
    quantidade() {
      console.log(this.produto);
      if (this.quantidade) {
        this.total = Math.round(
          parseFloat(this.produto.preco.replace(".", "").replace(",", ".")) *
            parseInt(this.quantidade)
        );
      } else {
        this.total = 0;
      }
    }
  },
  mounted() {
    this.getProdutos();
  }
};
</script>
