<template>
  <v-card
    :loading="loading"
    class="mx-auto my-12"
    max-width="374"
  >
    <v-img
      height="250"
      v-if="!!thumb"
      :src="thumb"
    ></v-img>

    <v-card-title>{{ title }}</v-card-title>

    <v-card-text>
      <!-- <v-row
        align="center"
        class="mx-0"
      >
        <v-rating
          :value="4.5"
          color="amber"
          dense
          half-increments
          readonly
          size="14"
        ></v-rating>n

        <div class="grey--text ml-4">4.5 (413)</div>
      </v-row> -->
      <v-row
        align="center"
        class="mx-0"
      >
        <v-chip
          class="ma-2"
          color="orange"
          text-color="white"
        >
          <v-icon>mdi-cash</v-icon>
          {{ price }}
        </v-chip>
      </v-row>

      <v-chip small >{{ category }}</v-chip>
      <div>{{ description }}</div>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <!-- <v-card-actions>
      <v-btn
        color="deep-purple lighten-2"
        text
        @click="reserve"
      >
        Reserve
      </v-btn>
    </v-card-actions> -->
  </v-card>
</template>

<script>
  export default {
    props: ['title', 'price', 'images', 'category', 'description'],
    data: () => ({
      loading: false,
      selection: 1,
    }),
    computed: {
      thumb() {
        return this.images && this.images.length > 0 && this.images[0].url;
      },
    },
    methods: {
      reserve () {
        this.loading = true

        setTimeout(() => (this.loading = false), 2000)
      },
    },
  }
</script>
