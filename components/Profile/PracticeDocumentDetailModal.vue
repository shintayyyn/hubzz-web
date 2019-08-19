<template>
  <div class="p-8 max-w-3xl">
    <div @click="close" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" />
    </div>
    <div class="ml-8 hover:text-black hover:bg-yellow-500 rounded-lg inline-flex p-2">
      <a
        @click.prevent="downloadItem(practiceDocument.file.url,practiceDocument.file.filename)"
        class="text-black no-underline"
      >
        <svgicon
          name="cloud-download"
          width="21"
          height="21"
          color="black"
          hover="transparent black"
        ></svgicon>
        <span>Download</span>
      </a>
    </div>
    <div class="flex flex-row justify-start">
      <div class="flex-col shadow-lg rounded-lg bg-gray-300 mx-6 mt-10">
        <div class="inline-flex text-sm m-4">
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
          <div class="flex m-2">
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
</template>
<script>
export default {
  props: ["practiceDocument"],
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
    close() {
      if (this.$route.fullPath === "/dashboard") {
        this.$emit("close");
      } else {
        const query = {
          ...this.$route.query
        };
        this.$router.push({ path: `/profile/documents`, query });
      }
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
</style>

