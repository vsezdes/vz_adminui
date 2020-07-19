<template>
  <v-container class="form-wrapper">
    <v-card
      class="mx-auto pa-0"
      outlined
      flat
    >
      <v-card-title class="headline">
        <v-icon class="mr-3 mb-1">{{ icon }}</v-icon>
        {{ title }}
        <v-btn absolute right class="close-btn" icon @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-divider />
      <slot />
      <v-card-actions>

      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'FormWrapper',
  props: {
    title: {
      type: String,
      default: 'Форма',
    },
    icon: {
      type: String,
      default: 'mdi-form-select',
    }
  }
}
</script>

<style lang="scss">
.form-wrapper {
  .headline {
    padding: 10px 15px;
    background: #FAFAFA;
  }
  .close-btn {
    background: #FFF;
    border: 1px solid #BBB;
    .close-btn .v-icon {
      color: #665;
    }
  }
}
</style>
