<template>
  <div class="modal-container shadow-lg">
    <div class="p-8 max-w-3xl" v-if="notFound">
      <div @click="close" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" />
      </div>
      <div>Not Found</div>
    </div>
    <div class="p-8 max-w-3xl" v-else>
      <div class="flex items-center">
        <div @click="close" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" />
        </div>
        <div
          class="ml-8 hover:text-black hover:bg-yellow-500 rounded-lg inline-flex p-2 cursor-pointer"
        >
          <a
            @click.prevent="downloadItem(practiceDocument.file.url,practiceDocument.file.filename)"
            class="text-black no-underline flex justify-center px-2"
          >
            <svgicon
              name="cloud-download"
              width="21"
              height="21"
              color="black"
              hover="transparent black"
            ></svgicon>
            <span class="pl-2">Download</span>
          </a>
        </div>
      </div>

      <div class="flex flex-row justify-start">
        <div class="flex-col shadow-lg rounded-lg bg-gray-300 mx-6 mt-10">
          <div class="inline-flex text-sm m-4">
            <div class="m-2 mr-20">
              <p class="mr-20 font-semibold">Title</p>
              <p
                class="mt-2 text-base"
              >{{practiceDocument.practice_document_type ? practiceDocument.practice_document_type.name: null}}</p>
              <p class="mt-5 mr-20 font-semibold">File last uploaded</p>
              <p
                class="mt-2 text-base"
              >{{practiceDocument.file ? $moment(practiceDocument.file.created_at).format('MM/DD/YYYY HH:mm:ss') : null}}</p>
              <p class="mt-5 mr-20 font-semibold">Uploaded By</p>
              <p class="mt-2 text-base">{{practiceDocument.created_by_user.personal_detail}}</p>
            </div>
            <div class="flex m-2">
              <embed v-if="showFile" width="800px" height="600px" :src="practiceDocument.file.url" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      practiceDocument: {
        file: {},
        practice_document_type: {
          name: ""
        },
        practice: {
          surgery: ""
        },
        created_by_user: {
          personal_detail: ""
        }
      },
      notFound: false,
      showFile: false
    };
  },
  beforeDestroy() {
    this.$store.commit("profile/TOGGLE_SHIELD", false);
  },
  mounted() {
    this.$store.commit("profile/TOGGLE_SHIELD", true); // SHIELD IS TOGGLED HERE
    this.$axios
      .get(`/api/v1/practice/practice-documents/${this.$route.params.id}`)
      .then(res => {
        this.practiceDocument.file = res.data.data.practice_document.file;
        this.practiceDocument.practice_document_type.name =
          res.data.data.practice_document.practice_document_type.name;
        this.practiceDocument.practice.surgery =
          res.data.data.practice_document.practice.surgery.name;
        this.practiceDocument.created_by_user.personal_detail =
          res.data.data.practice_document.created_by_user.personal_detail.name;
        this.showFile = true;
      })
      .catch(err => {
        console.log(err.response || err);
        this.notFound = true;
      });
  },
  methods: {
    close() {
      if (this.$route.fullPath === "/dashboard") {
        this.$emit("close");
      } else {
        const query = {
          ...this.$route.query
        };
        this.$router.push({ path: "/profile", query });
      }
    },
    downloadItem(fileUrl, fileFilename) {
      const axios = require("axios");
      axios({
        url: fileUrl,
        method: "GET",
        responseType: "blob" // important
      }).then(response => {
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileFilename);
        document.body.appendChild(link);
        link.click();
        console.log(fileUrl);
      });
    }
  }
};
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>
