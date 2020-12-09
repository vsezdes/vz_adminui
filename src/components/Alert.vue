<template>
  <div class="alert-container">
    <v-alert
      dense
      elevation="2"
      v-for="alert in alerts"
      :key="alert.ts"
      :type="alert.type"
      border="top"
      dismissible
      transition="scale-transition"
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

<style lang="scss">
.alert-container {
  position: fixed;
  right: 20px;
  max-width: 600px;
  min-width: 250px;
  // top: 60px;
  bottom: 5px;
  z-index: 5000;
  .v-alert {
    padding: 4px !important;
    font-size: 13px !important;
    margin-bottom: 6px;
    &.warning {
      background: darkorange;
    }
    &.error {
      background: firebrick;
    }
    &.info {
      background: mediumturquoise;
    }
    &.success {
      background: olivedrab;
    }
    &__icon {
      font-size: 16px !important;
      margin-top: 3px !important;
    }
    &__dismissible {
      width: 20px;
      height: 20px;
      position: relative;
      right: -12px;
      top: -12px;
      .v-icon {
        font-size: 16px !important;
        &:hover {
          color: crimson;
        }
      }
    }
  }
}

</style>
