<template>
  <FormWrapper :show="dialog" @close="$emit('close')" title="Добавить поставщика" icon="mdi-truck-delivery">
      <v-card-text style="height: 90%;">
        <v-form v-model="isValid" aria-autocomplete="off">
          <v-text-field
              label="* Имя"
              name="name"
              prepend-icon="mdi-account"
              type="text"
              v-model="user.firstName"
              :rules="nameRules"
          ></v-text-field>
          <v-text-field
              label="* Фамилия"
              name="surname"
              prepend-icon="mdi-account"
              type="text"
              v-model="user.lastName"
              :rules="nameRules"
          ></v-text-field>
          <v-text-field
              label="* Телефон"
              name="phone"
              prepend-icon="mdi-phone"
              v-mask="'+996(###)###-###'"
              placeholder="+996(999)123-456"
              :rules="phoneRules"
              v-model="user.phone"
              type="text"
          />
          <v-text-field
              label="* Почта"
              name="email"
              prepend-icon="mdi-mail"
              v-model="user.email"
              autocomplete="new-email"
              type="text"
              :rules='emailRules'
          ></v-text-field>
          <v-text-field
              id="password"
              label="* Пароль"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              v-model="user.password"
              :rules="passRules"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout justify-end>
          <v-btn
              class="mt-4"
              color="green"
              absolute
              right
              outlined
              :disabled="!isValid"
              @click="onSave"
              :loading="loading"
          >
            <v-icon>mdi-content-save-outline</v-icon>
            Сохранить</v-btn>
        </v-layout>
      </v-card-actions>
  </FormWrapper>
</template>

<script>
import { mask } from 'vue-the-mask';
import gql from "graphql-tag";
import { mapActions } from 'vuex';
import FormWrapper from "@/components/FormWrapper";
export default {
  name: "AddSupplier",
  components: {FormWrapper},
  directives:{
    mask
  },
  props:{
    dialog: {
      type: Boolean,
    }
  },
  data() {
    return {
      isValid: false,
      loading: false,
      user: {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
      },
      nameRules: [
        v => !!v || '*Это поле обязательно',
        v => (v && v.length >= 3) || 'Введите не менее 3-х символов',
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
        v => (v && v.length >= 5) || '*Это поле обязательно',
        v => (v && v.length === 16) || 'Неверный формат номера',
      ]
    }
  }
  ,
  methods: {
    ...mapActions(['alert']),
    onSave(){
      this.loading = true;
      this.$apollo.mutate({
        // Query
        mutation : gql`mutation saveSeller($id: Int!,$data: UserInput!) {
            saveSeller(id:$id, data:$data) {
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
      this.$emit('close');
    }
  },
}
</script>

<style scoped>

</style>
