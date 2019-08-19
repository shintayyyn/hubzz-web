<template>
  <div class="modal-container shadow-lg">
    <div class="p-8 max-w-3xl">
      <div class="flex items-center">
        <div @click="close" class="bordercursor-pointer">
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
          <div class="inline-flex flex-col md:flex-row text-sm m-4">
            <div class="m-2 mr-20">
              <p class="mr-20 font-semibold">Title</p>
              <p
                class="mt-2 text-base"
              >{{practiceDocument.practice_document_type ? practiceDocument.practice_document_type.name: null}}</p>
              <p class="mt-5 mr-20 font-semibold">Practice</p>
              <p
                class="mt-2 text-base"
              >{{practiceDocument.practice ? practiceDocument.practice.surgery.name: null}}</p>
              <p class="mt-5 mr-20 font-semibold">File last uploaded</p>
              <p
                class="mt-2 text-base"
              >{{practiceDocument.file ? $moment(practiceDocument.file.created_at).format('MM/DD/YYYY HH:mm:ss') : null}}</p>
              <p class="mt-5 mr-20 font-semibold">Uploaded By</p>
              <p class="mt-2 text-base">{{practiceDocument.created_by_user.personal_detail.name}}</p>
            </div>
            <div class="flex w-full m-2">
              <embed
                width="800px"
                height="600px"
                :src="practiceDocument.file ? practiceDocument.file.url:null"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/practice/practice-documents/${params.id}`
      );
      const practiceDocument =
        response.data && response.data.practice_document
          ? response.data.practice_document
          : null;
      return {
        practiceDocument
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    close() {
      this.$router.push("/profile/practice-documents");
    },
    downloadItem(fileUrl, fileFilename) {
      const axios = require("axios");
      axios({
        url: fileUrl,
        method: "GET",
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileFilename);
        document.body.appendChild(link);
        link.click();
      });
    }
  }
};
</script>
<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
.document {
  width: 100%;
}
@media screen and (min-width: 1200px) {
  .document {
    min-width: 600px;
  }
}
</style>

