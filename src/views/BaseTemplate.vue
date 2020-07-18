<template>
  <v-app id="keep">
    <v-app-bar
        app
        clipped-left
        color="amber"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <router-link to="/" class="logo">
        <v-avatar>
          <v-img height="40" src="../assets/logo.svg" />
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
      <div class="auth-box">
        <span v-if="isAuthenticated">
          <span class="mr-5">{{ user.firstName }} {{ user.lastName }}</span>
          <v-avatar class="mr-1" color="orange">
            <img v-if="user.avatar" src="user.avatar" />
            <v-icon v-else>mdi-emoticon-cool</v-icon>
          </v-avatar>
          <v-btn icon to="/logout"><v-icon>mdi-logout-variant</v-icon></v-btn>
        </span>
        <v-btn v-else icon to="/login"><v-icon>mdi-login-variant</v-icon></v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        color="grey lighten-4"
    >
      <v-list
          dense
          class="grey lighten-4"
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
      <v-container
          fluid
          class="grey lighten-4 fill-height align-start pa-5"
      >
        <v-row>
          <slot></slot>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name:'BaseTemplate',
  props: {
    source: String,
    loading: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    drawer: null,
    items: [
      { heading: 'Товары' },
      { icon: 'mdi-package-variant', text: 'Все товары', href: '/items' },
      { icon: 'mdi-format-list-bulleted-type', text: 'Категории' , href: '/categories'},
      { heading: 'Управление' },
      { icon: 'mdi-account-multiple', text: 'Пользователи', href: '/users' },
      { icon: '', text: 'Мои заказы', href: '/my-orders' },
    ],
  }),
  computed: {
    ...mapState(['isAuthenticated', 'user']),
  }
}
</script>

<style>
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
.v-avatar .v-image {
  filter: grayscale(100%);
}
</style>
