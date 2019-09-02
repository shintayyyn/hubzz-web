<template>
  <div class="relative" :style="[{ width: width }, {height: height}]">
    <img :src="imageUrl" v-if="imageUrl" class="object-cover rounded-full w-full h-full" />
    <img v-if="src && !imageUrl" :src="src" class="object-cover rounded-full w-full h-full" />
    <svgicon
      v-if="!src && !imageUrl"
      color="#e7eced #556080"
      name="user"
      :height="height"
      :width="width"
    />
    <div v-if="type == 'update'" class="icon absolute top-0 right-0">
      <input
        type="file"
        name="input_file"
        id="input_file"
        class="hidden"
        @input="onFileInput($event)"
      />
      <label for="input_file" class="flex items-center cursor-pointer">
        <svgicon class="opacity-50 hover:opacity-75" name="camera" height="36" width="36" />
      </label>
    </div>
    <div
      class="absolute top-0 left-0 bg-red-500 p-1 text-xs sm:text-sm text-white"
      v-if="error"
    >{{error}}</div>
    <AppLoading class="rounded-full" :loading="loading" :message="'Uploading'" />
  </div>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading";
export default {
  components: {
    AppLoading
  },
  props: {
    width: {
      default: "175px",
      type: String
    },
    height: {
      default: "175px",
      type: String
    },
    src: {
      type: String,
      required: true
    },
    type: String
  },
  data() {
    return {
      loading: false,
      imageUrl: "",
      error: ""
    };
  },
  methods: {
    onFileInput(e) {
      this.error = "";
      if (e.target.files[0].type.split("/")[0] !== "image") {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: ["Invalid file format"]
        });
      }
      let file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      this.loading = true;
      this.$axios
        .$put(`/api/v1/me/change-avatar`, formData)
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Avatar changed"]
          });
          this.getBase64(file, imageUrl => {
            this.imageUrl = imageUrl;
          });
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          if (err.response.data.status === 500) {
            this.error = "File size too large";
          }
          console.log(err.response.data);
        });
    },
    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    }
  }
};
</script>