<template>
  <section>
    <div class="p-4 md:p-8 max-w-3xl">
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
      </div>
      <div class="flex flex-row flex-no-wrap justify-start mt-4 md:mt-8">
        <div class="font-bold text-md sm:text-lg">{{ user.personal_detail.name }}</div>
      </div>
      <div
        v-if="user.locum_job_applied_update_accepted_until && user.locum_job_applied_update_accepted == false"
      >
        <p class="text-sm">This user has not yet accepted your changes.</p>
        Waiting for locum's approval within
        {{ deadline.hours > 0 ? deadline.hours > 1 ? `${deadline.hours} hours` : `${deadline.hours} hour` : '' }}
        {{ deadline.hours ? 'and' : '' }}
        {{ deadline.minutes > 0 ? deadline.minutes > 1 ? `${deadline.minutes} minutes` : `${deadline.minutes} minute` : '' }},
        before {{ $moment(user.locum_job_applied_update_accepted_until).utc().format("h:mm a, MMMM D, YYYY") }}
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
            <div class="text-xs sm:text-sm mb-4 md:mb-8">{{ user.locum_detail.profession.name }}</div>
            <div class="font-bold text-sm sm:text-md">Headline</div>
            <div
              class="text-xs sm:text-sm mb-4 md:mb-8"
            >{{ user.locum_detail && user.locum_detail.headline && user.locum_detail.headline.trim() ? user.locum_detail.headline : '(none)' }}</div>
            <div class="font-bold text-sm sm:text-md">Biography</div>
            <div
              class="text-xs sm:text-sm mb-4 md:mb-8"
            >{{ user.locum_detail && user.locum_detail.short_biography && user.locum_detail.short_biography.trim() ? user.locum_detail.short_biography : '(none)' }}</div>
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
            </div>

            <div class="font-bold text-sm sm:text-md">Others documents</div>
            <div class="flex flex-col mb-4 md:mb-8">
              <div
                v-for="item in optional"
                :key="item.id"
                class="flex flex-row mt-2 cursor-pointer hover:underline"
              >
                <span>
                  <svgicon name="cloud-download" height="24" width="24" />
                </span>
                <a
                  class="px-2"
                  :href="item.file.url"
                  :download="item.file.filename"
                  target="_blank"
                  @click.prevent="downloadItem(item.file.url, item.file.filename)"
                >{{ item.compliance_document.name }}</a>
              </div>
              <div v-if="optional && !optional.length" class="text-sm">(none)</div>
            </div>

            <div class="font-bold text-sm sm:text-md">Mandatory Trainings</div>
            <div class="flex flex-col mb-8">
              <div
                v-for="item in mandatoryTrainings"
                :key="item.id"
                class="flex flex-row flex-no-wrap mt-1 cursor-pointer hover:underline"
              >
                <div class="flex flex-row flex-no-wrap" v-if="item.file">
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
            <div v-if="referees.length > 0">
              <div
                v-for="item in referees"
                :key="item.id"
                :class="item && item.id ? 'rounded-lg flex flex-col bg-gray-300 my-2 p-4 text-xs md:text-sm' : ''"
              >
                <div class="flex flex-col w-full justify-start">
                  <div class="w-full">Contact Name:</div>
                  <div class="w-full">{{item.name && item.name.trim() ? item.name : '(none)'}}</div>
                </div>
                <div class="flex flex-col w-full justify-start my-2">
                  <div class="w-full">Telephone number:</div>
                  <div
                    class="w-full"
                  >{{item.phone_number && item.phone_number.trim() ? item.phone_number : '(none)'}}</div>
                </div>
                <div class="flex flex-col w-full justify-start">
                  <div class="w-full">Email Address:</div>
                  <div class="w-full">{{item.email && item.email.trim() ? item.email : '(none)'}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="referees.length === 0" class="text-xs md:text-sm">(none)</div>
          </div>
          <AppButton
            v-if="authPermissions.includes('Appoint Sessions Job')"
            :label="'Appoint to this job'"
            :disabled="!user.locum_job_user_appointable"
            @click="confirmation_modal = true"
          />
          <!-- <AppButton
            v-if="!user.locum_job_user_appointable"
            :label="'This user has not yet accepted your changes'"
            disabled
          />-->
        </div>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="sendMessageModal" class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3">
        <SendMessageModal :user="user" :profileOption="false" @close="sendMessageModal=false" />
      </div>
    </transition>
    <div v-if="sendMessageModal" class="shield" @click="sendMessageModal=false" />
    <AppConfirmationModal
      :label="'Appoint this Locum?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_modal"
      @confirm="checkIfLocumAlreadyAppointed"
      @cancel="confirmation_modal = false"
    />
    <AppConfirmationModal
      :label="`This Locum is already appointed on one of your Job.`"
      :label2="`${jobNumbers.length > 1 ? `${jobNumbers.slice(0,2)},etc..` : `${jobNumbers}`}`"
      :label3="`Are you sure you want to continue?`"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="warning_modal"
      @confirm="appoint"
      @cancel="warning_modal = false"
    />
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppAvatar from "@/components/Base/AppAvatar";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import SendMessageModal from "@/components/Messages/SendMessageModal";
export default {
  components: {
    AppButton,
    AppConfirmationModal,
    AppAvatar,
    SendMessageModal
  },
  props: {
    user: {
      type: Object,
      default: () => null
    },
    job: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      warning_modal: false,
      jobNumbers: [],
      //
      confirmation_modal: false,
      mandatory: [],
      optional: [],
      mandatoryTrainings: [],
      referees: [],
      sendMessageModal: false,
      deadline: {
        hours: 0,
        minutes: 0
      }
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    }
  },
  created() {
    this.getLocumCompliancesByLocumProfessionProfessionComplianceCategoryId(
      this.user.locum_detail.profession.profession_compliance_category_id
    );
    let data = this.$moment.duration(
      this.$moment(
        this.user.locum_job_applied_update_accepted_until,
        "YYYY-MM-DDTHH:mm:ss:SSSZ"
      ).diff(this.$moment())
    );
    this.mandatoryTrainings = [];
    this.user.locum_detail.mandatory_trainings.forEach(mandatoryTraining => {
      if (mandatoryTraining.file !== null) {
        this.mandatoryTrainings.push(mandatoryTraining);
      }
    });
    this.referees = [];
    this.user.locum_detail.referees.forEach(referee => {
      if (
        referee.name !== null &&
        referee.name &&
        referee.name.trim() &&
        referee.phone_number !== null &&
        referee.phone_number &&
        referee.phone_number.trim() &&
        referee.email !== null &&
        referee.email &&
        referee.email.trim()
      ) {
        this.referees.push(referee);
      }
    });
    // this.mandatoryTrainings = this.user.locum_detail.mandatory_trainings;
    this.deadline.hours = data._data.hours;
    this.deadline.minutes = data._data.minutes;
    console.log(this.deadline);
  },
  methods: {
    message(user) {
      this.user = user;
      this.sendMessageModal = true;
    },
    getLocumCompliancesByLocumProfessionProfessionComplianceCategoryId(
      locumProfessionProfessionComplianceCategoryId
    ) {
      this.$axios
        .$get(
          `/api/v1/profession-compliance-categories/${locumProfessionProfessionComplianceCategoryId}`
        )
        .then(res => {
          this.mandatory = this.user.locum_detail.compliance_documents.filter(
            compliance_document => {
              console.log(this.user);
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
    checkIfLocumAlreadyAppointed() {
      this.$axios
        .$get(`/api/v1/practice/jobs?appointed_locum_user_id=${this.user.id}`, {
          params: {
            status: ["Allocated", "Ongoing"]
          }
        })
        .then(res => {
          this.jobNumbers = res.data.jobs.map(job => job.job_number);
          if (res.data.jobs.length > 0) {
            this.warning_modal = true;
            this.confirmation_modal = false;
          } else if (res.data.jobs.length === 0) {
            this.appoint();
          }
        });
    },
    appoint() {
      this.$axios
        .$put(
          `/api/v1/practice/jobs/${this.job.id}/applicants/${this.user.id}/appoint`
        )
        .then(() => {
          if (
            this.$route.path.includes("/dashboard") ||
            this.$route.path.includes("/sessions")
          ) {
            this.$store.commit("jobs/REMOVE_PRACTICE_APPLIED_JOB", this.job.id);
            this.$store.commit(
              "jobs/REMOVE_PRACTICE_APPLIED_JOBS_REMINDER",
              this.job.id
            );
          }
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Assign locum successfully"]
          });
          this.$emit("appointed");
        })
        .catch(err => {
          console.log("err", err.reponse | err);
          if (
            err.response &&
            err.response.data &&
            err.response.data.message === "Locum User Not Accept Update"
          ) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danget",
              text: ["Locum has not yet accepted the amendment."]
            });
          } else {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danget",
              text: [`${err.response.data.message}`]
            });
          }
        })
        .finally(() => {
          this.warning_modal = false;
        });
    },
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
      });
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
</style>