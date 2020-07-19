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
        @click="showForm = !showForm"
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
      <ItemForm
        :show="showForm"
        @close="showForm = false"
      />
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
  computed() {
    this.items = [...this.lastItems];
  },
  data () {
    return {
      showForm: false,
    }
  },
}
</script>
