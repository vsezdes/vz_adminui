<template>
  <div id="app">
    <router-view/>
    <Alert />
    <v-dialog
      :value="showUpdateUI"
      width="400"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Найдены обновления!
        </v-card-title>

        <v-card-text class="mt-4">
          VT-manager нашел обновления своего кода, настоятельно рекомендуется обновить без промедления
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="accept"
          >
            Обновить
          </v-btn>
          <v-btn
            color="secondary"
            text
            @click="showUpdateUI = false"
          >
            Позже
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Alert from "./components/Alert";
export default {
  name:'app',
  components:{
    Alert
  },
  data() {
    return {
      showUpdateUI: false,
    }
  },
  created() {
    if (this.$workbox) {
      this.$workbox.addEventListener("waiting", () => {
        this.showUpdateUI = true;
      });
    }
  },
  methods: {
    async accept() {
      this.showUpdateUI = false;
      await this.$workbox.messageSW({ type: "SKIP_WAITING" });
    }
  }
}
</script>
