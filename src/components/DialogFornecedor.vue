<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>
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
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">Ok</v-btn>
        </v-card-actions>
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
      dialog: false
    };
  },
  created() {
    eventBus.$on("dialogTrigged", rowOfDialog => {
      console.log(rowOfDialog);
      this.dialog = rowOfDialog.dialog;
      this.content = rowOfDialog.row;
    });
  }
};
</script>
