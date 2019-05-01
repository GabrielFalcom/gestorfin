<template>
  <v-layout>
    <v-container grid-list-xl>
      <v-layout>
        <v-flex>
          <v-card>
            <div>
              <v-form ref="form" v-model="valid">
                <v-container>
                  <v-subheader>
                    <v-icon>work</v-icon>Dados Empresariais
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
                      <v-text-field v-model="empresa.cnpj" mask="##.###.###/####-##" label="CNPJ"></v-text-field>
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
                      <v-text-field v-model="pessoa.cpf" mask="###.###.###-##" label="CPF"></v-text-field>
                    </v-flex>
                    <v-flex xs12 md3>
                      <v-text-field v-model="pessoa.rg" label="RG"></v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-subheader>
                    <v-icon>contact_mail</v-icon>Dados de Contato
                  </v-subheader>
                  <v-layout>
                    <v-flex xs12 md4>
                      <v-text-field v-model="contato.email" :rules="emailRules" label="E-mail"></v-text-field>
                    </v-flex>
                    <v-flex xs12 md4>
                      <v-text-field v-model="contato.telefone" label="Telefone"></v-text-field>
                    </v-flex>
                    <v-flex xs12 md4>
                      <v-text-field v-model="contato.celular" mask="(##)#####-####" label="Celular"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-subheader>
                    <v-icon>pin_drop</v-icon>Dados de Endereço
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
              </v-form>
            </div>
          </v-card>
          <br>
          <v-btn color="success" 
              @click="submit" 
              :loading="loading"
              :disabled="loading">
              Cadastrar
            </v-btn>

          <v-btn color="warning" @click="reset">Resetar Formulario</v-btn>

          <v-btn color="error" @click="cancelar">Cancelar</v-btn>

          <v-snackbar v-model="snackbar" :bottom="true" :timeout="1750">{{snackResponse}}</v-snackbar>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    fornecedores: ["Pessoa Física", "Pessoa Jurídica"],
    nameRules: [v => !!v || "Nome é obrigatorio"],
    emailRules: [v => /.+@.+/.test(v) || "E-mail precisa ser valido"],
    loading: false,
    snackbar: false,
    snackResponse: "",
    valid: true,
    pessoa: {
      nomeCompleto: "",
      cpf: "",
      rg: "",
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
    }
  }),
  methods: {
    submit() {
      this.loading = true;

      var data = {};
      data.tipoFornecedor = this.empresa.select;
      this.empresa.select == "Pessoa Física" ? data.nome = this.pessoa.nomeCompleto : data.nome = this.empresa.nomeFantasia;
      data.cnpj = this.empresa.cnpj;
      data.razaoSoc = this.empresa.azaoSoc;
      data.email = this.contato.email;
      data.telefone = this.contato.telefone;
      data.celular = this.contato.celular;
      data.logradouro = this.endereco.logradouro;
      data.numero = this.endereco.numero;
      data.complemento = this.endereco.complemento;
      data.bairro = this.endereco.bairro;
      if (!"localidade" in this.endereco || this.endereco.localidade == "") {
        data.cidade = null;
      } else {
        data.cidade = this.endereco.localidade + "/" + this.endereco.uf;
      }
      data.cep = this.endereco.cep;

      this.$http
        .post("https://vuejs-http-6fd57.firebaseio.com/fornecedores.json", data)
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
              this.snackbar = false;
              // this.alertResponse = '';
            }, 1750);
          }
        );
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
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
    // voltar pra pagina anterior
    cancelar() {
      // this.$refs.form.resetValidation();
    }
  },
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
