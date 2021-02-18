<template>
  <div class="w-full">
    <div class="py-2">
      <!-- <div>
        <nuxt-link
          :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-banks`, query: { ...$route.query }}"
          class="cursor-pointer"
        >
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
      </div> -->

      <AppLoading :loading="loading" spinner />

      <div v-if="!loading && user" class="flex flex-row flex-no-wrap justify-start">
        <div class="font-bold text-md sm:text-lg">
          {{ user.personal_detail.name }}
        </div>
      </div>

      <div v-if="!loading && user" class="flex flex-row flex-wrap justify-between mt-4">
        <div class="w-full pr-0 lg:pr-2 lg:w-1/2">
          <div class="rounded-lg border p-4">
            <div class="flex flex-col">
              <div class="flex flex-row flex-wrap justify-between items-center">
                <div class="flex flex-col order-2 md:order-1 w-full md:w-1/2">
                  <div class="font-bold text-sm sm:text-md">
                    Candidate
                  </div>
                  <div class="text-sm mb-6">
                    {{ user.locum_detail.profession.name }}
                  </div>
                </div>
                <AppAvatar class="order-1 md:order-2 mb-4 md:mb-0" :height="'80px'" :width="'80px'"
                           :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : ''"
                />
              </div>
              <div class="font-bold text-sm sm:text-md">
                Headline
              </div>
              <div class="text-sm mb-6">
                {{ user.locum_detail.headline ? user.locum_detail.headline : '(none)' }}
              </div>
              <div class="font-bold text-sm sm:text-md">
                Biography
              </div>
              <div class="text-sm mb-6">
                {{ user.locum_detail.short_biography ? user.locum_detail.short_biography : '(none)' }}
              </div>

              <div
                v-for="referenceLocumComplianceDocument in user.reference_locum_compliance_documents"
                :key="referenceLocumComplianceDocument.compliance_document_id"
              >
                <div class="font-bold text-sm sm:text-md">
                  {{ referenceLocumComplianceDocument.compliance_document_name }}
                </div>

                <div class="text-sm mb-6">
                  {{ referenceLocumComplianceDocument.reference ? referenceLocumComplianceDocument.reference : 'N/A' }}
                </div>
              </div>

              <div class="font-bold text-sm sm:text-md">
                Specialty
              </div>
              <div class="text-sm mb-6 flex flex-row flex-wrap">
                <div v-for="item in user.locum_detail.qualifications" :key="item.id"
                     class="rounded-lg bg-sunglow px-2 py-1 m-1"
                >
                  {{ item.name }}
                </div>
              </div>
              <div class="font-bold text-sm sm:text-md">
                Clinical systems
              </div>
              <div class="text-sm mb-6 flex flex-row flex-wrap">
                <div v-for="item in user.locum_detail.clinical_systems" :key="item.id"
                     class="rounded-lg bg-sunglow px-2 py-1 m-1"
                >
                  {{ item.name }}
                </div>
              </div>
              <div class="font-bold text-sm sm:text-md">
                Languages
              </div>
              <div class="text-sm mb-6 flex flex-row flex-wrap">
                <div class="rounded-lg bg-sunglow px-2 py-1 m-1">
                  English
                </div>
                <div v-for="item in user.locum_detail.spoken_languages" :key="item.id"
                     class="rounded-lg bg-sunglow px-2 py-1 m-1"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full pl-0 lg:pl-2 mt-8 lg:mt-0 lg:w-1/2">
          <div class="rounded-lg border p-4 mb-4">
            <div class="font-bold text-sm sm:text-md">
              Compliance documents
            </div>
            <div class="flex flex-col mb-8">
              <div v-for="item in mandatory" :key="item.id"
                   class="flex flex-row flex-no-wrap mt-2 cursor-pointer hover:underline"
              >
                <svgicon name="cloud-download" height="24" width="24" />
                <a :href="item.file.url" :download="item.file.filename" target="_blank" class="px-2"
                   @click.prevent="downloadItem(item.file.url, item.file.filename)"
                >{{ item.compliance_document.name }}</a>
              </div>
            </div>
            <div class="font-bold text-sm sm:text-md">
              Others documents
            </div>
            <div class="flex flex-col mb-8">
              <div v-for="item in optional" :key="item.id"
                   class="flex flex-row flex-no-wrap mt-2 cursor-pointer hover:underline"
              >
                <svgicon class="mr-1" name="cloud-download" height="24" width="24" />
                <a :href="item.file.url" :download="item.file.filename" target="_blank" class="px-2"
                   @click.prevent="downloadItem(item.file.url, item.file.filename)"
                >{{ item.compliance_document.name }}</a>
              </div>
            </div>

            <div class="font-bold text-sm sm:text-md">
              Preferred rates
            </div>
            <div class="flex flex-col mb-8">
              <div v-for="item in user.locum_detail.rates" :key="item.id" class="flex flex-row flex-no-wrap mt-2">
                <div class="text-sm">
                  {{ item.rate_type.name }}: £ {{ item.min }}
                </div>
              </div>
            </div>
            <div class="font-bold text-sm sm:text-md">
              Referees
            </div>
            <div v-if="user.locum_detail.referees.length > 0">
              <div v-for="item in user.locum_detail.referees" :key="item.id"
                   class="rounded-lg flex flex-col bg-gray-300 my-2 p-4"
              >
                <div class="text-sm">
                  Contact Name: {{ item ? item.name:null }}
                </div>
                <div class="text-sm">
                  Telephone No.: {{ item ? item.phone_number:null }}
                </div>
                <div class="text-sm">
                  Email Address: {{ item ? item.email:null }}
                </div>
              </div>
            </div>
            <div v-else>
              <div class="text-sm">
                (none)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import AppAvatar from "@/components/Base/AppAvatar"

export default {
  components: {
    AppLoading,
    AppAvatar,
  },

  data () {
    return {
      loading: false,
      user: null,
      mandatory: [],
      optional: [],
    }
  },

  mounted () {
    this.loading = true
    this.$axios.get(`/api/v1/practice/locums/${this.$route.params.locumId}`).then((response) => {
      this.user = response.data.data.user

      this.getLocumCompliancesByLocumProfessionProfessionComplianceCategoryId(this.user.locum_detail.profession.profession_compliance_category_id)
    }).finally(() => {
      this.loading = false
    })
  },

  methods: {
    getLocumCompliancesByLocumProfessionProfessionComplianceCategoryId (locumProfessionProfessionComplianceCategoryId) {
      this.$axios.$get(`/api/v1/profession-compliance-categories/${locumProfessionProfessionComplianceCategoryId}`).then(res => {
        this.mandatory = this.user.locum_detail.compliance_documents.filter(
          compliance_document => {
            return res.data.profession_compliance_category.mandatory_compliance_documents.some(
              mandatory_compliance_document =>
                mandatory_compliance_document.id
                === compliance_document.compliance_document.id
            )
          }
        )
        this.optional = this.user.locum_detail.compliance_documents.filter(
          compliance_document => {
            return res.data.profession_compliance_category.optional_compliance_documents.some(
              optional_compliance_document =>
                optional_compliance_document.id
                === compliance_document.compliance_document.id
            )
          }
        )
      })
    },

    downloadItem (fileUrl, fileName) {
      const axios = require("axios")
      axios({
        url: fileUrl,
        method: "GET",
        responseType: "blob",
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data,]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", fileName)
        document.body.appendChild(link)
        link.click()
      })
    },

  },
}
</script>

<style scoped>
  .modal-container {
    z-index: 512;
  }

  @media screen and (min-width: 1200px) {
    .modal-container {
      width: 70%;
    }
  }
</style>
