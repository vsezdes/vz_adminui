<template>
  <div class="auth-box">
    <div
      v-if="token"
      class="menu-wrapper"
    >
        <v-badge
          offset-x="15"
          offset-y="33"
          color="secondary"
          :style="{ position: 'relative', zIndex: '20' }"
        >
          <v-btn slot="badge" @click="toggle" icon text x-small absolute class="badge-btn">
            <v-icon v-text="drawer ? 'mdi-close' : 'mdi-chevron-down'" />
          </v-btn>
          <v-avatar
            @click="toggle"
            class="mr-1 avatar"
            color="secondary"
          >
            <v-img v-if="user.avatar" :src="user.avatar"/>
            <v-icon v-else>mdi-emoticon-cool</v-icon>
          </v-avatar>
        </v-badge>
      <span class="user-menu" v-if="!drawer">
        <v-row align="center">
          <v-col class="px-2 pt-0">
            <span class="name">{{ user.firstName }} {{ user.lastName }} </span>
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
              v-else
              dense
              class="pa-0"
              link
              :to="item.href"
            >
              <v-list-item-content class="py-1">
                <v-list-item-title class="grey--text">
                  <v-icon class="px-1">{{ item.icon }}</v-icon>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </span>
        </div>
      </span>
    </div>
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
  },
  methods: {
    toggle() {
      this.drawer = !this.drawer;
    }
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
  position: relative;
}
.avatar {
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
}
.user-menu {
  min-width: 170px;
  padding: 5px;
  position: absolute;
  right: 9px;
  top: 4px;
  background: white;
  border: 1px solid #EEE;
  border-radius: 5px 25px 5px 5px;
  .name {
    font-size: 12px;
    line-height: 14px;
    display: block;
    padding: 5px 40px 0px 8px;
    border-bottom: 1px dashed silver;
    color: gray;
    min-height: 40px;
  }
}
</style>
