<template>
  <v-app id="keep">
    <v-app-bar
        app
        clipped-left
        color="amber"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <router-link style="text-decoration: none;color: black" to="/">
        <span class="title ml-3 mr-5">Всё&nbsp;<span class="font-weight-light">Тут</span></span>
      </router-link>

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
export default {
  name:'BaseTemplate',
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    items: [
      { heading: 'Товары' },
      { icon: 'mdi-package-variant', text: 'Все товары', href: '/' },
      { icon: 'mdi-format-list-bulleted-type', text: 'Категории' , href: '/categories'},
      { heading: 'Управление' },
      { icon: 'mdi-account-multiple', text: 'Пользователи', href: '/users' },
    ],
  }),
}
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none
}
.v-subheader {
  text-transform: uppercase;
}
</style>
