<template>
  <v-card
    class="pa-0 mb-1 search-item"
    outlined
    @click="$emit('on-expand', item.id)"
    hover
  >
    <div class="d-flex flex-no-wrap justify-left">
      <v-avatar
        class="product-img ma-1"
        size="85"
        tile
      >
        <v-img
          v-if="!!thumb"
          :src="thumb"
        />
      </v-avatar>
      <v-card-title
        class="headline"
        v-html="highlightSearch(item.title)"
      />
        <span class="price">
          {{ item.price }} сом
        </span>
    </div>
  </v-card>
</template>

<script>
import mixins from '@/mixins';

export default {
  name: 'SearchItem',
  props: ['item', 'search'],
  mixins,
  computed: {
    thumb() {
      return this.item.images && this.item.images[0] && this.item.images[0].url;
    },
  },
}
</script>

<style scoped>
.search-item .headline {
  font-size: 18px !important;
  line-height: 24px;
  padding: 2px 8px;
  word-break: keep-all;
}
.search-item .price {
  position: absolute;
  bottom: 0;
  right: 5px;
  color: #BBB;
  padding-left: 10px;
  font-size: 16px;
}
.product-img {
  border: 2px solid #EEE;
  background: #EEE;
}
</style>
