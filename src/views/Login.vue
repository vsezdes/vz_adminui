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
            <v-progress-linear
              :active="loading"
              indeterminate
              color="yellow darken-2"
            ></v-progress-linear>
            <v-toolbar
                color="#42a7f5"
                dark
                flat
            >
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-toolbar-title>Вход</v-toolbar-title>
              <v-spacer></v-spacer>

              <router-link style="color: white;font-weight: bold" to="Register">Регистрация</router-link>

            </v-toolbar>
            <v-card-text>
              <v-form>
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
                <v-btn style="color: white" @click="loginQuery" color="#42a7f5">Войти</v-btn>
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
import { mapActions } from 'vuex';
import {mask} from 'vue-the-mask'
import gql from "graphql-tag";

export default {
  name: "Login",
  directives: {
    mask
  },
  components: {
  },
  data() {
    return {
      email:'',
      password:'',
      loading: false,
      passRules:[
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
    validate () {
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
            token
            avatar
          }
        }`,
        variables: {
          user: this.email,
          pass: this.password,
        }
      }).then(data => {
        this.loading = false;
        if (data.data.authUser) this.login(data.data.authUser);
        // TODO: Remove this when login starts working
        else this.login({
          id: 0,
          firstName: 'Test',
          lastName: 'User',
          token: 'DFGH$#%WHWS#$UYHDFTERH$#3wh45$',
          avatar: null,
        }).then(() => this.$router.push('/'))
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

</style>
