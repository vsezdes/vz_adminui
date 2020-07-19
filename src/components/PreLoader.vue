<template>
  <v-overlay :value="$store.state.loader">
    <v-progress-circular color="rgba(255, 0, 0, 0.5)" indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>