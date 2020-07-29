<template>
  <BaseTemplate :loading="$apollo.loading">
    <ItemPreview :item="expandedItem" @close="expandedId = null"/>
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
            @on-expand="expandedId = $event"
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
import ItemPreview from '@/components/ItemPreview';
import ItemForm from '@/components/ItemForm';
import { LAST_ITEMS } from '@/gql/items.graphql';
import BaseTemplate from '@/views/BaseTemplate.vue';

export default {
  components: {
    BaseTemplate,
    ItemCard,
    ItemPreview,
    ItemForm,
  },
  apollo: {
    lastItems: LAST_ITEMS,
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
      activeItem: null,
      expandedId: null,
      showForm: false,
    }
  },
}
</script>
