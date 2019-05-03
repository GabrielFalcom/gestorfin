<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title :class="selectedClass">
          <h4>{{ content.nome }}</h4>
        </v-card-title>
        <v-divider></v-divider>
        <v-list dense>
          <div v-if="content.tipoFornecedor=='Pessoa Física'">
            <v-list-tile>
              <v-list-tile-content>CPF:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ content.cpf }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>RG:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ content.rg }}</v-list-tile-content>
            </v-list-tile>
          </div>
          <div v-else>
            <v-list-tile>
              <v-list-tile-content>CNPJ:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ content.cnpj }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Razão Social:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ content.razaoSoc }}</v-list-tile-content>
            </v-list-tile>
          </div>
          <v-list-tile>
            <v-list-tile-content>Email:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ content.email }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>Telefone:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ content.telefone }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>Celular:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ content.celular }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>Logradouro:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ content.logradouro }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>Numero:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ content.numero }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>Bairro:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ content.bairro }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>Complemento:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ content.complemento }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>Cidade:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ content.cidade }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>Cep:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ content.cep }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>Data Cadastro:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ content.dataCadastro }}</v-list-tile-content>
          </v-list-tile>

          <template v-if="erase == true">
            <br>
            <v-divider></v-divider>
            <strong>Atenção!</strong>
            <p>Você tem certeza que deseja excluir esse Fornecedor?</p>
            <v-divider></v-divider>
          </template>
        </v-list>
        <v-divider></v-divider>
        <template v-if="erase == false">
          <v-card-actions :class="selectedClass">
            <v-spacer></v-spacer>
            <v-btn flat @click="dialog = false">
              <strong>OK</strong>
            </v-btn>
          </v-card-actions>
        </template>
        <template v-else>
          <v-card-actions :class="selectedClass">
            <v-btn flat @click="dialog = false">
              <strong>Cancelar</strong>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn flat @click="removeFornecedor">
              <strong>Deletar</strong>
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { eventBus } from "../main";
export default {
  data() {
    return {
      content: {},
      dialog: false,
      selectedClass: "info",
      erase: "",
      chaveFirebase:""
    };
  },
  methods: {
    removeFornecedor() {
      this.$http
        .get(
          "https://vuejs-http-6fd57.firebaseio.com/fornecedores.json?orderBy=%22id%22&equalTo="+this.content.id)
        .then(response => {
          console.log(response);
          this.chaveFirebase=(Object.keys(response.body)[0]);
        }).then(function() {
          this.$http.delete("https://vuejs-http-6fd57.firebaseio.com/fornecedores/"+this.chaveFirebase+'.json')
            .then(
              response => {
                console.log(response);
                this.dialog = false;
                this.$emit('event_dialog',1);
              },
              error => {
                console.log(error);
              }
            );
      });
    }
  },
  created() {
    eventBus.$on("dialogTrigged", rowOfDialog => {
      console.log(rowOfDialog);
      this.dialog = rowOfDialog.dialog;
      this.content = rowOfDialog.row;
      this.erase = rowOfDialog.deleteRow;
      if (this.erase == true){
        this.selectedClass = "warning";
      }
    });
  }
};
</script>
