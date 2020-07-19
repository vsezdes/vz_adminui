<template>
  <v-navigation-drawer
    class="form-wrapper pa-0"
    v-model="drawer"
    temporary
    fixed
    right
    width="450"
  >
    <v-container>
      <v-card
        class="mx-auto pa-0 pb-10"
        outlined
        flat
      >
        <v-card-title class="headline">
          <v-icon class="mr-3 mb-1">{{ icon }}</v-icon>
          {{ title }}
          <v-btn absolute right class="close-btn" icon @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider />
        <v-container>
          <slot />
        </v-container>
        <v-card-actions>

        </v-card-actions>
      </v-card>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'FormWrapper',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Форма',
    },
    icon: {
      type: String,
      default: 'mdi-form-select',
    }
  },
  data() {
    return {
      drawer: false,
    };
  },
  watch: {
    show(val) {
      console.warn(val)
      this.drawer = val;
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
  .v-navigation-drawer__content {
    background: #F5F5F5;
  }
}
</style>
