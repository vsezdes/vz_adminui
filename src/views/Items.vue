<template>
  <BaseTemplate>
    <v-container fluid>
      <v-btn
        fixed
        dark
        fab
        top
        :style="{ top: '80px' }"
        right
        color="pink"
        @click="drawer = !drawer"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-row>
        <v-col
          v-for="item in lastItems"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <ItemCard
            v-bind="item"
          />
        </v-col>
      </v-row>
      {{ lastItems.length }}
      <v-navigation-drawer
        class="pa-0"
        v-model="drawer"
        temporary
        fixed
        fullWidth
        right
        width="450"
      >
        <ItemForm />
      </v-navigation-drawer>
    </v-container>
  </BaseTemplate>
</template>

<script>
import ItemCard from '@/components/ItemCard';
import ItemForm from '@/components/ItemForm';
import { LAST_ITEMS } from '@/gql/items.graphql';
import BaseTemplate from '@/views/BaseTemplate.vue';

export default {
  components: {
    BaseTemplate,
    ItemCard,
    ItemForm,
  },
  apollo: {
    lastItems: LAST_ITEMS,
  },
  updated() {
    console.warn('items: ', this.lastItems, this.lastItems.length);
  },
  computed() {
    this.items = [...this.lastItems];
  },
  data () {
    return {
      drawer: false,
    }
  },
}
</script>
