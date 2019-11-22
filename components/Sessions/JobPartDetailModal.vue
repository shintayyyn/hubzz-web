<template>
  <div class="p-4 md:p-8">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex flex-row justify-start mt-8">
      <div class="leading-loose font-bold text-md sm:text-lg">{{job_part.title}}</div>
      <div
        class="mr-2 py-2 px-4 rounded font-semibold uppercase"
        :class="bgStatus(job_part.status)"
      >{{status(job_part.status)}}</div>
      <div
        class="ml-2 py-2 px-4 rounded font-semibold"
        :class="jobPartStatus === 'Completed' ? 'bg-green-500' : 'bg-gray-300'"
        v-if="job_part.status === 'Completed'"
      >{{jobPartStatus}}</div>
    </div>

    <div class="flex flex-col mt-4">
      <div class="flex flex-wrap justify-start">
        <div class="p-0 md:pr-4 w-full md:w-1/2">
          <div class="flex flex-col">
            <JobPartDetailModalForm :job_part="job_part" />
            <!-- // ! check if needed permission for termination -->
            <JobDetailModalTerminateForm
              :job="job_part.job"
              @close="$emit('close')"
              v-if="job_part.status === 'Ongoing'"
            />
          </div>
        </div>
        <div class="p-0 md:pr-4 w-full md:w-1/2">
          <div class="flex flex-col">
            <JobDetailModalCompleteForm
              :job="job_part"
              @close="$emit('close')"
              v-if="job_part.status === 'Ongoing' && authPermissions.includes('Complete Sessions Job')"
            />
            <JobPartDetailModalParts
              v-if="job_part.parts > 1"
              :job_id="job_part.job.id"
              :disabledLink="$route.path === '/dashboard'"
            />
            <JobDetailModalLocum
              :user="user"
              :mandatory="mandatory"
              :optional="optional"
              @favorite="favorite"
              @unfavorite="unfavorite"
              v-if="(job_part.status === 'Ongoing' || job_part.status === 'Completed' || job_part.status === 'Allocated') && user"
            />
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
import JobPartDetailModalForm from "@/components/Sessions/JobPart/JobPartDetailModalForm";
import JobDetailModalUpdateForm from "@/components/Sessions/JobDetailModalUpdateForm";
import JobPartDetailModalParts from "@/components/Sessions/JobPart/JobPartDetailModalParts";
import JobDetailModalCandidates from "@/components/Sessions/JobDetailModalCandidates";
import JobDetailModalCancelForm from "@/components/Sessions/JobDetailModalCancelForm";
import JobDetailModalTerminateForm from "@/components/Sessions/JobDetailModalTerminateForm";
import JobDetailModalCompleteForm from "@/components/Sessions/JobDetailModalCompleteForm";
import JobDetailModalShowCandidate from "@/components/Sessions/JobDetailModalShowCandidate";
import JobDetailModalLocum from "@/components/Sessions/JobDetailModalLocum";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  props: ["job_part"],
  components: {
    JobPartDetailModalForm,
    JobDetailModalUpdateForm,
    JobDetailModalCandidates,
    JobPartDetailModalParts,
    JobDetailModalCompleteForm,
    JobDetailModalCancelForm,
    JobDetailModalTerminateForm,
    JobDetailModalShowCandidate,
    JobDetailModalLocum,
    AppConfirmationModal
  },
  data() {
    return {
      user: null,
      confirmation_text: "",
      confirmation_modal: false,
      mandatory: [],
      optional: []
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    },
    jobPartStatus() {
      let status = "TO BE INVOICED";
      if (this.job_part.disputed) {
        status = "DISPUTED";
      }
      if (this.job_part.invoiced && this.job_part.issued) {
        status = "INVOICED";
      }
      return status;
    }
  },
  created() {
    if (this.job_part.job.platform_job.appointed_to_locum !== null) {
      this.getAppointedLocum();
    }
  },
  methods: {
    getAppointedLocum() {
      this.$axios
        .$get(
          `/api/v1/practice/locums/${this.job_part.job.platform_job.appointed_to_locum.user.id}`
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
    status(status) {
      if (status === "Available") {
        return "LIVE";
      }
      return status.toUpperCase();
    },
    bgStatus(status) {
      switch (status) {
        case "Live":
          return "bg-yellow-500";
          break;
        case "Applied":
          return "bg-orange-600 text-white";
          break;
        case "Completed":
        case "Approved":
          return "bg-green-600 text-white";
          break;
        case "Allocated":
          return "bg-green-300";
          break;
        case "Ongoing":
          return "bg-green-500 text-white";
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
