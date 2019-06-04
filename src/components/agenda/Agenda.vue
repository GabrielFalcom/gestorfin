<template>
  <v-layout>
    <v-container grid-list-xl>
      <!-- <DialogProduto v-on:event_dialog="getProdutos"></DialogProduto> -->
      <v-card>
        <div class="titleCard" style="background-color: #3F51B5; border-color: #3F51B5;">
          <h2>Agenda</h2>
        </div>
        <v-card-title>
          <v-btn @click="navigateTo" color="indigo"  style="text-transform: none; color:#ffffff">
            <v-icon style="padding-right: 5px">add_circle</v-icon> Marcar Hora
          </v-btn>
          <v-spacer></v-spacer>
          
        </v-card-title>

        <v-layout wrap>
          <v-flex xs12 class="mb-3">
            <v-sheet height="600">
              <!-- now is normally calculated by itself, but to keep the calendar in this date range to view events -->
              <v-calendar ref="calendar" :now="today" :value="today" v-model="today"  color="primary" locale="pt-br" type="week">
                <!-- the events at the bottom (timed) -->
                <template v-slot:dayBody="{ date, timeToY, minutesToPixels }">
                  <template v-for="event in eventsMap[date]">
                    <!-- timed events -->
                    <div
                      v-if="event.time"
                      :key="event.title"
                      :style="{ top: timeToY(event.time) + 'px', height: minutesToPixels(event.duration) + 'px' }"
                      class="my-event with-time"
                      @click="open(event)"
                      v-html="event.title"
                    ></div>
                  </template>
                </template>
              </v-calendar>
            </v-sheet>
          </v-flex>

              <v-flex sm4 xs12 class="text-sm-left text-xs-center">
            <v-btn @click="$refs.calendar.prev()">
              <v-icon dark left>keyboard_arrow_left</v-icon>Anterior
            </v-btn>
          </v-flex>
          <v-spacer>
            <div style="text-transform: uppercase">{{labelMes}}</div>
          </v-spacer>
          <v-flex sm4 xs12 class="text-sm-right text-xs-center">
            <v-btn @click="$refs.calendar.next()">
              Proximo
              <v-icon right dark>keyboard_arrow_right</v-icon>
            </v-btn>
          </v-flex>

        </v-layout>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    today: new Date().toISOString().substring(0, 10),
    agenda: [{}],
    events: [
      {
        title: "Weekly Meeting",
        date: "2019-05-27",
        time: "09:00",
        duration: 45
      },
      {
        title: "Thomas' Birthday",
        date: "2019-05-28"
      },
      {
        title: "Complexo Alemão",
        date: "2019-05-29",
        time: "12:30",
        duration: 180
      }
    ]
  }),
  computed: {
    // convert the list of events into a map of lists keyed by date
    eventsMap() {
      const map = {};
      this.agenda.forEach(e => (map[e.date] = map[e.date] || []).push(e));
      return map;
    },
    labelMes: function() {
      return new Date(this.today).toLocaleString('pt-Br', { month: 'long' }) + ' / ' + new Date(this.today).getFullYear()
    }
  },
  mounted() {
    this.$refs.calendar.scrollToTime("08:00");
    this.getAgenda();
  },
  methods: {
    open(event) {
      alert(event.title);
    },
    navigateTo(){
      this.$router.push({ name: "marcahora" });
    },
    getAgenda() {
      this.$http
        .get("https://vuejs-250c3.firebaseio.com/agenda.json")
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = [];
          for (let key in data) {
            resultArray.push(data[key]);
          }
          this.agenda = resultArray;
          console.log(this.agenda);
        });
    }
  }
};
</script>

<style  scoped>
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #3F51B5;
  color: #ffffff;
  border: 1px solid #3F51B5;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
  left: 4px;
  margin-right: 8px;
  position: relative;
}

.with-time {
  position: absolute;
  right: 4px;
  margin-right: 0px;
}
</style>