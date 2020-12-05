<template>
  <div class="cart">
    <v-badge
      offset-x="10"
      offset-y="33"
      :color="cartQuantity > 0 ? 'primary' : 'grey'"
      :style="{ position: 'relative', zIndex: '20' }"
    >
      <v-btn
        slot="badge" icon text
        @click="drawer = !drawer"
        x-small absolute class="badge-btn"
      >
        <v-icon v-if="drawer">mdi-close</v-icon>
        <span v-else> {{cartQuantity }} </span>

      </v-btn>
      <v-btn
        icon
        color="primary"
        :style="{ background: 'white' }"
        outlined
        @click="drawer = !drawer"
      >
        <v-icon>mdi-cart</v-icon>
      </v-btn>
    </v-badge>
    <span class="user-cart" v-if="drawer">
      <v-row align="center">
        <v-col class="px-2 pt-0">
          <span class="name">
            Ваша корзина<br/>
            <div class="pt-1"><small>{{ cartQuantity }} товаров/а</small></div>
          </span>
        </v-col>
      </v-row>
      <div class="cart-items" v-if="drawer">
        <v-data-table
          disable-sort
          disable-pagination
          disable-filtering
          :hide-default-header="cart.length === 0"
          hide-default-footer
          dense
          :headers="headers"
          :items="cart"
          item-key="name"
          class="elevation-0"
        >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-close
          </v-icon>
        </template>
          <template slot="no-data">
            <div>
              Добавьте товары в корзину
            </div>
          </template>
        </v-data-table>
        <template v-if="cartTotal > 0">
          <v-divider />
          <div class="text-right total"> Итого: {{ cartTotal }} </div>
          <v-divider />
        </template>
        <v-btn
          :disabled="cart.length === 0"
          text x-small color="error" class="mt-3"
          @click="onEmptyCart"
        >
          Очистить корзину
        </v-btn>
        <v-btn
          :disabled="cart.length === 0"
          color="primary"
          x-small
          class="mt-3 float-right"
        >
          Оформить заказ
          <v-icon
            right
            size="16"
            dark
          >
            mdi-cart
          </v-icon>
        </v-btn>
      </div>
    </span>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  name: 'Cart',
  data: () => ({
    drawer: false,
    headers: [
      {
        text: 'Товар',
        align: 'start',
        sortable: false,
        value: 'title',
      },
      { text: 'Цена', value: 'price' },
      { text: 'Кол-во', value: 'quantity', align: 'center' },
      { text: '', value: 'actions', align: 'right', sortable: false },
    ],
  }),
  computed: {
    ...mapState(['cart']),
    cartQuantity() {
      return this.cart.length;
    },
    cartTotal() {
      let total = 0;
      this.cart.forEach(i => {
        total = total + i.price * i.quantity;
      })
      return total;
    }
  },
  methods: {
    ...mapActions(['deleteFromCart', 'emptyCart']),
    onEmptyCart() {
      if (window.confirm(`Удалить все товары из корзины?`)) {
        this.emptyCart();
      }
    },
    onDeleteItem(item) {
      if (window.confirm(`Удалить товар ${item.title} из корзины?`)) {
        this.deleteFromCart(item);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.badge-btn {
  left: 0px;
  top: 0px;
  font-size: 10px !important;
  letter-spacing: 0px;
  font-weight: bold;
  color: #fafafa !important;
  .v-icon {
    font-size: 14px !important;
  }
}
.cart {
  padding: 0px 15px 0px 5px;
  position: relative;
  .user-cart {
    min-width: 300px;
    padding: 5px;
    position: absolute;
    right: 5px;
    top: -1px;
    background: white;
    border: 1px solid #EEE;
    border-radius: 5px 8px 5px 5px;
    z-index: 10;
    .name {
      font-size: 16px;
      line-height: 14px;
      display: block;
      padding: 5px 40px 0px 8px;
      border-bottom: 1px dashed silver;
      color: gray;
      min-height: 45px;
    }
  }
  .total {
    padding: 2px 10px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }
}
</style>
