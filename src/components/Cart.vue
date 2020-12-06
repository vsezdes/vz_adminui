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
    <span class="user-cart elevation-1" v-if="drawer">
      <v-row align="center">
        <v-col class="px-2 pt-0">
          <span class="name">
            Ваша корзина<br/>
            <div class="pt-1"><small>{{ cartQuantity }} товаров/а</small></div>
          </span>
        </v-col>
      </v-row>
      <div class="cart-items" v-if="drawer">
        <perfect-scrollbar>
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
              @click="onDeleteItem(item)"
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
        </perfect-scrollbar>
      </div>
      <div class="cart-footer">
        <template v-if="cartTotal > 0">
          <v-divider />
          <div class="text-right total"> Итого: {{ cartTotal }} </div>
          <v-divider />
        </template>
        <v-btn
          :disabled="cart.length === 0"
          text small color="error" class="mt-3 ml-2 mb-1 pa-1 py-4"
          @click="onEmptyCart"
        >
          <v-icon
            size="18"
            class="mx-1 mb-0"
          >
            mdi-cart-remove
          </v-icon>
          Очистить
        </v-btn>
        <v-btn
          :disabled="cart.length === 0"
          color="primary"
          small
          class="py-4 mt-3 mr-3 mb-2 float-right"
          :to="{ name: 'Checkout' }"
        >
          <v-icon
            size="18"
            class="mr-1 mb-1"
          >
            mdi-cart-check
          </v-icon>
          Заказать
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
        class: 'cart-item-title',
        value: 'title',
      },
      { text: 'Цена', value: 'price' },
      { text: 'Кол-во', value: 'quantity', width: '75px', align: 'center' },
      { text: '', value: 'actions', align: 'right', width: '30px', sortable: false },
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

<style lang="scss">
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
    min-width: 320px;
    position: absolute;
    right: 5px;
    top: -1px;
    background: white;
    border: 1px solid #EEE;
    border-radius: 5px 8px 5px 5px;
    z-index: 10;
    .v-data-table {
      .text-start {
        padding: 4px;
        font-size: 12px !important;
        max-height: 50px !important;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .text-right {
        padding: 4px !important;
        button.v-icon:hover {
          color: crimson !important;
        }
      }
    }
    .ps {
      max-height: calc(100vh - 180px);
      padding: 0px 10px;
    }
    .name {
      font-size: 16px;
      line-height: 14px;
      display: block;
      padding: 10px 40px 0px 14px;
      border-bottom: 1px dashed silver;
      color: gray;
      min-height: 50px;
      small {
        font-size: 11px;
      }
    }
  }
  .total {
    padding: 7px 15px 5px;
    font-size: 16px;
    background: #FAFAFA;
    font-weight: bold;
    color: #333;
  }
}
</style>
