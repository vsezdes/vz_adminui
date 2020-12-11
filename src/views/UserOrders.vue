<template>
  <BaseTemplate>
  <v-sheet max-width="1400">
    <div class="text-h2 my-3">Мои заказы</div>
    <v-divider class="mb-10"/>
    <v-data-table
      :items="userOrders"
      :headers="headers"
      no-data-text="Заказов еще нет"
      sort-by="created"
      sort-desc
    >
      <template v-slot:[`item.created`]="{ item }">
        <span>{{ formatDateToString(item.created) }}</span>
      </template>
      <template v-slot:[`item.items`]="{ item }">
        <v-btn small @click="showDetails = item" title="Посмотреть детали заказа">
          {{item.items ? item.items.length : 0}} товаров
          <v-icon size="20" right>mdi-open-in-app</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog scrollable persistent max-width="600" attach :value="!!showDetails">
      <v-card>
        <v-card-title>Подробности заказа №{{ showDetails && showDetails.id }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-data-iterator
            v-if="showDetails"
            :items="showDetails.items"
            :disable-pagination="true"
            hide-default-footer
          >
            <template v-slot:item="{ item }">
              <v-card class="pa-0 mt-1" outlined elevation="1">
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-subtitle>{{ item.quantity }} штук по {{ item.price }} на сумму {{ item.quantity*item.price }}</v-card-subtitle>
              </v-card>
            </template>
          </v-data-iterator>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-alert border="left" type="info" outlined dense class="ml-4 mt-4">
            Сумма заказа: <strong>{{ showDetails && showDetails.total }}</strong>
          </v-alert>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            class="mr-4"
            outlined
            text
            @click="showDetails = null"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
  </BaseTemplate>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import BaseTemplate from './BaseTemplate';
import {DateFormat} from '@/mixins/DateFormat'

export default {
  name: 'UserOrders',
  mixins:[ DateFormat ],
  components: {
    BaseTemplate
  },
  data: () => ({
    loading: false,
    showDetails: null,
    headers: [
      { text: 'ID', value: 'id', align: 'start' },
      { text: 'Добавлен', value: 'created' },
      { text: 'Статус', value: 'status' },
      { text: 'Детали', value: 'details' },
      { text: 'Товары', value: 'items' },
    ],
  }),
  mounted() {
    this.getUserOrders().then(() => this.loading = false);
  },
  computed: {
    ...mapState(['userOrders'])
  },
  methods: {
    ...mapActions(['getUserOrders']),
  }
}
</script>
