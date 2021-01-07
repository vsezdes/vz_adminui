<template>
  <v-card>
    <v-card-title>Подробности заказа №{{ id }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text style="height: 300px;">
      <v-data-iterator
        :items="items"
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
      <v-alert border="left" type="info" outlined dense class="ml-4 mt-4">
        Сумма заказа: <strong>{{ total }}</strong>
      </v-alert>
      <v-spacer></v-spacer>
      <v-btn
        color="green darken-1"
        class="mr-4"
        outlined
        text
        @click="$emit('close')"
      >
        Ok
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'OrderItems',
  props: ['id', 'itemQuantity', 'items', 'price', 'total'],
  methods: {
    getQuantity(id) {
      if (id && this.itemQuantity) {
        return this.itemQuantity.find(i => i.itemId === id).quantity;
      }
      return 0;
    }
  }
}
</script>
