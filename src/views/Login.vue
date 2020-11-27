<template>
  <v-app id="inspire">
    <BaseTemplate :loading="false">
    <v-container
      class="fill-height"
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
            <v-progress-linear
              :active="loading"
              indeterminate
              color="yellow darken-2"
            ></v-progress-linear>
            <v-toolbar
              color="auth_forms_header"
              flat
            >
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-toolbar-title style="color: white">Вход</v-toolbar-title>
              <v-spacer></v-spacer>
              <router-link style="color: white;font-weight: bold" to="Register">Регистрация</router-link>

            </v-toolbar>
            <v-card-text>
              <v-form v-model="isValid">
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
                  label="Пароль"
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
                <v-btn style="color: white" @click="loginQuery" :disabled='!isValid' color="auth_forms_button">Войти</v-btn>
                <v-spacer></v-spacer>

              </v-layout>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    </BaseTemplate>
  </v-app>
</template>

<script>
import BaseTemplate from '@/views/BaseTemplate.vue';
// import gql from 'graphql-tag';
import { mapActions } from 'vuex';
import { mask } from 'vue-the-mask'
import gql from "graphql-tag";
import THEMES from '@/themes';

export default {
  name: "Login",
  components: {
    BaseTemplate,
  },
  directives: {
    mask
  },
  data() {
    return {
      isValid:false,
      email: '',
      password: '',
      loading: false,
      passRules: [
        v => !!v || '*Это поле обязательно',
      ],
      emailRules: [
        v => !!v || '*Это поле обязательно',
        v => /.+@.+\..+/.test(v) || 'Указанная вами почта имеет неверный формат',
      ],
    };
  },
  methods: {
    ...mapActions(['login', 'alert']),
    validate() {
      this.$refs.form.validate()
    },
    loginQuery() {
      this.loading = true;
      this.$apollo.query({
        // Query
        query: gql`query authUser($user: String!, $pass: String!) {
          authUser(login: $user, password: $pass) {
            id
            firstName
            lastName
            email
            phone
            address
            gender
            token
            groupName
            avatar
          }
        }`,
        variables: {
          user: this.email,
          pass: this.password,
        }
      }).then(data => {
        this.loading = false;
        if (data.data.authUser)
          this.login(data.data.authUser).then((user) => {
            console.error(this.$vuetify, user, THEMES); 
            this.$vuetify.currentTheme = THEMES[user.groupName];
            this.$router.push('/');
          });
        else
          this.alert({
            type: 'error',
            message: 'Пользователь с такими почтой и паролем не найден!'
          });
      }).catch(error => {
        this.loading = false;
        this.alert({
          type: 'error',
          message: error,
        });
      });
    },
  },
}
</script>

<style scoped>
/deep/ .container {
  max-width: 1200px;
}
</style>
