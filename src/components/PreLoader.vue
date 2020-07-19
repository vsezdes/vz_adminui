<template>
  <v-overlay :value="$store.state.loader" :color="$store.state.custom_colors.preloader.bg">
    <v-container fluid ><v-progress-circular :color="$store.state.custom_colors.preloader.circle" width="10"  indeterminate size="250">
      <v-img height="140" width="170" src="../assets/logo.svg" />

    </v-progress-circular></v-container>
  </v-overlay>
</template>