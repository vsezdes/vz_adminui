<template>
  <BaseTemplate :loading="$apollo.loading">
    <v-layout justify-center>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              Все пользователи
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Поиск по всем полям"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="users"
              :search="search"
            >
              <template v-slot:item.joined="{ item }">
                <span>{{ formatDateToString(item.joined) }}</span>
              </template>
              <template v-slot:item.avatar="{ item }">
                <v-avatar tile>
                  <v-img :src="item.avatar" />
                </v-avatar>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </BaseTemplate>
</template>

<script>
import { ALL_USERS } from '@/gql/users.graphql';
import BaseTemplate from '@/views/BaseTemplate.vue';
import {DateFormat} from '@/mixins/DateFormat'

export default {
  mixins:[ DateFormat ],
  components: {
    BaseTemplate,
  },
  apollo: {
    users: ALL_USERS,
  },
  computed: {
    expandedItem() {
      return this.getItemById(this.expandedId);
    }
  },
  methods: {
    onClose() {
      this.activeItem = null;
      this.showForm = false;
    },
    getItemById(id) {
      return this.lastItems && this.lastItems.find(i => i.id === id)
    },
    onEditItem(itemId) {
      this.activeItem = this.getItemById(itemId);
      this.showForm = true;
    }
  },
  data () {
    return {
      search: '',
      headers: [
        { text: 'ID', value: 'id', align: 'start' },
        {
          text: 'Фото',
          sortable: false,
          align: 'start',
          value: 'avatar',
        },
        {
          text: 'Имя',
          sortable: false,
          value: 'firstName',
        },
        { text: 'Фамилия', value: 'lastName' },
        { text: 'E-mail', value: 'email' },
        { text: 'Телефон', value: 'phone' },
        { text: 'Добавлен', value: 'joined' },
      ],
    }
  },
}
</script>
