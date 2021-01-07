<template>
  <BaseTemplate>
  <v-sheet max-width="1400">
    <div class="text-h2 my-3">Мой кабинет</div>
    <v-divider class="mb-10"/>
    <v-row>
      <v-col>
        <Box title="Мои данные" small-title>
          <p>
            Привет, {{ user.firstName }}!
          </p>
          <p class="my-3">
            Вы указали следующие контактные данные:
          </p>
          <v-sheet color="grey">
            <small>
            <v-list dense>
              <v-list-item dense>
              Телефон: {{ user.phone }}
              </v-list-item>
              <v-list-item dense>
              Почта: {{ user.email }}
              </v-list-item>
              <v-list-item dense>
              Адрес: {{ user.address }}
              </v-list-item>
            </v-list>
            </small>
          </v-sheet>
          <template name="buttons">
            <v-btn to="/profile">Изменить профиль</v-btn>
          </template>
        </Box>
      </v-col>
      <v-col>
        <Box title="Моя корзина" small-title>
          <v-data-table
            disable-sort
            disable-pagination
            disable-filtering
            :hide-default-header="cart.length === 0"
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
          <template name="buttons">
            <v-btn to="/checkout" v-if="cart.length > 0">Оформить заказ</v-btn>
            <v-btn to="/" v-else>Купить что нибудь</v-btn>
          </template>
        </Box>
      </v-col>
      <v-col>
        <Box title="Последние заказы" small-title>
          <v-data-table
            :items="pendingOrders"
            :headers="orderHeaders"
            no-data-text="Заказов еще нет"
            sort-by="created"
            sort-desc
            dense
            disable-pagination
            hide-default-footer
          >
            <template v-slot:[`item.created`]="{ item }">
              <span>{{ formatDateToString(item.created) }}</span>
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <OrderStatus :status="item.status" />
            </template>
            <template v-slot:[`item.items`]="{ item }">
              <v-btn small @click="showDetails = item" title="Посмотреть детали заказа">
                {{item.items ? item.items.length : 0}} товаров
                <v-icon size="20" right>mdi-open-in-app</v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <template name="buttons">
            <v-btn to="/user/orders" :disabled="userOrders.length < 1">Перейти к заказам</v-btn>
          </template>
        </Box>
      </v-col>
    </v-row>
    <v-dialog scrollable persistent max-width="600" attach :value="!!showDetails">
      <OrderItems v-bind="showDetails" @close="showDetails = null"/>
    </v-dialog>
  </v-sheet>
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
      { text: 'Статус', value: 'status', align: 'start', width: '220px' },
      { text: 'Добавлен', value: 'created' },
      { text: 'Товары', value: 'items' },
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
