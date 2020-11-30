<template>
  <div class="auth-box">
    <v-menu
      v-if="token"
      offset-y="3"
      v-model="drawer"
      class="menu-wrapper"
    >
      <template v-slot:activator="{ on }">
        <v-badge
          offset-x="15"
          offset-y="33"
          color="secondary"
          :style="{ position: 'relative' }"
        >
          <v-btn slot="badge" v-on="on" icon text x-small absolute class="badge-btn">
            <v-icon v-text="drawer ? 'mdi-close' : 'mdi-chevron-down'" />
          </v-btn>
          <v-avatar
            v-on="on"
            class="mr-1 avatar"
            color="secondary"
          >
            <v-img v-if="user.avatar" :src="user.avatar"/>
            <v-icon v-else>mdi-emoticon-cool</v-icon>
          </v-avatar>
        </v-badge>
      </template>
      <div class="user-menu">
        <v-row align="center">
          <v-col>
            <span class="mr-5">{{ user.firstName }} {{ user.lastName }} </span>
          </v-col>
        </v-row>
        <div class="menu-block">
          <span v-for="(item, i) in profile_menu" :key="i">
            <v-divider
              v-if="item.divider"
              class="my-1 mx-auto"
              inset
            ></v-divider>
            <v-list-item
              dense
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
          </span>
        </div>
      </div>
    </v-menu>
    <v-btn v-else icon to="/login">
      <v-icon>mdi-login-variant</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UserBar',
  data: () => ({
    cartQuantity: 0,
    drawer: true,
    profile_menu: [
      {icon: 'mdi-account', text: 'Мой профиль', href: '/profile'},
      { divider: true },
      {icon: 'mdi-logout-variant', text: 'Выход', href: '/logout'},
    ],
  }),
  computed: {
    ...mapState(['token', 'user']),
  }
}
</script>

<style lang="scss" scoped>
.badge-btn {
  left: 1px;
  top: 1px;
  &.v-btn--icon.v-size--x-small {
    .v-icon {
      font-size: 14px !important;
    }
  }
}
.menu-wrapper {
  background: orange;
}
.avatar {
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
}
.user-menu {
  padding: 5px;
    // background: white;
  .menu-block {
    background: white;
  }
}
</style>
