<template>
  <div
    class="image-uploader"
    v-if="show"
  >
    <div class="item-img"><v-img></v-img></div>
    <div class="item-img" v-for="img in images" :key="img.asset_id">
      <v-img :alt="img.original_filename"  width="180" height="90" :src="img.url" />
      <v-btn
        icon small absolute
        color="red"
        dark
        class="close-img"
        @click="onDelete(img.asset_id)"><v-icon>mdi-close</v-icon></v-btn>
    </div>
    <v-btn
      outlined color="primary"
      :disabled="images.length > 4"
      class="add-img mr-3"
      @click="cloudinaryUploader"><v-icon>mdi-cloud-upload</v-icon></v-btn>
  </div>
</template>

<script>
export default {
  name: 'ImageUploader',
  data: () => ({
    widget: null,
    lastUploaded: null,
  }),
  props: {
    images: {
      type: Array,
      default: () => ([]),
    },
    show: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    cloudinaryUploader() {
      this.widget && this.widget.open();
    },
    onImageReady(error, result) {
      if (!error && result && result.event === "success") {
        console.error(result);
        this.$emit('update:images', result.info);
      }
    },
    onDelete(id) {
      this.$emit('delete:images', id);
    },
  },
  mounted() {
    this.widget = window.cloudinary.createUploadWidget({
      cloudName: 'vsetut2020',
      apiKey: '486853485234433',
      cropping: true,
      croppingDefaultSelectionRatio: 16/9,
      croppingAspectRatio: 16/9,
      croppingShowBackButton: false,
      showSkipCropButton: false,
      uploadPreset: 'bc5bf78g'}, this.onImageReady
    )
  },
}
</script>

<style lang="scss">
.image-uploader {
  position: relative;
  padding: 10px 0 25px;
  display: flex;
  flex-wrap: wrap;
  .add-img {
    width: 152px;
    height: 92px !important;
    display: inline-block;
    margin-right: 10px;
    position: absolute;
    top: 10px;
    left: 0;
  }
  .item-img {
    width: 50%;
    max-width: 46%;
    height: 92px;
    flex: 1;
    border: 1px solid #e7e7e7;
    border-radius: 3px;
    position: relative;
    margin: 0 13px 20px 0;
    .close-img {
      position: absolute;
      right: -12px;
      top: -12px;
      border: 1px solid #EEE;
      background: #FFF;
    }
    &:first-child {
      // margin-left: 180px;
      // display: none;
      visibility: hidden;
    }
  }
  .v-btn.next-btn {
    bottom: 0px !important;
    right: 0px !important;
  }
}

</style>
