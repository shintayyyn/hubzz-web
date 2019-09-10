<template>
  <div class="p-8 max-w-5xl">
    <div @click="close" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex flex-row justify-start mt-8">
      <div class="leading-loose font-bold text-md sm:text-lg">{{job.title}}</div>
      <div class="mx-2 text-sm sm:text-sm p-2" :class="bgStatus(job.status)">{{status(job.status)}}</div>
      <div>
        <button
          class="font-bold text-xs sm:text-sm no-underline px-2 py-2 rounded-lg bg-yellow-500 ml-4 focus:outline-none"
          v-if="job.status === 'Current' && toEdit === false && jobOngoing === false || job.status === 'Applied' && toEdit === false || job.status === 'Available' && toEdit === false"
          @click.prevent="editJob()"
        >Edit this job</button>
        <button
          class="font-bold text-xs sm:text-sm no-underline px-2 py-2 rounded-lg bg-yellow-500 ml-4 focus:outline-none"
          v-if="job.status === 'Current' && toEdit === true && jobOngoing === false || job.status === 'Applied' && toEdit === true || job.status === 'Available' && toEdit === true"
          @click.prevent="cancelEdit()"
        >Cancel Editing</button>
      </div>
    </div>

    <div class="flex flex-col mt-4">
      <div class="flex flex-row flex-wrap justify-start">
        <JobDetailModalForm
          :job="job"
          v-if="toEdit === false || 
                toEdit === false  || 
                toEdit === false || 
                toEdit === false ||
                toEdit === false || 
                toEdit === false || 
                toEdit === false "
        />
        <JobDetailModalUpdateForm
          :job="job"
          v-if="job.status === 'Current' && toEdit === true && jobOngoing === false  || job.status === 'Applied' && toEdit === true  || job.status === 'Available' && toEdit === true"
        />
        <JobDetailModalCandidates
          class="order-first lg:order-none"
          :applicants="applicants"
          v-if="job.status === 'Applied'"
          @show="showLocum($event)"
        />
        <JobDetailModalLocum
          :user="user"
          :mandatory="mandatory"
          :optional="optional"
          v-if="(job.status === 'Current' || job.status === 'Completed') && user"
        />
      </div>
      <JobDetailModalCancelForm
        :job="job"
        @close="close"
        v-if="job.status === 'Current' || job.status === 'Applied' || job.status === 'Available'"
      />
      <JobDetailModalCompleteForm
        :job_parts="job.job_parts"
        @close="close"
        v-if="job.status === 'Current'"
      />
    </div>
    <div class="shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="modal shadow-lg" v-if="modal">
        <JobDetailModalShowCandidate @close="modal = false" :user="user" @appointed="close" />
      </div>
    </transition>
  </div>
</template>
<script>
import JobDetailModalForm from "@/components/Sessions/JobDetailModalForm";
import JobDetailModalUpdateForm from "@/components/Sessions/JobDetailModalUpdateForm";
import JobDetailModalCandidates from "@/components/Sessions/JobDetailModalCandidates";
import JobDetailModalLocum from "@/components/Sessions/JobDetailModalLocum";
import JobDetailModalCancelForm from "@/components/Sessions/JobDetailModalCancelForm";
import JobDetailModalCompleteForm from "@/components/Sessions/JobDetailModalCompleteForm";
import JobDetailModalShowCandidate from "@/components/Sessions/JobDetailModalShowCandidate";
export default {
  props: ["job"],
  components: {
    JobDetailModalForm,
    JobDetailModalUpdateForm,
    JobDetailModalCandidates,
    JobDetailModalLocum,
    JobDetailModalCompleteForm,
    JobDetailModalCancelForm,
    JobDetailModalShowCandidate
  },
  data() {
    return {
      user: null,
      mandatory: [],
      optional: [],
      applicants: [],
      modal: false,
      toEdit: false,
      jobOngoing: false
    };
  },
  created() {
    if (this.job.status === "Applied") {
      this.getCandidates();
    }
    if (this.job.platform_job.appointed_to_locum !== null) {
      this.getAppointedLocum();
    }
    if (this.$moment().diff(this.job.date_start, "days") >= 0) {
      console.log(
        "Job is either ongoing or unfilled. Cannot be edited",
        this.$moment().diff(this.job.date_start, "days")
      );
      this.jobOngoing = true;
    } else {
      console.log(
        "Job can still be edited",
        this.$moment().diff(this.job.date_start, "days")
      );
      this.jobOngoing = false;
    }
  },
  methods: {
    getCandidates() {
      this.$axios
        .$get(`/api/v1/practice/jobs/${this.job.id}/applicants`)
        .then(res => {
          this.applicants = res.data.users;
        });
    },
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
    editJob() {
      this.toEdit = true;
    },
    cancelEdit() {
      this.toEdit = false;
    },
    close() {
      this.$emit("close");
    },
    status(status) {
      if (status === "Available") {
        return "LIVE";
      }
      if (status === "Current") {
        return "ALLOCATED";
      }
      return status.toUpperCase();
    },
    bgStatus(status) {
      switch (status) {
        case "Available":
          return "bg-yellow-500";
          break;
        case "Applied":
          return "bg-orange-400 text-white";
          break;
        case "Completed":
          return "bg-green-400";
          break;
        case "Current":
          return "bg-green-400";
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .modal {
    width: 60%;
  }
}
</style>

