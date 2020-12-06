<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    class="lighten-3"
    transition="dialog-top-transition">
    <perfect-scrollbar v-if="item" ref="previewScrollbar">
      <v-toolbar fixed color="base_header">
        <v-icon class="mr-2">mdi-arrow-right-drop-circle</v-icon>
        <v-toolbar-title>{{ item.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon @click="$emit('close')">
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-sheet color="white" class="no-radius">
        <v-layout fluid>
          <v-row no-gutters>
            <v-col :cols="12" :lg="9">
                <v-carousel
                  continuous
                  height="calc(100vh - 115px)"
                  width="calc(100vw * 3/4)"
                  show-arrows-on-hover
                  :show-arrows="item.images.length > 1"
                >
                  <v-carousel-item
                    v-for="(slide, i) in item.images"
                    :key="i"
                  >
                    <v-sheet
                      color="#F5F5F5"
                      height="100%"
                      class="no-radius"
                    >
                      <v-row
                        class="fill-height"
                        align="center"
                        justify="center"
                      >
                        <div class="display-3">
                          <v-img
                            :style="{ border: '1px solid #EEE' }"
                            max-width="calc(100vw)"
                            :src="slide.url"
                          ></v-img>
                        </div>
                      </v-row>
                    </v-sheet>
                  </v-carousel-item>
                </v-carousel>
            </v-col>
            <v-col :cols="12" :lg="3">
              <v-card flat tile class="item-details px-5 py-2">
                <v-chip color="accent" outlined class="my-2 pa-3" small>{{ item.categoryName}} </v-chip>
                <v-btn
                  class="mt-0 mx-2"
                  color="info"
                  small
                  @click="showDetails"
                >
                  <v-icon size="18" class="mr-0">mdi-script-text</v-icon>
                  <v-icon size="18" class="mr-2 ml-0">mdi-arrow-down</v-icon>
                  Подробнее
                </v-btn>
                <v-btn
                  class="float-right mt-2 mx-2"
                  color="primary"
                  small
                  @click="addToCart(item)"
                >
                  <v-icon size="18" class="mr-1">mdi-cart-arrow-down</v-icon>
                  Купить
                </v-btn>
                <v-chip
                  outlined
                  class="float-right my-1 mr-2 pa-4 price"
                  small
                  color="base_header"
                >
                  <v-icon size="22" class="mr-2 mb-1">mdi-cash-multiple</v-icon>
                  {{ item.price || 0 }} &nbsp;<small class="mt-1 ml-1"> сом</small>
                </v-chip>
                <v-divider light/>
                <v-card-subtitle>
                  <strong>
                    {{ item.title }}
                  </strong>
                </v-card-subtitle>
                <v-card-text class="description">
                  {{ item.description }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-layout>
      </v-sheet>
    </perfect-scrollbar>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data: () => ({
    dialog: false,
  }),
  methods: {
    ...mapActions(['addToCart']),
    showDetails() {
      this.$refs.previewScrollbar.$el.scrollTop = this.$refs.previewScrollbar.$el.scrollHeight;
    }
  },
  computed: {
    thumb() {
      if (this.item && this.item.images && this.item.images[0]) {
        return this.item.images[0].url;
      }
      return null;
    }
  },
  watch: {
    item(val) {
      this.dialog = !!val;
    },
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    }
  }
}
</script>
<style lang="scss">
.no-radius {
  border-radius: 0 !important;
}
.item-details {
  .price {
    font-size: 18px !important;
    font-weight: bold;
  }
  .description {
    white-space: pre-line;
  }
}

</style>
<style scoped>
.ps-container > .ps-scrollbar-x-rail > .ps-scrollbar-x {
  transition: .2s linear left;
  /* maybe other vendor-prefixed transitions */
}
.ps-container > .ps-scrollbar-y-rail > .ps-scrollbar-y {
  transition: .2s linear top;
  /* maybe other vendor-prefixed transitions */
}
</style>
