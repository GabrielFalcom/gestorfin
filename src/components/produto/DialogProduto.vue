<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" width="550">
      <v-card>
        <v-card-title :class="selectedClass+' justify-center'">

            <v-toolbar-title>{{ content.nome }}</v-toolbar-title>

              <v-btn flat icon  @click="dialogTab = 'photo'">
                <v-icon :color="dialogTab == 'photo' ? 'white' : 'yellow accent-3' ">portrait</v-icon>
              </v-btn>

              <v-btn flat icon  @click="dialogTab = 'descricao'">
                <v-icon :color="dialogTab == 'descricao' ? 'white' : 'yellow accent-3' ">menu</v-icon>
              </v-btn>

            <v-btn flat icon @click="dialogTab = 'dados'">
                <v-icon :color="dialogTab == 'dados' ? 'white' : 'yellow accent-3' ">list</v-icon>
              </v-btn>

          
        </v-card-title>
        <template v-if="dialogTab == 'photo'">
          <img :src="$url(content.imagem)" style="width:400px;">
        </template>
        <template v-if="dialogTab == 'dados'">
          <v-list two-line>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="indigo">fitness_center</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ content.altura }}</v-list-tile-title>
                <v-list-tile-sub-title>Altura(M)</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ content.comprimento }}</v-list-tile-title>
                <v-list-tile-sub-title>Comprimento(M)</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            
            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ content.largura }}</v-list-tile-title>
                <v-list-tile-sub-title>Largura(M)</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-content>
                <v-list-tile-title>{{ content.peso }}</v-list-tile-title>
                <v-list-tile-sub-title>Peso(Kg)</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="indigo">list</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ content.fornecedor }}</v-list-tile-title>
                <v-list-tile-sub-title>Fornecedor</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            
            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ content.quantidade }}</v-list-tile-title>
                <v-list-tile-sub-title>Quantidade</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>R${{ content.preco }}</v-list-tile-title>
                <v-list-tile-sub-title>Preço</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>
          </v-list>
        </template>
        <template v-if="dialogTab == 'descricao'">
                <v-card-text style="white-space: pre-line">{{ content.descricao }}</v-card-text>
            </template>

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
      dialogTab: 'photo',
      dialog: false,
      loading: false,
      selectedClass: "cardTitleClt",
      erase: false,
      chaveFirebase: ""
    };
  },
  methods: {
    removeProduto() {
      this.loading = true;
      this.$http
        .get(
          "https://vuejs-http-6fd57.firebaseio.com/produtos.json?orderBy=%22id%22&equalTo=" +
            this.content.id
        )
        .then(response => {
          console.log(response);
          this.chaveFirebase = Object.keys(response.body)[0];
        })
        .then(function() {
          this.$http
            .delete(
              "https://vuejs-http-6fd57.firebaseio.com/produtos/" +
                this.chaveFirebase +
                ".json"
            )
            .then(
              response => {
                console.log(response);
                this.dialog = false;
                //Apenas emitindo um evento para Produtos executar um callback pra renderizar a lista.
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