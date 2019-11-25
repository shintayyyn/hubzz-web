<template>
  <div class="p-4 md:p-8">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex flex-row justify-start mt-4">
      <div class="leading-loose font-bold text-md sm:text-lg">{{ job.title }}</div>
      <div
        class="mx-2 text-sm sm:text-sm p-2"
        :class="bgStatus(job.status)"
      >{{ status(job.status) }}</div>
      <div v-if="authPermissions.includes('Update Sessions Job')">
        <button
          class="font-bold text-xs sm:text-sm no-underline px-2 py-2 rounded-lg bg-yellow-500 ml-4 focus:outline-none"
          v-if="
						(job.status === 'Allocated' &&
							toEdit === false &&
							canEdit === true) ||
							(job.status === 'Applied' && toEdit === false) ||
							(job.status === 'Live' && toEdit === false)
					"
          @click.prevent="toEdit = true"
        >Edit this job</button>
        <button
          class="font-bold text-xs sm:text-sm no-underline px-2 py-2 rounded-lg bg-yellow-500 ml-4 focus:outline-none"
          v-if="
						(job.status === 'Allocated' &&
							toEdit === true &&
							canEdit === true) ||
							(job.status === 'Applied' && toEdit === true) ||
							(job.status === 'Live' && toEdit === true)
					"
          @click.prevent="toEdit = false"
        >Cancel Editing</button>
      </div>
    </div>
    <div class="mt-4">{{ongoingTimeLeft}}</div>
    <div class="mt-4" v-if="job.update_accepted === false">Waiting for Locum's approval...</div>

    <div class="flex flex-col mt-4">
      <div class="flex flex-wrap justify-start">
        <div class="p-0 md:pr-4 w-full md:w-1/2">
          <div class="flex flex-col">
            <JobDetailModalForm :job="job" v-if="toEdit === false" />
            <JobDetailModalUpdateForm
              :job="job"
              v-if="job.status === 'Allocated' && toEdit === true && canEdit === true  || job.status === 'Applied' && toEdit === true  || job.status === 'Live' && toEdit === true"
              @updateJob="updateJob"
            />
            <JobDetailModalCancelForm
              :job="job"
              @close="$emit('close')"
              v-if="(job.status === 'Allocated' || job.status === 'Ongoing' || job.status === 'Applied' || job.status === 'Live') && authPermissions.includes('Cancel Sessions Job')"
            />
          </div>
        </div>
        <div class="p-0 md:pl-4 w-full md:w-1/2 mt-4 md:m-0">
          <div class="flex flex-col">
            <JobPartDetailModalParts :job_id="job.id" :disabledLink="true" />
            <JobDetailModalCandidates
              class="order-first lg:order-none"
              v-if="job.status === 'Applied'"
              :job="job"
              @show="showLocum($event)"
            />
            <JobDetailModalLocum
              :user="user"
              :mandatory="mandatory"
              :optional="optional"
              @favorite="favorite"
              @unfavorite="unfavorite"
              v-if="(job.status === 'Allocated' || job.status === 'Ongoing' || job.status === 'Completed') && user"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="shield" v-if="modal" @click="modal = false"></div>
    <transition name="slide" mode="out-in">
      <div class="modal-container shadow-lg" v-if="modal">
        <JobDetailModalShowCandidate
          @close="modal = false"
          :job="job"
          :user="user"
          @appointed="$emit('close')"
        />
      </div>
    </transition>
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
import JobDetailModalForm from "@/components/Sessions/JobDetailModalForm";
import JobPartDetailModalParts from "@/components/Sessions/JobPart/JobPartDetailModalParts";
import JobDetailModalUpdateForm from "@/components/Sessions/JobDetailModalUpdateForm";
import JobDetailModalCandidates from "@/components/Sessions/JobDetailModalCandidates";
import JobDetailModalLocum from "@/components/Sessions/JobDetailModalLocum";
import JobDetailModalCancelForm from "@/components/Sessions/JobDetailModalCancelForm";
import JobDetailModalCompleteForm from "@/components/Sessions/JobDetailModalCompleteForm";
import JobDetailModalShowCandidate from "@/components/Sessions/JobDetailModalShowCandidate";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  props: ["job"],
  components: {
    JobDetailModalForm,
    JobPartDetailModalParts,
    JobDetailModalUpdateForm,
    JobDetailModalCandidates,
    JobDetailModalLocum,
    JobDetailModalCompleteForm,
    JobDetailModalCancelForm,
    JobDetailModalShowCandidate,
    AppConfirmationModal
  },
  data() {
    return {
      user: null,
      mandatory: [],
      optional: [],
      modal: false,
      toEdit: false,
      confirmation_text: "",
      confirmation_modal: false
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    },
    canEdit() {
      return (
        this.$moment(
          `${this.job.date_start} ${this.job.time_start}`,
          "YYYY-MM-DD HH:mm"
        ).diff(this.$moment(), "hours") >= 72
      );
    },
    ongoingTimeLeft() {
      let days = this.$moment(
        `${this.job.date_start} ${this.job.time_start}`,
        "YYYY-MM-DD HH:mm"
      ).diff(this.$moment(), "days");

      let hours = this.$moment(
        `${this.job.date_start} ${this.job.time_start}`,
        "YYYY-MM-DD HH:mm"
      ).diff(this.$moment(), "hours");

      let minutes = this.$moment(
        `${this.job.date_start} ${this.job.time_start}`,
        "YYYY-MM-DD HH:mm"
      ).diff(this.$moment(), "minutes");

      let seconds = this.$moment(
        `${this.job.date_start} ${this.job.time_start}`,
        "YYYY-MM-DD HH:mm"
      ).diff(this.$moment(), "seconds");

      let timeLeft;
      let type;
      if (days > 0) {
        timeLeft = days;
        type = "days";
      } else if (hours > 0) {
        timeLeft = hours;
        type = "hours";
      } else if (minutes > 0) {
        timeLeft = minutes;
        type = "minutes";
      } else if (seconds > 0) {
        timeLeft = seconds;
        type = "seconds";
      }

      return `This Job will start in ${timeLeft} ${type}`;
    }
  },
  created() {
    if (this.job.platform_job.appointed_to_locum !== null) {
      this.getAppointedLocum();
    }
  },
  methods: {
    getAppointedLocum() {
      this.$axios
        .$get(
          `/api/v1/practice/locums/${this.job.platform_job.appointed_to_locum.user.id}`
        )
        .then(res => {
          this.user = res.data.user;
          this.getProfessionCategory(
            res.data.user.locum_detail.profession.profession_category.id
          );
        });
    },
    favorite() {
      this.confirmation_text = "Add this Locum to MyBanks?";
      this.confirmation_modal = true;
    },
    unfavorite() {
      this.confirmation_text = "Remove this Locum to MyBanks?";
      this.confirmation_modal = true;
    },
    confirm() {
      if (!this.user.is_favorite) {
        this.$axios
          .$post(`/api/v1/practice/locums/${this.user.id}/favorite`)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Added to favourites"]
            });
          });
        this.user.is_favorite = true;
        this.confirmation_modal = false;
      } else if (this.user.is_favorite) {
        this.$axios
          .$delete(`/api/v1/practice/locums/${this.user.id}/favorite`)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Remove to favourites"]
            });
          });
        this.user.is_favorite = false;
        this.confirmation_modal = false;
      }
    },
    getProfessionCategory(id) {
      this.$axios.$get(`/api/v1/profession-categories/${id}`).then(res => {
        this.mandatory = this.user.locum_detail.compliance_documents.filter(
          compliance_document => {
            return res.data.profession_category.mandatory_compliance_documents.some(
              mandatory_compliance_document =>
                mandatory_compliance_document.id ===
                compliance_document.compliance_document.id
            );
          }
        );
        this.optional = this.user.locum_detail.compliance_documents.filter(
          compliance_document => {
            return res.data.profession_category.optional_compliance_documents.some(
              optional_compliance_document =>
                optional_compliance_document.id ===
                compliance_document.compliance_document.id
            );
          }
        );
      });
    },
    showLocum(user) {
      this.user = user;
      this.modal = true;
    },
    updateJob({ newJob, oldJob }) {
      this.toEdit = false;
      this.$emit("close");
      setTimeout(() => {
        this.$router.push({
          path: `/sessions/${newJob.id}`,
          query: { ...this.$route.query }
        });
        if (
          this.$route.path.includes("/sessions") &&
          (!this.$route.query.status ||
            (this.$route.query.status &&
              this.$route.query.status === "Allocated"))
        ) {
          this.$store.commit("jobs/UPDATE_PRACTICE_ALLOCATED_JOB", {
            newJob,
            oldJob
          });
        } else if (
          this.$route.path.includes("/sessions") &&
          this.$route.query.status &&
          this.$route.query.status === "Applied"
        ) {
          this.$store.commit("jobs/UPDATE_PRACTICE_APPLIED_JOB", {
            newJob,
            oldJob
          });
        } else if (
          this.$route.path.includes("/sessions") &&
          this.$route.query.status &&
          this.$route.query.status === "Live"
        ) {
          this.$store.commit("jobs/UPDATE_PRACTICE_AVAILABLE_JOB", {
            newJob,
            oldJob
          });
        }
      }, 500);
    },
    status(status) {
      return status.toUpperCase();
    },
    bgStatus(status) {
      switch (status) {
        case "Live":
          return "bg-yellow-500";
          break;
        case "Applied":
          return "bg-orange-400 text-white";
          break;
        case "Completed":
          return "bg-green-400";
          break;
        case "Allocated":
          return "bg-green-300";
          break;
        case "Ongoing":
          return "bg-green-500";
          break;
        default:
          return "bg-red-500 text-white";
      }
    }
  }
};
</script>
<style scoped>
.shield {
  z-index: 511;
}
.modal-container {
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 60%;
  }
}
</style>
