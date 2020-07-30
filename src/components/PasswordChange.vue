<template>
  <v-dialog  @click.stop="dialog = true" v-model="dialog" persistent max-width="400px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="error"
        outlined
        small
        v-bind="attrs"
        v-on="on"
      >
        <v-icon size="14" class="mr-1">mdi-key-change</v-icon>
        Изменить пароль
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="auth_forms_header text-center" style="padding-top:10px">
        <span class="headline" style="color:white;width: 100%;">Смена пароля</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-layout wrap justify="center">
            <v-flex lg12 sm12 md10>
              <v-text-field :rules="passRules" label="Текущий пароль" type="password" v-model="old_password" required></v-text-field>
            </v-flex>
            <v-flex lg12 sm12 md10 style="margin: -20px 0">
              <v-text-field :rules="passRules" label="Новый пароль" type="password" v-model="new_password" required></v-text-field>
            </v-flex>
            <v-flex lg12 sm12 md10 >
              <v-text-field :rules="passRules" label="Повтор нового пароля" type="password" v-model="new_password2" required></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-layout justify-space-around>
          <v-flex md4 lg4>
            <v-btn color="error"  @click="dialog = false">Отмена</v-btn>
          </v-flex>
          <v-flex md4 lg4>
            <v-btn color="success"  @click="dialog = false;">Сохранить</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import gql from "graphql-tag";

export default {
name: "PasswordChange",
  data(){
    return{
      dialog:false,
      old_password:'',
      new_password: '',
      new_password2: '',
      passRules: [
        v => !!v || '*Это поле обязательно',
        v => (v && v.length >= 8) || 'Пароль должен быть длиннее 8-ми символов',
      ],
    }
  },
  computed:{
  },
  methods:{
    ChangePassword() {
      this.$apollo.query({
        // Query
        mutation : gql`mutation saveUser($id: Int!,$data: UserInput!) {
            saveUser(id:$id, data:$data,) {
              password
              phone
              email
              firstName
              lastName
              token
            }
          }`,
        variables: {
          id: 13,
          data: this.user
        }
      }).then(data => {
        if (data.data.saveUser) this.$store.commit('LOGIN',data.data.saveUser);
      }).catch(error => {
        this.alert({
          type: 'error',
          message: error,
        });
      });
    },
  },
}
</script>
