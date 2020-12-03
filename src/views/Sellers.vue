<template>
  <BaseTemplate>
    <AddSeller @close="onClose" :dialog="sellerForm"></AddSeller>
    <v-layout wrap style="margin-top: 50px" justify-end>
      <v-flex md1 sm1>
        <v-btn
          top
          right
          fab
          fixed
          :style="{ top: '80px' }"
          color="success"
          @click="sellerForm = true"
        >
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-flex>
      <v-flex md12 sm12 xs12>

        <v-col>
          <v-card>
            <v-card-title>
              Все поставщики
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Поиск по всем полям"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="sellers"
              :search="search"
              show-expand
              :items-per-page="9999"
              :expanded="expanded"
              :single-expand="false"
              @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
              :item-key="id"
              hide-default-footer
            >
<!--              <template v-slot:item.data-table-expand="{ item }" >-->
<!--                <v-icon  v-if="item.items.length>0" class="v-data-table__expand-icon v-icon&#45;&#45;link mdi mdi-chevron-down"></v-icon>{{ item.items.length }}-->
<!--              </template>-->
              <template v-slot:item.joined="{ item }" >
                <span>{{ formatDateToString(item.joined) }}</span>
              </template>
              <template v-slot:[`item.avatar`]="{ item }">
                <v-avatar tile>
                  <v-img v-if="item.avatar" :src="item.avatar"/>
                  <v-icon v-else>mdi-account</v-icon>
                </v-avatar>
              </template>

              <template  v-slot:expanded-item="{ headers, item }"  >
                <td  style="padding: 5px" :colspan="headers.length" v-show="item.items.length > 0"
                >

                  <v-data-table
                    style="padding: 2px"
                    :align="'center'"
                    justify-center
                    class="text-center"
                    dense
                    id="order_items_table"
                    item-key="item.id"
                    :items="item.items"
                    :headers="item_headers"
                    :items-per-page="9999"
                    hide-default-footer>
                    <template  v-slot:item.images="{ item }">
                      <v-avatar tile >
                        <v-img v-if="item.images" :src="item.images[0].url"/>
                        <v-icon v-else>mdi-account</v-icon>
                      </v-avatar>
                    </template>
                  </v-data-table>
                </td>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-flex>
    </v-layout>
  </BaseTemplate>
</template>

<script>
import {ALL_SELLERS} from '@/gql/sellers.graphql';
import BaseTemplate from '@/views/BaseTemplate.vue';
import {DateFormat} from '@/mixins/DateFormat'
import {mask} from 'vue-the-mask'
import AddSeller from "@/components/AddSeller";

export default {
  name: "Sellers",
  components: {AddSeller, BaseTemplate},
  mixins: [DateFormat],
  apollo: {
    sellers: ALL_SELLERS,
  },
  directives: {
    mask
  },
  data() {
    return {
      expanded: [],
      sellerForm: false,
      isValid: false,
      loading: false,
      user: {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
      },
      nameRules: [
        v => !!v || '*Это поле обязательно',
        v => (v && v.length >= 3) || 'Введите не менее 3-х символов',
      ],
      emailRules: [
        v => !!v || '*Это поле обязательно',
        v => /.+@.+\..+/.test(v) || 'Указанная вами почта имеет неверный формат',
      ],
      passRules: [
        v => !!v || '*Это поле обязательно',
        v => (v && v.length >= 8) || 'Пароль должен быть длиннее 8-ми символов',
      ],
      phoneRules: [
        v => (v && v.length >= 5) || '*Это поле обязательно',
        v => (v && v.length === 16) || 'Неверный формат номера',
      ],
      search: '',
      headers: [
        {text: 'ID', value: 'id', align: 'start'},
        {text: 'Фото', sortable: false, align: 'start', value: 'avatar',},
        {text: 'Имя', sortable: false, value: 'firstName',},
        {text: 'Фамилия', value: 'lastName'},
        {text: 'Пол', value: 'gender'},
        {text: 'E-mail', value: 'email'},
        {text: 'Телефон', value: 'phone'},
        {text: 'Добавлен', value: 'joined'},
        {text: 'Товары', value: 'data-table-expand',align: "right"},
        {text: '', value: 'items.length',align: "left",width:'1'},

      ],
      item_headers: [
        {text: 'id', value: 'id', align: 'center'},
        {text: 'название товара', value: 'title', align: 'center'},
        {text: 'фото', value: 'images', align: 'center'},
        {text: 'описание', value: 'description', align: 'center'},
        {text: 'цена', value: 'price', align: 'center'},
        // {text: 'категория', value: 'category.id', align: 'center'},
      ],
    }
  },
  methods: {
    onClose() {
      this.sellerForm = false
    },
    onExpand(){

    }
  }
}
</script>

<style scoped>

</style>
