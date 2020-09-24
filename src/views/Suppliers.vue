<template>
  <BaseTemplate>
    <AddSupplier @close="onClose" :dialog="supplierForm"></AddSupplier>
    <v-layout wrap style="margin-top: 50px" justify-end>
      <v-flex md1 sm1>
        <v-btn
            top
            right
            fab
            fixed
            :style="{ top: '80px' }"
            color="success"
            @click="supplierForm = true"
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
                :items="users"
                :search="search"
                show-expand
            >
              <template v-slot:item.joined="{ item }">
                <span>{{ formatDateToString(item.joined) }}</span>
              </template>
              <template v-slot:item.avatar="{ item }">
                <v-avatar tile>
                  <v-img :src="item.avatar"/>
                </v-avatar>
              </template>
              <template v-slot:expanded-item="{ headers }">
                <td style="padding: 5px" :colspan="headers.length">
                  <v-data-table
                      style="padding: 2px"
                      :align="'center'"
                      justify-center
                      class="text-center"
                      dense
                      hide-default-footer
                      id="order_items_table"
                      :items="fakeItems"
                      :headers="item_headers"></v-data-table>
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
import {ALL_USERS} from '@/gql/users.graphql';
import BaseTemplate from '@/views/BaseTemplate.vue';
import {DateFormat} from '@/mixins/DateFormat'
import {mask} from 'vue-the-mask'
import AddSupplier from "@/components/AddSupplier";

export default {
  name: "Suppliers",
  components: {AddSupplier, BaseTemplate},
  mixins: [DateFormat],
  apollo: {
    users: ALL_USERS,
  },
  directives: {
    mask
  },
  data() {
    return {
      supplierForm:false,
      isValid: false,
      loading: false,
      user: {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
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
        {
          text: 'Фото',
          sortable: false,
          align: 'start',
          value: 'avatar',
        },
        {
          text: 'Имя',
          sortable: false,
          value: 'firstName',
        },
        {text: 'Фамилия', value: 'lastName'},
        {text: 'E-mail', value: 'email'},
        {text: 'Телефон', value: 'phone'},
        {text: 'Добавлен', value: 'joined'},
        {text: 'Товары', value: 'data-table-expand'},

      ],
      fakeItems: [{title: 'someitem', images: [], description: 'prosto tovar', price: 123, category: ''}],
      item_headers: [
        {text: 'название товара', value: 'title', align: 'center'},
        {text: 'фото', value: 'images', align: 'center'},
        {text: 'описание', value: 'description', align: 'center'},
        {text: 'цена', value: 'price', align: 'center'},
        {text: 'категория', value: 'category', align: 'center'},
      ],
    }
  },
  methods:{
    onClose(){
      this.supplierForm = false
    }
  }
}
</script>

<style scoped>

</style>