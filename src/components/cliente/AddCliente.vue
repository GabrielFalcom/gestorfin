<template>
  <v-layout>
    <v-container grid-list-xl>
      <v-layout>
        <v-flex>
          <v-card>
            <div>
              <v-form ref="form" v-model="valid">
                <v-tabs centered color="#448AFF" dark icons-and-text>
                  <v-tabs-slider color="yellow dark-4"></v-tabs-slider>

                  <v-tab href="#tab-1">
                    Dados
                    <v-icon>list</v-icon>
                  </v-tab>

                  <v-tab href="#tab-2">
                    Imagem
                    <v-icon>portrait</v-icon>
                  </v-tab>
                <v-tab-item :value="'tab-1'">
                  <v-container>
                    <v-subheader>
                      <v-icon style="padding-right: 5px">work</v-icon>Dados Pessoais
                    </v-subheader>
                    <v-layout>
                      <v-flex xs12 md4>
                        <v-text-field
                          v-model="pessoa.nomeCompleto"
                          :rules="nameRules"
                          label="Nome Completo"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 md2>
                        <v-text-field
                          v-model="pessoa.nascimento"
                          mask="##/##/####"
                          return-masked-value
                          label="Nascimento"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 md3>
                        <v-text-field
                          v-model="pessoa.cpf"
                          mask="###.###.###-##"
                          return-masked-value
                          label="CPF"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 md3>
                        <v-text-field v-model="pessoa.rg" label="RG"></v-text-field>
                      </v-flex>
                    </v-layout>

                    <v-subheader>
                      <v-icon style="padding-right: 5px">contact_mail</v-icon>Dados de Contato
                    </v-subheader>
                    <v-layout>
                      <v-flex xs12 md4>
                        <v-text-field v-model="contato.email" :rules="emailRules" label="E-mail"></v-text-field>
                      </v-flex>
                      <v-flex xs12 md4>
                        <v-text-field
                          v-model="contato.telefone"
                          mask="(##) ####-####"
                          return-masked-value
                          label="Telefone"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 md4>
                        <v-text-field
                          v-model="contato.celular"
                          mask="(##) #####-####"
                          return-masked-value
                          label="Celular"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-subheader>
                      <v-icon style="padding-right: 5px">pin_drop</v-icon>Dados de Endereço
                    </v-subheader>
                    <v-layout>
                      <v-flex xs12 md4>
                        <v-text-field
                          v-on:keyup.native="buscarCep"
                          v-model="endereco.cep"
                          label="CEP"
                          mask="#####-###"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 md4>
                        <v-text-field v-model="endereco.logradouro" label="Logradouro"></v-text-field>
                      </v-flex>
                      <v-flex xs12 md4>
                        <v-text-field v-model="endereco.numero" label="Número"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout>
                      <v-flex xs12 md4>
                        <v-text-field v-model="endereco.complemento" label="Complemento"></v-text-field>
                      </v-flex>
                      <v-flex xs12 md4>
                        <v-text-field v-model="endereco.bairro" label="Bairro"></v-text-field>
                      </v-flex>
                      <v-flex xs12 md4>
                        <v-text-field v-model="endereco.localidade" label="Cidade/UF"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-tab-item>

                 <v-tab-item :value="'tab-2'">
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
    nameRules: [v => !!v || "Nome é obrigatorio"],
    emailRules: [v => /.+@.+/.test(v) || "E-mail precisa ser valido"],
    loading: false,
    snackbar: false,
    snackResponse: "",
    valid: true,
    //Firebase não cria um auto increment integer para atribuir ao payload. Vou injetar o valor em submit.
    idCliente: "",
    //Firebase tambem não permite PUT utilizando a referencia do objeto, apenas com sua chave de acesso.
    chaveFirebase: "",
    pessoa: {
      nomeCompleto: "",
      cpf: "",
      rg: "",
      nascimento: ""
    },
    contato: {
      email: "",
      telefone: "",
      celular: ""
    },
    endereco: {
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      localidade: "",
      cep: "",
      uf: ""
    },
    image: {
      name: "",
      url: "",
      file: ""
    },
    dataCadastro: "",
  }),
  methods: {
    submit() {
      this.formatDate();

      this.loading = true;
      var data = {};

      data.nome = this.pessoa.nomeCompleto;
      data.cpf = this.pessoa.cpf;
      data.rg = this.pessoa.rg;
      data.nascimento = this.pessoa.nascimento;
      data.email = this.contato.email;
      data.telefone = this.contato.telefone;
      data.celular = this.contato.celular;
      data.logradouro = this.endereco.logradouro;
      data.numero = this.endereco.numero;
      data.complemento = this.endereco.complemento;
      data.bairro = this.endereco.bairro;
      data.cep = this.endereco.cep;
      data.dataCadastro = this.dataCadastro;
      data.imagem = this.image;
      this.endereco.localidade == ""
        ? (data.cidade = null)
        : (data.cidade = this.endereco.localidade);

      this.$http
        .get(
          "https://vuejs-250c3.firebaseio.com/clientes.json?orderBy=%22id%22&limitToLast=1"
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
            .post("https://vuejs-250c3.firebaseio.com/clientes.json", data)
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

      data.nome = this.pessoa.nomeCompleto;
      data.cpf = this.pessoa.cpf;
      data.rg = this.pessoa.rg;
      data.email = this.contato.email;
      data.telefone = this.contato.telefone;
      data.celular = this.contato.celular;
      data.logradouro = this.endereco.logradouro;
      data.numero = this.endereco.numero;
      data.complemento = this.endereco.complemento;
      data.bairro = this.endereco.bairro;
      data.cep = this.endereco.cep;
      data.id = this.idCliente;
      data.cidade = this.endereco.localidade;
      data.nascimento = this.pessoa.nascimento;
      data.imagem = this.image;

      this.$http
        .get(
          "https://vuejs-250c3.firebaseio.com/clientes.json?orderBy=%22id%22&equalTo=" +
            this.idCliente
        )
        .then(response => {
          this.chaveFirebase = Object.keys(response.body)[0];
        })
        .then(function() {
          this.$http
            .patch(
              "https://vuejs-250c3.firebaseio.com/" +
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
    buscarCep() {
      if (/^[0-9]{8}$/.test(this.endereco.cep)) {
        this.$http
          .get("https://viacep.com.br/ws/" + this.endereco.cep + "/json/")
          .then(response => {
            if ("erro" in response.body) {
              this.endereco = {};
              this.snackResponse = "Cep Não Encontrado!";
              this.snackbar = true;
              console.log(response);
              return;
            }
            this.endereco = response.body;
            this.endereco.localidade =
              this.endereco.localidade + "/" + this.endereco.uf;
          });
      }
    },
    formatDate() {
      var todayTime = new Date();
      var month = todayTime.getMonth() + 1;
      var day = todayTime.getDate();
      var year = todayTime.getFullYear();
      this.dataCadastro = day + "/" + month + "/" + year;
    },
    cancelar() {
      // this.$refs.form.resetValidation();
      this.$router.push({ name: "cliente" });
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
  },
  mounted() {
    console.log(this.$route.params);
    console.log(!("content" in this.$route.params));
    if (!("content" in this.$route.params)) {
      return;
    }
    const content = this.$route.params.content;
    this.update = true;
    (this.pessoa = {
      nascimento: content.nascimento,
      cpf: content.cpf,
      nomeCompleto: content.nome,
      rg: content.rg
    }),
      (this.contato = {
        email: content.email,
        telefone: content.telefone,
        celular: content.celular
      }),
      (this.endereco = {
        cep: content.cep,
        logradouro: content.logradouro,
        numero: content.numero,
        complemento: content.complemento,
        bairro: content.bairro,
        localidade: content.cidade
      }),
      (this.idCliente = content.id);
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
