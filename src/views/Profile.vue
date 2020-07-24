<template>
  <BaseTemplate>
    <v-layout wrap style="margin-top: 50px" justify-center>
      {{ drawer }}
      <v-flex offset-0  offset-xs-3 xs6 md2 lg2 class="text-center">
        <v-avatar rounded size="150px" color="base_header" >
          <v-img v-if="avatar!=='mdi-account'" :src="avatar"/>
          <v-icon color="grey darken-3" v-else size="140px"> {{ avatar }}</v-icon>
        </v-avatar>
        <v-btn
          style="width:100% ;margin: 20px 0"
          color="info"
          dark
          @click="editablle = true"
          :disabled="editablle"
          v-on="on"
        >
          Изменить профиль
        </v-btn>
        <v-dialog  @click.stop="dialog = true" v-model="dialog" persistent max-width="400px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              style="width:100% ;margin: 20px 0"
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
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
                    <v-text-field label="Текущий пароль" type="password" required></v-text-field>
                  </v-flex>
                  <v-flex lg12 sm12 md10 style="margin: -20px 0">
                    <v-text-field label="Новый пароль" type="password" required></v-text-field>
                  </v-flex>
                  <v-flex lg12 sm12 md10 >
                    <v-text-field label="Повтор нового пароля" type="password" required></v-text-field>
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
                  <v-btn color="success"  @click="dialog = false">Сохранить</v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-flex offset-1 sm12 md6 lg6 align-self-center>
        <v-card>
          <v-card-text>
            <v-form>
              <v-layout wrap justify-space-around>
                <v-flex xs11 md5 lg5>
                  <v-text-field md5 lg5
                                :disabled="!editablle"
                                label="* Имя"
                                name="login"
                                prepend-icon="mdi-account"
                                type="text"
                                v-model="firstname"
                                :rules="nameRules"
                  ></v-text-field>
                </v-flex>

                <v-flex xs11 md5 lg5>
                  <v-text-field
                    label="* Фамилия"
                    name="surname"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="surname"
                    :rules="nameRules"
                  ></v-text-field>
                </v-flex>

                <v-flex xs11 md5 lg5>
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
                </v-flex>
                <v-flex xs11 md5 lg5 content="center" class="justify-center" >
                  <span style="position:absolute;">Пол:</span>
                  <v-radio-group v-model="gender" row class="justify-center" >
                    <v-radio
                      label="Ж"
                      color="blue"
                      value="female"
                    ></v-radio>
                    <v-radio
                      label="М"
                      color="red darken-3"
                      value="male"
                    ></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-flex xs11 md11 lg11>
                  <v-text-field
                    label="* Почта"
                    name="mail"
                    prepend-icon="mdi-mail"
                    v-model="mail"
                  ></v-text-field>
                </v-flex>

                <v-flex xs11 md11 lg11>
                  <v-text-field
                    id="address"
                    label="Адрес"
                    name="address"
                    prepend-icon="mdi-map"
                    v-model="address"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md11 lg11>
                  <v-layout justify-space-between>
                    <v-flex lg3 md3 >
                      <v-btn :disabled="!editablle" color="error" @click="editablle=false;firstname=''"> Отмена</v-btn>
                    </v-flex>
                    <v-flex lg3 md3>
                      <v-btn :disabled="!editablle" color="success"> Сохранить</v-btn>
                    </v-flex>
                  </v-layout>
                </v-flex>



              </v-layout>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from "@/views/BaseTemplate.vue";
import { mask } from 'vue-the-mask'


export default {
  name: "Profile",
  components: {
    BaseTemplate
  },
  directives:{
    mask
  },
  props:['drawer'],
  data() {
    return {
      editablle:false,
      dialog:false,
      avatar: 'mdi-account',
      phone: '',
      mail:'',
      birth_date: '',
      address: '',
      gender: '',
      firstname: '',
      surname: '',
      old_password:'',
      new_password: '',
      new_password2: '',
    }
  },
  created() {
    console.info(this.drawer)
  }
}
</script>

<style scoped>

</style>