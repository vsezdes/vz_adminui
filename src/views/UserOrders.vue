<template>
  <BaseTemplate>
  <v-sheet max-width="1400">
    <div class="text-h2 my-3">Мои заказы</div>
    <v-divider class="mb-10"/>
    <v-tabs
      v-model="tab"
      background-color="gray accent-1"
      icons-and-text
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        Все
        <v-icon>mdi-order-bool-ascending-variant</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        Открытые
        <v-icon>mdi-progress-clock</v-icon>
      </v-tab>

      <v-tab href="#tab-3">
        Завершенные
        <v-icon>mdi-check</v-icon>
      </v-tab>
    </v-tabs>
    <v-data-table
      :items="filteredOrders"
      :headers="headers"
      no-data-text="Заказов еще нет"
      sort-by="created"
      sort-desc
    >
      <template v-slot:[`item.created`]="{ item }">
        <span>{{ formatDateToString(item.created) }}</span>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <span class="float-left mt-3">#{{ item.id }}: </span>
        <OrderStatus :status="item.status" class="ml-10" />
      </template>
      <template v-slot:[`item.items`]="{ item }">
        <v-btn small @click="showDetails = item" title="Посмотреть детали заказа">
          {{item.items ? item.items.length : 0}} товаров
          <v-icon size="20" right>mdi-open-in-app</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog scrollable persistent max-width="600" attach :value="!!showDetails">
      <OrderItems v-bind="showDetails" @close="showDetails = null"/>
    </v-dialog>
  </v-sheet>
  </BaseTemplate>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import BaseTemplate from './BaseTemplate';
import OrderStatus from '@/components/OrderStatus';
import OrderItems from '@/components/OrderItems';
import {DateFormat} from '@/mixins/DateFormat'

export default {
  name: 'UserOrders',
  mixins:[ DateFormat ],
  components: {
    BaseTemplate,
    OrderStatus,
    OrderItems,
  },
  data: () => ({
    loading: false,
    showDetails: null,
    tab: null,
    headers: [
      { text: 'Статус', value: 'status', align: 'start', width: '220px' },
      { text: 'Добавлен', value: 'created' },
      { text: 'Детали', value: 'details' },
      { text: 'Товары', value: 'items' },
    ],
  }),
  mounted() {
    this.getUserOrders().then(() => this.loading = false);
  },
  computed: {
    ...mapState(['userOrders']),
    filteredOrders() {
      if (this.tab === 'tab-1') {
        return this.userOrders;
      } else if (this.tab === 'tab-2') {
        return this.userOrders.filter(o => o.status > 0);
      } else if (this.tab === 'tab-3') {
        return this.userOrders.filter(o => o.status <= 0);
      }
      return [];
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
