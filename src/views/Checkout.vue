<template>
  <BaseTemplate>
    <v-col>
      <v-alert
        v-if="orderSuccess"
        prominent
        type="success"
      >
        <v-row align="center">
          <v-col class="grow">
            Ваш заказ успешно создан, ожидайте звонка.
            Детали заказа:
            <v-sheet tile>
              <small>{{ orderSuccess }}</small>
            </v-sheet>
          </v-col>
          <v-col class="shrink">
            <v-btn to="/">Купить еще</v-btn>
            <v-btn outlined to="/user/orders">К заказам</v-btn>
          </v-col>
        </v-row>
      </v-alert>
      <v-stepper v-model="step" vertical v-else>
        <v-btn
          color="warning"
          text
          x-small
          :to="{ name: 'Home' }"
          class="ma-1 float-right"
        >
          <v-icon size="16">mdi-close</v-icon> Вернуться к товарам
        </v-btn>
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
            <template v-slot:[`item.quantity`]="{ item }">
              <v-btn x-small icon :disabled="item.quantity < 2" @click="quantityDecrease(item)">
                <v-icon size="12">mdi-minus</v-icon>
              </v-btn>
              <span>{{ item.quantity }}</span>
              <v-btn x-small icon :disabled="item.quantity > 49" @click="quantityIncrease(item)">
                <v-icon size="12">mdi-plus</v-icon>
              </v-btn>
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
          <v-btn @click="step = 2" small color="primary" class="float-right mt-6 mb-1 mr-1" :disabled="cartTotal === 0">
            Далее <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
          <v-divider class="mt-3 mb-6"/>
        </v-stepper-content>

        <v-stepper-step :complete="step > 2" step="2">
          Укажите данные доставки
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-form v-model="deliveryFormValid">
            <v-text-field
              label="Адрес доставки"
              :value="deliveryForm.address"
              :rules="[rules.required]"
              @change="setDeliveryFormData('address', $event)"
            />
            <v-text-field
              label="Контактный телефон"
              :value="deliveryForm.phone"
              v-mask="'+996(###)###-###'"
              :rules="[rules.required, rules.phone]"
              @change="setDeliveryFormData('phone', $event)"
            />
          </v-form>
          <v-divider class="mt-5 mb-1"/>
          <v-btn @click="step = 3" color="primary" class="float-right my-5 mr-1" small :disabled="!deliveryFormValid">
            Далее <v-icon size="16">mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn @click="step = 1" class="float-right my-5 mr-5" small><v-icon size="16">mdi-arrow-left</v-icon>Назад</v-btn>
        </v-stepper-content>
        <v-stepper-step :complete="step > 3" step="3">
          Подтвердите заказ
        </v-stepper-step>
        <v-stepper-content step="3">
          <p>
            Ваш заказ на сумму {{ cartTotal }} будет доставлен по адресу {{ deliveryForm.address }}
          </p>
          <p>
            Контактный телефон заказа: {{ deliveryForm.phone }}
          </p>
          <v-divider class="mt-5 mb-1"/>
          <v-progress-linear indeterminate v-if="loading" />
          <v-btn color="primary" @click="setOrder" class="float-right my-5 mr-1" small :disabled="loading">
            Завершить заказ <v-icon size="16">mdi-check</v-icon>
          </v-btn>
          <v-btn @click="step = 2" class="float-right my-5 mr-5" small><v-icon size="16">mdi-arrow-left</v-icon>Назад</v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-col>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from './BaseTemplate';
import { mask } from 'vue-the-mask'
import { mapState, mapActions } from 'vuex';
import gql from 'graphql-tag';
export default {
  name: 'Checkout',
  components: {
    BaseTemplate
  },
  directives: {
    mask
  },
  data() {
    return {
      loading: false,
      step: 1,
      orderSuccess: null,
      deliveryFormValid: false,
      deliveryForm: {
        address: '',
        phone: '',
      },
      rules: {
        required: value => !!value || 'Обязательное поле.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        phone: v => (v && v.length === 16) || 'Неверный формат номера',
      },
      headers: [
        {
          text: 'Товар',
          align: 'start',
          sortable: false,
          value: 'title',
        },
        { text: 'Цена', value: 'price' },
        { text: 'Кол-во', value: 'quantity', width: '85px', align: 'center' },
        { text: '', value: 'actions', align: 'right', sortable: false },
      ],
    }
  },
  mounted() {
    if (this.user) {
      this.$set(this.deliveryForm, 'phone', this.user.phone);
      this.$set(this.deliveryForm, 'address', this.user.address);
    }
  },
  methods: {
    ...mapActions(['emptyCart', 'deleteFromCart', 'setCartItemQuantity', 'alert']),
    setDeliveryFormData(key, val) {
      this.$set(this.deliveryForm, key, val);
    },
    quantityIncrease({ id, quantity }) {
      const newQty = quantity + 1;
      this.setCartItemQuantity({
        id, quantity: newQty,
      })
    },
    quantityDecrease({ id, quantity }) {
      const newQty = quantity - 1;
      if (newQty === 0) return;
      this.setCartItemQuantity({
        id, quantity: newQty,
      })
    },
    setOrder() {
      this.loading = true;

      this.$apollo.mutate({
        // Query
        mutation : gql`mutation setOrder($data: [OrderItemInput]!) {
          setOrder(data: $data) {
            id
            created
            details
            status
            total
            items {
              id
              title
              price
            }
          }
        }`,
        variables: {
          data: this.orderData,
        }
      }).then(({ data: { setOrder }}) => {
        this.loading = false;
        this.orderSuccess = setOrder;
        this.$store.commit('PUSH_USER_ORDERS', setOrder);
        this.emptyCart();
      }).catch(error => {
        this.loading = false;
        this.alert({
          type: 'error',
          message: error,
        });
      });
    },
    onDeleteItem(item) {
      if (window.confirm(`Удалить товар ${item.title} из корзины?`)) {
        this.deleteFromCart(item);
      }
    }
  },
  computed: {
    ...mapState(['cart', 'user']),
    orderData() {
      return this.cart.map(({ id, quantity }) => ({
        itemId: id, quantity
      }))
    },
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
