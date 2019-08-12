<template>
  <div class="avatar-container rounded-lg shadow-lg p-8 flex justify-center">
    <div class="relative avatar flex justify-center">
      <img :src="avatar.file.url" v-if="avatar && avatar.file && !imageUrl" />
      <img :src="imageUrl" v-else />
      <div class="icon absolute right-0 top-0">
        <input
          type="file"
          name="input_file"
          id="input_file"
          class="hidden"
          @input="onFileInput($event)"
        />
        <label for="input_file" class="cursor-pointer">
          <svgicon name="camera" height="42" width="42" />
        </label>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['avatar'],
  data() {
    return {
      imageUrl: ''
    }
  },
  methods: {
    onFileInput(e) {
      if (e.target.files[0].type.split('/')[0] !== 'image') {
        return
      }
      let file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      this.$axios.$put(`/api/v1/me/change-avatar`, formData).then(res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: ['Avatar changed'] })
        this.getBase64(file, (imageUrl) => {
          this.imageUrl = imageUrl
        })
      })
    },
    getBase64(img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },
  }
}
</script>
<style scoped>
.avatar-container {
  box-sizing: content-box;
  height: 170px;
}
.avatar {
  max-width: 170px;
  max-height: 170px;
  min-width: 170px;
  min-height: 170px;
}
img {
  border-radius: 50%;
}
</style>

