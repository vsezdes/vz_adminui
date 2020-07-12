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
                color="#42a7f5"
                dark
                flat
            >
              <v-spacer></v-spacer>
              <v-toolbar-title>Вход</v-toolbar-title>
              <v-spacer></v-spacer>

            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                    label="Телефон"
                    name="phone"
                    prepend-icon="mdi-phone"
                    prefix="+"
                    :rules="phoneRules"
                    v-model="phone"
                    type="text"
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
                <v-btn style="color: white" color="#42a7f5">Войти</v-btn>
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

export default {
  name: "Login",
  components: {
  },
  data() {
    return {
      password:'',
      passRules:[
        v => !!v || '*Это поле обязательно',
      ],
      phoneRules:[
        v => (v && v.length <= 1) || '*Это поле обязательно',

      ]
    };
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
  },
  created() {
    console.warn(this)
  }
}
</script>

<style scoped>

</style>