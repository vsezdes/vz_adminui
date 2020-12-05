<template>
  <div class="cart">
    <v-badge
      offset-x="10"
      offset-y="33"
      :color="cartQuantity > 0 ? 'primary' : 'grey'"
      :style="{ position: 'relative', zIndex: '20' }"
    >
      <v-btn slot="badge" icon text x-small absolute class="badge-btn">
        {{ cartQuantity }}
      </v-btn>
      <v-btn
        icon
        color="primary"
        :style="{ background: 'white' }"
        outlined
      >
        <v-icon>mdi-cart</v-icon>
      </v-btn>
    </v-badge>
    <span class="user-cart" v-if="drawer">
      <v-row align="center">
        <v-col class="px-2 pt-0">
          <span class="name">Ваша корзина</span>
        </v-col>
      </v-row>
      <div class="cart-items" v-if="drawer">
        <v-data-table
          disable-sort
          disable-pagination
          disable-filtering
          hide-default-header
          hide-default-footer
          dense
          :headers="headers"
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
        <v-btn
          :disabled="cart.length === 0"
          color="primary"
          small
          class="mt-3 float-right"
        >
          Оформить заказ
          <v-icon
            right
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
export default {
  name: 'Cart',
  data: () => ({
    drawer: true,
    cartQuantity: 0,
    cart: [
      // {
      //   id: 1,
      //   title: 'Test',
      //   price: 1000,
      //   quantity: 5,
      // },
      // {
      //   id: 2,
      //   title: 'Test',
      //   price: 1000,
      //   quantity: 5,
      // }
    ],
    headers: [
      {
        text: 'Товар',
        align: 'start',
        sortable: false,
        value: 'title',
      },
      { text: 'Цена', value: 'price' },
      { text: 'Кол-во', value: 'quantity' },
    ],
  })
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
  &.v-btn--text.v-size--x-small {
    .v-btn__content {
    }
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
}
</style>
