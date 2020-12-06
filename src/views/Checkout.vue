<template>
  <BaseTemplate>
    <v-col>
      <v-stepper v-model="step" vertical>
        <v-stepper-step :complete="step > 1" step="1">
          Проверьте ваш заказ
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-data-table
            dense
            disable-sort
            disable-pagination
            disable-filtering
            hide-default-footer
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
            <template slot="footer">
              <v-divider />
              <div class="text-right total"> Итого: {{ cartTotal }} </div>
            </template>
          </v-data-table>
          <v-btn @click="step = 2" class="float-right mt-5" :disabled="cartTotal === 0">Далее</v-btn>
          <v-divider class="mt-3 mb-5"/>
        </v-stepper-content>

        <v-stepper-step :complete="step > 2" step="2">
          Укажите данные доставки
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-form v-model="deliveryFormValid">
            <v-text-field
              label="Адрес доставки"
              :value="deliveryForm.address"
              @change="setDeliveryFormData('address', $event)"
            />
            <v-text-field
              label="Контактный телефон"
              :value="deliveryForm.phone"
              @change="setDeliveryFormData('phone', $event)"
            />
          </v-form>
          {{ deliveryForm }}
        </v-stepper-content>
        <v-stepper-step :complete="step > 3" step="3">
          Выберите способ оплаты
        </v-stepper-step>
      </v-stepper>
    </v-col>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from './BaseTemplate';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'Checkout',
  components: {
    BaseTemplate
  },
  data() {
    return {
      step: 1,
      deliveryFormValid: false,
      deliveryForm: {
        name: '',
        address: '',
        phone: '',
      },
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
    }
  },
  methods: {
    ...mapActions(['deleteFromCart']),
    setDeliveryFormData(key, val) {
      this.$set(this.deliveryForm, key, val);
    },
    onDeleteItem(item) {
      if (window.confirm(`Удалить товар ${item.title} из корзины?`)) {
        this.deleteFromCart(item);
      }
    }
  },
  computed: {
    ...mapState(['cart']),
    cartTotal() {
      let total = 0;
      this.cart.forEach(i => {
        total = total + i.price * i.quantity;
      })
      return total;
    }
  }
}
</script>

<style scoped>
.total {
  font-size: 16px;
  padding: 10px 20px 0;
}
</style>
