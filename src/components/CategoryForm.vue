<template>
  <BaseTemplate>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-form v-model="valid">
          <v-text-field
            label="Имя категории"
            v-model="title"
          />
          <v-text-field
            label="Ярлык категории"
            v-model="slug"
          />
          <v-text-field
            label="Иконка категории"
            v-model="icon"
          />
          <v-select
            v-model="categoryFirst"
            label="Родительская категория I уровня"
            :items="rootCategories"
          />
          <v-select
            v-if="categoryFirst && subRootCategories.length > 1"
            v-model="categorySecond"
            label="Родительская категория II уровня"
            :items="subRootCategories"
          />
          <v-btn dark block @click="submitForm" :loading="loading">Сохранить</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
  </BaseTemplate>
</template>

<script>
import gql from 'graphql-tag';
import CATEGORIES_QUERY from '@/gql/categories.graphql';
export default {
  name: 'CategoryForm',
  props: {
    categories: {
      type: Array,
      default: () => ([]),
    }
  },
  data: () => ({
    title: null,
    slug: null,
    icon: null,
    valid: false,
    loading: false,
    categoryFirst: null,
    categorySecond: null,
  }),
  computed: {
    rootCategories() {
      const items = [{
        text: 'Нет',
        value: 0,
      }];
      if (this.categories) {
        return [
          ...items,
          ...this.categories.map(cat => ({
            text: cat.title,
            value: cat.id,
          }))
        ];
      }
      return items;
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
  },
  watch: {
    categoryFirst(val) {
      if (val) this.categorySecond = null;
    }
  },
  methods: {
    submitForm() {
      console.warn(this.valid);
      this.loading = true;
      this.$apollo.mutate({
        // Query
        mutation: gql`mutation saveCat($id: Int, $data: CategoryInput!) {
          saveCategory(data: $data, id: $id) {
            id
            title
            slug
            icon
            parent {
              id
            }
            children {
              id
            }
          }
        }`,
        // Parameters
        variables: {
          data: {
            title: this.title,
            slug: this.slug,
            icon: this.icon,
            parentId: this.categorySecond || this.categoryFirst,
          },
        },
        // Update the cache with the result
        // The query will be updated with the optimistic response
        // and then with the real result of the mutation
        update: (store, { data: { saveCategory }}) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: CATEGORIES_QUERY });
          console.warn(data, saveCategory);
          if (!saveCategory.parent || !saveCategory.parent.id) {
            data.categories.push(saveCategory);
            // Write our data back to the cache.
            store.writeQuery({ query: CATEGORIES_QUERY, data })
          } else {
            let dataAdded = false;
            let updatedCats = data.categories.map(c => {
              if (c.id === saveCategory.parent.id) {
                dataAdded = true;
                c.children.push(saveCategory);
              }
              return c;
            });
            // if it seems like third-level cat added
            if (!dataAdded) {
              updatedCats = data.categories.map(c => {
                return {
                  ...c,
                  children: c.children.map(child => {
                    if (child.id === saveCategory.parent.id) {
                      child.children.push(saveCategory);
                    }
                    return child;
                  }),
                };
              });
            }
            store.writeQuery({ query: CATEGORIES_QUERY, data: { categories: updatedCats } })
          }
        },
        // Optimistic UI
        // Will be treated as a 'fake' result as soon as the request is made
        // so that the UI can react quickly and the user be happy
        // optimisticResponse: {
        //   __typename: 'Mutation',
        //   addTag: {
        //     __typename: 'Tag',
        //     id: -1,
        //     label: newTag,
        //   },
        // },
      }).then((data) => {
        // Result
        console.log(data)
        this.loading = false;
        this.title = null;
        this.icon = null;
        this.slug = null;
      }).catch((error) => {
        // Error
        console.error(error)
        this.loading = false;
      })
    }
  }
}
</script>
