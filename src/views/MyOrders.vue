<template>
  <BaseTemplate>
    <v-tabs>
      <v-tab>Все</v-tab>
      <v-tab-item>
        все
        <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            hide-default-footer
            :items-per-page=10
        >
        </v-data-table>
      </v-tab-item>
      <v-tab>Отмененные</v-tab>
      <v-tab-item>
          отмена
          <v-data-table
              :headers="headers"
              :items="GetItems(-1)"
              :search="search"
              hide-default-footer
              :items-per-page=10
          >
          </v-data-table>
      </v-tab-item>

      <v-tab>Возврат</v-tab>
      <v-tab-item>
        возврат
        <v-data-table
            :headers="headers"
            :items="GetItems(-2)"
            :search="search"
            hide-default-footer
            :items-per-page=10
        >
        </v-data-table>
      </v-tab-item>
    </v-tabs>

  </BaseTemplate>
</template>

<script>
import BaseTemplate from "./BaseTemplate";

export default {
  name: "MyOrders",
  data() {
    return {
      headers: [
        {text: 'название товара', value: 'title'},
        {text: 'сумма', value: 'price'},
        {text: 'количество', value: 'quantity'},
      ],

      //FAKEDATA
      id: 1,
      orderDate: 'some date',
      status: 1, // статусы описаны ниже
      details: '',
      items: [
        {title: 'Tovar1', price: 100, quantity: 1,status: -2},
        {title: 'Tovar2', price: 200, quantity: 2,status: 2},
        {title: 'Tovar3', price: 300, quantity: 3,status:-1},
      ],
      total: 400,
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
      ORDER_STATUS:{
        NEW: 0,
        PREPARING: 1,
        DELIVERING: 2,
        DONE: 3,
        CANCELLED: -1,
        RETURNED: -2,
      }
    };
  },
  components: {
    BaseTemplate
  },
  methods:{
    GetItems(status){
      var filtered = this.items.filter(function(x) { return x.status === status; });
      return filtered
    }
  }
}

</script>

<style scoped>

</style>