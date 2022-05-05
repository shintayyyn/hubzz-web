<template>
  <div class="w-full mt-5">
    <AppBreadcrumbs :links="links" />
    <AppLoading :loading="loading" spinner />

    <template v-if="!loading && user">
      <div class="flex flex-row flex-no-wrap justify-start">
        <div class="font-bold text-md sm:text-lg">
          {{ user.personal_detail.name }}
        </div>
      </div>

      <div class="flex flex-wrap justify-between mt-4">
        <div class="p-1 w-full md:w-1/2 lg:w-2/5">
          <div class="flex flex-col rounded-lg border p-4">
            <div class="flex flex-row flex-wrap justify-between items-center">
              <div class="flex flex-col order-2 md:order-1 w-full md:w-1/2">
                <div class="font-bold text-sm sm:text-md">
                  Candidate
                </div>
                <div class="text-sm mb-8">
                  {{ user.locum_detail.profession.name }}
                </div>
              </div>
              <AppAvatar
                class="order-1 md:order-2 mb-4 md:mb-0"
                :height="'80px'"
                :width="'80px'"
                :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : null"
              />
            </div>
            
            <div class="font-bold text-sm sm:text-md">
              E-mail
            </div>

            <div
              class="text-sm mb-8"
            >
              {{ user.email ? user.email : '(none)' }}
            </div>

            <div class="font-bold text-sm sm:text-md">
              Headline
            </div>

            <div
              class="text-sm mb-8"
            >
              {{ user.locum_detail && user.locum_detail.headline && user.locum_detail.headline.trim() ? user.locum_detail.headline : '(none)' }}
            </div>

            <div class="font-bold text-sm sm:text-md">
              Biography
            </div>
            <div
              class="text-sm mb-8"
            >
              {{ user.locum_detail.headline && user.locum_detail.short_biography && user.locum_detail.short_biography.trim() ? user.locum_detail.short_biography : '(none)' }}
            </div>

            <div
              v-for="referenceLocumComplianceDocument in user.reference_locum_compliance_documents"
              :key="referenceLocumComplianceDocument.compliance_document_id"
            >
              <div class="font-bold text-sm sm:text-md">
                {{ referenceLocumComplianceDocument.compliance_document_name }}
              </div>

              <div class="text-sm mb-8">
                {{ referenceLocumComplianceDocument.reference ? referenceLocumComplianceDocument.reference : 'N/A' }}
              </div>
            </div>

            <div class="font-bold text-sm sm:text-md">
              NI Number
            </div>
            <div
              class="text-sm mb-8"
            >
              {{ user.locum_detail && user.locum_detail.ni_number && user.locum_detail.ni_number.trim() ? user.locum_detail.ni_number : '(none)' }}
            </div>
              
            <div class="font-bold text-sm sm:text-md">
              Speciality
            </div>
            <div class="text-sm mb-8 flex flex-row flex-wrap">
              <div
                v-for="item in user.locum_detail.qualifications"
                :key="item.id"
                class="rounded-lg bg-sunglow px-2 py-1 m-1"
              >
                {{ item.name }}
              </div>
              <div
                v-if="user.locum_detail.qualifications.length === 0"
                class="rounded-lg bg-sunglow px-2 py-1 m-1"
              >
                N/A
              </div>
            </div>
            <div class="font-bold text-sm sm:text-md">
              Clinical systems
            </div>
            <div class="text-sm mb-8 flex flex-row flex-wrap">
              <div
                v-for="item in user.locum_detail.clinical_systems"
                :key="item.id"
                class="rounded-lg bg-sunglow px-2 py-1 m-1"
              >
                {{ item.name }}
              </div>
            </div>
            <div class="font-bold text-sm sm:text-md">
              Languages
            </div>
            <div class="text-sm mb-8 flex flex-row flex-wrap">
              <div class="rounded-lg bg-sunglow px-2 py-1 m-1">
                English
              </div>
              <div
                v-for="item in user.locum_detail.spoken_languages"
                :key="item.id"
                class="rounded-lg bg-sunglow px-2 py-1 m-1"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="p-1 w-full md:w-1/2 lg:w-2/5">
          <div class="flex flex-col rounded-lg border p-4">
            <div class="font-bold text-sm sm:text-md">
              Compliance documents
            </div>
            <div class="flex flex-col mb-6 text-sm">
              <div
                v-for="item in mandatory"
                :key="item.id"
                class="flex flex-row flex-no-wrap mt-2 cursor-pointer hover:underline items-start"
              >
                <svgicon name="cloud-download" height="24" width="24" />
                <a
                  :href="item.file.url"
                  :download="item.file.filename"
                  target="_blank"
                  class="px-2"
                  @click.prevent="downloadItem(item.file.url, item.file.filename)"
                >{{ item.compliance_document.name }}</a>
                <span class="p-1 rounded-lg" :class="statusStyle(item.status)">
                  {{ item && item.status ? item.status : null }}
                </span>
                <span class="text-xs p-1 mx-1">
                  {{ item && item.expired_at 
                    ? item.status === 'Approved' 
                      ? 'until ' + $moment(item.expired_at).format('DD/MM/YYYY')
                      : item.status === 'Expiring' 
                        ?'on ' + $moment(item.expired_at).format('DD/MM/YYYY')
                        : item.status === 'Expired'
                          ? 'at ' + $moment(item.expired_at).format('DD/MM/YYYY')
                          : null
                    : null }}
                </span>
              </div>
              <template v-if="mandatory && !mandatory.length">
                <span class="text-sm">(none)</span>
              </template>
            </div>

            <div class="font-bold text-sm sm:text-md">
              Others documents
            </div>
            <div class="flex flex-col mb-6 text-sm">
              <div
                v-for="item in optional"
                :key="item.id"
                class="flex flex-row flex-no-wrap mt-2 cursor-pointer hover:underline items-start"
              >
                <svgicon class="mr-1" name="cloud-download" height="24" width="24" />
                <a
                  :href="item.file.url"
                  :download="item.file.filename"
                  target="_blank"
                  class="px-2"
                  @click.prevent="downloadItem(item.file.url, item.file.filename)"
                >{{ item.compliance_document.name }}</a>
              </div>
              <template v-if="optional && !optional.length">
                <span class="text-sm">(none)</span>
              </template>
            </div>

            <div class="font-bold text-sm sm:text-md">
              Additional Trainings
            </div>
            <div class="flex flex-col mb-6 text-sm">
              <div
                v-for="item in mandatoryTrainings"
                :key="item.id"
                class="flex flex-row flex-no-wrap mt-1 cursor-pointer hover:underline"
              >
                <div v-if="item.file" class="flex flex-row flex-no-wrap">
                  <div class="w-5 h-5">
                    <svgicon name="cloud-download" height="24" width="24" />
                  </div>
                  <a
                    :href="item.file.url"
                    :download="item.file.filename"
                    class="break-words leading-loose mx-2 text-xs md:text-sm"
                    @click.stop.prevent="downloadItem(item.file.url, item.file.filename)"
                  >{{ item.mandatory_training.name }}</a>
                </div>
              </div>
              <template v-if="mandatoryTrainings && !mandatoryTrainings.length">
                <span class="text-sm">(none)</span>
              </template>
            </div>

            <div class="font-bold text-sm sm:text-md">
              Referees
            </div>
            <div v-if="referees.length > 0">
              <div
                v-for="item in referees"
                :key="item.id"
                :class="item && item.id ? 'rounded-lg flex flex-col bg-gray-300 my-2 p-4 text-xs md:text-sm' : ''"
              >
                <div class="flex flex-col w-full justify-start">
                  <div class="w-full">
                    Contact Name:
                  </div>
                  <div class="w-full">
                    {{ item.name && item.name.trim() ? item.name : '(none)' }}
                  </div>
                </div>
                <div class="flex flex-col w-full justify-start my-2">
                  <div class="w-full">
                    Telephone number:
                  </div>
                  <div
                    class="w-full"
                  >
                    {{ item.phone_number && item.phone_number.trim() ? item.phone_number : '(none)' }}
                  </div>
                </div>
                <div class="flex flex-col w-full justify-start">
                  <div class="w-full">
                    Email Address:
                  </div>
                  <div class="w-full">
                    {{ item.email && item.email.trim() ? item.email : '(none)' }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="referees.length === 0" class="text-xs md:text-sm">
              (none)
            </div>
          </div>
        </div>
        <div class="p-1 w-full lg:w-1/5">
          <div class="flex flex-col rounded-lg border p-4">
            <div class="flex flex-row flex-wrap justify-between items-center">
              <div class="flex flex-col order-2 md:order-1 w-full md:w-1/2">
                <div class="font-bold text-sm sm:text-md">
                  Payment Details
                </div>

                <div class="text-sm mb-4" />
              </div>
            </div>
              
            <div class="ml-4">
              <div class="font-bold text-sm sm:text-md">
                Paid Under Payroll
              </div>

              <div class="text-sm mb-4">
                {{ user.paid_under_payroll ? 'Yes' : 'No' }}
              </div>

              <div v-if="user.paid_under_payroll">
                <div class="font-bold text-sm sm:text-md">
                  Payroll Details
                </div>

                <div class="text-sm mb-4" />

                <div class="ml-4">
                  <div class="font-bold text-sm sm:text-md">
                    Payroll Company Name
                  </div>

                  <div class="text-sm mb-4">
                    {{ user.payroll_account_name }}
                  </div>

                  <div class="font-bold text-sm sm:text-md">
                    Bank Name
                  </div>

                  <div class="text-sm mb-4">
                    {{ user.payroll_bank_name }}
                  </div>

                  <div class="font-bold text-sm sm:text-md">
                    Sort Code
                  </div>

                  <div class="text-sm mb-4">
                    {{ user.payroll_sort_code }}
                  </div>

                  <div class="font-bold text-sm sm:text-md">
                    Payroll Bank Account Number
                  </div>

                  <div class="text-sm mb-4">
                    {{ user.payroll_account_number }}
                  </div>

                  <div class="font-bold text-sm sm:text-md">
                    Payroll Reference Number
                  </div>

                  <div class="text-sm mb-4">
                    {{ user.payroll_reference_number }}
                  </div>
                </div>
              </div>

              <div v-if="!user.paid_under_payroll">
                <div class="font-bold text-sm sm:text-md">
                  Bank Details
                </div>

                <div class="text-sm mb-4" />

                <div class="ml-4">
                  <div class="font-bold text-sm sm:text-md">
                    Account Name
                  </div>

                  <div class="text-sm mb-4">
                    {{ user.account_name }}
                  </div>

                  <div class="font-bold text-sm sm:text-md">
                    Bank Name
                  </div>

                  <div class="text-sm mb-4">
                    {{ user.bank_name }}
                  </div>

                  <div class="font-bold text-sm sm:text-md">
                    Sort Code
                  </div>

                  <div class="text-sm mb-4">
                    {{ user.sort_code }}
                  </div>

                  <div class="font-bold text-sm sm:text-md">
                    Account Number
                  </div>

                  <div class="text-sm mb-4">
                    {{ user.account_number }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import AppAvatar from "@/components/Base/AppAvatar"
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    AppLoading,
    AppAvatar,
    AppBreadcrumbs,
  },

  data () {
    return {
      loading: false,
      user: null,
      mandatory: [],
      optional: [],
      mandatoryTrainings: [],
      referees: [],
      links: [],
    }
  },

  mounted () {
    this.loading = true
    this.$axios.get(`/api/v1/practice/locums/${this.$route.params.locumId}`).then((response) => {
      this.user = response.data.data.user

      let parent_tab = this.$route.query.practice_locum_type ? this.$route.query.practice_locum_type : 'Favorites'
      let surg_tab = this.$route.query.surgeries_bank ? 'Surgeries Banks' : 'Banks'
      let prof_tab = this.$route.query.profession_category_name ? 'Others' : 'GP'


      let url = `/my-banks?${parent_tab !== 'Favorites' ? 'practice_locum_type='+parent_tab : ''}${parent_tab !== 'All' ? prof_tab === 'Others' ? '&profession_category_name=Others' : '' : ''}${this.$route.query.surgeries_bank ==='true' ? '&surgeries_bank=true' : ''}`

      this.links = [
        {
          title: 'My Banks',
          url: '/my-banks',
        },
        {
          title: parent_tab,
          url: url,
        },
      ]

      console.log("parent_tab", parent_tab)

      if (!['Favorites', 'All',].includes(parent_tab)){
        this.links.push({
          title: surg_tab,
          url: url,
        })
      }

      if (parent_tab !== 'All') {
        this.links.push({
          title: prof_tab,
          url: url,
        },)
      }

      this.links.push(
        {
          title: this.user.personal_detail.name,
          url: this.$route.path,
        }
      )


      this.getLocumCompliancesByLocumProfessionProfessionComplianceCategoryId(this.user.locum_detail.profession.profession_compliance_category_id)
      
      this.mandatoryTrainings = []

      this.user.locum_detail.mandatory_trainings.forEach(mandatoryTraining => {
        if (mandatoryTraining.file !== null) {
          this.mandatoryTrainings.push(mandatoryTraining)
        }
      })

      this.referees = []

      this.user.locum_detail.referees.forEach(referee => {
        if (
          referee.name !== null
          && referee.name
          && referee.name.trim()
          && referee.phone_number !== null
          && referee.phone_number
          && referee.phone_number.trim()
          && referee.email !== null
          && referee.email
          && referee.email.trim()
        ) {
          this.referees.push(referee)
        }
      })
    }).finally(() => {
      this.loading = false
      this.$store.commit("SET_BREADCRUMBS", this.links)
      console.log("linkssss", this.$store.state.breadcrumbs)
    })
  },
  
  methods: {
    getLocumCompliancesByLocumProfessionProfessionComplianceCategoryId (locumProfessionProfessionComplianceCategoryId) {
      this.$axios.$get(`/api/v1/profession-compliance-categories/${locumProfessionProfessionComplianceCategoryId}`)
        .then(res => {
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
        .finally(() => {
          console.log('mandatory', this.mandatory)
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

    statusStyle (status) {
      switch (status) {
      case 'Approved':
        return 'bg-green-500 text-white text-xs'
      case 'Expiring':
      case 'Pending':
        return 'bg-yellow-500 text-black-700 text-xs'
      case 'Expired':
      case 'Rejected':
        return 'bg-red-800 text-red-400 text-xs'
      default:
        return
      }
    },
  },
}
</script>
