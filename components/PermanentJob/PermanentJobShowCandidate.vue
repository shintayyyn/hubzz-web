<template>
  <section>
    <div class="p-4 md:p-8">
      <div class="flex items-center">
        <svgicon
          name="left-arrow"
          height="32"
          width="32"
          class="cursor-pointer"
          @click="$emit('close')"
        />
        <button class="mx-4 focus:outline-none" @click.prevent.stop="message(user)">
          <svgicon name="chat" height="32" width="32" color="#888 #555 #fff" />
        </button>

        <div
          v-if="permanentJobApp.application_status === 'Applied' && permanent_job.job_posting_status === 'Available'"
        >
          <AppButton
            :label="'Accept'"
            :custom-theme="'bg-yellow-500 hover:bg-yellow-400'"
            class="mx-1"
            @click="accepted=!accepted"
          />
          <AppButton
            class="mx-1"
            :label="'Reject'"
            :custom-theme="'bg-red-500 hover:bg-red-600 text-white'"
            @click="rejectConfirmModal = true"
          />
        </div>
      </div>
      <div
        v-if="accepted"
        class="absolute flex flex-col bg-white shadow-lg rounded-lg md:w-2/3 lg:w-1/2 xl:w-1/3 p-4 z-50"
      >
        <AppDate
          v-model="form.invitation_date"
          :name="'invitation_date'"
          :label="'Invitation Date'"
          is-after
          :error="formError.find(item => item.field === 'invitation_date')"
        />
        <AppTime
          v-model="form.invitation_time"
          :name="'invitation_time'"
          :label="'Invitation Time'"
          :error="formError.find(item => item.field === 'invitation_time')"
        />
        <div class="flex items-center justify-end">
          <AppButton class="mr-2" :label="'Cancel'" @click="accepted=false, formError=[]" />
          <AppButton class :label="'Invite This Locum'" @click="inviteLocum()" />
        </div>
      </div>

      <!-- <transition name="fade" mode="out-in">
       
      </transition>-->
      <!-- <div class="shield" v-if="accepted" @click="accepted=!accepted"></div> -->
      <!-- <input 
					v-model="form.invitation_schedule"
					type="datetime-local" 
					id="meeting-time"
					name="meeting-time">

					<AppButton
					@click="inviteLocum()"
					class="mx-1"
					:label="'Invite This Locum'"
      />-->

      <div class="flex flex-row flex-no-wrap justify-start items-center mt-4 md:mt-8">
        <div class="font-bold text-md sm:text-lg">{{ user.name }}</div>
        <div
          class="px-4 py-1 rounded-lg w-32 text-center mx-2"
          :class="statusStyle(permanentJobApp.application_status)"
        >{{ permanentJobApp.application_status }}</div>
      </div>
      <div
        v-if="permanentJobApp && 
          permanentJobApp.application_status &&
          permanentJobApp.invitation_schedule"
      >
        You have invited this candidate
        {{ $moment(permanent_job_application.invitation_schedule).format('DD/MM/YYYY, h:mm:ss a') }}
        GMT for an Interview.
      </div>
      <div class="flex flex-row flex-wrap justify-between mt-4">
        <div class="w-full pr-0 lg:pr-2 lg:w-1/2">
          <div class="bg-white rounded-lg shadow-lg p-4 md:p-8">
            <div class="float-right">
              <AppAvatar
                :height="'80px'"
                :width="'80px'"
                :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : ''"
              />
            </div>
            <div class="font-bold text-sm sm:text-md">Candidate</div>
            <div class="text-xs sm:text-sm mb-4 md:mb-8">{{ user.name }}</div>
            <div class="font-bold text-sm sm:text-md">Headline</div>
            <div
              class="text-xs sm:text-sm mb-4 md:mb-8"
            >{{ user.locum_detail && user.locum_detail.headline ? user.locum_detail.headline : '(none)' }}</div>
            <div class="font-bold text-sm sm:text-md">Biography</div>
            <div
              class="text-xs sm:text-sm mb-4 md:mb-8"
            >{{ user.locum_detail && user.locum_detail.short_biography ? user.locum_detail.short_biography : '(none)' }}</div>
            <div class="font-bold text-sm sm:text-md">GMC / NMC Number</div>
            <div
              class="text-xs sm:text-sm mb-4 md:mb-8"
            >{{ user && user.locum_detail && user.locum_detail.gmc_or_nmc_number ? user.locum_detail.gmc_or_nmc_number.number : 'N/A' }}</div>
            <div class="font-bold text-sm sm:text-md">MPL / NPL Number</div>
            <div
              class="text-xs sm:text-sm mb-4 md:mb-8"
            >{{ user && user.locum_detail && user.locum_detail.mpl_or_npl_number ? user.locum_detail.mpl_or_npl_number.number : 'N/A' }}</div>
            <div class="font-bold text-sm sm:text-md">Specialty</div>
            <div class="text-xs sm:text-sm mb-4 md:mb-8 flex flex-row flex-wrap">
              <div
                v-for="item in user.locum_detail.qualifications"
                :key="item.id"
                class="rounded-lg bg-yellow-500 p-2 m-1"
              >{{ item.name }}</div>
            </div>
            <div class="font-bold text-sm sm:text-md">Clinical systems</div>
            <div class="text-xs sm:text-sm mb-4 md:mb-8 flex flex-row flex-wrap">
              <div
                v-for="item in user.locum_detail.clinical_systems"
                :key="item.id"
                class="rounded-lg bg-yellow-500 p-2 m-1"
              >{{ item.name }}</div>
            </div>
            <div class="font-bold text-sm sm:text-md">Languages</div>
            <div class="text-xs sm:text-sm mb-4 md:mb-8 flex flex-row flex-wrap">
              <div class="rounded-lg bg-yellow-500 p-2 m-1">English</div>
              <div
                v-for="item in user.locum_detail.spoken_languages"
                :key="item.id"
                class="rounded-lg bg-yellow-500 p-2 m-1"
              >{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div class="w-full pl-0 lg:pl-2 mt-8 lg:mt-0 lg:w-1/2">
          <div class="rounded-lg shadow-lg p-4 md:p-8 mb-4">
            <div class="font-semibold">Job Pitch</div>
            <div>
              <no-ssr>
                <quill-editor
                  class="border-none"
                  :options="options"
                  :content="permanentJobApp && permanentJobApp.job_application_pitch ? 
                  permanentJobApp.job_application_pitch : 'N/A'"
                  disabled
                />
              </no-ssr>
            </div>
            <div
              v-if="permanentJobApp && permanentJobApp.cover_email_file"
              class="flex items-center cursor-pointer hover:underline"
            >
              <span>
                <svgicon name="cloud-download" height="24" width="24" />
              </span>
              <a
                class="px-2 text-sm leading-tight"
                :href="permanentJobApp.cover_email_file.url"
                :download="permanentJobApp.cover_email_file.filename"
                target="_blank"
                @click.prevent="downloadItem(permanentJobApp.cover_email_file.url, permanentJobApp.cover_email_file.filename)"
              >{{ permanentJobApp.cover_email_file.filename }}</a>
            </div>
          </div>
          <div class="rounded-lg shadow-lg p-4 md:p-8 mb-4">
            <div class="font-bold text-sm sm:text-md">Compliance documents</div>
            <div class="flex flex-col mb-4 md:mb-8">
              <div
                v-for="item in mandatory"
                :key="item.id"
                class="flex flex-row items-center mt-2 cursor-pointer hover:underline"
              >
                <span>
                  <svgicon name="cloud-download" height="24" width="24" />
                </span>
                <a
                  class="px-2 text-sm leading-tight"
                  :href="item.file.url"
                  :download="item.file.filename"
                  target="_blank"
                  @click.prevent="downloadItem(item.file.url, item.file.filename)"
                >{{ item.compliance_document.name }}</a>
              </div>
              <template v-if="mandatory && !mandatory.length">
                <span class="text-sm">(none)</span>
              </template>
            </div>

            <div class="font-bold text-sm sm:text-md">Others documents</div>
            <div class="flex flex-col mb-4 md:mb-8">
              <div
                v-for="item in optional"
                :key="item.id"
                class="flex flex-row items-center mt-2 cursor-pointer hover:underline"
              >
                <span>
                  <svgicon name="cloud-download" height="24" width="24" />
                </span>
                <a
                  class="px-2 text-sm leading-tight"
                  :href="item.file.url"
                  :download="item.file.filename"
                  target="_blank"
                  @click.prevent="downloadItem(item.file.url, item.file.filename)"
                >{{ item.compliance_document.name }}</a>
              </div>
              <template v-if="optional && !optional.length">
                <span class="text-sm">(none)</span>
              </template>
            </div>

            <div class="font-bold text-sm sm:text-md">Mandatory Trainings</div>
            <div class="flex flex-col mb-4 md:mb-8">
              <div
                v-for="item in mandatoryTrainings.filter(item => item.file)"
                :key="item.id"
                class="flex flex-row items-center mt-2 cursor-pointer hover:underline"
              >
                <span>
                  <svgicon name="cloud-download" height="24" width="24" />
                </span>
                <a
                  :href="item.file.url"
                  :download="item.file.filename"
                  class="px-2 text-sm leading-tight"
                  @click.stop.prevent="downloadItem(item.file.url, item.file.filename)"
                >{{ item.mandatory_training.name }}</a>
              </div>
              <template v-if="mandatoryTrainings && !mandatoryTrainings.length">
                <span class="text-sm">(none)</span>
              </template>
            </div>

            <div class="font-bold text-sm sm:text-md">Preferred rates</div>
            <div class="flex flex-col mb-4 md:mb-8">
              <div
                v-for="item in user.locum_detail.rates"
                :key="item.id"
                class="flex flex-row flex-no-wrap mt-2"
              >
                <div class="text-xs sm:text-sm">{{ item.rate_type.name }}: £ {{ item.min }}</div>
              </div>
            </div>
            <div class="font-bold text-sm sm:text-md">Referees</div>
            <div v-if="user.locum_detail.referees.length > 0">
              <div
                v-for="item in user.locum_detail.referees"
                :key="item.id"
                :class="item && item.name ? 'rounded-lg flex flex-col bg-gray-300 my-2 p-4 text-xs md:text-sm' : ''"
              >
                <div class="text-xs sm:text-sm">{{ item ? item.name:null }}</div>
                <div class="text-xs sm:text-sm">{{ item ? item.phone_number:null }}</div>
                <div class="text-xs sm:text-sm">{{ item ? item.email:null }}</div>
              </div>
            </div>
            <div
              v-if="!user.locum_detail.referees.map(item => item.name !== null).includes(true)"
              class="text-xs md:text-sm"
            >(none)</div>
          </div>
          <!-- <AppButton
            v-if="permanentJobApp.invitation_schedule && permanentJobApp.application_status === 'For Interview'"
            :label="'Appoint to this job'"
            @click="confirmation_modal = true"
          />-->
        </div>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="sendMessageModal" class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3">
        <SendMessageModal :user="user" :profile-option="false" @close="sendMessageModal=false" />
      </div>
    </transition>
    <div v-if="sendMessageModal" class="shield" @click="sendMessageModal=false" />
    <AppConfirmationModal
      :label="'Are you sure you want to reject this Locum?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="rejectConfirmModal"
      @confirm="rejectLocum()"
      @cancel="rejectConfirmModal = false"
    />
    <AppConfirmationModal
      :label="'Appoint this Locum?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="confirmation_modal"
      @confirm="appoint"
      @cancel="confirmation_modal = false"
    />
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppAvatar from "@/components/Base/AppAvatar";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import SendMessageModal from "@/components/Messages/SendMessageModal";
import AppDate from "@/components/Base/AppDate";
import AppTime from "@/components/Base/AppTime";

export default {
  components: {
    AppButton,
    AppConfirmationModal,
    SendMessageModal,
    AppAvatar,
    AppDate,
    AppTime,
  },
  props: {
    user: {
      type: Object,
      default: () => null
    },
    permanent_job: {
      type: Object,
      default: () => null,
    },
    permanent_job_application: {
      type: Object,
      default: () => null,
    }
  },
  data () {
    return {
      permanentJobApp: "",
      confirmation_modal: false,
      rejectConfirmModal: false,
      mandatory: [],
      optional: [],
      mandatoryTrainings: [],
      sendMessageModal: false,
      form: {
        invitation_date: "",
        invitation_time: "",
      },
      formError: [],
      accepted: false,
      options: {
        modules: {
          toolbar: null,
        }
      }
    };
  },
  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    }
  },

  created () {
    this.getLocumCompliancesByLocumProfessionProfessionComplianceCategoryId(
      this.user.locum_detail.profession.profession_compliance_category_id
    );
    this.mandatoryTrainings = this.user.locum_detail.mandatory_trainings;
    this.permanentJobApp = this.permanent_job_application;
  },

  methods: {
    message (user) {
      this.user = user;
      this.sendMessageModal = true;
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
                  mandatory_compliance_document.id ===
                  compliance_document.compliance_document.id
              );
            }
          );
          this.optional = this.user.locum_detail.compliance_documents.filter(
            compliance_document => {
              return res.data.profession_compliance_category.optional_compliance_documents.some(
                optional_compliance_document =>
                  optional_compliance_document.id ===
                  compliance_document.compliance_document.id
              );
            }
          );
        });
    },

    async inviteLocum () {
      this.formError = [];
      this.Validate(this.form);
      if (!this.formError.length) {
        await this.$axios
          .$put(
            `/api/v1/practice/permanent-job-applications/${this.permanent_job_application.id}/schedule-locum`,
            {
              invitation_schedule:
                this.form.invitation_date + " " + this.form.invitation_time,
            }
          )
          .then(res => {
            console.log("perm job app", res.data.permanent_job_application);
            this.permanentJobApp = res.data.permanent_job_application;
            this.$emit("close");
            this.$emit("updateApplicants");
            this.accepted = false;
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Successfully Invited Locum"]
            });
          })
          .catch(err => {
            console.log("err", err.reponse | err);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            });
          });
      }
    },

    async rejectLocum () {
      await this.$axios
        .$put(
          `/api/v1/practice/permanent-job-applications/${this.permanent_job_application.id}/reject-application`
        )
        .then(() => {
          this.rejectConfirmModal = false;
          this.$emit("close");
          this.$emit("updateApplicants");
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Successfully Rejected Locum"]
          });
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`]
          });
        });
    },

    appoint () {
      this.$axios
        .$put(
          `/api/v1/practice/permanent-job-applications/${this.permanent_job_application.id}/appoint-locum-to-job/${this.permanent_job_application.permanent_job_id}`
        )
        .then(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Assign locum successfully"]
          });
          this.$route.push("/permanent-jobs");
        })
        .catch(err => {
          console.log("err", err.reponse | err);
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`]
          });
          this.accepted = false;
        })
        .finally(() => {
          this.confirmation_modal = false;
        });
    },

    downloadItem (fileUrl, fileName) {
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
      });
    },

    statusStyle (jobStatus) {
      switch (jobStatus) {
        case "Available":
          return "bg-green-500 text-white";
        case "Applied":
          return "bg-yellow-600 text-white";
        case "For Interview":
          return "bg-green-600 text-white";
        case "Accepted":
          return "bg-green-700 text-white";
        case "Rejected":
          return "bg-red-700 text-white";
        case "Closed":
          return "bg-gray-700 text-white";
        default:
          return "bg-yellow-400 text-black";
      }
    }
  }
};
</script>
<style scoped>
.document-filename {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.avatar {
  max-width: 80px;
  max-height: 80px;
  min-width: 80px;
  min-height: 80px;
}

img {
  border-radius: 50%;
}
.shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 59;
}
</style>