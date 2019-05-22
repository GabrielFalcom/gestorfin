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
                  v-model="dados.fornecedor"
                  :items="produtos"
                  item-text="nome"
                  :rules="[v => !!v || 'Fornecedor é obrigatorio']"
                  label="Produto"
                  return-object
                  required
                ></v-select>

                <v-flex d-flex xs6 sm6>
                  <v-text-field v-model="dados.quantidade" label="Quantidade" required></v-text-field>
                </v-flex>

                <v-flex d-flex xs6 sm6>
                  <v-text-field v-model="dados.preco" label="Valor Unitario (R$)" disabled></v-text-field>
                </v-flex>

                <v-flex d-flex xs6 sm6>
                  <v-text-field v-model="dados.quantidade" label="Fornecedor" disabled></v-text-field>
                </v-flex>

                <v-flex d-flex xs6 sm6>
                  <v-text-field v-model="dados.preco" label="Valor Total (R$)" disabled></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex d-flex xs12 sm6 md6>
              <img :src="$url(dados.fornecedor.imagem)" style="height:220px;">
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex d-flex xs12 md3>
              <v-text-field v-model="dados.descricao" label="Descrição  Pagamento"></v-text-field>
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
                    v-model="date"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title @input="menuVencimento = false"></v-date-picker>
              </v-menu>
            </v-flex>

            <v-flex xs12 md3>
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
                    label="Data Emissão"
                    prepend-icon="event"
                    v-on="on"
                    v-model="date"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title @input="menuVencimento = false"></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-title style="background-color:#673AB7"></v-card-title>
      </v-form>
    </v-card>
    <br>

    <template v-if="update == false">
      <v-btn color="success" @click="submit" :loading="loading" :disabled="loading">Cadastrar</v-btn>

      <v-btn color="warning" @click="reset" :disabled="loading">Limpar Formulario</v-btn>
    </template>
    <template v-else>
      <v-btn color="success" @click="updating" :loading="loading" :disabled="loading">Atualizar</v-btn>
    </template>
    <v-btn color="error" @click="cancelar" :disabled="loading">Cancelar</v-btn>

    <v-snackbar v-model="snackbar" :bottom="true" :timeout="1750">{{snackResponse}}</v-snackbar>
  </v-container>
</template>

<script>
import { eventBus } from "../../main";

export default {
  data: () => ({
    formaPag:[],
    formaPagSelected: "",
    menuVencimento: "",
    date: "",
    update: false,
    loading: false,
    snackbar: false,
    snackResponse: "",
    valid: true,
    //Firebase não cria um auto increment integer para atribuir ao payload. Vou injetar o valor em submit.
    idProduto: "",
    //Firebase tambem não permite PUT utilizando a referencia do objeto, apenas com sua chave de acesso.
    chaveFirebase: "",
    produtos: [],
    dados: {
      nome: "",
      preco: "",
      quantidade: "",
      fornecedor: ""
    },
    dimensao: {
      peso: "",
      altura: "",
      largura: "",
      comprimento: ""
    },
    descricao: "",
    dataCadastro: "",
    image: {
      name: "",
      url: "",
      file: ""
    },
    dialog: false,
    dataCadastro: "",
    comment: ""
  }),
  methods: {
    submit() {
      this.formatDate();

      this.loading = true;

      var data = {};

      data.nome = this.dados.nome;
      data.fornecedor = this.dados.fornecedor;
      data.quantidade = this.dados.quantidade;
      data.preco = this.dados.preco;

      data.peso = this.dimensao.peso;
      data.altura = this.dimensao.altura;
      data.largura = this.dimensao.largura;
      data.comprimento = this.dimensao.comprimento;

      data.descricao = this.descricao;

      data.dataCadastro = this.dataCadastro;

      data.imagem = this.image;

      this.$http
        .get(
          "https://vuejs-250c3.firebaseio.com/produtos.json?orderBy=%22id%22&limitToLast=1"
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
            .post("https://vuejs-250c3.firebaseio.com/produtos.json", data)
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
    updating() {
      this.loading = true;

      var data = {};

      data.nome = this.dados.nome;
      data.fornecedor = this.dados.fornecedor;
      data.quantidade = this.dados.quantidade;
      data.preco = this.dados.preco;

      data.peso = this.dimensao.peso;
      data.altura = this.dimensao.peso;
      data.largura = this.dimensao.largura;
      data.comprimento = this.dimensao.comprimento;

      data.descricao = this.descricao;

      data.imagem = this.image;

      this.$http
        .get(
          "https://vuejs-250c3.firebaseio.com/produtos.json?orderBy=%22id%22&equalTo=" +
            this.idProduto
        )
        .then(response => {
          this.chaveFirebase = Object.keys(response.body)[0];
        })
        .then(function() {
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
      this.$router.push({ name: "produto" });
    },
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.image.name = files[0].name;
        if (this.image.name.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.image.url = fr.result;
          this.image.file = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.image.name = "";
        this.image.url = "";
        this.image.file = "";
      }
    },
    getProdutos() {
      this.$http
        .get("https://vuejs-250c3.firebaseio.com/produtos.json")
        .then(response => {
          return response.json();
        })
        .then(data => {
          // const resultArray = {};
          // for (let key in data) {
          //   var aux = data[key]["id"];
          //   resultArray[aux] = data[key]["nome"];
          //   this.produtos.push(resultArray[aux]);
          // }
          // console.log(this.produtos);

          const resultArray = [];
          for (let key in data) {
            resultArray.push(data[key]);
          }
          this.produtos = resultArray;
          console.log(this.produtos);
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

    this.dados.fornecedor = content.fornecedor;
    this.dados.quantidade = content.quantidade;
    this.dados.preco = content.preco;
    this.dados.nome = content.nome;

    this.dimensao.peso = content.peso;
    this.dimensao.altura = content.altura;
    this.dimensao.largura = content.largura;
    this.dimensao.comprimento = content.comprimento;

    this.descricao = content.descricao;

    this.image = content.imagem;
  },
  created() {
    this.getProdutos();
  }
};
</script>
