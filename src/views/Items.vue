<template>
  <BaseTemplate :loading="$apollo.loading">
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
            @on-edit="onEditItem"
          />
        </v-col>
      </v-row>
      {{ lastItems && lastItems.length }}
      <ItemForm
        :show="showForm"
        :item="activeItem"
        @close="onClose"
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
      activeItem: null,
      showForm: false,
    }
  },
}
</script>
