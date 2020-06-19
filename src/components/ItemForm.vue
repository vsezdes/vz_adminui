<template>
  <v-container>
    <v-card
      class="mx-auto pa-0"
      outlined
      flat
    >
    <v-card-title class="headline">Добавить товар</v-card-title>
    <v-stepper v-model="step" vertical non-linear>
      <v-stepper-step :complete="step > 1" step="1" @click.native="step = 1">
        Категории
        <small>{{ catString }}</small>
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-form v-model="valid" class="my-4">
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
        <v-spacer />
        <v-btn
          :disabled="!categoryThird"
          fab outlined small absolute color="primary"
          class="next-btn mr-3"
          v-if="step === 1"
          @click="step = 2"><v-icon>mdi-arrow-right</v-icon></v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="step > 2" step="2">
        Детали
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-form
          v-model="detailsValid"
        >
          <v-text-field
            label="Наименование товара"
            v-model="itemName"
            :rules="[
              v => v.length > 4 || 'Обязательно к заполнению (5 букв)'
            ]"
          />
          <v-text-field
            label="Цена товара"
            v-model="itemPrice"
            :rules="[
              v => !!v || 'Обязательно к заполнению'
            ]"
          />
        </v-form>
        <v-btn
          :disabled="!detailsValid"
          fab outlined small absolute color="primary"
          class="next-btn mr-3"
          v-if="step === 2"
          @click="step = 3"><v-icon>mdi-arrow-right</v-icon></v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="step > 3" step="3">
        Фото
      </v-stepper-step>

      <v-stepper-content step="3">
        <ImageUploader
          :images="images"
          v-on:update:images="images.push($event)"
          v-on:delete:images="images = images.filter(i => i.asset_id !== $event)"
          :show="step === 3"
          @next="step = 4"
        />
      </v-stepper-content>

      <v-stepper-step step="4">Сохранить</v-stepper-step>
      <v-stepper-content step="4">
        <ItemPreview :data="item" />
        <v-btn text @click="drawer = false">Отмена</v-btn>
        <v-btn color="primary" @click="save" :loading="loading">Записать</v-btn>
      </v-stepper-content>
    </v-stepper>
    <v-card-actions>

    </v-card-actions>
  </v-card>

  </v-container>
</template>

<script>
import gql from 'graphql-tag';
import CATEGORIES_QUERY from '@/gql/categories.graphql';
import { LAST_ITEMS } from '@/gql/items.graphql';
import VImageInput from 'vuetify-image-input';
import ImageUploader from '@/components/ImageUploader.vue';
import ItemPreview from '@/components/ItemPreview.vue';


export default {
  components: {
    ImageUploader,
    ItemPreview,
    [VImageInput.name]: VImageInput,
  },
  apollo: {
    categories: CATEGORIES_QUERY,
  },
  data() {
    return {
      loading: false,
      categoryFirst: null,
      categorySecond: null,
      categoryThird: null,
      valid: false,
      detailsValid: false,
      step: 1,
      itemName: '',
      itemPrice: '',
      images: [],
    };
  },
  computed: {
    rootCategories() {
      return this.categories && this.categories.map(cat => ({
        text: cat.title,
        value: cat.id,
      }))
    },
    catString() {
      let str = '';
      const cat1 = this.categories && this.categories.find(c => c.id === this.categoryFirst);
      if (cat1) {
        str += cat1.title;
        const cat2 = cat1.children.find(c => c.id === this.categorySecond);
        if (cat2) {
          str += ' » ' + cat2.title;
          const cat3 = cat2.children.find(c => c.id === this.categoryThird);
          if (cat3) str += ' » ' + cat3.title;
        }
      }
      return str.toLowerCase();
    },
    item() {
      return {
        title: this.itemName,
        price: this.itemPrice,
        thumb: this.images.length > 0 && this.images[0].url,
        images: this.images,
      }
    }
  },
  methods: {
    subRootCategories(catId, nextLevel = false) {
      const items = [];
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
    },
    save() {
      this.$apollo.mutate({
        // Query
        mutation: gql`mutation saveItem($id: Int, $data: ItemInput!) {
          saveItem(data: $data, id: $id) {
            id
            title
            price
            category
            images {
              asset_id
              url
            }
          }
        }`,
        // Parameters
        variables: {
          data: {
            title: this.item.title,
            price: parseFloat(this.item.price),
            categoryId: this.categoryThird,
            images: this.images.map(i => ({
              ...i,
              coordinates: JSON.stringify(i.coordinates),
              tags: JSON.stringify(i.tags),
            })),
          },
        },
        // Update the cache with the result
        // The query will be updated with the optimistic response
        // and then with the real result of the mutation
        update: (store, { data: { saveItem }}) => {
          const data = store.readQuery({ query: LAST_ITEMS });
          console.warn(data, saveItem);
          data.lastItems.unshift(saveItem);
          store.writeQuery({ query: LAST_ITEMS, data })
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
    },
  }
}
</script>

<style lang="scss">
.v-card .v-form {
  width: 100%;
}
.v-stepper__content {
  position: relative;
  .v-btn.next-btn {
    right: 50px;
    bottom: -10px;
  }
}
</style>
