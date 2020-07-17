<template>
  <BaseTemplate>
    <v-container fluid>
     <v-select
         v-model="selected_user"
         :items="GetUsers()"
         item-text="fullName"
         item-value="id"
         label="Select"
         :hint="'Выберите пользователя'"
         persistent-hint
         return-object
         single-line
     ></v-select>
     <v-select
         :items="status_titles"
         item-text="title"
         item-value="number"
         v-model="selected_status"
         :hint="'Выберите категорию заказа'"
         menu-props="{maxHeight: 404}"
         persistent-hint

     ></v-select>
    </v-container>
    <v-row>
    <v-col cols="1"></v-col>
    <v-col cols="10">
    <div v-for="order in fakedata"
             :key="order.id">
          <v-card
              class="mx-auto"
              max-width="550"
              v-if="(order.status===selected_status || selected_status==='all' ) && order.user.id === selected_user.id "
          >
            <v-card-text>
              <div>Пользователь: {{ order.user.firstName+' '+order.user.lastName }}</div>
              <div>Дата заказа: {{ order.orderDate }}</div>
              <div>Описание: {{ order.details }}</div>
              <v-menu :offset-y="true" :close-on-content-click="false">
                <template v-slot:activator="{ on: menu, attrs }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-btn
                          color="primary"
                          dark
                          v-bind="attrs"
                          v-on="{ ...tooltip, ...menu }"
                      >Товары</v-btn>
                    </template>
                  </v-tooltip>
                </template>
                <v-list>
                  <v-list-item>
                    <v-data-table
                        :headers="headers"
                        :items="order.items"
                        :items-per-page="5"
                        hide-default-footer
                        class="elevation-1"
                    ></v-data-table>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-text>
          </v-card>
    </div>
    </v-col>
    </v-row>

  </BaseTemplate>
</template>

<script>
import BaseTemplate from "./BaseTemplate";

export default {
  name: "MyOrders",
  data() {
    return {
      all_users:[],
      selected_user:null,
      selected_status:'',
      status_titles:[
        {title:'все',number:'all'},
        {title:'новый',number:1},
        {title:'готовится',number:2},
        {title:'доставляется',number:3},
        {title:'завершен',number:0},
        {title:'отмена',number:-1},
        {title:'возврат',number:-2},
      ],
      headers: [
        {text: 'название товара', value: 'title'},
        {text: 'сумма', value: 'price'},
        {text: 'количество', value: 'quantity'},
      ],

      //FAKEDATA
      fakedata:[{
        id: 1,
        orderDate: 'some date',
        status: -2, // статусы описаны ниже
        details: '',
        items: [
          { title: 'Tovar1', price: 100, quantity: 1 },
          { title: 'Tovar2', price: 200, quantity: 2 },
          { title: 'Tovar3', price: 300, quantity: 3 },
        ],
        total: 400,
        user: {
          id:1,
          firstName: 'John',
          lastName: 'Doe',
        }
      },{
        id: 1,
        orderDate: 'some date',
        status: -1, // статусы описаны ниже
        details: '',
        items: [
          { title: 'Tovar4', price: 100, quantity: 1 },
          { title: 'Tovar5', price: 200, quantity: 2 },
          { title: 'Tovar6', price: 300, quantity: 3 },
        ],
        total: 400,
        user: {
          id:1,
          firstName: 'John',
          lastName: 'Doe',
        }
      }],
    };
  },
  components: {
    BaseTemplate
  },
  created() {
    this.selected_status=this.status_titles[0].number
    this.users_whitelist=this.GetUsers()
    console.info(this.users_whitelist)
  },
  methods:{
    checkit: function () {
      this.$nextTick(() => {
        let elt = document.getElementById('john')
        if(elt.checked) {
          console.log('checked')
        } else {
          console.log('unchecked')
        }
      })

      //this.selected.push('Vuejs')
      //this.selected.push('Paris')
    },
    GetUsers(){
      console.info(this.fakedata)
      var all_users=[]
      let i = 0;
      for (i=0;i < this.fakedata.length;i++){
        var order=this.fakedata[i]
        if (!all_users.find((i) => i === order.user)){
        order.user.fullName = order.user.firstName + ' ' + order.user.lastName
        all_users.push(order.user)
        }
      }

      console.info(all_users)
      this.selected_user = all_users[0]
      return all_users
    },

    // GetItems(status){
    //   return this.fakedata.items.filter(function(x) { return x.status === status; });
    // },
    // eslint-disable-next-line no-unused-vars
    Check(status=null){
      // console.log(fakedata[0].items)
      console.log(this.fakedata[0].items)
      // var all_items = []
      // var i
      // for (i=0;i < this.fakedata.length;i++){
      //   if (status===this.fakedata[i].status || status === 'all'){
      //     all_items = all_items.concat(this.fakedata[i].items)
      //   }
      // }
      // console.log(all_items)
      // return {
      //   all_items
      // }
    }
  }
}

</script>

<style scoped>

</style>