<template>
  <BaseTemplate>
    <v-flex style="margin-top:50px;">
      <!-- fixed view_mode buttons -->
      <v-layout column class="fab-container">
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
        <v-card md12 sm12 xs12 class="mb-2" v-for="(item) in searchItems()" :key="item.id">
          <v-card-title style="background-color:#ffc107;">
            <h2>{{ item.categoryName }} > {{ item.title }}</h2>
          </v-card-title>
          <!-- tile view mode-->
          <v-layout wrap>
            <v-flex lg4 md4 sm12 xs12 style="width:300px;padding: 10px">
              <v-carousel hide-delimiters height="300">
                <v-carousel-item v-for="(image) in item.images" :key="image.id" :src="image.url">
                </v-carousel-item>
              </v-carousel>
              <p >цена: {{ item.price }} сом</p>
              <v-layout wrap>
                <v-flex lg6 md6 sm6 xs6>
                  <p>создан: {{ formatDateToString(item.createdAt) }} </p>
                </v-flex>
                <v-flex v-if="item.updatedAt" lg6 md6 sm6 xs6>
                  <p >изменен: {{ formatDateToString(item.updatedAt) }}  </p>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex lg6 md6 sm6 xs6>
                  <p>просмотры: {{ item.views }}  </p>
                </v-flex>
                <v-flex lg6 md6 sm6 xs6>
                  <p>продажи: {{ item.sales }}  </p>
                </v-flex>
              </v-layout>


            </v-flex>
            <v-flex lg6 md6 sm12 xs12 class="ml-5">
              <div>
                <p>описание: <br> {{ item.description }}
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse, expedita incidunt necessitatibus nulla perspiciatis qui totam ullam unde veritatis voluptatibus. Alias aspernatur eum ipsam libero, minima odio quae? Aliquid assumenda corporis culpa, ex explicabo facere facilis inventore iusto necessitatibus, officia praesentium quibusdam. Delectus, dignissimos dolorem eaque harum hic ipsa ipsam iusto labore laborum minus molestiae nisi odit quaerat quis reiciendis saepe suscipit temporibus, voluptatum! Accusantium adipisci corporis, cumque dicta dignissimos dolores ducimus eligendi et fuga ipsa numquam omnis, quaerat quis quo rerum temporibus vitae! Ab adipisci animi aperiam commodi culpa debitis enim est expedita explicabo id iusto laudantium minima molestias nam neque nostrum obcaecati pariatur placeat quae quidem, sapiente sint ullam! Accusamus architecto ea illum, ipsam iusto magnam nobis qui!
                </p>

              </div>
            </v-flex>
          </v-layout>
          <v-card-actions style="background-color:#85360f"></v-card-actions>
        </v-card>
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
import _ from 'lodash'
import MY_ITEMS from '@/gql/myItems.graphql';
import {DateFormat} from '@/mixins/DateFormat'

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
  },
  data() {
    return {
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
  z-index: 7;
}
</style>
