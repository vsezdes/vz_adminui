<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    class="lighten-3"
    transition="dialog-top-transition">
    <perfect-scrollbar v-if="item" ref="previewScrollbar">
      <v-toolbar class="preview-toolbar" color="base_header">
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
            <v-col :cols="12" :xl="9">
                <v-carousel
                  continuous
                  height="calc(100vh - 120px)"
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
            <v-col :cols="12" :xl="3">
              <v-card flat tile class="item-details px-5 py-3">
                <v-chip
                  outlined
                  class="mt-n2 mb-0 mr-1 py-5 price"
                  color="base_header"
                >
                  <v-icon size="22" class="mr-2 mb-1">mdi-cash-multiple</v-icon>
                  {{ item.price || 0 }} &nbsp;<small class="mt-1 ml-1"> сом</small>
                </v-chip>
                <v-btn
                  class="mt-1 mx-2 mb-3"
                  color="info"
                  @click="showDetails"
                >
                  <v-icon size="18" class="mr-0">mdi-script-text</v-icon>
                  <v-icon size="18" class="mr-2 ml-0">mdi-arrow-down</v-icon>
                  Описание
                </v-btn>
                <div class="quantity-buy float-right">
                  <div class="btn-holder">
                    <v-btn x-small icon outlined @click="quantity++">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn x-small icon outlined :disabled="quantity < 2" @click="quantity--">
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </div>
                  <v-btn
                    class="buy"
                    color="primary"
                    large
                    fab
                    @click="onBuy"
                  >
                    <span v-if="quantity > 1">+ {{ quantity }}</span>
                    <v-icon :size="quantity > 1 ? 22 : 28">mdi-cart-arrow-down</v-icon>
                  </v-btn>
                </div>
                <v-divider light/>
                <v-card-subtitle>
                  <v-chip color="accent" outlined class="my-2 pa-2" x-small>{{ item.categoryName}} </v-chip>
                  <br/>
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
    quantity: 1,
  }),
  methods: {
    ...mapActions(['addToCart']),
    onBuy() {
      this.addToCart({ ...this.item, quantity: this.quantity });
      this.quantity = 1;
    },
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
    dialog(val) {
      if (!val) {
        this.quantity = 1;
      }
    },
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
  padding-bottom: 56px !important;
}
.preview-toolbar {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 30;
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
.quantity-buy {
  padding-right: 95px;
  .buy {
    right: 20px;
    top: -5px;
    z-index: 30;
    letter-spacing: -1px;
    position: absolute;
  }
  .btn-holder {
    position: relative;
    top: -10px;
    .v-btn:first-child {
      top: 0;
    }
    .v-btn {
      position: absolute;
      top: 35px;
      left: 0;
    }
  }
}

</style>
<style scoped>
.ps {
  padding-top: 56px;
}
.ps-container > .ps-scrollbar-x-rail > .ps-scrollbar-x {
  transition: .2s linear left;
  /* maybe other vendor-prefixed transitions */
}
.ps-container > .ps-scrollbar-y-rail > .ps-scrollbar-y {
  transition: .2s linear top;
  /* maybe other vendor-prefixed transitions */
}
</style>
