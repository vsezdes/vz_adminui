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
                <v-toolbar-title>Регистрация</v-toolbar-title>
                <v-spacer></v-spacer>

              </v-toolbar>
              <v-card-text>
                <v-form>
                  <ImageUploader
                      :images="images"
                      v-on:update:images="images.push($event)"
                      v-on:delete:images="images = images.filter(i => i.asset_id !== $event)"
                      v-model="images"
                  />
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
                    prefix="+"
                    :rules="phoneRules"
                    v-model="phone"
                    type="number"
                ></v-text-field>
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
                  <v-btn style="color:white" color="#42a7f5"

                  >Зарегистрироваться</v-btn>
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

import VImageInput from 'vuetify-image-input';
import ImageUploader from '@/components/ImageUploader.vue';

export default {
  name: "Register",
  components: {
    ImageUploader,
    [VImageInput.name]: VImageInput,
  },
  data() {
    return {
      loading: false,
      valid:false,
      firstname:'',
      surname:'',
      phone:'',
      email:'',
      password:'',
      images: [],
      nameRules: [
        v => !!v || '*Это поле обязательно',
        v => (v && v.length < 3) || 'Введите не менее 3-х символов',
      ],
      emailRules: [
        v => !!v || '*Это поле обязательно',
        v => /.+@.+\..+/.test(v) || 'Указанная вами почта имеет неверный формат',
      ],
      passRules:[
        v => !!v || '*Это поле обязательно',
        v => (v && v.length <= 8) || 'Пароль должен быть длиннее 8-ми символов',
      ],
      phoneRules:[
        v => (v && v.length <= 1) || '*Это поле обязательно',
        v => (v && v.length < 9) || 'Неверный формат номера',
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