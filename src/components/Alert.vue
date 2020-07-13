<template>
<div class="alert-container">
  <v-alert
    v-for="alert in alerts"
    :key="alert.ts"
    :type="alert.type"
    border="top"
    dismissible
  >
    {{ alert.message }}
  </v-alert>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'Alert',
  computed: {
    ...mapState(['alerts']),
  },
  methods: {
    ...mapActions(['alert']),
  }
}
</script>

<style>
.alert-container {
  position: fixed;
  right: 10px;
  max-width: 600px;
  bottom: 0;
  z-index: 5000;
}

</style>
