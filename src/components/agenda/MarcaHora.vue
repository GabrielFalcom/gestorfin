<template>
  <v-container grid-list-xl>
    <v-card>
      <v-form ref="form" v-model="valid">
        <v-card-title
          style="background-color: #3F51B5; border-color: #3F51B5; color: white; padding: 0; height: 40px;"
          class="justify-center"
        >Agendar Horario</v-card-title>
        <v-tabs centered color="indigo dark-3" dark icons-and-text height="40">
          <v-tabs-slider color="green"></v-tabs-slider>

          <v-tab href="#tab-1">
            Clientes & Produtos
            <v-icon style="padding:0; margin:0;">account_balance</v-icon>
          </v-tab>

          <v-tab href="#tab-2">
            Horario & Pagamento
            <!-- <v-icon>fullscreen</v-icon> -->
            <v-icon style="padding:0; margin:0;">access_time</v-icon>
          </v-tab>

          <v-tab-item :value="'tab-1'">
            <v-container fluid grid-list-md>
              <v-layout>
                <v-flex d-flex x12 lg12>
                  <v-autocomplete
                    v-model="cliente"
                    :items="clientes"
                    box
                    chips
                    background-color="indigo lighten-3"
                    label="Clientes"
                    item-text="nome"
                    multiple
                    return-object
                    required
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        :selected="data.selected"
                        close
                        class="chip--select-multi"
                        @input="remove(data.item)"
                      >
                        <v-avatar>
                          <img :src="data.item.imagem.url">
                        </v-avatar>
                        {{ data.item.nome }}
                      </v-chip>
                    </template>

                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-tile-content v-text="data.item"></v-list-tile-content>
                      </template>
                      <template v-else>
                        <v-list-tile-avatar>
                          <img :src="data.item.imagem.url">
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title v-html="data.item.nome"></v-list-tile-title>
                        </v-list-tile-content>
                      </template>
                    </template>
                  </v-autocomplete>
                </v-flex>
              </v-layout>
              <v-layout v-for="(item,index) in produto" :key="index">
                <v-flex d-flex xs12 sm6 md6>
                  <v-select
                    v-model="produto[index]"
                    :items="produtos"
                    item-text="nome"
                    :rules="[v => !!v || 'Produto é obrigatorio']"
                    label="Produto"
                    return-object
                    required
                  ></v-select>
                </v-flex>

                <v-flex d-flex xs6 sm2 md2>
                  <v-text-field v-model="produto[index].qntConsumido" label="Quantidade" required></v-text-field>
                </v-flex>

                <v-flex d-flex xs6 sm2 md2>
                  <v-text-field
                    v-model="produto[index].precoConsumo"
                    label="Valor Unitario (R$)"
                    disabled
                  ></v-text-field>
                </v-flex>

                <v-flex d-flex xs6 sm2 md2>
                  <v-text-field
                    :value="parseFloat(produto[index].qntConsumido * produto[index].precoConsumo.replace('.', '').replace(',', '.'))"
                    label="Valor Total (R$)"
                    disabled
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-btn flat block color="green" @click="addNewPrd">
                  <v-icon>add</v-icon> Adicionar Produto
                </v-btn>
              </v-layout>
            </v-container>
          </v-tab-item>

          <v-tab-item :value="'tab-2'">
            <v-container fluid grid-list-md>
              <v-layout>
                <v-flex xs12 sm6 md6>
                  <v-time-picker v-model="horaInicio" format="24hr" color="green lighten-1">
                    <h1>Hora Inicio</h1>
                  </v-time-picker>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-time-picker
                    v-model="horaFim"
                    format="24hr"
                    color="green lighten-1"
                    header-color="primary"
                  >
                    <h1>Hora Fim</h1>
                  </v-time-picker>
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

                <v-flex d-flex xs12 md3>
                  <v-text-field v-model="montante" label="Montante (R$)" disabled></v-text-field>
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
                        label="Data do evento"
                        prepend-icon="event"
                        v-on="on"
                        v-model="date.vencimento"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date.vencimento"
                      no-title
                      @input="menuVencimento = false"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>
        </v-tabs>
        <v-card-title style="background-color: #3F51B5; padding: 0; height: 40px;"></v-card-title>
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
    date: "",
    loading: false,
    snackbar: false,
    snackResponse: "",
    valid: true,
    chaveFirebase: "",
    produtos: [],
    produto: [{ precoConsumo: "" }],
    clientes: [],
    cliente: "",
    preco: "",
    descricao: "",
    formaPagSelected: "",
    montante: 0,
    dialog: false,
    dataCadastro: "",
    horaIncio:"",
    horaFim:"",
    duration:"",
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
        })
        .then(function() {
          var data = {};
          data.quantidade =
            parseInt(this.quantidade) + parseInt(this.produto.quantidade);
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
                setTimeout(() => {
                  this.loading = false;
                  this.snackbar = false;
                  this.reset();
                }, 1750);
              },
              error => {
                this.snackbar = true;
                this.snackResponse = "Não foi possivel atualizar o cadastro";
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
                    setTimeout(() => {
                      this.loading = false;
                      this.snackbar = false;
                    }, 1750);
                  },
                  error => {
                    this.snackbar = true;
                    this.snackResponse = "Não foi possivel efetuar o cadastro";
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
      (this.listaPrd = []), this.getProdutos();
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
        });
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
        });
    },
    addNewPrd() {
      const len = this.produto.length -1;
      const obj = this.produto[len];
      const isEmpty = parseInt(Object.keys(obj).length) > 1;
      if (isEmpty) {
        this.produto.push({ precoConsumo: "" });
      }
    },
     remove (item) {
        const index = this.cliente.indexOf(item)
        if (index >= 0) this.cliente.splice(index, 1)
      }
  },
  computed: {
    qntConsumido() {
      return this.produto.map(produto => produto.qntConsumido);
    }
  },
  watch: {
    qntConsumido() {
      const len = this.produto.length -1;
      const obj = this.produto[len];

    }
  },
  mounted() {
    this.getProdutos();
    this.getClientes();
  }
};
</script>