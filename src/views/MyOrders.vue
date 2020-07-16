<template>
  <BaseTemplate>
    <v-btn @click="Check">123123</v-btn>
    <v-container >
      <v-menu :offset-y="true" :close-on-content-click="false">
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
              >Пользователи</v-btn>
            </template>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item v-for="user in GetUsers()" :key="user" :v-if="!users_whitelist.find((i) => i === user)"
          >
            <v-checkbox style="max-height: 20px" v-model="users_whitelist" :label="user"
                        :value="user"
            ></v-checkbox>
          </v-list-item>
        </v-list>
      </v-menu>

    <div style="" v-for="status in status_titles" :key="status.number">
      <v-checkbox style="max-height: 20px" v-model="status_whitelist" :label="status.title" :value="status.number"></v-checkbox>
    </div>
    </v-container>
    <v-tabs >
        <v-tab v-for="status in status_titles" :key="status.number" >{{ status.title }}</v-tab>
        <v-tab-item v-for="status in status_titles" :key="status.number">
          <div v-for="order in fakedata"
               :key="order.id">
          <v-card
              class="mx-auto"
              max-width="550"
              v-if="order.status === status.number || status.number ==='все' && users_whitelist.find((i) => i === order.user.firstName+' '+ order.user.lastName) "
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
      all_users:[],
      users_whitelist:[],
      status_whitelist:[-2,-1,0,1,2,3],
      status_titles:[
        {title:'все',number:'все'},
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
        if (!all_users.find((i) => i === order.user.firstName+' '+order.user.lastName)){
          all_users.push(order.user.firstName+' '+order.user.lastName)
        }
      }

      console.info(all_users)
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