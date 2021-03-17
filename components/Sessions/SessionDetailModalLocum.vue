<template>
  <div class="flex flex-col w-full mt-2">
    <div class="text-xs sm:text-sm font-bold">
      Locum
    </div>
    <div v-if="!user && loading" class="relative flex w-full" style="min-height:80px">
      <AppLoading :loading="loading" spinner />
    </div>
    <div v-if="user && !loading" class="relative rounded-lg border p-4 mt-2">
      <div class="flex flex-col">
        <div class="flex flex-row justify-between">
          <div class="flex flex-col w-full">
            <AppAvatar
              class="mb-4"
              :height="'80px'"
              :width="'80px'"
              :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : ''"
            />
            <div class="flex flex-col w-full">
              <div class="font-bold text-sm lg:text-lg">
                {{ user.personal_detail.name }}
              </div>
              <div class="text-xs lg:text-sm mb-6">
                {{ user.locum_detail.profession.name }}
              </div>
            </div>
          </div>
          <div class="flex justify-start items-start z-50">
            <template v-if="user.is_favorite">
              <svgicon
                name="on-star"
                height="32"
                width="32"
                class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                @click="unfavorite"
              />
            </template>
            <template v-else-if="!user.is_favorite">
              <svgicon
                name="off-star"
                height="32"
                width="32"
                class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
                @click="favorite"
              />
            </template>
            <button
              class="bg-sunglow mx-2 rounded-lg hover:bg-yellow-400 focus:outline-none"
              @click.prevent="message(user.id)"
            >
              <svgicon name="chat" height="20" width="20" color="#888 #555 #fff" class="m-2" />
            </button>
          </div>
          <transition name="fade" mode="out-in">
            <div v-if="sendMessageModal" class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3">
              <SendMessageModal
                :user="user"
                @close="sendMessageModal=false"
                @showProfile="show(user.id)"
              />
            </div>
          </transition>
          <div v-if="sendMessageModal" class="shield" @click="sendMessageModal=false" />
        </div>
        <div class="body-info flex flex-wrap">
          <div class="w-full px-1">
            <div class="font-bold text-sm sm:text-md">
              Headline
            </div>
            <div
              class="text-xs sm:text-sm mb-6"
            >
              {{ user.locum_detail && user.locum_detail.headline ? user.locum_detail.headline : '(none)' }}
            </div>
          </div>

          <div class="w-full px-1">
            <div class="font-bold text-sm sm:text-md">
              Biography
            </div>
            <div
              class="text-xs sm:text-sm mb-6"
            >
              {{ user.locum_detail && user.locum_detail.short_biography ? user.locum_detail.short_biography : '(none)' }}
            </div>
          </div>
          <div class="w-full md:w-1/2 px-1">
            <div>
              <div
                v-for="referenceLocumComplianceDocument in user.reference_locum_compliance_documents"
                :key="referenceLocumComplianceDocument.compliance_document_id"
              >
                <div class="font-bold text-sm sm:text-md">
                  {{ referenceLocumComplianceDocument.compliance_document_name }}
                </div>

                <div class="text-xs sm:text-sm mb-6">
                  {{ referenceLocumComplianceDocument.reference ? referenceLocumComplianceDocument.reference : 'N/A' }}
                </div>
              </div>
            </div>

            <div>
              <div class="font-bold text-sm sm:text-md">
                NHS Smart Card ID Number
              </div>
              <div class="text-xs sm:text-sm mb-6">
                {{ user.locum_detail.nhs_smart_card_id_number }}
              </div>
            </div>

            <div>
              <div class="font-bold text-sm sm:text-md">
                Special requirements
              </div>
              <div class="text-xs sm:text-sm mb-6">
                {{ user.locum_detail.special_requirements ? user.locum_detail.special_requirements : '(none)' }}
              </div>
            </div>

            <div>
              <div class="font-bold text-sm sm:text-md">
                Preferred rates
              </div>
              <div class="flex flex-col mb-8">
                <div
                  v-for="item in user.locum_detail.rates"
                  :key="item.id"
                  class="flex flex-row flex-no-wrap mt-2"
                >
                  <div class="text-xs sm:text-sm">
                    {{ item.rate_type.name }}: £ {{ item.min | currency}}
                  </div>
                </div>
              </div>
            </div>

            <div class="w-full">
              <div class="font-bold text-sm sm:text-md">
                Compliance documents
              </div>
              <div class="flex flex-col mb-8">
                <div
                  v-for="item in mandatory"
                  :key="item.id"
                  class="flex flex-row flex-no-wrap mt-1 cursor-pointer hover:underline"
                >
                  <div class="w-5 h-5">
                    <svgicon name="cloud-download" height="24" width="24" />
                  </div>
                  <a
                    :href="item.file.url"
                    :download="item.file.filename"
                    class="break-words leading-loose mx-2 text-xs md:text-sm"
                    @click.stop.prevent="downloadItem(item.file.url, item.file.filename)"
                  >{{ item.compliance_document.name }}</a>
                </div>
                <template v-if="mandatory && !mandatory.length">
                  <span class="text-sm">(none)</span>
                </template>
              </div>
            </div>

            <div class="w-full">
              <div class="font-bold text-sm sm:text-md">
                Other documents
              </div>
              <div class="flex flex-col mb-4">
                <div
                  v-for="item in optional"
                  :key="item.id"
                  class="flex flex-row flex-no-wrap mt-1 cursor-pointer hover:underline"
                >
                  <div class="w-5 h-5">
                    <svgicon name="cloud-download" height="24" width="24" />
                  </div>
                  <a
                    :href="item.file.url"
                    :download="item.file.filename"
                    class="break-words leading-loose mx-2 text-xs md:text-sm"
                    @click.stop.prevent="downloadItem(item.file.url, item.file.filename)"
                  >{{ item.compliance_document.name }}</a>
                </div>
                <template v-if="optional && !optional.length">
                  <span class="text-sm">(none)</span>
                </template>
              </div>
            </div>
          </div>
          <div class="w-full md:w-1/2 px-1">
            <div class="font-bold text-sm sm:text-md">
              Speciality
            </div>
            <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
              <div
                v-for="item in user.locum_detail.qualifications"
                :key="item.id"
                class="rounded-lg bg-sunglow py-1 px-2 m-1"
              >
                {{ item.name }}
              </div>
            </div>
            <div class="font-bold text-sm sm:text-md">
              Clinical systems
            </div>
            <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
              <div
                v-for="item in user.locum_detail.clinical_systems"
                :key="item.id"
                class="rounded-lg bg-sunglow py-1 px-2 m-1"
              >
                {{ item.name }}
              </div>
            </div>
            <div class="font-bold text-sm sm:text-md">
              Languages
            </div>
            <div class="text-xs sm:text-sm mb-6 flex flex-row flex-wrap">
              <div class="rounded-lg bg-sunglow py-1 px-2 m-1">
                English
              </div>
              <div
                v-for="item in user.locum_detail.spoken_languages"
                :key="item.id"
                class="rounded-lg bg-sunglow py-1 px-2 m-1"
              >
                {{ item.name }}
              </div>
            </div>

            <div class="w-full">
              <div class="font-bold text-sm sm:text-md">
                Mandatory Trainings
              </div>
              <div class="flex flex-col mb-8">
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
            </div>
            <div class="w-full">
              <div class="font-bold text-sm sm:text-md">
                Other Mandatory Trainings
              </div>
              <div class="flex flex-col mb-8">
                <div
                  v-for="item in otherMandatoryTrainings"
                  :key="item.id"
                  class="flex flex-row flex-no-wrap mt-1 cursor-pointer hover:underline"
                >
                  <div
                    v-if="item.locum_other_mandatory_trainings.file"
                    class="flex flex-row flex-no-wrap"
                  >
                    <div class="w-5 h-5">
                      <svgicon name="cloud-download" height="24" width="24" />
                    </div>
                    <a
                      :href="item.locum_other_mandatory_trainings.file.url"
                      :download="item.locum_other_mandatory_trainings.file.filename"
                      class="break-words leading-loose mx-2 text-xs md:text-sm"
                      @click.stop.prevent="downloadItem(item.locum_other_mandatory_trainings.file.url, item.locum_other_mandatory_trainings.file.filename)"
                    >{{ item.locum_other_mandatory_trainings.name }}</a>
                  </div>
                </div>
                <template v-if="otherMandatoryTrainings && !otherMandatoryTrainings.length">
                  <span class="text-sm">(none)</span>
                </template>
              </div>
            </div>
            
            <div class="font-bold text-sm sm:text-md">
              Referees
            </div>
            <div v-if="user.locum_detail.referees.length > 0">
              <div
                v-for="item in user.locum_detail.referees"
                :key="item.id"
                :class="item && item.name ? 'rounded-lg flex flex-col bg-gray-300 my-2 p-4 text-xs md:text-sm' : ''"
              >
                <div class="text-xs sm:text-sm">
                  {{ item ? item.name:null }}
                </div>
                <div class="text-xs sm:text-sm">
                  {{ item ? item.phone_number:null }}
                </div>
                <div class="text-xs sm:text-sm">
                  {{ item ? item.email:null }}
                </div>
              </div>
              <div
                v-if="!user.locum_detail.referees.map(item => item.name !== null).includes(true)"
                class="text-xs md:text-sm"
              >
                (none)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AppConfirmationModal
      :label="confirmation_text"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_modal"
      @confirm="confirm"
      @cancel="confirmation_modal = false"
    />
  </div>
</template>
<script>
import AppAvatar from "~/components/Base/AppAvatar"
import AppLoading from "~/components/Base/AppLoading"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import SendMessageModal from "@/components/Messages/SendMessageModal"
export default {
  components: {
    AppAvatar,
    AppLoading,
    AppConfirmationModal,
    SendMessageModal,
  },
  props: {
    job: {
      type: Object,
      default: () => null,
    },
  },
  data () {
    return {
      loading: false,
      user: null,
      mandatory: [],
      optional: [],
      mandatoryTrainings: [],
      otherMandatoryTrainings: [],
      confirmation_text: "",
      confirmation_modal: false,
      sendMessageModal: false,
    }
  },
  created () {
    this.getAppointedLocum()
  },
  methods: {
    message (id) {
      this.$axios.$get(`/api/v1/practice/locums/${id}`).then(res => {
        this.user = res.data.user
        this.sendMessageModal = true
        // this.$emit("show", user);
      })
    },
    getAppointedLocum () {
      this.loading = true
      this.$axios
        .$get(
          `/api/v1/practice/locums/${this.job.platform_job.appointed_to_locum.user.id}`
        )
        .then(res => {
          this.user = res.data.user
          this.mandatoryTrainings = []
          res.data.user.locum_detail.mandatory_trainings.forEach(
            mandatoryTraining => {
              if (mandatoryTraining.file !== null) {
                this.mandatoryTrainings.push(mandatoryTraining)
              }
            }
          )
          this.otherMandatoryTrainings = []
          this.user.locum_detail.other_mandatory_trainings.forEach(
            otherMandatoryTraining => {
              if (
                otherMandatoryTraining.locum_other_mandatory_trainings
                && otherMandatoryTraining.locum_other_mandatory_trainings.file
                  !== null
              ) {
                this.otherMandatoryTrainings.push(otherMandatoryTraining)
              }
            }
          )
          this.getLocumCompliancesByLocumProfessionProfessionComplianceCategoryId(
            res.data.user.locum_detail.profession
              .profession_compliance_category_id
          )
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    getLocumCompliancesByLocumProfessionProfessionComplianceCategoryId (
      locumProfessionProfessionComplianceCategoryId
    ) {
      this.$axios
        .$get(
          `/api/v1/profession-compliance-categories/${locumProfessionProfessionComplianceCategoryId}`
        )
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
    },
    favorite () {
      this.confirmation_text = "Add this Locum to MyBanks?"
      this.confirmation_modal = true
    },
    unfavorite () {
      this.confirmation_text = "Remove this Locum to My Banks?"
      this.confirmation_modal = true
    },
    confirm () {
      if (!this.user.is_favorite) {
        this.$axios
          .$post(`/api/v1/practice/locums/${this.user.id}/favorite`)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Added to favourites",],
            })
          })
        this.user.is_favorite = true
        this.confirmation_modal = false
      } else if (this.user.is_favorite) {
        this.$axios
          .$delete(`/api/v1/practice/locums/${this.user.id}/favorite`)
          .then(() => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Remove to favourites",],
            })
          })
        this.user.is_favorite = false
        this.confirmation_modal = false
      }
    },
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
  },
}
</script>
<style scoped>
.avatar {
  max-width: 80px;
  max-height: 80px;
  min-width: 80px;
  min-height: 80px;
}

img {
  border-radius: 50%;
}
</style>
