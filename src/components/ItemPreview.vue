<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    class="lighten-3"
    transition="dialog-top-transition">
    <div v-if="item">
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
                  height="calc(100vh - 65px)"
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
                <v-chip
                  x-large
                  label
                  class="ma-2 price"
                  color="base_header"
                  text-color="primary"
                >
                  <v-icon size="48" class="mr-5">mdi-cash-multiple</v-icon>
                  {{ item.price || 0 }} &nbsp;<small class="ml-2"> сом</small>
                </v-chip>
                <v-divider light/>
                <v-chip color="accent" class="my-3">{{ item.category}} </v-chip>
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
    </div>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
  }),
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
    font-size: 40px;
  }
  .description {
    white-space: pre-line;
  }
}

</style>
