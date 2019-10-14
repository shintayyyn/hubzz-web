<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8">
      <div class="flex flex-row flex-no-wrap items-center text-lg">
        <div @click="$router.push('/compliance')" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" />
        </div>
        <a
          @click.prevent="downloadItem(compliance_document.file.url,compliance_document.file.filename)"
          class="text-black no-underline flex items-center w-auto hover:bg-yellow-500 rounded-lg cursor-pointer p-2 mx-4"
        >
          <svgicon
            name="cloud-download"
            width="21"
            height="21"
            color="black"
            hover="transparent black"
            class="inline"
          ></svgicon>
          <span class="mx-1"></span>
          <span>Download</span>
        </a>
      </div>

      <div class="flex flex-col p-4">
        <div class="shadow-lg rounded-lg bg-gray-300 mt-5 max-w-5xl">
          <div class="flex flex-row flex-wrap justify-start p-8">
            <div class="flex flex-col w-full lg:w-1/4 pr-4">
              <p class="font-bold text-lg">Title</p>
              <p
                class="mt-2 text-sm md:text-base"
              >{{compliance_document.compliance_document ? compliance_document.compliance_document.name: null}}</p>
              <p class="mt-5 font-bold text-lg">File last uploaded</p>
              <p
                class="mt-2 text-sm md:text-base"
              >{{compliance_document.file ? $moment(compliance_document.file.created_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
              <div v-if="compliance_document.status === 'Approved'">
                <p class="mt-5 font-bold text-lg">Expiration Date</p>
                <p
                  class="mt-2 text-sm md:text-base"
                >{{compliance_document.expired_at ? $moment(compliance_document.expired_at).format('DD/MM/YYYY HH:mm:ss') : null}}</p>
              </div>
              <div v-if="compliance_document.status === 'Rejected'">
                <p class="mt-5 font-bold text-lg">Rejected At</p>
                <p
                  class="mt-2 text-sm md:text-base"
                >{{compliance_document && compliance_document.rejected_at ? compliance_document.rejected_at : null }}</p>
                <p class="mt-5 font-bold text-lg">Notes</p>
                <p
                  class="mt-2 text-sm md:text-base"
                >{{compliance_document && compliance_document.note ? compliance_document.note : null}}</p>
              </div>
            </div>
            <div class="mt-5 lg:mt-0 w-full lg:w-3/4">
              <embed
                class="object-contain object-top w-full"
                :class="compliance_document.file.type == 'image' ? 'image' : 'document h-full'"
                :src="compliance_document.file.subtype === 'tiff' || compliance_document.file.subtype === 'msword' ? convertDoc(compliance_document.file.url) : compliance_document.file.url"
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
  async asyncData({ app, params, error, redirect }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/locum/locum-detail-compliance-documents/${params.id}`
      );
      let compliance_document =
        response.data && response.data.locum_detail_compliance_document
          ? response.data.locum_detail_compliance_document
          : null;
      return {
        compliance_document
      };
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return redirect("/compliance");
      }
      throw err;
    }
  },
  methods: {
    downloadItem(fileUrl, fileName) {
      const axios = require("axios");
      axios({
        url: fileUrl,
        method: "GET",
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    convertDoc(document) {
        return `https://docs.google.com/gview?url=${document}&embedded=true`;
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
.document {
  width: 100%;
  min-height: 50vh;
}

.image {
  min-height: 100%;
  max-height: 100%;
}

@media screen and (min-width: 768px) {
  .document {
    min-height: 70vh;
  }

  .image {
    min-height: 60vh;
    max-height: 60vh;
  }
}
</style>