<template>
  <BaseTemplate :loading="loading">
    <ItemPreview :item="expandedItem" @close="expandedId = null"/>
    <v-container fluid>
      <v-row>
        <v-col>
          <div class="headline">{{ categoryTitle }}</div>
          <v-divider />
          <v-progress-linear indeterminate v-if="loading" />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="item in categoryItems"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <ItemCard
            :readonly="true"
            v-bind="item"
            @on-expand="expandedId = $event"
          />
        </v-col>
      </v-row>
      <!-- <v-btn
        v-if="showLoadMore"
        @click="loadMore"
        block
        :loading="$apolloData.queries.lastItems.loading"
      >Показать еще...</v-btn> -->
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
import BaseTemplate from '@/views/BaseTemplate.vue';
import gql from 'graphql-tag';

export default {
  components: {
    BaseTemplate,
    ItemCard,
    ItemPreview,
    ItemForm,
  },
  computed: {
    categoryTitle() {
      if (this.categoryItems && this.categoryItems.length > 0) {
        return this.categoryItems[0].categoryName;
      }
      return 'Загрузка...';
    },
    expandedItem() {
      return this.getItemById(this.expandedId);
    },
  },
  methods: {
    onClose() {
      this.activeItem = null;
      this.showForm = false;
    },
    getItemById(id) {
      return this.categoryItems && this.categoryItems.find(i => i.id === id)
    },
    onEditItem(itemId) {
      this.activeItem = this.getItemById(itemId);
      this.showForm = true;
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
            categoryName
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
    this.fetchCategoryItems(this.$route.params.categoryId);
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
      loading: false,
      page: 0,
    }
  },
}
</script>
