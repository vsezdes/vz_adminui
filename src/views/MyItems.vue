<template>
  <BaseTemplate>
    <v-flex style="margin-top:50px;">
      <!-- fixed view_mode buttons -->
      <v-layout class="fab-container">
        <v-btn
          dark
          fab
          color="pink"
          @click="showForm = !showForm"
          style="margin: 0 10px"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn-toggle right v-model="view_mode">
          <v-btn :value="'tab'" dark fab color="pink">
            <v-icon>mdi-card-bulleted-outline</v-icon>
          </v-btn>
          <v-btn :value="'table'" dark fab color="pink">
            <v-icon>mdi-table-large</v-icon>
          </v-btn>
        </v-btn-toggle>

      </v-layout>

      <v-card>
        <v-row justify="space-around">
          <v-col cols="auto">
            <v-card-title style="margin-top:-8px">Мои товары</v-card-title>
          </v-col>
          <v-col cols="auto">
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Поиск по всем полям" single-line
                          hide-details></v-text-field>
          </v-col>
        </v-row>
      </v-card>

      <v-flex v-if="view_mode==='tab'">
        <v-row>
          <v-col
            v-for="item in searchItems()"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
          >
            <ItemCard
              v-bind="item"
              @on-edit="onEditItem"
              @on-expand="expandedId = $event"
            />
          </v-col>
        </v-row>
        <ItemPreview :item="expandedItem" @close="expandedId = null" />
        <ItemForm :show="showForm" :item="activeItem" @close="onClose" />
      </v-flex>

      <!-- table view mode-->
      <v-flex v-else>
        <v-card md12 sm12 xs12>
          <v-flex>
            <v-data-table :headers="headers" :items="myItems" :search="search">
              <template v-slot:[`item.createdAt`]="{ item }">
                <span>{{ formatDateToString(item.createdAt) }} {{ item.createdAt }}</span>
              </template>
              <template v-slot:[`item.images`]="{ item }">
                <v-avatar tile>
                  <v-img :src="item.images[0].url"/>
                </v-avatar>
              </template>
            </v-data-table>
          </v-flex>
        </v-card>
      </v-flex>
    </v-flex>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from '@/views/BaseTemplate.vue';
import ItemCard from '@/components/ItemCard.vue';
import ItemPreview from '@/components/ItemPreview';
import ItemForm from '@/components/ItemForm.vue';
import _ from 'lodash'
import MY_ITEMS from '@/gql/myItems.graphql';
import {DateFormat} from '@/mixins/DateFormat'
import gql from "graphql-tag";

export default {
  name: "MyItems",
  mixins:[ DateFormat ],
  apollo: {
    myItems: {
      query: MY_ITEMS,
      variables: {
        page: 0,
      },
    }
  },
  components: {
    BaseTemplate,
    ItemCard,
    ItemPreview,
    ItemForm,

  },
  methods: {
    searchItems() {
      if (!this.search) return this.myItems;
      const searchKeys = ['title', 'price', 'description', 'categoryName'];
      const searchString = this.search.toLowerCase();
      return this.myItems.filter(item => {
        for (let key of searchKeys) {
          let item_prop = _.get(item, key, '')
          if (item_prop.toString().toLowerCase().includes(searchString)) return true
        }
      })
    },

    getItemById(id) {
      return this.myItems && this.myItems.find(i => i.id === id)
    },
    loadMore() {
      console.warn(this);
      this.page++
      this.$apollo.queries.myItems.fetchMore({
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
    onEditItem(itemId) {
      this.activeItem = this.getItemById(itemId);
      this.showForm = true;
    },
    onClose() {
      this.activeItem = null;
      this.showForm = false;
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
  computed:{
    loading() {
      return this.$apolloData.queries.lastItems.loading;
    },
    expandedItem() {
      return this.getItemById(this.expandedId);
    }
  },
  data() {
    return {
      showForm: false,
      activeItem:null,
      expandedId: null,
      view_mode: 'tab',
      search: '',
      headers: [
        {
          text: 'фото',
          value: 'images',
          align: 'center'
        },
        {
          text: 'название товара',
          value: 'title',
          align: 'center'
        },
        {
          text: 'описание',
          value: 'description',
          align: 'center'
        },
        {
          text: 'цена',
          value: 'price',
          align: 'center'
        },
        {
          text: 'категория',
          value: 'categoryName',
          align: 'center'
        },
        {
          text: 'дата добавления',
          value: 'createdAt',
          align: 'center'
        },
        {
          text: 'дата обновления',
          value: 'updatedAt',
          align: 'center'
        },
        {
          text: 'просмотры',
          value: 'views',
          align: 'center'
        },
        {
          text: 'продажи',
          value: 'sales',
          align: 'center',
        },
      ],
    }
  },
};
</script>

<style scoped>
.fab-container {
  position: fixed;
  top: 80px;
  right: 12px;
  z-index: 1;
}
</style>
