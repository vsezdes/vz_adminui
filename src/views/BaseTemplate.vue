<template>
  <v-app>
    <v-app-bar
      app
      clipped-left
      class="mr-2"
      color="base_header"
    >
      <v-app-bar-nav-icon v-if="isMobile" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <router-link to="/" class="logo">
        <v-avatar>
          <v-img height="40" src="../assets/logo.svg"/>
        </v-avatar>
        <span class="title ml-3 mr-5">Всё&nbsp;<span class="font-weight-light">Тут</span></span>
        <v-progress-circular
          v-if="loading"
          :indeterminate="true"
          size="48"
          width="3"
          color="blue"
        />
      </router-link>
      <v-spacer></v-spacer>
      <Cart />
      <UserBar />
    </v-app-bar>

    <v-navigation-drawer
      app
      clipped
      v-model="drawer"
      color="base_sidebar"
      :key="enableMini ? 'mini' : 'normal'"
      :permanent="!isMobile"
      :mini-variant.sync="mini"
      :expand-on-hover="enableMini"
      width="220"
      :value="isMobile ? drawer : true"
    >
      <v-btn
        v-if="!isMobile"
        outlined
        :title="!enableMini ? 'Свернуть меню' : 'Развернуть меню'"
        x-small
        absolute
        right icon
        :color="enableMini ? 'black' : '#BBB'"
        class="mini-btn mt-7"
        @click.stop="toggleMini"
      >
        <v-icon :size="14">{{ !enableMini ? 'mdi-arrow-left' : 'mdi-arrow-right' }}</v-icon>
      </v-btn>
      <v-list
        dense
        color="base_sidebar"
      >
        <template v-for="(item, i) in items">
          <v-row
            v-if="item.heading"
            :key="i"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
          </v-row>
          <v-divider
            v-else-if="item.divider"
            :key="i"
            dark
            class="my-4"
          ></v-divider>
          <v-list-item
            v-else
            :key="i"
            link
            exact
            :to="item.href"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <v-sheet max-width="1400">
          <div v-if="title" class="pagetitle text-h2" v-text="title" />
          <v-divider v-if="title" class="mb-10"/>
          <slot />
        </v-sheet>
      </v-container>
    </v-main>
    <v-footer>
      <small class="text-right flex">
        &copy; 2021
      </small>
    </v-footer>
  </v-app>
</template>

<script>
import Cart from '@/components/Cart';
import UserBar from '@/components/UserBar';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'BaseTemplate',
  components: {
    Cart,
    UserBar,
  },
  props: {
    title: {
      type: String,
    },
    loading: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    drawer: null,
    mini: false,
  }),
  watch: {
    isMobile(val) {
      if (val && this.enableMini) {
        this.toggleMini();
      }
    }
  },
  methods: {
    ...mapActions(['toggleMini']),
  },
  computed: {
    ...mapState(['user', 'enableMini']),
    isMobile() {
      return !this.$vuetify.breakpoint.mdAndUp;
    },
    items() {
      const group = this.user ? this.user.groupName : 'DEFAULT';
      switch (group) {
        case 'DEFAULT':
        default:
          return [
            { heading: 'Авторизация' },
            { icon: 'mdi-login-variant', text: 'Войти', href:'/login' },
            { icon: 'mdi-account-plus', text: 'Зарегистрироваться', href:'/register' },
          ];
        case 'SELLER':
          return [
            { heading: 'Товары и заказы' },
            { icon: 'mdi-cash-register', text: 'Дашборда поставщика', href:'/seller' },
            { icon: 'mdi-cash-register', text: 'Управление товарами', href:'/seller/items' },
            { icon: 'mdi-cash-register', text: 'Управление заказами', href:'/seller/orders' },
            { heading: 'Отчеты' },
            { icon: 'mdi-cash-register', text: 'Просмотр отчетов', href:'/seller/reports' },
          ];
        case 'USER':
          return [
            {heading: 'Меню'},
            {icon: 'mdi-shopping', text: 'Магазин', href: "/" },
            {icon: 'mdi-briefcase-account', text: 'Мой кабинет', href: '/user'},
            {icon: 'mdi-cash-register', text: 'Мои заказы', href: '/user/orders'},
          ];
        case 'ADMIN':
          return [
            {heading: 'Меню'},
            {icon: 'mdi-shopping', text: 'Магазин', href: "/" },
            {heading: 'ЛК Продавца'},
            {icon: 'mdi-cash-register', text: 'Мои заказы', href: '/seller/orders'},
            {heading: 'Товары'},
            {icon: 'mdi-package-variant', text: 'Все товары', href: '/items'},
            {icon: 'mdi-format-list-bulleted-type', text: 'Категории', href: '/categories'},
            {heading: 'Управление'},
            {icon: 'mdi-account-multiple', text: 'Пользователи', href: '/users'},
            {icon: 'mdi-cash-register', text: 'Заказы', href: '/orders'},
            {icon: 'mdi-truck-delivery', text: 'Поставщики', href: '/sellers'},
          ];
      }
    },
  },
}
</script>

<style scoped>
.pagetitle.text-h2 {
  font-size: 36px !important;
}
.v-navigation-drawer--mini-variant .mini-btn {
  display: none;
}
.v-subheader {
  text-transform: uppercase;
  white-space: nowrap;
}

.logo {
  text-decoration: none;
  position: relative;
}

.logo .title {
  text-decoration: none;
  color: #755803;
}

.logo .v-progress-circular {
  position: absolute;
  left: 0;
  top: 1px;
}

.logo .v-avatar .v-image {
  filter: grayscale(100%);
}
</style>
