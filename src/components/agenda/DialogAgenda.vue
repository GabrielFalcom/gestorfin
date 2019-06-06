<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" width="550">
      <v-card>
        <v-card-title :class="selectedClass+' justify-center'">
            <v-toolbar-title>{{ content.title }}</v-toolbar-title>
        </v-card-title>
        
          <v-list two-line>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="indigo">list</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ content.date }}</v-list-tile-title>
                <v-list-tile-sub-title>Data Evento</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ content.duration }}</v-list-tile-title>
                <v-list-tile-sub-title>Minutos de Jogo</v-list-tile-sub-title>
              </v-list-tile-content>
            
            </v-list-tile>


            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ content.time }}</v-list-tile-title>
                <v-list-tile-sub-title>Inicio</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ content.timeEnd }}</v-list-tile-title>
                <v-list-tile-sub-title>Termino</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>              

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="indigo">account_balance_wallet</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ content.total }}</v-list-tile-title>
                <v-list-tile-sub-title>Receita do Jogo (R$)</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ content.status }}</v-list-tile-title>
                <v-list-tile-sub-title>Status</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ content.formaPagSelected }}</v-list-tile-title>
                <v-list-tile-sub-title>Forma Pagamento</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile> 
            <v-divider inset></v-divider>             
          </v-list>

          <v-list two-line>
            <v-list-tile-sub-title>Clientes</v-list-tile-sub-title>
              <v-list-tile v-for="(cliente,index) in content.clientes" :key="index" style="padding:0 53px">
                <v-list-tile-content>
                    <v-list-tile-title>{{ cliente }}</v-list-tile-title>
                  </v-list-tile-content>
              </v-list-tile>
          </v-list>


          

          <template v-if="erase == true">
            <v-divider></v-divider>
            <strong>Atenção!</strong>
            <p>Você tem certeza que deseja excluir esse registro da Agenda?</p>
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
            <v-btn flat @click="removeCliente" :loading="loading" :disabled="loading">
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
      selectedClass: "cardTitleClt",
      erase: false,
      chaveFirebase: ""
    };
  },
  methods: {
    removeCliente() {
      this.loading = true;
      this.$http
        .get(
          "https://vuejs-250c3.firebaseio.com/clientes.json?orderBy=%22id%22&equalTo=" +
            this.content.id
        )
        .then(response => {
          console.log(response);
          this.chaveFirebase = Object.keys(response.body)[0];
        })
        .then(function() {
          this.$http
            .delete(
              "https://vuejs-250c3.firebaseio.com/clientes/" +
                this.chaveFirebase +
                ".json"
            )
            .then(
              response => {
                console.log(response);
                this.loading = false;
                this.dialog = false;
                //Apenas emitindo um evento para Clientes executar um callback pra renderizar a lista.
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
        this.selectedClass = "cardTitleClt";
      }
    });
  }
};
</script>

<style>
/* background-color: #00C853; */
</style>
