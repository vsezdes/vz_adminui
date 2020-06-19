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
          v-model="categorySecond"
          :disabled="!categoryFirst"
          label="Категория II уровня"
          :items="subRootCategories(categoryFirst)"
          dense
        />
        <v-select
          v-model="categoryThird"
          :disabled="!categorySecond"
          label="Категория III уровня"
          :items="subRootCategories(categorySecond, true)"
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
      categoryThird: null,
      valid: false,
    };
  },
  computed: {
    rootCategories() {
      return this.categories && this.categories.map(cat => ({
        text: cat.title,
        value: cat.id,
      }))
    },
  },
  methods: {
    subRootCategories(catId, nextLevel = false) {
      const items = [{
        text: 'Нет',
        value: 0,
      }];

      let theCat = null;
      let children = null;
      if (nextLevel) {
        const secondCat = this.categories && this.categories.find(cat => cat.id === this.categoryFirst);
        theCat = secondCat && secondCat.children.find(cat => cat.id === catId);
      } else {
        theCat = this.categories && this.categories.find(cat => cat.id === catId);
      }

      children = theCat && theCat.children;
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
