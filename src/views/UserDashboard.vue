<template>
  <BaseTemplate title="Мой кабинет">
    <v-row>
      <v-col>
        <Box title="Мои данные">
          <small>
          Привет, {{ user.firstName }}!
          <p class="my-1">
            Ваши контактные данные:
          </p>
          </small>
          <v-sheet color="grey lighten-3" class="pa-2" rounded outlined>
            <small>
              Телефон: <strong> {{ user.phone }} </strong> <br />
              Почта: <strong> {{ user.email }} </strong> <br />
              Адрес: <strong> {{ user.address }} </strong> <br />
            </small>
          </v-sheet>
          <template v-slot:buttons>
            <v-btn small color="primary" outlined to="/profile">Изменить профиль</v-btn>
          </template>
        </Box>
      </v-col>
      <v-col>
        <Box title="Моя корзина">
          <v-data-table
            disable-sort
            disable-pagination
            disable-filtering
            :hide-default-header="true"
            hide-default-footer
            dense
            :headers="cartHeaders"
            :items="cart"
            item-key="name"
            class="elevation-0"
          >
            <template slot="no-data">
              <div>
                Добавьте товары в корзину
              </div>
            </template>
          </v-data-table>
          <template v-slot:buttons>
            <v-btn small color="primary" to="/checkout" v-if="cart.length > 0">Оформить заказ</v-btn>
            <v-btn small outlined to="/" v-else>Купить что нибудь</v-btn>
          </template>
        </Box>
      </v-col>
      <v-col>
        <Box title="Последние заказы">
          <v-data-table
            :items="pendingOrders"
            :headers="orderHeaders"
            no-data-text="Заказов еще нет"
            dense
            disable-pagination
            disable-sort
            hide-default-footer
            hide-default-header
          >
            <template v-slot:[`item.created`]="{ item }">
              <small :style="{ whiteSpace: 'nowrap' }">{{ formatDateToString(item.created) }}</small>
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <OrderStatus :status="item.status" :small="true"/>
            </template>
            <template v-slot:[`item.items`]="{ item }">
              <v-btn x-small outlined color="green" @click="showDetails = item" title="Посмотреть детали заказа">
                {{item.items ? item.items.length : 0}} товаров
                <v-icon size="20" right>mdi-open-in-app</v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <template v-slot:buttons>
            <v-btn small color="secondary" outlined to="/user/orders" :disabled="userOrders.length < 1">Перейти к заказам</v-btn>
          </template>
        </Box>
      </v-col>
    </v-row>
    <v-dialog scrollable persistent max-width="600" attach :value="!!showDetails">
      <OrderItems v-bind="showDetails" @close="showDetails = null"/>
    </v-dialog>
  </BaseTemplate>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import BaseTemplate from './BaseTemplate';
import Box from '@/components/Box';
import OrderStatus from '@/components/OrderStatus';
import OrderItems from '@/components/OrderItems';
import {DateFormat} from '@/mixins/DateFormat'

export default {
  name: 'UserDashboard',
  mixins:[ DateFormat ],
  components: {
    BaseTemplate,
    OrderStatus,
    OrderItems,
    Box,
  },
  data: () => ({
    loading: false,
    showDetails: null,
    tab: null,
    orderHeaders: [
      { value: 'status', align: 'start', width: '180px' },
      { value: 'created' },
      { value: 'items' },
    ],
    cartHeaders: [
      {
        text: 'Товар',
        align: 'start',
        sortable: false,
        class: 'cart-item-title',
        value: 'title',
      },
      { text: 'Цена', value: 'price' },
      { text: 'Кол-во', value: 'quantity', width: '75px', align: 'center' },
    ],
  }),
  mounted() {
    this.getUserOrders().then(() => this.loading = false);
  },
  computed: {
    ...mapState(['userOrders', 'cart', 'user']),
    pendingOrders() {
      const filtered = this.userOrders.filter(o => o.status > 0);
      return filtered.slice(Math.max(filtered.length - 5, 0));
    },
  },
  methods: {
    ...mapActions(['getUserOrders']),
    getQuantity(id) {
      if (id && this.showDetails) {
        return this.showDetails.itemQuantity.find(i => i.itemId === id).quantity;
      }
      return 0;
    }
  }
}
</script>
