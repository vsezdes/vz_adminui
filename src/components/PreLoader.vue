<template>
  <v-app>
    <v-overlay :value="$store.state.loader" color="preloader_bg">
      <v-container fluid>
        <v-progress-circular color="preloader_circle" width="10" indeterminate size="250">
          <v-img height="140" width="170" src="../assets/logo.svg"/>

        </v-progress-circular>
      </v-container>
    </v-overlay>
  </v-app>
</template>
