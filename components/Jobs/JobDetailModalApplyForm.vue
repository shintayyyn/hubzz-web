<template>
  <div class="rounded-lg shadow-lg p-4 md:p-8 mt-8">
    <template v-if="isReadyToApply">
      <div class="text-sm sm:text-base mb-4">This job is still open</div>
      <AppButton :label="'Apply now'" @click="apply" />
    </template>
    <template v-else>
      <div class="text-sm sm:text-base mb-4">
        Please complete your
        <strong>compliance</strong> requirements to be eligible to apply for this job
      </div>
      <AppButton :label="'Go to Compliance'" @click="goTo" />
    </template>
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
export default {
  components: {
    AppButton
  },
  props: ["compliances", "job"],
  data() {
    return {
      userCompliance: [],
      gmc_or_nmc_number_status: null,
      mpl_or_npl_number_status: null
    };
  },
  computed: {
    isReadyToApply() {
      let isComplete = true;
      this.compliances.forEach(id => {
        if (!this.userCompliance.includes(id)) {
          isComplete = false;
        }
      });
      if (
        this.gmc_or_nmc_number_status !== "Verified" ||
        this.mpl_or_npl_number_status !== "Verified"
      ) {
        isComplete = false;
      }
      return isComplete;
    }
  },
  created() {
    this.$auth.user.locum_detail.compliance_documents.forEach(item => {
      if (item.status === "Approved") {
        this.userCompliance.push(item.compliance_document.id);
      }
    });
    this.gmc_or_nmc_number_status = this.$auth.user.locum_detail.gmc_or_nmc_number.status;
    this.mpl_or_npl_number_status = this.$auth.user.locum_detail.mpl_or_npl_number.status;
  },
  methods: {
    goTo() {
      document.body.style.overflow = "auto";
      this.$router.push("/compliance");
    },
    apply() {
      this.$axios.$post(`/api/v1/locum/jobs/${this.job.id}/apply`).then(res => {
        if (this.$route.path.includes("/jobs")) {
          this.$store.commit("jobs/REMOVE_LOCUM_AVAILABLE_JOB", this.job.id);
          this.$store.commit("jobs/REMOVE_LOCUM_MATCHED_JOB", this.job.id);
        }
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: [`${res.message}`]
        });
        this.$emit("close");
      });
    }
  }
};
</script>
