<template>
  <v-layout>
    <v-container grid-list-xl>
      <v-layout>
        <v-flex>
          <v-card>
            <div>
              <v-form ref="form" v-model="valid">
                <v-card-title style="background-color:#009688"></v-card-title>
                <v-container>
                  <v-layout>
                    <v-flex xs12 md3>
                      <v-text-field v-model="dados.descricao" label="Descrição  Pagamento"></v-text-field>
                    </v-flex>

                    <v-flex xs12 md3>
                      <v-text-field v-model="dados.valor" prefix="R$" label="Valor"></v-text-field>
                    </v-flex>

                    <v-flex xs12 md3>
                      <v-menu
                        ref="menu.vencimento"
                        v-model="menu.vencimento"
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
                        <v-date-picker
                          v-model="date.vencimento"
                          no-title
                          @input="menu.vencimento = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>

                    <v-flex xs12 md3>
                      <v-menu
                        ref="menu.emissao"
                        v-model="menu.emissao"
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
                        <v-date-picker
                          v-model="date.emissao"
                          no-title
                          @input="menu.emissao = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex xs12 md3>
                      <v-select
                        v-model="dados.formaPagSelected"
                        :items="formaPag"
                        label="Forma de Pagamento"
                        required
                      ></v-select>
                    </v-flex>

                    <v-flex xs12 md3>
                      <label
                        aria-hidden="true"
                        class="v-label v-label--active theme--light"
                        style="display: table-row"
                      >Pagamento Quitado</label>
                      <v-radio-group v-model="radiobtn" row style="margin:0; padding-top:10px">
                        <v-radio label=" SIM " value="Pago" color="indigo"></v-radio>
                        <v-radio label=" NÃO " value="Em Aberto" color="red darken-3"></v-radio>
                      </v-radio-group>
                    </v-flex>

                    <template v-if="radiobtn == 'Pago'">
                      <v-flex xs12 md3>
                        <v-menu
                          ref="menu.compensacao"
                          v-model="menu.compensacao"
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
                              label="Data Compensação"
                              prepend-icon="event"
                              v-on="on"
                              v-model="date.compensacao"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="date.compensacao"
                            no-title
                            @input="menu.compensacao = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-flex>
                    </template>
                  </v-layout>

                  <v-layout>
                    <v-flex xs12 md12>
                      <v-select
                        clearable
                        v-model="dados.cliente"
                        :items="clientes"
                        label="Clientes"
                        return-object
                        required
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-card-title style="background-color:#009688"></v-card-title>
              </v-form>
            </div>
          </v-card>
          <br>

          <template v-if="update == false">
            <v-btn color="success" @click="submit" :loading="loading" :disabled="loading">Cadastrar</v-btn>

            <v-btn color="warning" @click="reset" :disabled="loading">Limpar Formulario</v-btn>
          </template>
          <template v-else>
            <v-btn
              color="success"
              @click="updating"
              :loading="loading"
              :disabled="loading"
            >Atualizar</v-btn>
          </template>
          <v-btn color="error" @click="cancelar" :disabled="loading">Cancelar</v-btn>

          <v-snackbar v-model="snackbar" :bottom="true" :timeout="1750">{{snackResponse}}</v-snackbar>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
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
    radiobtn: "",
    menu: {
      emissao: false,
      compensacao: false,
      vencimento: false
    },
    update: false,
    loading: false,
    snackbar: false,
    snackResponse: "",
    valid: true,
    //Firebase não cria um auto increment integer para atribuir ao payload. Vou injetar o valor em submit.
    idProduto: "",
    //Firebase tambem não permite PUT utilizando a referencia do objeto, apenas com sua chave de acesso.
    chaveFirebase: "",
    clientes: [],
    dados: {
      descricao: "",
      valor: "",
      formaPagSelected: "",
      cliente: [],
    },
    date: {
      emissao: "",
      compensacao: "",
      vencimento: ""
    },
    dialog: false,
    dataCadastro: ""
  }),
  methods: {
    submit() {
      this.formatDate();

      this.loading = true;

      var data = {};

      data.descricao = this.dados.descricao;
      data.valor = this.dados.valor;
      data.formaPagSelected = this.dados.formaPagSelected;
      data.cliente = this.dados.cliente;

      data.vencimento = this.date.vencimento;
      data.compensacao = this.date.compensacao;
      data.emissao = this.date.emissao;

      if (this.radiobtn == "Pago") {
        data.status = this.radiobtn;
      } else {
        this.diffDays(this.date.vencimento);
        data.status = this.radiobtn;
      }

      data.dataCadastro = this.dataCadastro;

      this.$http
        .get(
          "https://vuejs-250c3.firebaseio.com/recebimentos.json?orderBy=%22id%22&limitToLast=1"
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
            .post("https://vuejs-250c3.firebaseio.com/recebimentos.json", data)
            .then(
              response => {
                this.$refs.form.reset();
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
    },
    diffDays(vencimento) {
      vencimento = vencimento.replace(/-/g, ",");
      //Get 1 day in milliseconds
      var one_day = 1000 * 60 * 60 * 24;

      // Convert both dates to milliseconds
      var hoje_ms = new Date().getTime();

      var vencimento_ms = new Date(vencimento).getTime();

      // Calculate the difference in milliseconds
      var difference_ms = vencimento_ms - hoje_ms;

      // Convert back to days and return
      Math.round(difference_ms / one_day) <= -1
        ? (this.radiobtn = "Atrasado")
        : (this.radiobtn = "Em Aberto");
    },
    updating() {
      this.loading = true;

      var data = {};

      data.descricao = this.dados.descricao;
      data.valor = this.dados.valor;
      data.formaPagSelected = this.dados.formaPagSelected;
      data.cliente = this.dados.cliente;

      data.vencimento = this.date.vencimento;
      data.compensacao = this.date.compensacao;
      data.emissao = this.date.emissao;

      if (this.radiobtn == "Pago") {
        data.status = this.radiobtn;
      } else {
        this.diffDays(this.date.vencimento);
        data.status = this.radiobtn;
      }

      this.$http
        .get(
          "https://vuejs-250c3.firebaseio.com/recebimentos.json?orderBy=%22id%22&equalTo=" +
            this.idProduto
        )
        .then(response => {
          this.chaveFirebase = Object.keys(response.body)[0];
        })
        .then(function() {
          this.$http
            .patch(
              "https://vuejs-250c3.firebaseio.com/recebimentos/" +
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
                  this.cancelar();
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
        });
    },
    reset() {
      this.$refs.form.reset();
    },
    formatDate() {
      var todayTime = new Date();
      var month = todayTime.getMonth() + 1;
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      this.dataCadastro = day + "/" + month + "/" + year;
    },
    cancelar() {
      this.$router.push({ name: "contasrcb" });
    },
    getClientes() {
      this.$http
        .get("https://vuejs-250c3.firebaseio.com/clientes.json")
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = {};
          for (let key in data) {
            var aux = data[key]["id"];
            resultArray[aux] = data[key]["nome"];
            this.clientes.push(resultArray[aux]);
          }
          console.log(this.clientes);
        });
    }
  },
  mounted() {
    console.log(this.$route.params);
    console.log(!("content" in this.$route.params));
    if (!("content" in this.$route.params)) {
      return;
    }
    const content = this.$route.params.content;
    this.update = true;
    this.idProduto = content.id;

    this.radiobtn = content.status;
    this.radiobtn == "Atrasado" ? (this.radiobtn = "Em Aberto") : "";

    this.dados.descricao = content.descricao;
    this.dados.valor = content.valor;
    this.dados.formaPagSelected = content.formaPagSelected;
    this.dados.cliente = content.cliente;

    this.date.emissao = content.emissao;
    this.date.compensacao = content.compensacao;
    this.date.vencimento = content.vencimento;

    this.descricao = content.descricao;
  },
  created() {
    this.getClientes();
  }
};
</script>