<template>
  <v-card
    :loading="loading"
    class="item-card mx-auto my-4 elevation-1"
    width="300"
    height="290"
    outlined
    @click="readonly ? $emit('on-expand', id) : () => {}"
  >
    <v-img
      v-if="!!thumb"
      :src="thumb"
      height="200"
    >
        <v-chip v-if="recommended" color="success" class="float-right ma-2">
          <v-icon size="24">mdi-thumb-up</v-icon>
        </v-chip>
        <v-chip
          class="ma-2 price float-left"
          color="orange"
          text-color="white"
        >
          {{ price || 0}} <small>сом</small>
        </v-chip>
        <v-btn
          v-if="!readonly"
          icon
          outlined
          absolute
          right
          bottom
          class="expand"
          @click="$emit('on-expand', id)"
        >
          <v-avatar color="white">
            <v-icon>mdi-arrow-expand-all</v-icon>
          </v-avatar>
        </v-btn>
    </v-img>
    <v-chip
      v-else
      class="ma-2 price"
      color="orange"
      text-color="white"
    >
      {{ price || 0 }} <small>сом</small>
    </v-chip>
    <v-divider />

    <v-card-title>
      <v-tooltip top attach :open-delay="500">
        <template v-slot:activator="{ on, attrs }">
          <h2
            v-bind="attrs"
            v-on="on"
          >{{ title }}</h2>
        </template>
        <span>{{ title }}</span>
      </v-tooltip>
    </v-card-title>
    <div class="item-controls" v-if="!readonly">
      <v-btn icon @click="$emit('on-edit', id)">
        <v-icon>mdi-lead-pencil</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('on-delete', id)">
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
        <v-tooltip v-if="readonly" bottom :min-width="100" :open-delay="500" attach>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="buy-btn mb-10"
              color="primary"
              v-on="on"
              v-bind="attrs"
              @click.stop="addToCart({ id, title, price, quantity: 1 })"
              fab
              right
              absolute
              large
            >
              <v-icon>mdi-cart-arrow-down</v-icon>
            </v-btn>
          </template>
          <span>В корзину</span>
        </v-tooltip>
      </v-row>

      <v-chip x-small outlined color="secondary float-left">{{ categoryName }}</v-chip>
    </v-card-text>

    <!-- <v-divider class="mx-4"></v-divider> -->


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
import { mapActions } from 'vuex';
export default {
  props: ['id', 'title', 'price', 'images', 'categoryName', 'description', 'readonly','loading', 'recommended'],
  data: () => ({
    selection: 1,
  }),
  computed: {
    thumb() {
      return this.images && this.images[0] && this.images[0].url;
    },
  },
  methods: {
    ...mapActions(['addToCart']),
  },
}
</script>

<style lang="scss">
.item-card {
  &.v-sheet {
    margin-top: 44px !important;
    margin-bottom: 24px !important;
  }
  .item-controls {
    display: none;
    position: absolute;
    right: -2px;
    top: 5px;
    background: #F5F5F5;
    border-radius: 20px 0 0 20px;
    padding: 0px 6px;
    box-shadow: 1px 1px 1px #CCC;
  }
  .buy-btn {
    display: none;
    bottom: 50px;
  }
  &:hover {
    .item-controls, .buy-btn {
      display: block;
    }
  }
  .v-image {
    .v-avatar {
      border: 1px solid #EEE !important;
      &:hover {
        border: 1px solid #333 !important;
      }
    }
    .v-btn.expand {
      color: #CCC;
      &:hover {
        color: #333;
        background: #EEE;
      }
    }
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
    padding: 3px 10px;
    padding-top: 2px;
    padding-bottom: 0px;
    min-height: 56px;
  }
  .v-card__text {
    padding: 3px 10px;
  }
  .v-card__title h2{
    overflow: hidden;
    position: relative;
    line-height: 1.2em;
    max-height: 2.3em;
    font-size: 0.85em;
    text-align: justify;
    margin-right: -1em;
    padding-right: 1em;
  }
  .v-card__title h2:before {
    content: '...';
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .v-card__title h2:after {
    content: '';
    position: absolute;
    right: 0;
    width: 1em;
    height: 1em;
    margin-top: 0.2em;
    background: white;
  }
}

</style>
