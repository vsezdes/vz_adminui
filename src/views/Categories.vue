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
          v-for="(cat) in categories"
          :key="cat.id"
          class="ma-3"
          max-width="300"
        >
          <v-card-title class="headline">
            <v-icon class="mb-1 mr-3">{{ `mdi-${cat.icon}` }}</v-icon>
            {{ cat.title }}
            <v-spacer />
            <div class="controls">
              <v-btn class="add-btn" small icon @click="onAddChild(cat.id)"><v-icon small>mdi-plus-box</v-icon></v-btn>
              <v-btn class="edit-btn" small icon @click="onEdit(cat)"><v-icon small>mdi-pencil</v-icon></v-btn>
            </div>
            <v-btn :disabled="cat.children.length > 0" small icon @click="onDelete(cat.id)"><v-icon small>mdi-close</v-icon></v-btn>

          </v-card-title>
          <v-card-text>
            <v-divider />
            <v-treeview
              :items="cat.children"
              dense
              open-all
              item-key="id"
              hoverable
              shaped
              item-text="title"
            >
              <template v-slot:prepend="{ item }">
                <v-icon>
                  {{ `mdi-${item.icon}` }}
                </v-icon>
              </template>
              <template v-slot:append="{ item }">
                <div class="controls">
                  <v-btn class="add-btn" small icon @click="onAddChild(item.id)"><v-icon small>mdi-plus-box</v-icon></v-btn>
                  <v-btn class="edit-btn" small icon @click="onEdit(item)"><v-icon small>mdi-pencil</v-icon></v-btn>
                </div>
                <v-btn :disabled="item.children && item.children.length > 0" small icon @click="onDelete(item.id)"><v-icon small>mdi-close</v-icon></v-btn>
              </template>
            </v-treeview>
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
        :item="theCat"
        :select-cat="newCategoryParent"
        @close="drawer = false"
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
    newCategoryParent: null,
    theCat: null,
    drawer: false,
  }),
  watch: {
    newCategoryParent(val) {
      if (val) {
        this.drawer = true;
      }
    },
    theCat(val) {
      if (val) {
        this.drawer = true;
      }
    },
    drawer(val) {
      if (!val) {
        this.theCat = null;
        this.newCategoryParent = null;
      }
    }
  },
  methods: {
    onAddChild(id) {
      this.newCategoryParent = id;
    },
    onEdit(cat) {
      this.theCat = cat;
    },
    onDelete(id) {
      if (!window.confirm('Удалить категорию?')) return;
      this.loading = true;
      this.$apollo.mutate({
        // Query
        mutation: gql`mutation delCat($id: Int!) {
          delCategory(id: $id) {
            id
            title
          }
        }`,
        // Parameters
        variables: {
          id,
        },
        update: (store, { data: { delCategory }}) => {
          const data = store.readQuery({ query: CATEGORIES_QUERY });
          if (!delCategory.id) return;

          const categories = data.categories.filter(c1 => c1.id !== delCategory.id).map(c1 => ({
            ...c1,
            children: c1.children.filter(c2 => c2.id !== delCategory.id).map(c2 => ({
              ...c2,
              children: c2.children.filter(c3 => c3.id !== delCategory.id).map(c3 => ({
                ...c3,
                children: c3.children.filter(c4 => c4.id !== delCategory.id),
              })),
            }))
          }));
          console.warn(data, categories, delCategory);
          store.writeQuery({ query: CATEGORIES_QUERY, data: { categories } });
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

<style>
.v-treeview-node__children .v-treeview-node__children .add-btn {
  display: none !important;
}

.v-treeview-node__content .controls,
.headline .controls {
  display: none;
}
.v-treeview-node__content:hover .controls,
.headline:hover .controls {
  display: block;
  position: absolute;
  width: 100px;
  right: 10px;
  text-align: right;
  padding-right: 30px;
}
</style>
