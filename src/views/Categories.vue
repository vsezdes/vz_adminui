<template>
  <BaseTemplate :loading="loading || $apollo.loading">
    <v-container fluid>
      <v-btn
        fixed
        dark
        fab
        top
        :style="{ top: '80px' }"
        right
        color="pink"
        @click="showForm = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-row>
        <v-col
          v-for="(cat) in categories"
          :key="cat.id"
          cols="12"
          sm="6"
          md="4"
          lg="4"
        >
          <v-card
            class="ma-3"
          >
            <v-card-title class="headline root-title">
              <v-icon class="my-1 mx-2">{{ `mdi-${cat.icon}` }}</v-icon>
              {{ cat.title }}
              <v-spacer />
              <div class="controls">
                <v-btn class="add-btn" small icon @click="onAddChild(cat.id)"><v-icon small>mdi-plus-box</v-icon></v-btn>
                <v-btn class="edit-btn" small icon @click="onEdit(cat)"><v-icon small>mdi-pencil</v-icon></v-btn>
              </div>
              <v-btn :disabled="cat.children.length > 0" small icon @click="onDelete(cat.id)"><v-icon small>mdi-close</v-icon></v-btn>

            </v-card-title>
            <v-card-text>
              <v-treeview
                :items="cat.children"
                dense
                open-all
                item-key="id"
                hoverable
                shaped
                item-text="title"
              >
                <template v-slot:label="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <span v-on="on">{{ item.title }}</span>
                    </template>
                    <span>{{ item.title }}</span>
                  </v-tooltip>
                </template>
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
      <CategoryForm
        :show="showForm"
        :categories="categories"
        :item="theCat"
        :select-cat="newCategoryParent"
        @close="onFormClose"
      />
    </v-container>
  </BaseTemplate>
</template>

<script>
import gql from 'graphql-tag';
import CategoryForm from '@/components/CategoryForm';
import BaseTemplate from '@/views/BaseTemplate.vue';
import CATEGORIES_QUERY from '@/gql/categories.graphql';

export default {
  components: {
    CategoryForm,
    BaseTemplate,
  },
  data: () => ({
    loading: false,
    newCategoryParent: null,
    theCat: null,
    showForm: false,
  }),
  methods: {
    onFormClose() {
      this.theCat = null;
      this.newCategoryParent = null;
      this.showForm = false;
    },
    onAddChild(id) {
      this.newCategoryParent = id;
      this.showForm = true;
    },
    onEdit(cat) {
      this.theCat = cat;
      this.showForm = true;
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
.v-card__title.headline.root-title {
  background: #F5F5F5;
  font-size: 16px;
  padding: 5px;
}
.v-treeview-node__content:hover .controls,
.headline:hover .controls {
  display: block;
  position: absolute;
  width: 100px;
  right: 0px;
  top: 3px;
  text-align: right;
  padding-right: 30px;
  background: #F5F5F5;
}
.v-treeview-node__content:hover .controls{
  right: 7px;
  top: 6px;
}
</style>
