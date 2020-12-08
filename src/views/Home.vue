<template>
  <BaseTemplate>
    <v-col>
      <v-row>
        <v-col
          cols="12"
        >
          <Search
            @on-expand="expandedId = $event"
          />
        </v-col>
      </v-row>
      <v-row class="title">
        <v-col><h1>Последние добавленные</h1></v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="item in lastItems"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
        >
          <ItemCard
            v-bind="item"
            :readonly="true"
            @on-expand="expandedId = $event"
          />
        </v-col>
      </v-row>
      <v-row class="title">
        <v-col><h1>Рекомендуемые товары</h1></v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="item in lastItems"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
        >
          <ItemCard
            v-bind="item"
            :readonly="true"
            @on-expand="expandedId = $event"
          />
        </v-col>
      </v-row>
      <v-row class="title">
        <v-col><h1>Популярные категории</h1></v-col>
      </v-row>
    </v-col>
    <ItemPreview :item="expandedItem" @close="expandedId = null"/>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from '@/views/BaseTemplate.vue';
import { LAST_ITEMS, GET_LATEST_INFO } from '@/gql/items.graphql';
import ItemCard from '@/components/ItemCard';
import Search from '@/components/Search';
import ItemPreview from '@/components/ItemPreview';
import mixins from '@/mixins/index';

export default {
  name: 'Home',
  mixins,
  components: {
    BaseTemplate,
    ItemCard,
    ItemPreview,
    Search
  },
  data() {
    return {
      expandedId: null,
    };
  },
  apollo: {
    lastItems: {
      query: LAST_ITEMS,
      variables: {
        page: 0,
      },
    },
    getLatestInfo: {
      query: GET_LATEST_INFO,
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
    getItemById(id) {
      return this.lastItems && this.lastItems.find(i => i.id === id)
    },
    loadMore() {
      console.warn(this);
      this.page++
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
  }
}
</script>

<style lang="scss" scoped>
.title {
  h1 {
    font-size: 18px;
    text-transform: uppercase;
    background: #EEE;
    letter-spacing: 1px;
    border-left: 5px solid orange;
    padding-left: 15px;
    color: #666;
  }
}
</style>
