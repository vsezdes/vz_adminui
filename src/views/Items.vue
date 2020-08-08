<template>
  <BaseTemplate :loading="$apollo.loading">
    <ItemPreview :item="expandedItem" @close="expandedId = null"/>
    <v-container fluid>
      <v-btn
        fixed
        dark
        fab
        top
        :style="{ top: '80px' }"
        right
        color="pink"
        @click="showForm = !showForm"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-row>
        <v-col
          v-for="item in lastItems"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <ItemCard
            v-bind="item"
            @on-edit="onEditItem"
            @on-expand="expandedId = $event"
          />
        </v-col>
      </v-row>
      <v-btn
        v-if="showLoadMore"
        @click="loadMore"
        block
        :loading="$apolloData.queries.lastItems.loading"
      >Показать еще...</v-btn>
      <ItemForm
        :show="showForm"
        :item="activeItem"
        @close="onClose"
      />
    </v-container>
  </BaseTemplate>
</template>

<script>
import ItemCard from '@/components/ItemCard';
import ItemPreview from '@/components/ItemPreview';
import ItemForm from '@/components/ItemForm';
import { LAST_ITEMS } from '@/gql/items.graphql';
import BaseTemplate from '@/views/BaseTemplate.vue';

export default {
  components: {
    BaseTemplate,
    ItemCard,
    ItemPreview,
    ItemForm,
  },
  apollo: {
    lastItems: {
      query: LAST_ITEMS,
      variables: {
        page: 0,
      },
    },
  },
  computed: {
    loading() {
      return this.$apolloData.queries.lastItems.loading;
    },
    expandedItem() {
      return this.getItemById(this.expandedId);
    }
  },
  methods: {
    onClose() {
      this.activeItem = null;
      this.showForm = false;
    },
    getItemById(id) {
      return this.lastItems && this.lastItems.find(i => i.id === id)
    },
    onEditItem(itemId) {
      this.activeItem = this.getItemById(itemId);
      this.showForm = true;
    },
    loadMore() {
      console.warn(this);
      this.page++
      // Fetch more data and transform the original result
      this.$apollo.queries.lastItems.fetchMore({
        // New variables
        variables: {
          page: this.page,
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newItems = fetchMoreResult.lastItems;
          this.showLoadMore = (previousResult.lastItems.length / this.page) === newItems.length;
          return {
            lastItems: [
              // Merging the tag list
              ...previousResult.lastItems, ...newItems,
            ],
          }
        },
      })
    },
  },
  data () {
    return {
      activeItem: null,
      expandedId: null,
      showForm: false,
      showLoadMore: true,
      page: 0,
    }
  },
}
</script>
