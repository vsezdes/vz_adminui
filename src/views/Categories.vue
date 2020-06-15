<template>
  <v-container fluid>
    <v-progress-linear v-if="loading" :indeterminate="true" />
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
            <v-btn icon @click="onDelete(cat.id)"><v-icon>mdi-minus</v-icon></v-btn>
          </v-card-title>
          <v-card-text>
            <div v-for="cat2 in cat.children" :key="cat2.id">
              - <v-icon>mdi-{{ cat2.icon }}</v-icon>{{ cat2.title }}
                <v-btn icon @click="onDelete(cat2.id)"><v-icon>mdi-minus</v-icon></v-btn>
              <div v-for="cat3 in cat2.children" :key="cat3.id">
                - - - <v-icon>mdi-{{ cat3.icon }}</v-icon>{{ cat3.title }}
                <v-btn icon @click="onDelete(cat3.id)"><v-icon>mdi-minus</v-icon></v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-navigation-drawer
      class="pa-0"
      v-model="drawer"
      temporary
      fixed
      right
      width="400px"
    >
      <CategoryForm
        :categories="categories"
      />
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import gql from 'graphql-tag';
import CategoryForm from '@/components/CategoryForm';
import CATEGORIES_QUERY from '@/gql/categories.graphql';

export default {
  components: {
    CategoryForm
  },
  data: () => ({
    loading: false,
    drawer: false,
  }),
  methods: {
    onDelete(id) {
      this.loading = true;
      this.$apollo.mutate({
        // Query
        mutation: gql`mutation delCat($id: Int!) {
          delCategory(id: $id) {
            id
            title
            parent {
              id
            }
          }
        }`,
        // Parameters
        variables: {
          id,
        },
        update: (store, { data: { delCategory }}) => {
          const data = store.readQuery({ query: CATEGORIES_QUERY });
          console.warn(data, delCategory);
          if (!delCategory.parent || !delCategory.parent.id) {
            data.categories = [...data.categories.filter(c => c.id !== id)];
            store.writeQuery({ query: CATEGORIES_QUERY, data })
          } else {
            let dataRemoved = false;
            let updatedCats = data.categories.map(c => {
              if (c.id === delCategory.parent.id) {
                dataRemoved = true;
                c.children = [...c.children.filter(c => c.id !== id)];
              }
              return c;
            });
            // if it seems like third-level cat added
            if (!dataRemoved) {
              updatedCats = data.categories.map(c => {
                return {
                  ...c,
                  children: c.children.map(child => {
                    if (child.id === delCategory.parent.id) {
                      child.children = [...child.children.filter(c => c.id !== id)];
                    }
                    return child;
                  }),
                };
              });
            }
            store.writeQuery({ query: CATEGORIES_QUERY, data: { categories: updatedCats } })
          }
        },
      }).then((data) => {
        // Result
        console.log(data)
        this.loading = false;
      }).catch((error) => {
        // Error
        console.error(error)
        this.loading = false;
      })
    },
  },
  apollo: {
    categories: CATEGORIES_QUERY,
  },
}
</script>
