<template>
  <v-alert
    :color="theStatus.color"
    dense
    max-width="150"
    outlined
    min-width="150"
    class="pa-0 mt-1 mb-1"
  >
    <v-icon
      v-if="theStatus.icon"
      :color="theStatus.color"
      class="my-0 ml-2 mr-1"
    >{{ theStatus.icon }}</v-icon>
    {{ theStatus.title }}
  </v-alert>
</template>

<script>
export default {
  name: 'OrderStatus',
  props: ['status'],
  computed: {
    theStatus() {
      return this.status_titles.find(s => s.number === this.status);
    }
  },
  data: () => ({
    status_titles: [
      {title: 'все', number: 'all', color: null},
      {title: 'новый', number: 1, color: 'blue darken-1', icon: 'mdi-new-box'},
      {title: 'готовится', number: 2, color: 'lime darken-2', icon: 'mdi-progress-clock'},
      {title: 'на доставке', number: 3, color: 'amber darken-4', icon: 'mdi-truck-delivery'},
      {title: 'завершен', number: 0, color: 'light-green accent-4', icon: 'mdi-check-outline'},
      {title: 'отмена', number: -1, color: 'red', icon: 'mdi-cancel'},
      {title: 'возврат', number: -2, color: 'orange accent-4', icon: 'mdi-backspace'},
    ],
  })
}
</script>
