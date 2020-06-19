<template>
  <v-card
    class="mx-auto mb-7"
    max-width="344"
  >
    <v-img
      :style="{ border: '1px solid #EEE' }"
      :src="data.thumb"
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
  props: {
    data: {
      type: Boolean,
      default: () => {},
    }
  }
}
</script>
