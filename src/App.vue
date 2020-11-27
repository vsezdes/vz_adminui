<template>
  <div id="app">
    <PreLoader v-if="$store.state.loader"/>
    <router-view/>
    <Alert/>
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
import { mapGetters } from 'vuex';
import PreLoader from "@/components/PreLoader";
import Alert from "./components/Alert";
import THEMES from '@/themes';

export default {
  name: 'app',
  components: {
    PreLoader,
    Alert,
  },
  data() {
    return {
      showUpdateUI: false,
    }
  },
  created() {
    // simulate AJAX

    if (this.$workbox) {
      this.$workbox.addEventListener("waiting", () => {
        this.showUpdateUI = true;
      });
    }
  },
  computed: {
    ...mapGetters(['userGroup']),
  },
  watch: {
    userGroup(val) {
      this.setTheme(val);
    },
  },
  mounted() {
    this.setTheme(this.userGroup);
  },
  methods: {
    setTheme(val) {
      const themeName = val || 'ADMIN';
      const theme = THEMES.find(t => t.name === themeName);
      if(!theme) return;
      const name = theme.name;
      const dark = theme.dark;
      const light = theme.light;
      // set themes
      Object.keys(dark).forEach(i => {
        this.$vuetify.theme.themes.dark[i] = dark[i];
      });
      Object.keys(light).forEach(i => {
        this.$vuetify.theme.themes.light[i] = light[i];
      });
      // also save theme name to disable selection
      this.$vuetify.theme.themes.name = name;
    },
    async accept() {
      this.showUpdateUI = false;
      await this.$workbox.messageSW({type: "SKIP_WAITING"});
    }
  }
}
</script>
