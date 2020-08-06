<style scoped >
.control_buttons{
  top: -50px;
  min-height: 15px;
  min-width: 15px;
  //position: relative;
  background: #CADADA;
}

</style>

<template>
  <v-flex>
    <v-btn
      style="left: -35px;background-color: red;  top: -140px;
"
      icon
      color="white"
      class="control_buttons"
    @click="$delete(form, 'avatar');">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-btn
      style="right: -35px"
      class="control_buttons"
      icon
      @click="onButtonClick"
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <input
      ref="uploader"
      class="d-none"
      type="file"
      @change="onAddFiles"
      hidden
    />
    <v-img :src="file.url"></v-img>
  </v-flex>
</template>
<script>
export default {
  name: 'SingleImageUpload',
  data() {
    return {
      // loading:avatar_loading,
      file: '',
    }
  },
  props: ['avatar_loading','form'],
  methods: {
    onButtonClick() {
      // this.$emit('loading',true)
      this.isSelecting = true
      window.addEventListener('focus', () => {
        this.isSelecting = false
      }, {once: true})
      this.$refs.uploader.click()
    },
    onAddFiles(file) {
      this.avatar_loading = true
      this.uploadFileToCloudinary(file.target.files[0]).then((fileResponse) => {
        if (fileResponse.format === 'png' || fileResponse.format === 'jpg') {this.$set(this.form, 'avatar', fileResponse)}
      });
      // this.$emit('loading',false)
    },
    uploadFileToCloudinary(file) {
      // this.$emit('loading' , true)
      return new Promise(function (resolve, reject) {
        //Ideally these to lines would be in a .env file
        const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/vsetut2020/upload';
        const CLOUDINARY_UPLOAD_PRESET = 'bc5bf78g';
        let formData = new FormData();
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'cloudinary-demo');
        formData.append('file', file);
        let request = new XMLHttpRequest();
        request.open('POST', CLOUDINARY_URL, true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.onreadystatechange = () => {
          // File uploaded successfully
          if (request.readyState === 4 && request.status === 200) {
            let response = JSON.parse(request.responseText);
            resolve(response);
          }
          // Not successfull, let find our what happened
          if (request.status !== 200) {
            formData=''
            let response = JSON.parse(request.responseText);
            let error = response.error.message;
            this.errorText = 'error uploading files ' + error;
            reject(error);
          }
        };
        request.onerror = (err) => {
          alert('error: ' + err);
          reject(err);
        };
        request.send(formData);
      });
    },
  }
}
</script>
