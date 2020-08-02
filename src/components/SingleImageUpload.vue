<template>
  <div class="all">
    <v-btn
      class="edit"
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
    />
    <v-img :src="file.url"></v-img>
  </div>
</template>
<script>
export default {
  name: 'SingleImageUpload',
  data() {
    return {
      file: ''
    }
  },
  props: ['form'],
  methods: {
    onButtonClick() {
      this.isSelecting = true
      window.addEventListener('focus', () => {
        this.isSelecting = false
      }, {once: true})
      this.$refs.uploader.click()
    },
    onAddFiles(file) {
      this.uploadFileToCloudinary(file.target.files[0]).then((fileResponse) => {
        this.$set(this.form, 'avatar', fileResponse);
      });
    },
    uploadFileToCloudinary(file) {
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
            let response = JSON.parse(request.responseText);
            let error = response.error.message;
            this.errorText = 'error uploading files ' + error;
            this.isError = true;
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
<style>
.all {
  right: -15px;
  top: 0;
  min-height: 15px;
  min-width: 15px;
  position: absolute;
}

.v-btn.edit {
  background: #CADADA;
}
</style>