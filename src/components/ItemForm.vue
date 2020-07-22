<template>
  <FormWrapper
    title="Добавить товар"
    :show="show"
    @close="onClose"
    icon="mdi-shopping-outline"
  >
    <v-stepper class="form-stepper" v-model="step" vertical non-linear>
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
            v-if="showSecond"
            v-model="categorySecond"
            label="Категория II уровня"
            :items="getChildren(categoryFirst)"
            dense
          />
          <v-select
            v-if="showThird"
            v-model="categoryThird"
            label="Категория III уровня"
            :items="getChildren(categorySecond)"
            dense
          />
          <v-select
            v-if="showFourth"
            v-model="categoryFourth"
            label="Категория IV уровня"
            :items="getChildren(categoryThird)"
            dense
          />
        </v-form>
        <v-spacer />
        <v-btn
          :disabled="!catsSelected"
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
        />
      </v-stepper-content>
    </v-stepper>
      <v-btn
        class="mt-4"
        color="green"
        absolute
        right
        outlined
        :disabled="!(itemName && itemPrice && images.length > 0)"
        @click="save"
        :loading="loading"
      >
        <v-icon>mdi-content-save-outline</v-icon>
        Сохранить</v-btn>
  </FormWrapper>
</template>

<script>
import { mapActions } from 'vuex';
import gql from 'graphql-tag';
import CATEGORIES_QUERY from '@/gql/categories.graphql';
import { LAST_ITEMS } from '@/gql/items.graphql';
import VImageInput from 'vuetify-image-input';
import ImageUploader from '@/components/ImageUploader.vue';
// import ItemPreview from '@/components/ItemPreview.vue';
import FormWrapper from '@/components/FormWrapper.vue';


export default {
  components: {
    ImageUploader,
    FormWrapper,
    [VImageInput.name]: VImageInput,
  },
  apollo: {
    categories: CATEGORIES_QUERY,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      categoryFirst: null,
      categorySecond: null,
      categoryThird: null,
      categoryFourth: null,
      valid: false,
      detailsValid: false,
      id: null,
      step: 1,
      itemName: '',
      itemPrice: '',
      itemDescription: '',
      images: [],
      selectedCats: [],
      flatCats: [],
    };
  },
  computed: {
    rootCategories() {
      return this.categories && this.categories.map(cat => ({
        text: cat.title,
        value: cat.id,
      }))
    },
    catsSelected() {
      const cat = this.getCatById(this.itemCategory);
      return cat && (!cat.children || cat.children.length === 0);
    },
    itemCategory() {
      return this.categoryFourth || this.categoryThird || this.categorySecond || this.categoryFirst;
    },
    catString() {
      let str = '';
      const cat1 = this.getCatById(this.categoryFirst);
      const cat2 = this.getCatById(this.categorySecond);
      const cat3 = this.getCatById(this.categoryThird);
      const cat4 = this.getCatById(this.categoryFourth);
      if (cat1) str += cat1.title;
      if (cat2) str += ' » ' + cat2.title;
      if (cat3) str += ' » ' + cat3.title;
      if (cat4) str += ' » ' + cat4.title;
      return str.toLowerCase();
    },
    showSecond() {
      const cat = this.getCatById(this.categoryFirst);
      return cat && cat.children && cat.children.length > 0;
    },
    showThird() {
      const cat = this.getCatById(this.categorySecond);
      return cat && cat.children && cat.children.length > 0;
    },
    showFourth() {
      const cat = this.getCatById(this.categoryThird);
      return cat && cat.children && cat.children.length > 0;
    },
    itemPreview() {
      return {
        title: this.itemName,
        price: this.itemPrice,
        description: this.itemDescription,
        thumb: this.images.length > 0 && this.images[0].url,
        images: this.images,
      }
    }
  },
  watch: {
    item(val) {
      if (!val) return;
      console.warn('item:', val, this.images)
      this.id = val.id;
      this.itemName = val.title;
      this.itemPrice = val.price;
      this.images = val.images.map(i => ({
        asset_id: i.asset_id,
        url: i.url,
      }));
      this.fillCategoriesByLast(val.categoryId);
      this.step = 2;
    },
    categories(val, oldVal) {
      if (val && !oldVal) this.flattenCategories();
    },
    categoryFirst(val) {
      if (val) {
        this.categorySecond = null;
        this.categoryThird = null;
        this.categoryFourth = null;
      }
    },
    categorySecond(val) {
      if (val) {
        this.categoryThird = null;
        this.categoryFourth = null;
      }
    },
    categoryThird(val) {
      if (val) {
        this.categoryFourth = null;
      }
    },
  },
  methods: {
    ...mapActions(['alert']),
    fillCategoriesByLast(id) {
      const cats = [];
      let cat = null;
      for (let i = 0; i < 4; i++) {
        cat = this.getCatById((cat && cat.parentId) || (i === 0 && id));
        if (cat) cats.unshift(cat);
      }
      if (cats.length === 0) return;
      if (cats[0]) this.categoryFirst = cats[0].id;
      this.$nextTick(() => {
        if (cats[1]) this.categorySecond = cats[1].id;
        this.$nextTick(() => {
          if (cats[2]) this.categoryThird = cats[2].id;
          this.$nextTick(() => {
            if (cats[3]) this.categoryFourth = cats[3].id;
          });
        });
      });
    },
    onClose() {
      this.$emit('close');
      this.step = 1;
      this.categoryFirst = null;

    },
    getCatById(catId) {
      if (!catId) return;
      return this.flatCats && this.flatCats.find(c => c.id === catId);
    },
    flattenCategories(children) {
      if (!children) {
        this.flatCats = [];
        this.categories.forEach(cat => {
          if (cat.children) this.flattenCategories(cat.children);
          this.flatCats.push(cat);
        });
      } else {
        children.forEach(cat => {
          if (cat.children) this.flattenCategories(cat.children);
          this.flatCats.push(cat);
        })
      }
    },
    getChildren(catId) {
      const cat = this.getCatById(catId);
      return cat && cat.children.map(cat => ({
        text: cat.title,
        value: cat.id,
      }));
    },
    save() {
      this.$apollo.mutate({
        // Query
        mutation: gql`mutation saveItem($id: Int, $data: ItemInput!) {
          saveItem(data: $data, id: $id) {
            id
            title
            price
            description
            category
            categoryId
            images {
              asset_id
              url
            }
          }
        }`,
        // Parameters
        variables: {
          id: this.id,
          data: {
            title: this.itemName,
            price: parseFloat(this.itemPrice),
            categoryId: this.itemCategory,
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
          const item = data.lastItems.find(i => i.id === this.id);
          let lastItems = null;
          if (item) {
            lastItems = [...data.lastItems.map(i => {
              if (i.id === this.id) return saveItem;
              return i;
            })];
          } else {
            lastItems = [...data.lastItems];
            lastItems.unshift(saveItem);
          }
          store.writeQuery({ query: LAST_ITEMS, data: { lastItems } })
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
        this.alert({
          type: 'success',
          message: 'Товар добавлен',
        });
        console.log(data)
        this.loading = false;
        this.itemName = '';
        this.itemPrice = '';
        this.images = [];
        this.$emit('close');
      }).catch((error) => {
        this.alert({
          type: 'error',
          message: error,
        });
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
.form-stepper.v-stepper {
  border: none;
  box-shadow: none;
  padding: 0;
  .v-stepper__step {
    padding: 10px;
  }
  .v-stepper__content {
    margin: -10px -54px -10px 22px;
  }
}
</style>
