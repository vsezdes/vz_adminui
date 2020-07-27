<template>
  <v-app id="inspire">
    <v-container
      class="fill-height"
      fluid
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <v-card class="elevation-12">
            <v-toolbar
              color="auth_forms_header"
              dark
              flat
            >
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-toolbar-title>Регистрация</v-toolbar-title>
              <v-spacer></v-spacer>
              <router-link style="color: white;font-weight: bold" to="Login">Вход</router-link>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="* Имя"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="firstname"
                  :rules="nameRules"
                ></v-text-field>
                <v-text-field
                  label="* Фамилия"
                  name="surname"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="surname"
                  :rules="nameRules"
                ></v-text-field>
                <v-text-field
                  label="* Телефон"
                  name="phone"
                  prepend-icon="mdi-phone"
                  v-mask="'+996(###)###-###'"
                  placeholder="+996(999)123-456"
                  :rules="phoneRules"
                  v-model="phone"
                  type="text"
                />
                <v-text-field
                  label="* Почта"
                  name="email"
                  prepend-icon="mdi-mail"
                  v-model="email"
                  type="text"
                  :rules='emailRules'
                ></v-text-field>
                <v-text-field
                  id="password"
                  label="* Пароль"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="password"
                  :rules="passRules"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-layout row wrap>
                <v-spacer></v-spacer>
                <v-btn style="color:white" color="auth_forms_button" @click="register"

                >Зарегистрироваться
                </v-btn>
                <v-spacer></v-spacer>

              </v-layout>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
// import gql from 'graphql-tag';

import { mask } from 'vue-the-mask'
import gql from "graphql-tag";

export default {
  name: "Register",
  directives: {
    mask
  },
  data() {
    return {
      loading: false,
      valid: false,
      firstname: '',
      surname: '',
      phone: '',
      email: '',
      password: '',
      nameRules: [
        v => !!v || '*Это поле обязательно',
        v => (v && v.length > 3) || 'Введите не менее 3-х символов',
      ],
      emailRules: [
        v => !!v || '*Это поле обязательно',
        v => /.+@.+\..+/.test(v) || 'Указанная вами почта имеет неверный формат',
      ],
      passRules: [
        v => !!v || '*Это поле обязательно',
        v => (v && v.length >= 8) || 'Пароль должен быть длиннее 8-ми символов',
      ],
      phoneRules: [
        v => (v && v.length <= 1) || '*Это поле обязательно',
        v => (v && v.length < 17) || 'Неверный формат номера',
      ]
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate()
    },
    register() {
      this.$apollo.mutate({
        // Query
        mutation: gql`query register { register(
                data: {
                 lastName: surname,
                 firstName: firstname,
                 phone: phonr,
                 email: email,
                 pass:password,
                 avatar:image})
                 { firstName lastName token avatar } }`,
      })
    },
  },
}
</script>

<style scoped>

</style>