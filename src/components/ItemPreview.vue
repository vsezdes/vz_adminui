<template>
  <v-card
    v-if="data"
    class="mx-auto mb-7"
    max-width="344"
  >
    <v-img
      v-if="!!thumb"
      :style="{ border: '1px solid #EEE' }"
      :src="thumb"
      height="200px"
    ></v-img>

    <v-btn
      :style="{ float: 'right', margin: '25px 5px' }"
      icon
      @click="show = !show"
    >
      <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
    </v-btn>

    <v-card-title>
      {{ data.title }}
    </v-card-title>

    <v-card-subtitle>
      Цена: <v-chip small>{{ data.price }}</v-chip>
    </v-card-subtitle>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          Сюда влепим описание
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    show: false,
  }),
  computed: {
    thumb() {
      if (this.data && this.data.images && this.data.images[0]) {
        return this.data.images[0].url;
      }
      return null;
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    }
  }
}
</script>
