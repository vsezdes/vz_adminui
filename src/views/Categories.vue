<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <CategoryForm
          :categories="categories"
        />
      </v-col>
      <v-col>
        <v-card
          v-for="cat in categories"
          :key="cat.id"
          class="ma-3"
          max-width="300"
        >
          <v-card-title>
            <v-icon>mdi-{{ cat.icon }}</v-icon>
            {{ cat.title }}
          </v-card-title>
          <v-card-text>
            <div v-for="cat2 in cat.children" :key="cat2.id">
              - <v-icon>mdi-{{ cat2.icon }}</v-icon>{{ cat2.title }}
              <div v-for="cat3 in cat2.children" :key="cat3.id">
                - - - <v-icon>mdi-{{ cat3.icon }}</v-icon>{{ cat3.title }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CategoryForm from '@/components/CategoryForm';
import CATEGORIES_QUERY from '@/gql/categories.graphql';

export default {
  components: {
    CategoryForm
  },
  apollo: {
    categories: CATEGORIES_QUERY,
  },
}
</script>
