<template>
  <BaseTemplate :loading="loading">
    <v-layout wrap class="profile-form mt-5" justify-center>
      <v-flex offset-0 offset-xs-3 xs6 md2 lg2 class="avatar text-center">

        <v-avatar rounded size="150px" color="base_header" >
          <v-progress-circular
            v-if="avatar_loading"
            :size="154"
            style="position: absolute"
            indeterminate color="blue" >
          </v-progress-circular>

          <v-img
            v-if="form && form.avatar"
            :src="form.avatar.url"
          />
          <v-icon
            style="background-color: #FFC107"
            v-else
            color="grey darken-3"
            size="140px"
          >
            mdi-account
          </v-icon>
        </v-avatar>
        <SingleImageUpload style="height: 0" v-if="editable" :avatar_loading="avatar_loading" :form="form"/>
        <v-divider class="my-2"/>
        <v-btn
          class="mb-3"
          color="info"
          text
          small
          @click="editable = true"
          :disabled="editable"
        >
          <v-icon size="14" class="mr-1">mdi-pencil</v-icon> Изменить профиль
        </v-btn>
        <PasswordChange />
      </v-flex>
      <v-flex offset-1 sm12 md6 lg6 align-self-center>
        <v-card>
          <v-card-text>
            <v-form>
              <v-layout wrap justify-space-around>
                <v-flex xs11 md5 lg5>
                  <v-text-field md5 lg5
                    :disabled="!editable"
                    label="* Имя"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="form.firstName"
                    :rules="nameRules"
                  />
                </v-flex>

                <v-flex xs11 md5 lg5>
                  <v-text-field
                    :disabled="!editable"
                    label="* Фамилия"
                    name="surname"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="form.lastName"
                    :rules="nameRules"
                  ></v-text-field>
                </v-flex>

                <v-flex xs11 md5 lg5>
                  <v-text-field
                    :disabled="!editable"
                    label="* Телефон"
                    name="phone"
                    prepend-icon="mdi-phone"
                    v-mask="'+996(###)###-###'"
                    placeholder="+996(999)123-456"
                    v-model="form.phone"
                    type="text"
                    :rules="phoneRules"
                  />
                </v-flex>
                <v-flex xs11 md5 lg5 content="center" class="justify-center" >
                  <span style="position:absolute;">Пол:</span>
                  <v-radio-group v-model="form.gender" :disabled="!editable" row class="justify-center" >
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
                    :disabled="!editable"
                    label="* Почта"
                    name="mail"
                    prepend-icon="mdi-mail"
                    v-model="form.email"
                    :rules="emailRules"
                  ></v-text-field>
                </v-flex>

                <v-flex xs11 md11 lg11>
                  <v-text-field
                    :disabled="!editable"
                    label="Адрес"
                    name="address"
                    prepend-icon="mdi-map"
                    v-model="form.address"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md11 lg11>
                  <v-layout justify-space-between>
                    <v-flex lg3 md3 >
                      <v-btn v-show="editable" :disabled="loading" color="error" @click="onCancel"> Отмена</v-btn>
                    </v-flex>
                    <v-flex lg3 md3>
                      <v-btn v-show="editable" :disabled="loading" color="success" @click="editUser"> Сохранить</v-btn>
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
import gql from "graphql-tag";
import PasswordChange from "@/components/PasswordChange";
import { mapState, mapActions } from 'vuex';
import SingleImageUpload from "@/components/SingleImageUpload";

export default {
  name: "Profile",
  components: {
    SingleImageUpload,
    PasswordChange,
    BaseTemplate
  },
  directives:{
    mask
  },
  props:['drawer'],
  mounted() {
    this.getUserState();
  },
  data() {
    return {
      avatar_loading:false, //change to false when it working
      form: {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        birthDate: '',
        gender: '',
        address: '',
      },
      editable:false,
      loading: false,
      nameRules: [
        v => !!v || '*Это поле обязательно',
        v => (v && v.length > 3) || 'Введите не менее 3-х символов',
      ],
      emailRules: [
        v => !!v || '*Это поле обязательно',
        v => /.+@.+\..+/.test(v) || 'Указанная вами почта имеет неверный формат',
      ],
      phoneRules: [
        v => (v && v.length <= 1) || '*Это поле обязательно',
        v => (v && v.length < 17) || 'Неверный формат номера',
      ]
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods:{
    ...mapActions(['alert']),
    getUserState() {
      Object.keys(this.form).forEach(key => {
        this.$set(this.form, key, this.user[key]);
      });
    },
    onCancel(){
      this.editable = false;
      this.getUserState();
    },
    editUser() {
      this.loading = true;
      this.$apollo.mutate({
        // Query
        mutation : gql`mutation saveUser($id: Int!,$data: UserInput!) {
            saveUser(id:$id, data:$data) {
              id
              firstName
              lastName
              email
              phone
              address
              gender
              token
              avatar
            }
          }`,
        variables: {
          id: this.user.id,
          data: {
            ...this.form
          }
        }
        }).then(data => {
          this.loading = false;
          if (data.data.saveUser) {
            this.$store.commit('SAVE_USER', data.data.saveUser);
            this.editable = false;
          }
        }).catch(error => {
          this.loading = false;
          this.alert({
            type: 'error',
            message: error,
          });
      });
    }
  },
}
</script>

<style lang="scss">
.profile-form {
  .avatar {
    position: relative;
  }
}
</style>
