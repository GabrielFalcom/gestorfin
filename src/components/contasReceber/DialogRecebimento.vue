<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" width="550">
      <v-card>
        <v-card-title :class="selectedClass+' justify-center'">
          <v-toolbar-title style="color: white">{{ content.descricao }}</v-toolbar-title>
        </v-card-title>

        <v-list two-line>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">account_balance_wallet</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ content.valor }}</v-list-tile-title>
              <v-list-tile-sub-title>Valor(R$)</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action></v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ content.formaPagSelected }}</v-list-tile-title>
              <v-list-tile-sub-title>Forma Pagamento</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action></v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ content.status }}</v-list-tile-title>
              <v-list-tile-sub-title>Pagamento</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">date_range</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ content.vencimento }}</v-list-tile-title>
              <v-list-tile-sub-title>Data Vencimento</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action></v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ content.emissao }}</v-list-tile-title>
              <v-list-tile-sub-title>Data Emissão</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action></v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ content.dataCadastro }}</v-list-tile-title>
              <v-list-tile-sub-title>Data Cadastro</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action></v-list-tile-action>
            <template v-if="content.status == 'Pago'">
            <v-list-tile-action></v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ content.compensacao }}</v-list-tile-title>
                <v-list-tile-sub-title>Data Compensação</v-list-tile-sub-title>
              </v-list-tile-content>
            </template>
          </v-list-tile>

          <template v-if="content.cliente != ''">
            <v-divider inset></v-divider>
            <v-list-tile>
              <v-list-tile-action>
                  <v-icon color="indigo">poll</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ content.cliente }}</v-list-tile-title>
                <v-list-tile-sub-title>Cliente</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>

        <template v-if="erase == true">
          <v-divider></v-divider>
          <strong>Atenção!</strong>
          <p>Você tem certeza que deseja excluir esse Produto?</p>
          <v-divider></v-divider>
        </template>

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
            <v-btn flat @click="dialog = false" :disabled="loading">
              <strong style="color: white">Cancelar</strong>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn flat @click="removeProduto" :loading="loading" :disabled="loading">
              <strong style="color: white">Deletar</strong>
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { eventBus } from "../../main";
export default {
  data() {
    return {
      content: {},
      dialog: false,
      loading: false,
      selectedClass: "",
      erase: false,
      chaveFirebase: ""
    };
  },
  methods: {
    removeProduto() {
      this.loading = true;
      this.$http
        .get(
          "https://vuejs-250c3.firebaseio.com/recebimentos.json?orderBy=%22id%22&equalTo=" +
            this.content.id
        )
        .then(response => {
          console.log(response);
          this.chaveFirebase = Object.keys(response.body)[0];
        })
        .then(function() {
          this.$http
            .delete(
              "https://vuejs-250c3.firebaseio.com/recebimentos/" +
                this.chaveFirebase +
                ".json"
            )
            .then(
              response => {
                console.log(response);
                this.dialog = false;
                //Apenas emitindo um evento para Recebimentos executar um callback pra renderizar a lista.
                this.$emit("event_dialog");
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
      if (this.erase == true) {
        this.selectedClass = "cardTitleDelete";
      } else {
        this.selectedClass = "cardTitleRcbmt";
      }
    });
  }
};
</script>