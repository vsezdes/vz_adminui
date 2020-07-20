<template>
  <v-card
    :loading="loading"
    class="item-card mx-auto my-12"
    max-width="374"
  >
    <v-img
      v-if="!!thumb"
      :src="thumb"
      contain
    >
        <v-chip
          class="ma-2 price"
          color="orange"
          text-color="white"
        >
          150 000 <small>сом</small> {{ price }}
        </v-chip>
    </v-img>
    <v-chip
      v-else
      class="ma-2 price"
      color="orange"
      text-color="white"
    >
      150 000 <small>сом</small> {{ price }}
    </v-chip>

    <v-card-title>{{ title }}</v-card-title>
    <div class="item-controls">
      <v-btn icon @click="$emit('on-edit', id)">
        <v-icon>mdi-lead-pencil</v-icon>
      </v-btn>
      <v-btn icon @click="onDelete">
        <v-icon>mdi-delete-forever-outline</v-icon>
      </v-btn>
    </div>
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
    props: ['id', 'title', 'price', 'images', 'category', 'description'],
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
      onDelete () {
        if (!window.confirm('Удалить товар?')) return;
        console.warn('delete: ', this.id);
      },
    },
  }
</script>

<style lang="scss">
.item-card {
  .item-controls {
    position: absolute;
    right: -2px;
    top: 5px;
    background: #F5F5F5;
    border-radius: 20px 0 0 20px;
    padding: 0px 6px;
    box-shadow: 1px 1px 1px #CCC;
  }
  .v-chip.price {
    font-size: 20px;
    font-weight: 500;
    small {
      margin-top: 3px;
      padding-left: 4px;
      font-size: 80%;
    }
  }
  .v-card__title {
    padding-bottom: 0px;
  }
}

</style>
