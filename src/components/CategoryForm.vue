<template>
  <v-container>
    <v-card-title class="headline">{{ !id ? 'Добавить категорию' : 'Изменить категорию' }}</v-card-title>
    <v-row class="text-center">
      <v-col cols="12">
        <v-form v-model="valid" lazy-validation ref="form">
          <v-text-field
            label="Имя категории"
            v-model="title"
            :rules="[
              v => !!v || 'Обязательно к заполнению'
            ]"
          />
          <v-text-field
            label="Ярлык категории"
            v-model="slug"
            :rules="[
              v => !!v || 'Обязательно к заполнению'
            ]"
          />
          <v-autocomplete
            :items="icons"
            :append-icon="icon && `mdi-${icon}`"
            color="white"
            item-text="name"
            label="Иконка категории"
            v-model="icon"
            ref="iconselector"
            :rules="[
              v => !!v || 'Обязательно к заполнению'
            ]"
            @change="$refs.iconselector.blur()"
          >
            <template v-slot:item="{ item }">
              <v-list-item-avatar
                color="indigo"
                class="headline font-weight-light white--text"
              >
                <v-icon dark>{{ `mdi-${item}` }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-select
            v-show="!id"
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
          <v-select
            v-if="categorySecond && subSubRootCategories.length > 1"
            v-model="categoryThird"
            label="Родительская категория III уровня"
            :items="subSubRootCategories"
          />
          <v-btn block color="green" outlined @click="validate" :loading="loading">Сохранить</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import icons from '@/icons'
import gql from 'graphql-tag';
import CATEGORIES_QUERY from '@/gql/categories.graphql';
const CYRLAT = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"-","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"-","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"-","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"-","б":"b","ю":"yu", " ": "-"};

export default {
  name: 'CategoryForm',
  props: {
    categories: {
      type: Array,
      default: () => ([]),
    },
    item: {
      type: Object,
      default: () => {},
    },
    selectCat: {
      type: Number,
      default: null,
    }
  },
  data: () => ({
    id: null,
    title: null,
    slug: null,
    icon: null,
    valid: false,
    loading: false,
    categoryFirst: null,
    categorySecond: null,
    categoryThird: null,
    icons,
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
    },
    subSubRootCategories() {
      const items = [{
        text: 'Нет',
        value: 0,
      }];
      const grandChildren = ((this.categories && this.categories.find(cat => cat.id === this.categoryFirst)) || {}).children;
      const { children } = (grandChildren && grandChildren.find(cat => cat.id === this.categorySecond)) || {};
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
    title(val) {
      this.slug = this.transliterate(val);
    },
    selectCat(val) {
      if (val) {
        this.categories.forEach(c1 => {
          if (c1.id === val) {
            this.categoryFirst = c1.id;
            this.categorySecond = null;
            this.categoryThird = null;
            return;
          }
          c1.children.forEach(c2 => {
            if (c2.id === val) {
              this.categoryFirst = c1.id;
              this.$nextTick(() => {
                this.categorySecond = c2.id
                this.categoryThird = null;
              });
              return;
            }
            c2.children.forEach(c3 => {
              if (c3.id === val) {
                this.categoryFirst = c1.id;
                this.$nextTick(() => {
                  this.categorySecond = c2.id
                  this.categoryThird = c3.id;
                });

                return;
              }
            })
          });
        });
      } else {
        this.categoryFirst = null;
        this.categorySecond = null;
        this.categoryThird = null;
      }
    },
    item(val) {
      if (!val) {
        this.title = null;
        this.icon = null;
        this.slug = null;
        this.id = null;
        this.categoryFirst = null;
        this.categorySecond = null;
        this.categoryThird = null;
      } else {
        this.title = val.title;
        this.icon = val.icon;
        this.slug = val.slug;
        this.id = val.id;
      }
    },
    categoryFirst(val) {
      if (val) this.categorySecond = null;
    }
  },
  methods: {
    ...mapActions(['alert']),
    validate() {
      this.$refs.form.validate();
      this.$nextTick(() => {
        if (this.valid) this.submitForm();
      });
    },
    submitForm() {

      if (!this.valid) return false;
      this.loading = true;
      this.$apollo.mutate({
        // Query
        mutation: gql`mutation saveCat($id: Int, $data: CategoryInput!) {
          saveCategory(data: $data, id: $id) {
            id
            title
            slug
            icon
            parent
            children {
              id
            }
          }
        }`,
        // Parameters
        variables: {
          id: this.id,
          data: {
            title: this.title,
            slug: this.slug,
            icon: this.icon,
            parentId: this.categoryThird || this.categorySecond || this.categoryFirst,
          },
        },
        // Update the cache with the result
        // The query will be updated with the optimistic response
        // and then with the real result of the mutation
        update: (store, { data: { saveCategory }}) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: CATEGORIES_QUERY });
          console.warn(data, saveCategory);
          if (this.id) return;
          if (!saveCategory.parent) {
            data.categories.push(saveCategory);
            // Write our data back to the cache.
            store.writeQuery({ query: CATEGORIES_QUERY, data })
          } else {
            let dataAdded = false;
            let updatedCats = data.categories.map(c => {
              if (c.id === saveCategory.parent) {
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
                    if (child.id === saveCategory.parent) {
                      dataAdded = true;
                      child.children.push(saveCategory);
                    }
                    return child;
                  }),
                };
              });
            }
            // if it seems like fourth-level cat added
            if (!dataAdded) {
              updatedCats = data.categories.map(c => {
                return {
                  ...c,
                  children: c.children.map(child => {
                    return {
                      ...child,
                      chidlren: child.children.map(grandchild => {
                        if (grandchild.id === saveCategory.parent) {
                          grandchild.children.push(saveCategory);
                        }
                        return grandchild;
                      })
                    };
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
        this.alert({
          type: 'success',
          message: this.id ? 'Категория изменена' : 'Категория добавлена',
        });
        this.loading = false;
        this.title = null;
        this.icon = null;
        this.slug = null;
        this.$emit('close', true);
      }).catch((error) => {
        // Error
        console.error(error)
        this.alert({
          type: 'error',
          message: error,
        });
        this.loading = false;
      })
    },
    transliterate(word){
      return word.split('').map(function (char) {
        return CYRLAT[char] || char;
      }).join("");
    }
  }
}
</script>
