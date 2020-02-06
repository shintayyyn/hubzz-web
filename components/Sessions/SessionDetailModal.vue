<template>
  <div class="p-4 md:p-8">
    <div>
      <svgicon
        name="left-arrow"
        height="32"
        width="32"
        @click="$emit('close')"
        class="cursor-pointer"
      />
    </div>

    <div class="flex flex-wrap justify-start items-center mt-4">
      <div class="leading-tight font-bold text-md sm:text-lg">{{ job.title }}</div>
      <div
        class="mx-2 py-2 px-4 rounded font-semibold"
        :class="bgStatus(job.status)"
      >{{ status(job.status) }}</div>
      <template v-if="authPermissions.includes('Update Sessions Job')">
        <button
          class="font-bold text-xs sm:text-sm no-underline px-2 py-2 rounded-lg bg-green-400 hover:bg-green-500 text-white ml-4 focus:outline-none"
          v-if="job.status === 'Pending' &&
            practice.type == 'Hub' &&
            toEdit === false"
          @click="approveJob()"
        >Approve this Job</button>
        <button
          class="font-bold text-xs sm:text-sm no-underline px-2 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 ml-4 focus:outline-none"
          v-if="
						((job.status === 'Allocated' || job.status === 'Pending' ) &&
							toEdit === false &&
							canEdit === true) ||
              (job.status === 'Pending' && toEdit === false) ||
							(job.status === 'Applied' && toEdit === false) ||
							(job.status === 'Live' && toEdit === false)
					"
          @click.prevent="toEdit = true"
        >Edit this job</button>
        <button
          class="font-bold text-xs sm:text-sm no-underline px-2 py-2 rounded-lg bg-yellow-500 ml-4 focus:outline-none"
          v-if="
						((job.status === 'Allocated' || job.status === 'Pending' ) &&
							toEdit === true &&
							canEdit === true) ||
              (job.status === 'Pending' && toEdit === true) ||
							(job.status === 'Applied' && toEdit === true) ||
							(job.status === 'Live' && toEdit === true)
					"
          @click.prevent="toEdit = false"
        >Cancel Editing</button>
      </template>
      <template v-if="['Unfilled','Withdrawn','Cancelled'].includes(job.status)">
        <AppButton :label="'Repost Job'" @click="repost" :inStyle="'font-size:1em'" />
      </template>
    </div>

    <template v-if="['Allocated','Live','Applied'].includes(job.status)">
      <div class="mt-4" v-if="waitingForApproval">Waiting for Locum's approval...</div>
    </template>

    <div class="flex flex-col mt-4">
      <div class="flex flex-wrap justify-start">
        <div class="p-0 md:pr-4 w-full md:w-1/2">
          <div class="flex flex-col">
            <SessionDetailModalInfo :job="job" v-if="toEdit === false" />
            <SessionDetailModalUpdateForm
              :job="job"
              @updateJob="updateJob"
              v-if="job.status === 'Allocated' && toEdit === true && canEdit === true  || 
              job.status === 'Applied' && toEdit === true  || 
              job.status === 'Live' && toEdit === true ||
              job.status === 'Pending' && toEdit === true"
            />
            <SessionDetailModalMap :job="job" v-if="showMap" />
            <SessionDetailModalCancelForm
              :job="job"
              @cancelled="$emit('close'), $emit('cancelled', $event)"
              v-if="(job.status === 'Allocated' ||
              job.status === 'Ongoing' || 
              job.status === 'Applied' || 
              job.status === 'Live' ||
              job.status === 'Pending') && authPermissions.includes('Cancel Sessions Job')"
            />
          </div>
        </div>
        <div class="p-0 md:pl-4 w-full md:w-1/2 order-first md:order-none">
          <div class="flex flex-col">
            <SessionPartDetailModalParts :job_id="job.id" :disabledLink="true" />
            <SessionDetailModalCandidates
              v-if="job.status === 'Applied'"
              :job="job"
              @appointed="$emit('close'), $emit('appointed', job.id)"
            />
            <SessionDetailModalLocum
              :job="job"
              v-if="(job.status === 'Allocated' || job.status === 'Ongoing' || job.status === 'Completed' || job.status === 'Declined')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SessionPartDetailModalParts from "@/components/Sessions/SessionPart/SessionPartDetailModalParts";
import SessionDetailModalInfo from "@/components/Sessions/SessionDetailModalInfo";
import SessionDetailModalUpdateForm from "@/components/Sessions/SessionDetailModalUpdateForm";
import SessionDetailModalCandidates from "@/components/Sessions/SessionDetailModalCandidates";
import SessionDetailModalLocum from "@/components/Sessions/SessionDetailModalLocum";
import SessionDetailModalCancelForm from "@/components/Sessions/SessionDetailModalCancelForm";
import SessionDetailModalMap from "@/components/Sessions/SessionDetailModalMap";
import AppButton from "@/components/Base/AppButton";
export default {
  props: ["job"],
  components: {
    SessionDetailModalInfo,
    SessionPartDetailModalParts,
    SessionDetailModalUpdateForm,
    SessionDetailModalCandidates,
    SessionDetailModalLocum,
    SessionDetailModalCancelForm,
    SessionDetailModalMap,
    AppButton
  },
  data() {
    return {
      user: null,
      toEdit: false,
      practice: "",
      showMap: false
    };
  },
  created() {
    this.practice = this.$auth.user.practice_detail.practice;
  },
  mounted() {
    setTimeout(() => {
      this.showMap = true;
    }, 1);
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    },
    canEdit() {
      return (
        this.$moment(
          `${this.job.date_start} ${this.job.time_start}`,
          "YYYY-MM-DD HH:mm"
        ).diff(
          this.$moment()
            .utc()
            .format("YYYY-MM-DD HH:mm"),
          "hours"
        ) >= 12
      );
    },
    waitingForApproval() {
      return (
        this.job.status === "Allocated" &&
        this.job.update_accepted === false &&
        this.job.original === false &&
        this.job.update_accepted_until
      );
    }
  },
  methods: {
    updateJob({ newJob, oldJob }) {
      this.$emit("close");
      setTimeout(() => {
        this.$store.commit("jobs/UPDATE_PRACTICE_PENDING_JOB", {
          newJob,
          oldJob
        });
        this.$store.commit("jobs/UPDATE_PRACTICE_ALLOCATED_JOB", {
          newJob,
          oldJob
        });
        this.$store.commit("jobs/UPDATE_PRACTICE_APPLIED_JOB", {
          newJob,
          oldJob
        });
        this.$store.commit("jobs/UPDATE_PRACTICE_AVAILABLE_JOB", {
          newJob,
          oldJob
        });
        if (this.$route.name === "sessions-index-id") {
          this.$router.push({
            path: `/sessions/${newJob.id}`,
            query: { ...this.$route.query }
          });
        }
      }, 500);
    },
    approveJob() {
      this.$axios
        .$put(`/api/v1/practice/jobs/${this.job.id}/approve`)
        .then(res => {
          console.log("it worked");
        });
    },
    status(status) {
      let jobStatus = status === "Declined" ? "Withdrawn" : status;
      return jobStatus.toUpperCase();
    },
    bgStatus(status) {
      switch (status) {
        case "Live":
          return "bg-yellow-500";
          break;
        case "Applied":
          return "bg-orange-500 text-white";
          break;
        case "Allocated":
          return "bg-green-600 text-white";
          break;
        default:
          return "bg-red-500 text-white";
      }
    },
    repost() {
      this.$emit("close");
      setTimeout(() => {
        this.$store.commit("calendar/SET_REPOST_JOB", this.job);
        this.$store.commit("calendar/CREATE_JOB_MODAL", true);
      }, 500);
    }
  }
};
</script>
