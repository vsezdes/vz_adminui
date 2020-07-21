<template>
  <BaseTemplate>
    <v-row justify-start>
      <v-col md="10" lg="10" offset-md="1">

        <v-layout wrap justify-space-between>
          <v-flex md3 sm10>
            <v-select
                @change="CleanupOrders()"
                :items="status_titles"
                item-text="title"
                item-value="number"
                v-model="selected_status"
                :hint="'Выберите категорию заказа'"
                menu-props="{maxHeight: 404}"
                persistent-hint

            >

            </v-select>
          </v-flex>
          <v-flex md3 sm10>
            <v-select
                @change="CleanupOrders()"
                v-model="selected_user"
                :items="all_users"
                item-text="fullName"
                item-value="id"
                label="Select"
                :hint="'Выберите пользователя'"
                persistent-hint
                return-object
                single-line
            >
            </v-select>
          </v-flex>

        </v-layout>
      </v-col>
      <v-col md="10" lg="10" offset-md="1">

        <v-data-table
            :headers="order_headers"
            :items="CleanupOrders()"
            :items-per-page="999999"
            item-key="id"
            hide-default-footer

            :single-expand="expand"
            :expanded.sync="expanded"
            class="elevation-1"
            show-expand
            :calculate-widths='true'
        >
          <!--      Вставка таблицы в таблицу -->
          <template v-slot:expanded-item="{ headers , item}">
            <td :colspan="headers.length">
              <v-data-table
                  hide-default-footer
                  class="amber lighten-2"
                  :items="item.items"
                  :headers="item_headers"></v-data-table>
            </td>
          </template>
          <!--      Определение количества товара -->
          <template v-slot:item.items="{ item }">
            {{ item.items.length }}
          </template>
          <!--      Определение статуса заказа -->
          <template v-slot:item.status="{ item }">
            <v-chip :color="status_titles.find(obj => {return( obj.number === item.status)}).color">
              {{
                status_titles.find(obj => {
                  return (obj.number === item.status)
                }).title
              }}
            </v-chip>
          </template>
        </v-data-table>
      </v-col>

    </v-row>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from "./BaseTemplate";

export default {
  name: "MyOrders",
  data() {
    return {
      expanded: [],
      expand: false,
      all_users: [],
      selected_user: null,
      selected_status: null,
      status_titles: [
        {title: 'все', number: 'all', color: null},
        {title: 'новый', number: 1, color: 'blue darken-1'},
        {title: 'готовится', number: 2, color: 'lime darken-2'},
        {title: 'доставляется', number: 3, color: 'amber darken-4'},
        {title: 'завершен', number: 0, color: 'light-green accent-4'},
        {title: 'отмена', number: -1, color: 'red'},
        {title: 'возврат', number: -2, color: 'orange accent-4'},
      ],
      order_headers: [
        {text: 'статус', align: 'left', value: 'status'},
        {text: 'товары', value: 'items'},
        {text: 'Пользователь', value: 'user.fullName'},
        {text: 'описание', value: 'details', width: '23px'},
        {text: 'сумма', value: 'total'},
        {text: 'дата', value: 'orderDate'},
        {text: '', value: 'data-table-expand'},

      ],
      item_headers: [
        {text: 'название товара', value: 'title'},
        {text: 'сумма', value: 'price'},
        {text: 'количество', value: 'quantity'},
      ],

      //FAKEDATA
      fakedata: [{
        id: 1,
        orderDate: 'some date',
        status: -2, // статусы описаны ниже
        details: 'asdasdnfdskjfndjfnsdffs' +
            'sdfsdfsdfsdf /n' +
            'sdfsdfsdfsdfs /n' +
            'sdfsdfsdfsdf /n',
        items: [
          {title: 'Tovar1', price: 100, quantity: 1},
          {title: 'Tovar2', price: 200, quantity: 2},
          {title: 'Tovar3', price: 300, quantity: 3},
        ],
        total: 400,
        user: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
        }
      }, {
        id: 2,
        orderDate: 'some date',
        status: -1, // статусы описаны ниже
        details: '',
        items: [
          {title: 'Tovar4', price: 100, quantity: 1},
          {title: 'Tovar5', price: 200, quantity: 2},
          {title: 'Tovar6', price: 300, quantity: 3},
        ],
        total: 400,
        user: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
        }
      }],
    };
  },
  components: {
    BaseTemplate
  },
  beforeMount() {
    this.GetUsers()
    this.selected_status = this.status_titles[0].number
    this.selected_user = this.all_users[0]
  },
  methods: {
    GetUsers() {
      let i = 0;
      for (i = 0; i < this.fakedata.length; i++) {
        var order = this.fakedata[i]
        if (!this.all_users.includes(order.user)) {
          order.user.fullName = order.user.firstName + ' ' + order.user.lastName
          this.all_users.push(order.user)
        }
      }
    },
    CleanupOrders() {
      let user = this.selected_user

      return this.fakedata.filter((obj) => {
        if (user != null) {
          var n = obj.user.id === user.id && obj.status === this.selected_status || this.selected_status === 'all'
          return n
        }
      })
    },
  },
}
</script>

<style scoped>

</style>