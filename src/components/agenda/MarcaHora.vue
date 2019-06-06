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
                  <v-text-field v-model="produto[index].qntConsumido" :rules="[v => !!v || 'Quantidade é obrigatorio']" label="Quantidade" required></v-text-field>
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
                  <v-icon>add</v-icon>Adicionar Produto
                </v-btn>
              </v-layout>
            </v-container>
          </v-tab-item>

          <v-tab-item :value="'tab-2'">
            <v-container fluid grid-list-md>
              <v-layout>
                <v-flex xs12 sm6 md6>
                  <v-time-picker v-model="horaInicio" format="24hr" color="green lighten-1"
                  :rules="[v => !!v || 'Hora é obrigatorio']">
                    <h1>Hora Inicio</h1>
                  </v-time-picker>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-time-picker
                    v-model="horaFim"
                    format="24hr"
                    color="green lighten-1"
                    header-color="primary"
                    :rules="[v => !!v || 'Hora é obrigatorio']">
                  >
                    <h1>Hora Fim</h1>
                  </v-time-picker>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex d-flex xs8 sm8 md8 offset-xs3>
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
                        v-model="date"
                        :rules="[v => !!v || 'Data é obrigatorio']">
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title @input="menuVencimento = false"></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex d-flex xs12 md4>
                  <v-text-field v-model="descricao" label="Descrição  Pagamento" :rules="[v => !!v || 'Descrição é obrigatorio']">></v-text-field>
                </v-flex>

                <v-flex d-flex xs12 md4>
                  <v-select
                    v-model="formaPagSelected"
                    :items="formaPag"
                    label="Forma de Pagamento"
                    required
                  ></v-select>
                </v-flex>

                <v-flex d-flex xs12 md4>
                  <v-text-field v-model="montante" label="Montante (R$)" disabled></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>
        </v-tabs>
        <v-card-title style="background-color: #3F51B5; padding: 0; height: 40px;"></v-card-title>
      </v-form>
    </v-card>
    <br>

    <v-alert
      :value="alert"
      icon="warning"
      type="error"
      transition="scale-transition"
    >Ja possui agenda marcada para este dia. Escolha outra data.</v-alert>

    <v-btn
      color="success"
      @click="submit"
      :loading="loading"
      :disabled="loading"
    >Registrar Aquisição</v-btn>

    <v-btn color="error" @click="cancelar" :disabled="loading">Cancelar</v-btn>

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
    horaInicio: "",
    horaFim: "",
    duration: "",
    aux: 0,
    alert: false
  }),
  methods: {
    getAllClientes() {
      console.log(this.cliente);
      const data = this.cliente;
      var clienteArray = [];
      for (let key in data) {
        clienteArray.push(data[key]["nome"]);
      }
      return clienteArray;
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.formatDate();
        this.diffMin();
        console.log(this.date);
        this.loading = true;
        var seguir = true;

        var data = {};

        this.$http
          .get(
            "https://vuejs-250c3.firebaseio.com/agenda.json?orderBy=%22date%22&equalTo=%22" +
              this.date +
              "%22"
          )
          .then(response => {
            if (response.bodyText != "{}") {
              seguir = false;
              this.alert = true;
              setTimeout(() => {
                this.loading = false;
                this.alert = false;
              }, 3000);
            }
            if (seguir == true) {
              console.log("seguir == true: " + seguir);
              this.$http
                .get(
                  "https://vuejs-250c3.firebaseio.com/agenda.json?orderBy=%22id%22&limitToLast=1"
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
                  data.title = this.descricao;
                  data.date = this.date;
                  data.time = this.horaInicio;
                  data.duration = this.duration;
                  data.timeEnd = this.horaFim;
                  data.formaPagSelected = this.formaPagSelected;
                  data.total = this.montante;
                  data.clientes = this.getAllClientes();
                  data.status = "Pago";

                  this.$http
                    .post(
                      "https://vuejs-250c3.firebaseio.com/agenda.json",
                      data
                    )
                    .then(
                      response => {
                        console.log(response);
                        this.snackbar = true;
                        this.snackResponse = "Cadastro Realizado com Sucesso!";
                        setTimeout(() => {
                          this.loading = false;
                          this.snackbar = false;
                        }, 1750);
                      },
                      error => {
                        this.snackbar = true;
                        this.snackResponse =
                          "Não foi possivel efetuar o cadastro";
                        setTimeout(() => {
                          this.loading = false;
                          this.snackbar = false;
                        }, 1750);
                      }
                    );
                })
                .then(function() {
                  this.$http
                    .get(
                      "https://vuejs-250c3.firebaseio.com/recebimentos.json?orderBy=%22id%22&limitToLast=1"
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
                      data.dataCadastro = this.dataCadastro;
                      data.descricao = this.descricao;
                      data.valor = this.montante;
                      data.vencimento = this.date;
                      data.emissao = this.date;
                      data.formaPagSelected = this.formaPagSelected;
                      data.status = "Pago";
                      data.cliente = this.getAllClientes();

                      this.$http
                        .post(
                          "https://vuejs-250c3.firebaseio.com/recebimentos.json",
                          data
                        )
                        .then(
                          response => {
                            this.snackbar = true;
                            this.snackResponse =
                              "Cadastro Realizado com Sucesso!";
                            setTimeout(() => {
                              this.loading = false;
                              this.snackbar = false;
                            }, 1750);
                          },
                          error => {
                            this.snackbar = true;
                            this.snackResponse =
                              "Não foi possivel efetuar o cadastro";
                            setTimeout(() => {
                              this.loading = false;
                              this.snackbar = false;
                            }, 1750);
                          }
                        );
                    });
                });
            }
          });
      } else {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 2000);
      }
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
      const len = this.produto.length - 1;
      const obj = this.produto[len];
      const isEmpty = parseInt(Object.keys(obj).length) > 1;
      if (isEmpty) {
        this.produto.push({ precoConsumo: "" });
      }
    },
    remove(item) {
      const index = this.cliente.indexOf(item);
      if (index >= 0) this.cliente.splice(index, 1);
    },
    loop(value, index, array) {
      if (this.produto[index].qntConsumido != undefined) {
        this.aux +=
          parseInt(this.produto[index].qntConsumido) *
          parseInt(this.produto[index].precoConsumo);
      }
      this.montante = this.aux;
      console.log(this.montante);
    },
    diffMin() {
      var hi = this.horaInicio.split(":");
      var hf = this.horaFim.split(":");
      var hri = new Date().setHours(hi[0], hi[1]);
      var hrf = new Date().setHours(hf[0], hf[1]);

      if (hrf < hri) {
        this.duration = -1;
      }

      var diff = (hrf - hri) / 1000;
      diff /= 60;
      this.duration = Math.abs(Math.round(diff));
    },
    cancelar() {
      this.$router.push({ name: "agenda" });
    }
  },
  computed: {
    qntConsumido() {
      return this.produto.map(produto => produto.qntConsumido);
    }
  },
  watch: {
    qntConsumido() {
      const len = this.produto.length - 1;
      const obj = this.produto[len];
      this.aux = 0;
      this.produto.forEach(this.loop);
    }
  },
  mounted() {
    this.getProdutos();
    this.getClientes();
  }
};
</script>