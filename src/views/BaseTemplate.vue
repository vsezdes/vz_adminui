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
      <div class="auth-box" style="height: 100%;position: absolute;right: 20px;">
        <v-menu style="border-radius: 0" offset-y v-model="profile_menu_open">
          <template v-slot:activator="{ on, attrs }">
            <v-container :style="isExpanded" style="display: flex; align-items: center;padding: 0 15px ;height: 100%;">
              <span v-if="token" style="top: 10px">
                <span class="mr-5">{{ user.firstName }} {{ user.lastName }} </span>
                <v-avatar class="mr-1" color="orange">
                  <v-img v-if="user.avatar" :src="user.avatar"/>
                  <v-icon v-else>mdi-emoticon-cool</v-icon>
                </v-avatar>
              </span>

              <v-btn v-else icon to="/login">
                <v-icon>mdi-login-variant</v-icon>
              </v-btn>

              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </v-container>
          </template>
          <v-flex v-for="(item, i) in profile_menu" :key="i" style="background: white">
            <v-row
              v-if="item.heading"
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
              style="padding: 0"
              v-else
              :key="i"
              link
              :to="item.href"
            >
              <v-list-item-content>
                <v-list-item-title class="grey--text">
                  <v-icon style="padding: 0 12px">{{ item.icon }}</v-icon>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-flex>
        </v-menu>
      </div>
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
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Cart from '@/components/Cart';
import UserBar from '@/components/UserBar';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'BaseTemplate',
  props: {
    source: String,
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
            {icon: 'mdi-home', text: 'Главная', href: "/" },
            {heading: 'Товары'},
            {icon: 'mdi-package-variant', text: 'Все товары', href: '/items'},
            {icon: 'mdi-format-list-bulleted-type', text: 'Категории', href: '/categories'},
            {heading: 'Управление'},
            {icon: 'mdi-account-multiple', text: 'Пользователи', href: '/users'},
            {icon: 'mdi-cash-register', text: 'Заказы', href: '/orders'},
            {icon: 'mdi-truck-delivery', text: 'Поставщики', href: '/sellers'},
          ];
      }
    }
  },
}
</script>

<style scoped>
.v-navigation-drawer--mini-variant .mini-btn {
  display: none;
}
.v-subheader {
  text-transform: uppercase;
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

.v-menu__content {
  border-radius: 0 !important;
}
</style>
