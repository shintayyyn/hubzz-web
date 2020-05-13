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

    <div class="flex flex-row justify-start mt-4">
      <div class="leading-loose font-bold text-md sm:text-lg">{{ job_part.job.title }}</div>
      <div
        class="py-2 px-4 mx-1 rounded font-semibold"
        :class="bgStatus(job_part.locum_status)"
        @click="['Approved','Cancelled'].includes(job_part.locum_status) ? toggle_invoice_modal = true : null"
      >{{ status(job_part.locum_status) }}</div>
      <div
        v-if="['Completed','Cancelled'].includes(job_part.locum_status) && tagStatus(job_part)"
        class="py-2 px-4 mx-1 rounded font-semibold bg-gray-300 cursor-pointer hover:bg-gray-600 hover:text-white"
        @click="toggle_invoice_modal = true"
      >{{ tagStatus(job_part) }}</div>
    </div>

    <!-- <div
			class="text-xs sm:text-sm py-3"
    >Posted {{ $moment(job_part.date_created).format("DD/MM/YYYY") }}</div>-->

    <div class="flex flex-col mt-4">
      <div class="flex flex-wrap justify-start">
        <div class="p-0 lg:pr-4 w-full lg:w-1/2">
          <div
            v-if="job_part.status === 'Declined' || job_part.status === 'Withdrawn'"
            class="bg-white rounded-lg shadow-lg p-4 md:p-8 mt-4"
          >
            <div class="leading-tight pb-4">
              <p class="font-bold text-sm sm:text-md">Reason for Withdrawal</p>
              <p
                class="text-xs sm:text-sm break-words"
              >{{ job_part.job.platform_job.declined_reason ? job_part.job.platform_job.declined_reason : '(none)' }}</p>
            </div>
            <div class="leading-tight">
              <p class="font-bold text-sm sm:text-md">Date of Withdrawal</p>
              <p class="text-xs sm:text-sm">{{ job_part.job.platform_job.declined_at | localDate }}</p>
            </div>
          </div>
          <div class="flex flex-col">
            <JobPartDetailModalInfo :job_part="job_part" />
            <JobDetailModalUnassignForm
              v-if="job_part.locum_status === 'Ongoing'"
              :ref="'unassignForm'"
              :job="job_part.job"
              @unassign="$emit('close')"
            />
          </div>
        </div>
        <div class="p-0 md:pl-4 w-full md:w-1/2 order-first md:order-none">
          <div class="flex flex-col">
            <JobPartDetailModalParts :job_id="job_part.job.id" />
            <JobDetailModalMap :job="job_part.job" />
          </div>
        </div>
      </div>
    </div>

    <AppConfirmationModal
      :label="'Proceed to Invoice?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'No'"
      :modal="toggle_invoice_modal"
      @confirm="goToGenerateInvoice"
      @cancel="toggle_invoice_modal = false"
    />
  </div>
</template>
<script>
import JobPartDetailModalInfo from "@/components/Jobs/JobPart/JobPartDetailModalInfo";
import JobPartDetailModalParts from "@/components/Jobs/JobPart/JobPartDetailModalParts";
import JobDetailModalInfo from "@/components/Jobs/JobDetailModalInfo";
import JobDetailModalMap from "@/components/Jobs/JobDetailModalMap";
import JobDetailModalUnassignForm from "@/components/Jobs/JobDetailModalUnassignForm";
import JobDetailModalApplyForm from "@/components/Jobs/JobDetailModalApplyForm";
import JobDetailModalCancelForm from "@/components/Jobs/JobDetailModalCancelForm";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  components: {
    JobPartDetailModalInfo,
    JobPartDetailModalParts,
    JobDetailModalInfo,
    JobDetailModalMap,
    JobDetailModalUnassignForm,
    JobDetailModalApplyForm,
    JobDetailModalCancelForm,
    AppConfirmationModal
  },
  props: ["job_part"],
  data() {
    return {
      toggle_invoice_modal: false
    };
  },
  methods: {
    goToGenerateInvoice() {
      let hasInvoice = false;
      if (this.job_part.locum_invoice_id) {
        hasInvoice = true;
      }

      let invoiceStatus = null;
      switch (this.tagStatus(this.job_part)) {
        case "TO BE INVOICED":
          invoiceStatus = "to-be-invoiced";
          break;
        case "DISPUTED":
          invoiceStatus = "disputed";
          break;
        case "INVOICED":
          invoiceStatus = "issued";
          break;
        default:
          invoiceStatus = null;
      }

      this.$router.push(`/locum-billing/invoices`);

      setTimeout(() => {
        if (hasInvoice === false) {
          this.$router.push(
            `/locum-billing/invoices/${this.job_part.id}/create`
          );
        } else if (
          hasInvoice === true &&
          this.job_part.locum_status !== "Approved"
        ) {
          this.$router.push({
            path: `/locum-billing/invoices/${this.job_part.locum_invoice_id}/edit`,
            query: { ...this.$route.query, status: invoiceStatus }
          });
        } else if (
          hasInvoice === true &&
          this.job_part.locum_status === "Approved"
        ) {
          this.$router.push({
            path: `/locum-billing/invoices/${this.job_part.locum_invoice_id}`,
            query: { ...this.$route.query, status: "Approved" }
          });
        }
      }, 500);
    },
    tagStatus(job_part) {
      let status = "";
      if (job_part.locum_status === "Completed") {
        status = "TO BE INVOICED";
        if (job_part.disputed && job_part.issued) {
          status = "DISPUTED";
        } else if (job_part.invoiced && job_part.issued) {
          status = "INVOICED";
        }
        return status;
      } else if (job_part.locum_status === "Cancelled") {
        return job_part.terminated ? "TERMINATED" : null;
      }
    },
    status(status) {
      return status.toUpperCase();
    },
    bgStatus(status) {
      switch (status) {
        case "Ongoing":
        case "Completed":
          return "bg-green-600 text-white";
          break;
        case "Approved":
          return "bg-green-600 text-white cursor-pointer";
          break;
        case "Cancelled":
          return "bg-red-500 text-white cursor-pointer";
        default:
          return "bg-red-500 text-white";
      }
    }
  }
};
</script>
