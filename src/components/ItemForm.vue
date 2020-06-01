<template>
  <v-container>
    <v-card
      class="mx-auto"
      max-width="400"
      outlined
    >
    <v-card-title class="headline">Добавить товар</v-card-title>
    <v-card-actions>
      <v-form v-model="valid">
        <v-select
          v-model="categoryFirst"
          label="Категория I уровня"
          :items="rootCategories"
          dense
        />
        <v-select
          v-model="categoryFirst"
          label="Категория I уровня"
          :items="rootCategories"
          dense
        />
        <v-select
          v-model="categoryFirst"
          label="Категория I уровня"
          :items="rootCategories"
          dense
        />
      </v-form>
    </v-card-actions>
  </v-card>

  </v-container>
</template>

<script>
import CATEGORIES_QUERY from '@/gql/categories.graphql';

export default {
  apollo: {
    categories: CATEGORIES_QUERY,
  },
  data() {
    return {
      categoryFirst: null,
      categorySecond: null,
    };
  },
  computed: {
    rootCategories() {
      return this.categories && this.categories.map(cat => ({
        text: cat.title,
        value: cat.id,
      }))
    },
    subRootCategories() {
      const items = [{
        text: 'Нет',
        value: 0,
      }];
      const children = this.categories && this.categories.find(cat => cat.id === this.categoryFirst).children;
      if (children) {
        return [
          ...items,
          ...children.map(cat => ({
            text: cat.title,
            value: cat.id,
          }))
        ];
      }
      return items;
    }
  }
}
</script>

<style>
.v-card .v-form {
  width: 100%;
}
</style>
