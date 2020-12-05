<template>
  <div class="cart">
    <v-badge
      offset-x="10"
      offset-y="33"
      :color="cartQuantity > 0 ? 'primary' : 'grey'"
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
    <span class="user-menu" v-if="drawer">
      <v-row align="center">
        <v-col class="px-2 pt-0">
          <span class="name">Ваша корзина</span>
        </v-col>
      </v-row>
      <div class="menu-block" v-if="drawer">
        <span v-for="(item, i) in profile_menu" :key="i">
          <v-divider
            v-if="item.divider"
            class="my-1 mx-auto"
            inset
          ></v-divider>
          <v-list-item
            v-else
            dense
            class="pa-0"
            link
            :to="item.href"
          >
            <v-list-item-content class="py-1">
              <v-list-item-title class="grey--text">
                <v-icon class="px-1">{{ item.icon }}</v-icon>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </span>
      </div>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data: () => ({
    drawer: false,
    cartQuantity: 999,
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
  .user-menu {
    min-width: 170px;
    padding: 5px;
    position: absolute;
    right: 19px;
    top: 4px;
    background: white;
    border: 1px solid #EEE;
    border-radius: 5px 8px 5px 5px;
    .name {
      font-size: 12px;
      line-height: 14px;
      display: block;
      padding: 5px 40px 0px 8px;
      border-bottom: 1px dashed silver;
      color: gray;
      min-height: 40px;
    }
  }
}
</style>
