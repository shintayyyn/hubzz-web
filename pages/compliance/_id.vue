<template>
  <div class="p-2">
    <div class="flex flex-row flex-no-wrap items-center">
      <!-- <div class="cursor-pointer" @click="$router.push('/compliance')">
        <svgicon name="left-arrow" height="32" />
      </div> -->
      <a
        class="text-black no-underline flex items-center w-auto text-sm transition-hover hover:bg-yellow-500 rounded-lg cursor-pointer py-2 px-4 border"
        @click.prevent="downloadItem(compliance_document.file.url,compliance_document.file.filename)"
      >
        <svgicon
          name="cloud-download"
          width="18"
          height="18"
          color="black"
          hover="transparent black"
          class="inline"
        />
        <span class="mx-1" />
        <span>Download</span>
      </a>
    </div>

    <div class="flex flex-col">
      <div class="shadow-lg rounded-lg bg-gray-300 mt-4 max-w-5xl">
        <div class="flex flex-row flex-wrap justify-start p-4 md:p-8">
          <div class="flex flex-col w-full lg:w-1/4 pr-4">
            <p class="font-bold text-lg">
              Type
            </p>
            <p
              class="mt-2 text-sm md:text-base"
            >
              {{ compliance_document.compliance_document ? compliance_document.compliance_document.name: null }}
            </p>
            <div v-if="compliance_document.has_reference">
              <p class="font-bold text-lg mt-5">
                Reference
              </p>
              <p class="mt-2 text-sm md:text-base">
                {{ compliance_document.reference }}
              </p>
            </div>
            <div v-if="compliance_document.country">
              <p class="font-bold text-lg mt-5">
                Country
              </p>
              <p class="mt-2 text-sm md:text-base">
                {{ compliance_document.country.name }}
              </p>
            </div>
            <p class="mt-5 font-bold text-lg">
              Date uploaded
            </p>
            <p
              class="mt-2 text-sm md:text-base"
            >
              {{ compliance_document.uploaded_at_in_gb_formatted }}
            </p>
            <p class="mt-5 font-bold text-lg">
              Status
            </p>
            <p class="mt-2 text-sm md:text-base">
              {{ compliance_document.status }}
            </p>
            <div v-if="compliance_document.status === 'Approved'">
              <p class="mt-5 font-bold text-lg">
                Expiration Date
              </p>
              <p
                class="mt-2 text-sm md:text-base"
              >
                {{ compliance_document.expired_at_in_gb_formatted }}
              </p>
            </div>
            <div v-if="compliance_document.status === 'Rejected'">
              <p class="mt-5 font-bold text-lg">
                Rejected At
              </p>
              <p
                class="mt-2 text-sm md:text-base"
              >
                {{ compliance_document.rejected_at_in_gb_formatted }}
              </p>
              <p class="mt-5 font-bold text-lg">
                Notes
              </p>
              <p
                class="mt-2 text-sm md:text-base"
              >
                {{ compliance_document && compliance_document.note ? compliance_document.note : null }}
              </p>
            </div>

            <div v-if="false">
              <p class="mt-5 font-bold text-lg">
                Note
              </p>
              <p class="mt-2 text-sm md:text-base">
                {{ compliance_document.note }}
              </p>
            </div>
          </div>
          <div class="mt-5 lg:mt-0 w-full lg:w-3/4">
            <embed
              class="object-contain object-top w-full"
              :class="compliance_document.file.type == 'image' ? 'image' : 'document h-full'"
              :src="['msword', 'tiff', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'vnd.openxmlformats-officedocument.wordprocessingml.template', 'vnd.ms-word.document.macroEnabled.12', 'vnd.ms-word.template.macroEnabled.12'].includes(compliance_document.file.subtype) ? convertDoc(compliance_document.file.url) : compliance_document.file.url"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData ({ app, params, redirect, }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/locum/locum-compliance-documents/${params.id}`
      )
      let compliance_document	= response.data && response.data.locum_compliance_document
        ? response.data.locum_compliance_document
        : null
        
      return {
        compliance_document,
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return redirect("/compliance")
      }
      throw err
    }
  },
  methods: {
    downloadItem (fileUrl, fileName) {
      const axios = require("axios")
      axios({
        url: fileUrl,
        method: "GET",
        responseType: "blob", // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data,]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    convertDoc (document) {
      console.log(document)
      return `https://docs.google.com/gview?url=${document}&embedded=true`
    },
  },
}
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
