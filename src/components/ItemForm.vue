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
        Укажите категорию
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
        Детали товара
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-form
          v-model="detailsValid"
        >
          <v-text-field
            label="Наименование товара"
            v-model="itemName"
            :rules="[
              v => v.length > 5 || 'Обязательно к заполнению (5 букв)'
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
        Фото товара
      </v-stepper-step>

      <v-stepper-content step="3">
        <ImageUploader
          :images="images"
          v-on:update:images="images.push($event)"
          v-on:delete:images="images = images.filter(i => i.asset_id !== $event)"
          :show="step === 3"
        />
      </v-stepper-content>

      <v-stepper-step step="4">View setup instructions</v-stepper-step>
      <v-stepper-content step="4">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="e6 = 1">Continue</v-btn>
        <v-btn text>Cancel</v-btn>
      </v-stepper-content>
    </v-stepper>
    <v-card-actions>

    </v-card-actions>
  </v-card>

  </v-container>
</template>

<script>
import CATEGORIES_QUERY from '@/gql/categories.graphql';
import VImageInput from 'vuetify-image-input';
import ImageUploader from '@/components/ImageUploader.vue';


export default {
  components: {
    ImageUploader,
    [VImageInput.name]: VImageInput,
  },
  apollo: {
    categories: CATEGORIES_QUERY,
  },
  data() {
    return {
      categoryFirst: null,
      categorySecond: null,
      categoryThird: null,
      valid: false,
      step: 3,
      itemName: '',
      imageData: '',
      images: [],
    };
  },
  updated() {
    console.log('img1', this.images);
  },
  computed: {
    rootCategories() {
      return this.categories && this.categories.map(cat => ({
        text: cat.title,
        value: cat.id,
      }))
    },
    catString() {
      return 'suprastin'
    },
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
    uploadSelectedImage() {
      console.error(this.imageData)
    }
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
