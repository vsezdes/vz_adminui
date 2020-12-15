<template>
  <v-card v-if="order">
    <v-card-title>Подробности заказа №{{ order.id }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text style="height: 300px;">
      <v-data-iterator
        :items="order.items"
        :disable-pagination="true"
        item-key="id"
        hide-default-footer
      >
        <template v-slot:item="{ item }">
          <v-card class="pa-0 mt-1" outlined elevation="1">
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-subtitle>{{ getQuantity(item.id) }} штук по {{ item.price }} на сумму {{ getQuantity(item.id)*item.price }}</v-card-subtitle>
          </v-card>
        </template>
      </v-data-iterator>

    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-container>
      <v-row>
        <v-col cols="12" class="pt-0" v-if="preCancel">
          <v-textarea
            class="mt-0 pt-0"
            label="Опишите причину отмены"
            rows="2"
          />
        </v-col>
        <v-col cols="4" class="pt-0">
          <span :style="{ position: 'relative', top: '2px' }">
            <OrderStatus v-if="order.status !== undefined" :status="order.status" />
          </span>
        </v-col>
        <v-col class="pt-0">
          <span v-if="!preCancel">
            <v-btn v-if="orderStatus === 1" small class="mt-1 ml-2 float-right"
              color="success"
              @click="setStatus(2)"
            >
              <v-icon left>mdi-progress-clock</v-icon>
              В обработку
            </v-btn>
            <v-btn v-else-if="orderStatus === 2" small class="mt-1 ml-2 float-right"
              color="success"
              @click="setStatus(3)"
            >
              <v-icon left>mdi-truck-delivery</v-icon>
              На доставку
            </v-btn>
            <v-btn v-else-if="orderStatus === 3" small class="mt-1 ml-2 float-right"
              color="success"
              @click="setStatus(0)"
            >
              <v-icon left>mdi-check-outline</v-icon>
              Выполнен
            </v-btn>
          </span>
          <span v-else>
            <v-btn small class="mt-1 ml-2 float-right" @click="preCancel = false">Назад</v-btn>
          </span>
          <v-btn
            small
            class="mt-1 float-right"
            :color="preCancel ? 'error' : 'warning'"
            v-if="orderStatus > 0"
            @click="preCancel ? setCancelStatus() : preCancel = true"
          >
            <v-icon left>mdi-cancel</v-icon>
            {{ !preCancel ? 'В отмененные' : 'Да, отменить' }}
          </v-btn>
        </v-col>
        <v-col cols="12" class="pt-0">
          <v-divider />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0">
          <span border="left" type="info" outlined dense class="ml-4 mt-4">
            Сумма заказа: <strong>{{ order.total }}</strong>
          </span>
          <v-btn
            color="green darken-1"
            class="mr-4 float-right"
            outlined
            text
            @click="$emit('close')"
          >
            Ok
          </v-btn>
        </v-col>
      </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
import OrderStatus from '@/components/OrderStatus';
import { mapActions } from 'vuex';
export default {
  name: 'OrderDetails',
  components: {
    OrderStatus
  },
  props: ['order'],
  data: () => ({
    preCancel: false,
    loading: false,
  }),
  computed: {
    orderStatus() {
      return +this.order.status;
    }
  },
  methods: {
    ...mapActions(['setOrderStatus']),
    setCancelStatus() {
      this.preCancel = false;
      this.setOrderStatus({
        order: this.order.id,
        status: -1,
        comment: this.cancelComment
      }).then(() => this.loading = false);
    },
    setStatus(status) {
      this.loading = true;
      this.setOrderStatus({
        order: this.order.id,
        status
      }).then(() => this.loading = false);
    },
    getQuantity(id) {
      if (id && this.order) {
        return this.order.itemQuantity.find(i => i.itemId === id).quantity;
      }
      return 0;
    }
  }
}
</script>
