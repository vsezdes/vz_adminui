<template xmlns:color>
  <v-app id="keep">
    <v-app-bar
      app
      clipped-left
      color="base_header"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
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
      v-model="drawer"
      app
      clipped
      color="base_sidebar"
    >
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

    <v-content>
      <v-layout
          color: base_bg
          class="fill-height align-start pa-5"
      >
        <v-row>
          <slot></slot>
        </v-row>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import {mapState} from 'vuex';

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
    profile_menu_open: false,
    profile_menu: [
      {icon: 'mdi-account', text: 'Мой профиль', href: '/profile'},
      {icon: 'mdi-logout-variant', text: 'Выход', href: '/logout'},
    ],
  }),
  computed: {
    ...mapState(['token', 'user']),
    items() {
      const group = this.user ? this.user.groupName : 'DEFAULT';
      switch (group) {
        case 'DEFAULT':
        default:
          return [];
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
            {heading: 'Товары'},
            {icon: 'mdi-package-variant', text: 'Все товары', href: '/items'},
            {icon: 'mdi-format-list-bulleted-type', text: 'Категории', href: '/categories'},
            {heading: 'Управление'},
            {icon: 'mdi-account-multiple', text: 'Пользователи', href: '/users'},
            {icon: 'mdi-cash-register', text: 'Мои заказы', href: '/orders'},
            {icon: 'mdi-truck-delivery', text: 'Поставщики', href: '/sellers'},
          ];
      }
    },
    isExpanded: function () {
      return {
        background: this.profile_menu_open ? 'white' : ''
      }
    }
  },
}
</script>

<style scoped>
#keep .v-navigation-drawer__border {
  display: none
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
