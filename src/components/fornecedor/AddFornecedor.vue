<template>
  <v-layout>
    <v-container grid-list-xl>
      <v-layout>
        <v-flex>
          <v-card>
            <div>
              <v-form ref="form" v-model="valid">
                <v-card-title style="background-color:#00c853"></v-card-title>
                <v-container>
                  <v-subheader>
                    <v-icon style="padding-right: 5px">work</v-icon>Dados Empresariais
                  </v-subheader>
                  <v-layout>
                    <v-flex xs12 md3>
                      <v-select
                        v-model="empresa.select"
                        :items="fornecedores"
                        :rules="[v => !!v || 'Fornecedor é obrigatorio']"
                        label="Fornecedor"
                        required
                      ></v-select>
                    </v-flex>
                  </v-layout>

                  <v-layout v-if="this.empresa.select == 'Pessoa Jurídica'">
                    <v-flex xs12 md3>
                      <v-text-field
                        v-model="empresa.nomeFantasia"
                        :rules="nameRules"
                        label="Nome Fantasia"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md3>
                      <v-text-field
                        v-model="empresa.cnpj"
                        mask="##.###.###/####-##"
                        return-masked-value
                        label="CNPJ"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field v-model="empresa.razaoSoc" label="Razão Social"></v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-layout v-if="this.empresa.select == 'Pessoa Física'">
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="pessoa.nomeCompleto"
                        :rules="nameRules"
                        label="Nome Completo"
                        required
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
                        mask="(##)####-####"
                        return-masked-value
                        label="Telefone"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md4>
                      <v-text-field
                        v-model="contato.celular"
                        mask="(##)#####-####"
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
                <v-card-title style="background-color:#00c853"></v-card-title>
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

          <v-alert
            :value="alert"
            icon="warning"
            type="warning"
            transition="scale-transition"
          >Atenção aos campos obrigatorios</v-alert>

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
    fornecedores: ["Pessoa Física", "Pessoa Jurídica"],
    nameRules: [v => !!v || "Nome é obrigatorio"],
    emailRules: [v => /.+@.+/.test(v) || "E-mail precisa ser valido"],
    loading: false,
    snackbar: false,
    snackResponse: "",
    valid: true,
    alert: false,
    //Firebase não cria um auto increment integer para atribuir ao payload. Vou injetar o valor em submit.
    idFornecedor: "",
    //Firebase tambem não permite PUT utilizando a referencia do objeto, apenas com sua chave de acesso.
    chaveFirebase: "",
    pessoa: {
      nomeCompleto: "",
      cpf: "",
      rg: ""
    },
    empresa: {
      select: null,
      nomeFantasia: "",
      cnpj: "",
      razaoSoc: ""
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
    dataCadastro: ""
  }),
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.formatDate();

        this.loading = true;
        var data = {};
        data.tipoFornecedor = this.empresa.select;
        this.empresa.select == "Pessoa Física"
          ? (data.nome = this.pessoa.nomeCompleto)
          : (data.nome = this.empresa.nomeFantasia);
        data.cpf = this.pessoa.cpf;
        data.rg = this.pessoa.rg;
        data.cnpj = this.empresa.cnpj;
        data.razaoSoc = this.empresa.azaoSoc;
        data.email = this.contato.email;
        data.telefone = this.contato.telefone;
        data.celular = this.contato.celular;
        data.logradouro = this.endereco.logradouro;
        data.numero = this.endereco.numero;
        data.complemento = this.endereco.complemento;
        data.bairro = this.endereco.bairro;
        data.cep = this.endereco.cep;
        data.dataCadastro = this.dataCadastro;
        this.endereco.localidade == ""
          ? (data.cidade = null)
          : (data.cidade = this.endereco.localidade);

        this.$http
          .get(
            "https://vuejs-250c3.firebaseio.com/fornecedores.json?orderBy=%22id%22&limitToLast=1"
          )
          .then(response => {
            const resultArray = [];
            for (let key in response.body) {
              resultArray.push(response.body[key]);
            }
            data.id = resultArray[0].id + 1;
          })
          .then(function() {
            this.$http
              .post(
                "https://vuejs-250c3.firebaseio.com/fornecedores.json",
                data
              )
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
      } else {
        this.alert = true;
        this.loading = true;
        setTimeout(() => {
                this.loading = false;
                this.alert = false;
                }, 2000);
      }

    },
    updating() {
      if (this.$refs.form.validate()) {
        this.formatDate();

      this.loading = true;

      var data = {};
      data.tipoFornecedor = this.empresa.select;
      this.empresa.select == "Pessoa Física"
        ? (data.nome = this.pessoa.nomeCompleto)
        : (data.nome = this.empresa.nomeFantasia);
      data.cpf = this.pessoa.cpf;
      data.rg = this.pessoa.rg;
      data.cnpj = this.empresa.cnpj;
      data.razaoSoc = this.empresa.azaoSoc;
      data.email = this.contato.email;
      data.telefone = this.contato.telefone;
      data.celular = this.contato.celular;
      data.logradouro = this.endereco.logradouro;
      data.numero = this.endereco.numero;
      data.complemento = this.endereco.complemento;
      data.bairro = this.endereco.bairro;
      data.cep = this.endereco.cep;
      data.id = this.idFornecedor;
      data.cidade = this.endereco.localidade;

      this.$http
        .get(
          "https://vuejs-250c3.firebaseio.com/fornecedores.json?orderBy=%22id%22&equalTo=" +
            this.idFornecedor
        )
        .then(response => {
          this.chaveFirebase = Object.keys(response.body)[0];
        })
        .then(function() {
          this.$http
            .patch(
              "https://vuejs-250c3.firebaseio.com/fornecedores/" +
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
    } else {
        this.alert = true;
        this.loading = true;
        setTimeout(() => {
                this.loading = false;
                this.alert = false;
                }, 2000);
      }
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
      this.$router.push({ name: "fornecedor" });
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
    if (content.tipoFornecedor == "Pessoa Jurídica") {
      this.empresa = {
        select: content.tipoFornecedor,
        nomeFantasia: content.nome,
        cnpj: content.cnpj,
        razaoSoc: content.razaoSoc
      };
    } else {
      (this.empresa = {
        select: content.tipoFornecedor
      }),
        (this.pessoa = {
          cpf: content.cpf,
          nomeCompleto: content.nome,
          rg: content.rg
        });
    }
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
      (this.idFornecedor = content.id);
  }
};
</script>
