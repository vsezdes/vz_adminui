<template>
  <BaseTemplate>
    <v-layout justify-center wrap>
      <v-flex md10 sm10 xs10>
        <v-layout wrap justify-space-between>
          <v-flex md3 sm10 xs12>
            <v-select
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
              v-model="selected_user"
              :items="allUsers"
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
      </v-flex>
      <v-flex md sm10>
        <v-data-table
          :headers="order_headers"
          :items="filteredOrders"
          :items-per-page="999999"
          item-key="id"
          hide-default-footer
          :single-expand="expand"
          :expanded.sync="expanded"
          class="elevation-1"
          show-expand
          :calculate-widths='true'
        >
<!--          Преобразование формата created -->
          <template v-slot:item.created="{ item }">
            <span>{{ formatDateToString(item.created) }}</span>
          </template>
          <!--      Вставка таблицы в таблицу -->
          <template  v-slot:expanded-item="{ headers , item}">
            <td v-if="item.items" :colspan="headers.length">
              <v-data-table
                hide-default-footer
                class="amber lighten-2"
                :items="item.items"
                :headers="item_headers"></v-data-table>
            </td>
          </template>
          <!--      Определение количества товара -->
          <template  v-slot:item.items="{ item }">
            <v-flex v-if="item.items">
              {{ item.items.length }}
            </v-flex>
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
      </v-flex>
    </v-layout>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from "./BaseTemplate";
import ALL_ORDERS from '@/gql/orders.graphql';
import { DateFormat } from '@/mixins/DateFormat'

export default {
  name: "Orders",
  apollo: {
    orders: ALL_ORDERS,
  },
  mixins:[ DateFormat ],
  data() {
    return {
      expanded: [],
      expand: false,
      selected_user: null,
      selected_status: 'all',
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
        {text: 'статус', value: 'status'},
        {text: 'товары', value: 'items'},
        {text: 'Пользователь', value: 'user.fullName'},
        {text: 'описание', value: 'details', width: '255px'},
        {text: 'сумма', value: 'total'},
        {text: 'дата', value: 'created'},
        {text: '', value: 'data-table-expand'},
      ],
      item_headers: [
        {text: 'название товара', value: 'title'},
        {text: 'сумма', value: 'price'},
        {text: 'количество', value: 'quantity'},
      ],
    };
  },
  components: {
    BaseTemplate
  },
  beforeMount() {
    this.selected_user = this.allUsers[0]
  },
  computed: {
    allUsers() {
      let all_users = []
      let i = 0;
      if (this.orders) {
        for (i = 0; i < this.orders.length; i++) {
          let order = this.orders[i];
          if (!all_users.includes(order.user)) {
            order.user.fullName = order.user.firstName + ' ' + order.user.lastName
            all_users.push(order.user)
          }
        }
      }
      return all_users
    },
    filteredOrders() {
      let user = this.selected_user

      return this.orders && this.orders.filter((obj) => {
        if (user != null) {
          return obj.user.id === user.id && (obj.status === this.selected_status || this.selected_status === 'all')
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
