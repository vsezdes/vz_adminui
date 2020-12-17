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
        color="primary"
        @click="showForm = !showForm"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-row>
        <v-col
          v-for="item in items"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <ItemCard
            v-bind="item"
            @on-edit="onEditItem"
            @on-delete="onDelete"
            @on-expand="expandedId = $event"
            :loading="loading"
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
import gql from 'graphql-tag';

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
    },
    items() {
      const s = this.categoryItems || this.lastItems;
      console.error(s, this.categoryItems, this.lastItems);
      return s;
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
    update(id){
      let store = this.$store
      const data = LAST_ITEMS ;
      if (!id) return;

      const lastItems = data.values().filter(i => i.id !== id);
      store.writeQuery({ query: LAST_ITEMS, data: { lastItems } });
    },
    onDelete (id) {
      if (!window.confirm('Удалить товар?')) return;
      this.loading = false
      this.$apollo.mutate({
        // Query
        mutation: gql`mutation delItem($id: Int!) {
          delItem(id: $id) {
            id
            title
          }
        }`,
        // Parameters
        variables: {
          id: id,
        },
      }).then((data) => {
        // Result
        console.log(data)
        this.loading=false;
        this.lastItems.pop(this.lastItems.find(i => i.id === id))

      }).catch((error) => {
        // Error
        console.error(error)
        this.loading = false;
      })
      // this.update(id)
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
    fetchCategoryItems(id) {
      if (!id) return;
      this.loading = true;
      this.showLoadMore = false;
      this.$apollo.query({
        query: gql(`query catItems($id: Int!) {
          categoryItems(id: $id) {
            id
            title
            price
            description
            images {
              url
            }
          }
        }`),
        variables: {
          id: +id
        }
      }).then(res => {
        this.categoryItems = res.data.categoryItems;
        this.loading = false;
      }).catch(err => {
        console.error('Error fetching cat: ', err);
        this.loading = false;
      })

    }
  },
  created() {
    if (this.$route.name === 'CategoryItems') {
      this.$apollo.skipAll = true;
      this.fetchCategoryItems(this.$route.params.categoryId);
    }
  },
  mounted() {
    // TODO: make something more clever here
    this.showLoadMore = this.items && this.items.length > 6;
  },
  data () {
    return {
      activeItem: null,
      expandedId: null,
      showForm: false,
      showLoadMore: false,
      categoryItems: null,
      page: 0,
    }
  },
}
</script>
