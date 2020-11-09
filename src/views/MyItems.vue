<template>
  <BaseTemplate>
    <v-flex style="margin-top:50px;">
      <!-- fixed view_mode buttons -->
      <v-layout column class="fab-container">
        <v-btn-toggle right v-model="view_mode">
          <v-btn dark fab color="pink">
            <v-icon>mdi-card-bulleted-outline</v-icon>
          </v-btn>
          <v-btn dark fab color="pink">
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

      <v-flex v-if="view_mode===0">
        <v-card md12 sm12 xs12 class="mb-2" v-for="(item) in searchItems()" :key="item.id">
          <v-card-title style="background-color:#ffc107;">
            <h2>{{ item.category.title }} > {{ item.title }}</h2>
          </v-card-title>
          <!-- tile view mode-->
          <v-layout wrap>
            <v-flex lg4 md4 sm12 xs12 style="height:300px;width:300px">
              <v-carousel hide-delimiters height="300">
                <v-carousel-item v-for="(image) in item.images" :key="image.id" :src="image.url">
                </v-carousel-item>
              </v-carousel>
            </v-flex>
            <v-flex lg6 md6 sm12 xs12 class="ml-5">
              <div>
                <br>
                <p style="font-weight:600"> {{ item.price }} сом</p>
                <p> {{ item.description }}</p>
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
            <v-data-table :headers="headers" :items="lastItems" :search="search">
              <template v-slot:item.joined="{ item }">
                <span>{{ formatDateToString(item.joined) }}</span>
              </template>
              <template v-slot:item.images="{ item }">
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

<style scoped>
.fab-container {
  position: fixed;
  top: 80px;
  right: 12px;
  z-index: 7;
}
</style>

<script>
import BaseTemplate from '@/views/BaseTemplate.vue';
import _ from 'lodash'

export default {
  components: {
    BaseTemplate,
  },
  methods: {
    filteredItems() {
      if (!this.search) return this.lastItems;
      const searchString = this.search.toLowerCase();
      return this.lastItems.filter(item =>
        item.title && item.title.toLowerCase.includes(searchString)
      );
    },
    searchItems() {
      if (!this.search) return this.lastItems;

      const searchKeys = ['title', 'price', 'description', 'category.title'];
      const searchString = this.search.toLowerCase();

      return this.lastItems.filter(item => {
        for (let key of searchKeys) {
          let item_prop = _.get(item, key, '')
          if (item_prop.toString().toLowerCase().includes(searchString)) return true
        }
      })

    },
  }
  ,
  data() {
    return {
      view_mode: 0,
      search: '',
      headers: [{
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
          value: 'category.title',
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
      lastItems: [{
        'id': 1,
        'title': 'qwqwe',
        'price': 123,
        'images': [{
          id: 1,
          url: 'http://res.cloudinary.com/vsetut2020/image/upload/v1602004291/images_f3aewp.jpg'
        },

          {
            id: 3,
            url: 'http://res.cloudinary.com/vsetut2020/image/upload/v1602010672/images_t7rhjy.jpg'
          },
        ],
        'category': {title: 'игрушки'},
        'description': 'blabla'
      },
        {
          'id': 2,
          'title': 'qwqwe',
          'price': 123,
          'images': [{
            id: 1,
            url: 'http://res.cloudinary.com/vsetut2020/image/upload/v1602004291/images_f3aewp.jpg'
          },

            {
              id: 3,
              url: 'http://res.cloudinary.com/vsetut2020/image/upload/v1602010672/images_t7rhjy.jpg'
            },
          ],
          'category': {title: 'продукты'},
          'description': 'У нас работают много людей, у которых можно многому поучиться, например ребята умеют строить PCI-DSS Compliant инфраструктуру, уделяют время документации и в целом инженерная культура на высоком уровне. От настроенных пайплайнов до нужной документации на архитектуру и код.'
        }
      ],
    }
  },

};
</script>
