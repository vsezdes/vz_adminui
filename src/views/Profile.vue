<template>
  <BaseTemplate>
    <v-layout wrap style="margin-top: 50px" justify-center :disabled="!editable">
      <v-flex offset-0  offset-xs-3 xs6 md2 lg2 class="text-center">
        <v-btn
          color="primary"
          class="text-none"
          rounded
          depressed
          @click="onButtonClick"
        >
          Изменить фото профиля
        </v-btn>
        <input rules=""
          ref="uploader"
          class="d-none"
          type="file"
          @change="onAddFiles"
        />
        <v-img :src="file.url" ></v-img>
<!--        <v-btn @click="UploadImage"> asdasdasdasd </v-btn>-->
        <v-avatar rounded size="150px" color="base_header" >
          <v-img v-if="avatar!=='mdi-account'" :src="avatar"/>
          <v-icon color="grey darken-3" v-else size="140px"> {{ user.avatar }}</v-icon>
        </v-avatar>
        <v-btn
          style="width:100% ;margin: 20px 0"
          color="info"
          dark
          @click="editable = true"
          :disabled="editable"
        >
          Изменить профиль
        </v-btn>
        <PasswordChange ></PasswordChange>
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
                    v-model="user.firstName"
                    :rules="nameRules"
                  ></v-text-field>
                </v-flex>

                <v-flex xs11 md5 lg5>
                  <v-text-field
                    :disabled="!editable"
                    label="* Фамилия"
                    name="surname"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="user.lastName"
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
                    v-model="user.phone"
                    type="text"
                    :rules="phoneRules"
                  />
                </v-flex>
                <v-flex xs11 md5 lg5 content="center" class="justify-center" >
                  <span style="position:absolute;">Пол:</span>
                  <v-radio-group v-model="user.gender" :disabled="!editable" row class="justify-center" >
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
                    v-model="user.email"
                    :rules="emailRules"
                  ></v-text-field>
                </v-flex>

                <v-flex xs11 md11 lg11>
                  <v-text-field
                    :disabled="!editable"
                    id="address"
                    label="Адрес"
                    name="address"
                    prepend-icon="mdi-map"
                    v-model="user.address"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md11 lg11>
                  <v-layout justify-space-between>
                    <v-flex lg3 md3 >
                      <v-btn v-show="editable" color="error" @click="Cancel();editable = false;"> Отмена</v-btn>
                    </v-flex>
                    <v-flex lg3 md3>
                      <v-btn v-show="editable" color="success" @click="editable=false;editUser()"> Сохран</v-btn>
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
// import SingleImageUpload from "@/components/SingleImageUpload";

export default {
  name: "Profile",
  components: {
    // SingleImageUpload,
    PasswordChange,
    BaseTemplate
  },
  directives:{
    mask
  },
  props:['drawer'],
  data() {
    return {
      isError: false,
      errorText: null,
      file:'',
      user: {...this.$store.state.user},
      id:null,
      editable:false,
      avatar: 'mdi-account',
      phone: '',
      birth_date: '',
      gender: '',
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
methods:{
  onButtonClick() {
    this.isSelecting = true
    window.addEventListener('focus', () => {
      this.isSelecting = false
    }, { once: true })
    this.$refs.uploader.click()
  },
  onAddFiles(file) {
    window.console.log(file.target.files[0]);
    this.uploadFileToCloudinary(file.target.files[0]).then((fileResponse) => {
      this.file=fileResponse;
    });
  },
  uploadFileToCloudinary(file) {
    return new Promise(function (resolve, reject) {
      //Ideally these to lines would be in a .env file
      const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/vsetut2020/upload';
      const CLOUDINARY_UPLOAD_PRESET = 'bc5bf78g';
      let formData = new FormData();
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'cloudinary-demo');
      formData.append('file', file);
      let request = new XMLHttpRequest();
      request.open('POST', CLOUDINARY_URL, true);
      request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      request.onreadystatechange = () => {
        // File uploaded successfully
        if (request.readyState === 4 && request.status === 200) {
          let response = JSON.parse(request.responseText);
          resolve(response);
        }
        // Not successfull, let find our what happened
        if (request.status !== 200) {
          let response = JSON.parse(request.responseText);
          let error = response.error.message;
          this.errorText = 'error uploading files ' + error;
          this.isError = true;
          reject(error);
        }
      };
      request.onerror = (err) => {
        alert('error: ' + err);
        reject(err);
      };
      request.send(formData);
    });
  },
    Cancel(){
      this.user={...this.$store.state.user}
    },
    editUser() {
      delete this.user.token, this.user.id, this.user.gender
      this.$apollo.mutate({
        // Query
        mutation : gql`mutation saveUser($id: Int!,$data: UserInput!) {
          saveUser(id:$id, data:$data,) {
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
    }
  },
}
</script>