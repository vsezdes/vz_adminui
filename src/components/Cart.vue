<template>
  <div class="cart">
    <v-badge
      bottom
      inline
      :content="`${cartQuantity}`"
    >
      <v-btn
        icon
      >
        <v-icon>mdi-cart</v-icon>
      </v-btn>
    </v-badge>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data: () => ({
    cartQuantity: 0,
  })
}
</script>

<style lang="scss" scoped>
.cart {
  border: 1px solid #BBB;
  border-radius: 25px;
  padding: 2px 15px 2px 5px;
  .v-btn {}
}
</style>
