<template>
  <div class="p-4 md:p-8">
    <div @click="close" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex flex-row justify-start mt-8">
      <div class="leading-loose font-bold text-md sm:text-lg">{{job_part.job.title}}</div>
      <div
        class="mx-2 text-sm sm:text-sm p-2"
        :class="bgStatus(job_part.job.status)"
      >{{status(job_part.job.status)}}</div>
    </div>

    <div class="flex flex-col mt-4">
      <div class="flex flex-wrap justify-start">
        <div class="p-0 md:pr-4 w-full md:w-1/2">
          <div class="flex flex-col">
            <JobDetailModalForm :job="job_part.job" v-if="toEdit === false" />
            <JobDetailModalCancelForm
              :job="job_part.job"
              @close="close"
              v-if="(job_part.job.status === 'Allocated' || job_part.job.status === 'Ongoing' || job_part.job.status === 'Applied' || job_part.job.status === 'Available') && authPermissions.includes('Cancel Sessions Job')"
            />
          </div>
        </div>
        <div class="p-0 md:pr-4 w-full md:w-1/2">
          <div class="flex flex-col">
            <JobDetailModalCompleteForm
              :job="job_part"
              @close="close"
              v-if="job_part.job.status === 'Ongoing' && authPermissions.includes('Complete Sessions Job')"
            />
            <JobPartDetailModalParts
              :job_id="job_part.job.id"
              :disabledLink="$route.path === '/dashboard'"
            />
            <JobDetailModalCandidates
              v-if="job_part.job.status === 'Applied'"
              class="order-first lg:order-none"
              :applicants="applicants"
              @show="showLocum($event)"
            />
            <JobDetailModalLocum
              :user="user"
              :mandatory="mandatory"
              :optional="optional"
              v-if="(job_part.job.status === 'Ongoing' || job_part.job.status === 'Completed') && user"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="shield" v-if="modal" @click="modal = false"></div>
    <transition name="slide" mode="out-in">
      <div class="modal-container shadow-lg" v-if="modal">
        <JobDetailModalShowCandidate @close="modal = false" :user="user" @appointed="close" />
      </div>
    </transition>
  </div>
</template>
<script>
import JobDetailModalForm from "@/components/Sessions/JobDetailModalForm";
import JobDetailModalUpdateForm from "@/components/Sessions/JobDetailModalUpdateForm";
import JobPartDetailModalParts from "@/components/Sessions/JobPart/JobPartDetailModalParts";
import JobDetailModalCandidates from "@/components/Sessions/JobDetailModalCandidates";
// import JobDetailModalSessionSample from "@/components/Sessions/JobDetailModalSessionSample";
import JobDetailModalCancelForm from "@/components/Sessions/JobDetailModalCancelForm";
import JobDetailModalCompleteForm from "@/components/Sessions/JobDetailModalCompleteForm";
import JobDetailModalShowCandidate from "@/components/Sessions/JobDetailModalShowCandidate";
import JobDetailModalLocum from "@/components/Sessions/JobDetailModalLocum";
export default {
  props: ["job_part"],
  components: {
    JobDetailModalForm,
    JobDetailModalUpdateForm,
    JobDetailModalCandidates,
    JobPartDetailModalParts,
    // JobDetailModalSessionSample,
    JobDetailModalCompleteForm,
    JobDetailModalCancelForm,
    JobDetailModalShowCandidate,
    JobDetailModalLocum
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
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  created() {
    console.log("job_part", this.job_part);
    if (this.job_part.job.status === "Applied") {
      this.getCandidates();
    }
    if (this.job_part.job.platform_job.appointed_to_locum !== null) {
      this.getAppointedLocum();
    }
    if (this.$moment().diff(this.job_part.job.date_start, "days") >= 0) {
      console.log(
        "Job is either ongoing or unfilled. Cannot be edited",
        this.$moment().diff(this.job_part.job.date_start, "days")
      );
      this.jobOngoing = true;
    } else {
      console.log(
        "Job can still be edited",
        this.$moment().diff(this.job_part.job.date_start, "days")
      );
      this.jobOngoing = false;
    }
  },
  methods: {
    getCandidates() {
      this.$axios
        .$get(`/api/v1/practice/jobs/${this.job_part.job.id}/applicants`)
        .then(res => {
          this.applicants = res.data.users;
        });
    },
    getAppointedLocum() {
      this.$axios
        .$get(
          `/api/v1/practice/locums/${this.job_part.job.platform_job.appointed_to_locum.user.id}`
        )
        .then(res => {
          this.user = res.data.user;
          console.log(this.user);
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
      if (status === "Allocated") {
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

