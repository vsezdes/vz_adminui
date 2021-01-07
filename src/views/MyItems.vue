<template>
  <BaseTemplate title="Мои товары">
    <v-btn
      large right absolute top icon
      @click="showForm = !showForm" :loading="loading"
      color="primary" outlined
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-sheet>
      <v-row justify="space-between">
        <v-col cols="auto">
          <v-btn-toggle v-model="viewMode">
            <v-btn value="tab" title="Вид карточками" height="35">
              <v-icon size=20>mdi-card-bulleted-outline</v-icon>
            </v-btn>
            <v-btn value="table" title="Табличный вид" height="35">
              <v-icon size="20">mdi-table-large</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="auto">
          <v-text-field
            class="mt-0 pt-0"
            v-model="search"
            append-icon="mdi-magnify"
            label="Поиск по всем полям" single-line
            hide-details
          />
        </v-col>
      </v-row>
    </v-sheet>
    <ItemPreview :item="expandedItem" @close="expandedId = null"/>
    <ItemForm :show="showForm" :item="activeItem" @close="onClose"/>

    <v-flex v-if="viewMode==='tab'">
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
            @on-delete="onDelete"
            @on-expand="expandedId = $event"
          />
        </v-col>
      </v-row>
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
            <template v-slot:[`item.actions`]="{ item }">
              <div class="item-controls">
                <v-btn icon @click="onEditItem(item.id)">
                  <v-icon>mdi-lead-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="onDelete(item.id)">
                  <v-icon>mdi-delete-forever-outline</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-flex>
      </v-card>
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
  computed: {
    loading() {
      return this.$apolloData.queries.myItems.loading;
    },
    expandedItem() {
      return this.getItemById(this.expandedId);
    },
    items() {
      const s = this.categoryItems || this.myItems;
      console.error(s, this.categoryItems, this.myItems);
      return s;
    }

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
    onClose() {
      this.activeItem = null;
      this.showForm = false;
    },
    getItemById(id) {
      return this.myItems && this.myItems.find(i => i.id === id)
    },
    update(id){
      let store = this.$store
      const data = MY_ITEMS ;
      if (!id) return;

      const myItems = data.values().filter(i => i.id !== id);
      store.writeQuery({ query: MY_ITEMS, data: { myItems } });
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
        this.myItems.pop(this.myItems.find(i => i.id === id))

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
      this.$apollo.queries.myItems.fetchMore({
        // New variables
        variables: {
          page: this.page,
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newItems = fetchMoreResult.myItems;
          this.showLoadMore = (previousResult.myItems.length / this.page) === newItems.length;
          return {
            myItems: [
              // Merging the tag list
              ...previousResult.myItems, ...newItems,
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
  data() {
    return {
      showForm: false,
      activeItem:null,
      expandedId: null,
      viewMode: 'tab',
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
        // {
        //   text: 'дата добавления',
        //   value: 'createdAt',
        //   align: 'center'
        // },
        // {
        //   text: 'дата обновления',
        //   value: 'updatedAt',
        //   align: 'center'
        // },
        // {
        //   text: 'просмотры',
        //   value: 'views',
        //   align: 'center'
        // },
        // {
        //   text: 'продажи',
        //   value: 'sales',
        //   align: 'center',
        // },
        {
          text: 'действия',
          value: 'actions',
          align: 'center'
        },
      ],
    }
  },
};
</script>
