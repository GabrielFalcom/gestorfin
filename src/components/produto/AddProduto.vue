<template>
  <v-layout>
    <v-container grid-list-xl>
      <v-layout>
        <v-flex>
          <v-card>
            <div>
              <v-form ref="form" v-model="valid">
                <v-tabs centered color="amber darken-2" dark icons-and-text height="40">
                  <v-tabs-slider color="green dark-4"></v-tabs-slider>

                  <v-tab href="#tab-1" >
                    Dados
                    <v-icon style="padding:0; margin:0;">list</v-icon>
                  </v-tab>

                  <v-tab href="#tab-2">
                    Dimensões
                    <!-- <v-icon>fullscreen</v-icon> -->
                    <v-icon style="padding:0; margin:0;">fitness_center</v-icon>
                  </v-tab>

                  <v-tab href="#tab-3">
                    Descrição
                    <v-icon style="padding:0; margin:0;">menu</v-icon>
                  </v-tab>

                  <v-tab href="#tab-4">
                    Imagem
                    <v-icon style="padding:0; margin:0;">portrait</v-icon>
                  </v-tab>

                  <v-tab-item :value="'tab-1'">
                    <v-container>
                      <v-layout>
                        <v-flex xs12 md6>
                          <v-select
                            v-model="dados.fornecedor"
                            :items="fornecedores"
                            :rules="[v => !!v || 'Fornecedor é obrigatorio']"
                            label="Fornecedor"
                            required
                          ></v-select>
                        </v-flex>
                        <template v-if="dados.fornecedor != ''">
                          <v-flex xs12 md3>
                            <v-text-field v-model="dados.quantidade" label="Quantidade" required></v-text-field>
                          </v-flex>
                          <v-flex xs12 md3>
                            <v-text-field v-model="dados.preco" prefix="R$" label="Preco" required></v-text-field>
                          </v-flex>
                        </template>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 md12>
                          <v-text-field v-model="dados.nome" label="Nome" required></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-tab-item>

                  <v-tab-item :value="'tab-2'">
                    <v-container>
                      <v-layout>
                        <v-flex xs12 md3>
                          <v-text-field v-model="dimensao.peso" suffix="(Kg)" label="Peso"></v-text-field>
                        </v-flex>

                        <v-flex xs12 md3>
                          <v-text-field v-model="dimensao.altura" suffix="(M)" label="Altura"></v-text-field>
                        </v-flex>

                        <v-flex xs12 md3>
                          <v-text-field v-model="dimensao.largura" suffix="(M)" label="Largura"></v-text-field>
                        </v-flex>

                        <v-flex xs12 md3>
                          <v-text-field
                            v-model="dimensao.comprimento"
                            suffix="(M)"
                            label="Comprimento"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-tab-item>

                  <v-tab-item :value="'tab-3'">
                    <v-container>
                      <v-layout>
                        <v-flex xs12 md12>
                          <v-textarea
                            auto-grow
                            box
                            :label="dados.nome"
                            color="deep-purple"
                            counter
                            rows="10"
                            v-model="descricao"
                          ></v-textarea>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-tab-item>

                  <v-tab-item :value="'tab-4'">
                    <v-container>
                      <v-layout>
                        <v-flex
                          xs12
                          class="text-xs-center text-sm-center text-md-center text-lg-center"
                        >
                          <v-text-field
                            label="Selecionar Imagem"
                            @click="pickFile"
                            v-model="image.name"
                            prepend-icon="attach_file"
                          ></v-text-field>
                          <input
                            type="file"
                            style="display: none"
                            ref="image"
                            accept="image/*"
                            @change="onFilePicked"
                          >
                          <img :src="image.url" v-if="image.url" style="max-height:500px">
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-tab-item>
                </v-tabs>
                <v-card-title style="background-color:#f59f30"></v-card-title>
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
    update: false,
    loading: false,
    snackbar: false,
    snackResponse: "",
    valid: true,
    //Firebase não cria um auto increment integer para atribuir ao payload. Vou injetar o valor em submit.
    idProduto: "",
    //Firebase tambem não permite PUT utilizando a referencia do objeto, apenas com sua chave de acesso.
    chaveFirebase: "",
    fornecedores: [],
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
    getFornecedres() {
      this.$http
        .get("https://vuejs-250c3.firebaseio.com/fornecedores.json")
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = {};
          for (let key in data) {
            var aux = data[key]["id"];
            resultArray[aux] = data[key]["nome"];
            this.fornecedores.push(resultArray[aux]);
          }
          console.log(this.fornecedores);
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
    this.getFornecedres();
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
