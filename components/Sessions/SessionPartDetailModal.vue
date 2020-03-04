<template>
  <div class="p-4 md:p-8">
    <div>
      <svgicon
        name="left-arrow"
        height="32"
        width="32"
        class="cursor-pointer"
        @click="$emit('close')"
      />
    </div>

    <div class="flex flex-row justify-start items-center mt-4">
      <div class="leading-tight font-bold text-md sm:text-lg">{{ jobPart.job.title }}</div>
      <div
        class="py-2 px-4 mx-1 rounded font-semibold"
        :class="bgStatus(jobPart.status)"
      >{{ status(jobPart.status) }}</div>
      <div
        v-if="['Completed','Cancelled'].includes(jobPart.status) && tagStatus(jobPart)"
        class="py-2 px-4 mx-1 rounded font-semibold bg-gray-300"
      >{{ tagStatus(jobPart) }}</div>
      <!-- <template v-if="jobPart.status === 'Completed'">
        <div
          class="py-2 px-4 mx-1 mx-rounded font-semibold"
          :class="jobPartStatus === 'Completed' ? 'bg-green-500' : 'bg-gray-300'"
        >{{jobPartStatus}}</div>
      </template>-->
      <template
        v-if="['Terminated','Completed','Approved', 'Cancelled', 'Withdrawn', 'Declined'].includes(jobPart.status) && !this.$route.name.includes('my-banks')"
      >
        <AppButton :label="'Repost Job'" :in-style="'font-size:1em'" @click="repost" />
      </template>
    </div>

    <div class="flex flex-col mt-4">
      <div class="flex flex-wrap justify-start">
        <div class="p-0 md:pr-4 w-full md:w-1/2">
          <div class="flex flex-col">
            <div
              v-if="jobPart.status === 'Declined' || jobPart.status === 'Withdrawn' || jobPart.status === 'Cancelled'"
              class="bg-white rounded-lg shadow-lg p-4 md:p-8 mt-4"
            >
              <template v-if="jobPart.status === 'Declined' || jobPart.status === 'Withdrawn'">
                <div class="leading-tight pb-4">
                  <p class="font-bold text-sm sm:text-md">Reason for Withdrawal</p>
                  <p
                    class="text-xs sm:text-sm"
                  >{{ jobPart.job.platform_job.declined_reason ? jobPart.job.platform_job.declined_reason : '(none)' }}</p>
                </div>
                <div class="leading-tight pb-4">
                  <p class="font-bold text-sm sm:text-md">Date of Withdrawal</p>
                  <p
                    class="text-xs sm:text-sm"
                  >{{ jobPart.job.platform_job.declined_at | localDate }}</p>
                </div>
                <div class="leading-tight pb-4">
                  <p class="font-bold text-sm sm:text-md">Withdrawn by</p>
                  <p class="text-xs sm:text-sm">{{ jobPart.locum_first_name }}</p>
                </div>
              </template>
              <template v-if="jobPart.status === 'Cancelled'">
                <div class="leading-tight pb-4">
                  <p
                    class="font-bold text-sm sm:text-md"
                  >{{ jobPart.terminated ? 'Terminated' : 'Cancelled' }} At</p>
                  <p
                    class="text-xs sm:text-sm"
                  >{{ jobPart.job.platform_job.cancelled_at | localDate }}</p>
                </div>
                <div class="leading-tight">
                  <p
                    class="font-bold text-sm sm:text-md"
                  >Reason for {{ jobPart.terminated ? 'termination' : 'cancellation' }}</p>
                  <p class="text-xs sm:text-sm">{{ jobPart.job.platform_job.cancelled_reason }}</p>
                </div>
                <div class="leading-tight mt-4">
                  <p
                    class="font-bold text-sm sm:text-md"
                  >{{ jobPart.terminated ? 'Terminated By' : 'Cancelled By' }}</p>
                  <div class="flex justify-start">
                    <div class="text-xs sm:text-sm">
                      {{
                      jobPart.cancelled_by_practice === 'Hub'
                      ? jobPart.parent_practice_name
                      : jobPart.cancelled_by_practice === 'Spoke'
                      ? jobPart.practice_name
                      : jobPart.practice_name
                      }}
                    </div>
                    <div class="mx-1">-</div>
                    <div class="text-xs sm:text-sm">
                      {{
                      jobPart.cancelled_by_user &&
                      jobPart.cancelled_by_user.email
                      ? jobPart.cancelled_by_user.email
                      : jobPart.cancelled_by_user.name
                      }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <SessionPartDetailModalInfo :job_part="jobPart" />
            <div
              v-if="practice.type !== 'Spoke' || 
                (practice.type === 'Spoke' && !practice.parent_practice_id) ||
                (practice.type === 'Spoke' && practice.parent_practice_id && practice.allow_surgery_bill_locum === true)"
            >
              <SessionDetailModalCompleteForm
                v-if="jobPart.status === 'Ongoing' && authPermissions.includes('Complete Sessions Job')"
                :job_part="jobPart"
                @completed="$emit('close')"
              />
              <SessionDetailModalCancelForm
                v-if="['Live','Allocated','Ongoing','Applied'].includes(jobPart.status) && authPermissions.includes('Cancel Sessions Job')"
                :job="jobPart.job"
                @cancelled="$emit('close')"
              />
            </div>
            <div
              v-else
              class="mx-4 m-2"
            >You are not allowed to set jobs as completed. Please contact your Hub to gain access to this feature.</div>
          </div>
        </div>
        <div class="p-0 md:pr-4 w-full md:w-1/2">
          <div class="flex flex-col">
            <SessionPartDetailModalParts :job_id="jobPart.job.id" />
            <SessionDetailModalLocum
              v-if="(jobPart.status === 'Allocated' || jobPart.status === 'Ongoing' || jobPart.status === 'Completed' || jobPart.status === 'Approved' || jobPart.status === 'Withdrawn' || (jobPart.status === 'Cancelled' && jobPart.appointed_to_locum_user_id))"
              :job="jobPart.job"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SessionPartDetailModalInfo from "@/components/Sessions/SessionPart/SessionPartDetailModalInfo";
import SessionPartDetailModalParts from "@/components/Sessions/SessionPart/SessionPartDetailModalParts";
import SessionDetailModalCancelForm from "@/components/Sessions/SessionDetailModalCancelForm";
import SessionDetailModalCompleteForm from "@/components/Sessions/SessionDetailModalCompleteForm";
import SessionDetailModalLocum from "@/components/Sessions/SessionDetailModalLocum";
import AppButton from "@/components/Base/AppButton";
export default {
  components: {
    SessionPartDetailModalInfo,
    SessionPartDetailModalParts,
    SessionDetailModalCompleteForm,
    SessionDetailModalCancelForm,
    SessionDetailModalLocum,
    AppButton
  },
  props: {
    jobPart: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      user: null,
      practice: null
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    }
  },
  created() {
    this.user = this.$auth.user;
    this.practice = this.$auth.user.practice_detail.practice;
  },
  methods: {
    tagStatus(job_part) {
      let status = "";
      if (job_part.status === "Completed") {
        status = "TO BE INVOICED";
        if (job_part.disputed && job_part.issued) {
          status = "DISPUTED";
        } else if (job_part.invoiced && job_part.issued) {
          status = "INVOICED";
        }
        return status;
      } else if (job_part.status === "Cancelled") {
        return job_part.terminated ? "TERMINATED" : null;
      }
    },
    status(status) {
      let jobStatus = status === "Available" ? "Live" : status;
      return jobStatus.toUpperCase();
    },
    bgStatus(status) {
      let str;
      switch (status) {
        case "Ongoing":
        case "Completed":
        case "Approved":
          str = "bg-green-600 text-white";
          break;
        default:
          str = "bg-red-500 text-white";
      }
      return str;
    },
    repost() {
      this.$emit("close");
      setTimeout(() => {
        if (this.$route.name.includes("hub-surgery-management")) {
          this.$store.commit("calendar/SET_REPOST_JOB", this.jobPart.job);
          this.$store.commit("calendar/CREATE_JOB_SURGERY_MODAL", true);
        } else if (
          this.$route.name.includes("sessions") ||
          this.$route.name.includes("dashboard")
        ) {
          this.$store.commit("calendar/SET_REPOST_JOB", this.jobPart.job);
          this.$store.commit("calendar/CREATE_JOB_MODAL", true);
        }
      }, 500);
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
