<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title :class="selectedClass">
          <h4>{{ content.nome }}</h4>
        </v-card-title>
        <v-img src="https://cdn.vuetifyjs.com/images/lists/ali.png" height="300px"></v-img>
        <v-divider></v-divider>
        <v-list two-line style="padding-top:1px">
<!-- 
            <v-list-tile>
              <v-list-tile-content>CPF:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ content.cpf }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>RG:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ content.rg }}</v-list-tile-content>
            </v-list-tile> -->

            <v-list-tile>
                <v-list-tile-action>
                    <v-icon color="indigo">person</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>{{ content.cpf }}</v-list-tile-title>
                    <v-list-tile-sub-title>CPF</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
                <v-list-tile-action></v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{ content.rg }}</v-list-tile-title>
                <v-list-tile-sub-title>RG</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
                <v-list-tile-action>
                    <v-icon color="indigo">mail</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>{{ content.email }}</v-list-tile-title>
                    <v-list-tile-sub-title>Email</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
                <v-list-tile-action></v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{ content.telefone }}</v-list-tile-title>
                <v-list-tile-sub-title>Telefone</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
                <v-list-tile-action></v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{ content.celular }}</v-list-tile-title>
                <v-list-tile-sub-title>Celular</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
                <v-list-tile-action>
                    <v-icon color="indigo">pin_drop</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>{{ content.logradouro }}</v-list-tile-title>
                    <v-list-tile-sub-title>Logradouro</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
                <v-list-tile-action></v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{ content.numero }}</v-list-tile-title>
                <v-list-tile-sub-title>Numero</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
                <v-list-tile-action></v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{ content.bairro }}</v-list-tile-title>
                <v-list-tile-sub-title>Bairro</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
                <v-list-tile-action></v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{ content.complemento }}</v-list-tile-title>
                <v-list-tile-sub-title>Complemento</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
                <v-list-tile-action></v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{ content.cidade }}</v-list-tile-title>
                <v-list-tile-sub-title>Cidade</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
                <v-list-tile-action></v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{ content.cep }}</v-list-tile-title>
                <v-list-tile-sub-title>Cep</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
                <v-list-tile-action></v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{ content.dataCadastro }}</v-list-tile-title>
                <v-list-tile-sub-title>Data Cadastro</v-list-tile-sub-title>
                </v-list-tile-content>
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
              <strong style="color: white">OK</strong>
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
import { eventBus } from '../../main';
export default {
  data() {
    return {
      content: {},
      dialog: false,
      selectedClass: "cardTitleFncd",
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
                //Apenas emitindo um evento para Fornecedores executar um callback pra renderizar a lista.
                this.$emit('event_dialog');
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

<style>
/* background-color: #00C853; */

</style>
