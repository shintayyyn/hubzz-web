<template>
  <div>
    <AppLoading :loading="loading" spinner />
    <div v-if="!loading && practice && practice.tax_year_end_date">
      <div
        class="relative bg-white rounded-lg shadow-lg my-2 p-4 md:p-8 max-w-3xl"
      >
        <AppFormError
          v-if="false && formError.length > 0"
          :formError="formError"
        />
        <div class="flex flex-wrap ">
          <div class="w-full">
            <AppInput
              v-model="selectedTaxYear"
              type="select"
              label="Tax Year End"
              :items="taxYearsSelectionList"
              required
            />
          </div>
        </div>
      </div>

      <AppTable
        v-if="locumInvoiceTaxYearTotals.length > 0"
        :total="count"
        :items="locumInvoiceTaxYearTotals"
        :columns="columns"
        :loading="loading"
      />

      <AppButton
        v-if="!loading && locumInvoiceTaxYearTotals.length > 0"
        :label="exporting ? 'Exporting as PDF...' : 'Export as PDF'"
        :inStyle="'padding: 5px 14px;'"
        @click="exportLocumInvoiceTaxYearTotalsAsPdf"
      />

      <transition name="fade" mode="out-in">
        <div
          v-if="locumInvoiceTaxYearTotals.length === 0 && !loading"
          class="flex justify-center py-4"
        >
          No reports found
        </div>
      </transition>
    </div>

    <div v-if="!loading && !(practice && practice.tax_year_end_date)">
      <transition name="fade" mode="out-in">
        <div class="flex justify-center py-4">
          No Tax Year End Date.
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import AppFormError from "@/components/Base/AppFormError";
import AppTable from "@/components/Base/AppTable";

export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },

  components: {
    AppInput,
    AppButton,
    AppLoading,
    AppFormError,
    AppTable
  },

  data() {
    return {
      loading: false,
      practice: null,
      taxYearsSelectionList: [],
      selectedTaxYear: null,
      count: 0,
      locumInvoiceTaxYearTotals: [],
      exporting: false
    };
  },

  computed: {
    columns() {
      return [
        {
          name: "Job Part Count",
          dataIndex: "job_part_count"
        },
        {
          name: "£ Total Amount",
          dataIndex: "total_amount_formatted"
        },
        {
          name: "£ NI Amount",
          dataIndex: "ni_amount_formatted"
        },
        {
          name: "£ PAYE Amount",
          dataIndex: "paye_amount_formatted"
        }
      ];
    }
  },

  watch: {
    selectedTaxYear() {
      this.getLocumInvoiceTaxYearTotals();
    }
  },

  mounted() {
    this.loading = true;
    this.$axios
      .get("/api/v1/practice/me/practice-profile", { cache: true })
      .then(response => {
        this.practice = response.data.data.practice;
      })
      .finally(() => {
        this.loading = false;
        this.initialize();
      });
  },

  methods: {
    initialize() {
      const minTaxYear = "2019";

      const selectedTaxYear = this.$moment.utc().format("YYYY");

      let tempYear = selectedTaxYear;

      let years = [];

      while (
        this.$moment(minTaxYear, "YYYY").isSameOrBefore(
          this.$moment(tempYear, "YYYY")
        )
      ) {
        years.unshift(tempYear);
        tempYear = this.$moment(tempYear, "YYYY")
          .subtract(1, "years")
          .format("YYYY");
      }

      this.taxYearsSelectionList = years.map(year => ({
        value: year,
        label:
          this.practice && this.practice.tax_year_end_date
            ? this.$moment(
              this.practice.tax_year_end_date,
              "YYYY-MM-DD"
            ).format("DD/MM/") + this.$moment(year, "YYYY").format("YYYY")
            : this.$moment(year, "YYYY").format("YYYY")
      }));

      this.selectedTaxYear = selectedTaxYear;
    },

    getLocumInvoiceTaxYearTotals() {
      this.count = 0;
      this.locumInvoiceTaxYearTotals = [];

      if (!this.selectedTaxYear) {
        return;
      }

      const taxYear = this.selectedTaxYear;

      this.loading = true;

      Promise.all([
        // this.$axios.get(`/api/v1/practice/locum-invoice-tax-year-totals/${taxYear}/count`).then((responses) => {
        //   return responses.data.data.count
        // }),
        this.$axios
          .get(`/api/v1/practice/locum-invoice-tax-year-totals/${taxYear}`, {
            cache: true
          })
          .then(responses => {
            return responses.data.data.locum_invoice_tax_year_totals;
          }),
        new Promise(resolve => setTimeout(resolve, 500))
      ])
        .then(results => {
          const [
            // count,
            locumInvoiceTaxYearTotals
          ] = results;

          // this.count = count
          this.locumInvoiceTaxYearTotals = locumInvoiceTaxYearTotals;
        })
        .catch(err => {
          console.log(
            "err.response ? err.response.data : err",
            err.response ? err.response.data : err
          );
          this.$nuxt.error(err.response ? err.response.data : err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    exportLocumInvoiceTaxYearTotalsAsPdf() {
      if (!this.selectedTaxYear) {
        return;
      }

      const taxYear = this.selectedTaxYear;

      this.exporting = true;

      const filename = `locum_invoice_tax_year_totals_${taxYear}.pdf`;

      this.$axios
        .post(
          `/api/v1/practice/locum-invoice-tax-year-totals/${taxYear}/generate-key`
        )
        .then(responses => {
          const token = responses.data.data.token;

          window.open(
            `${process.env.API_URL}/api/v1/locum-invoice-tax-year-totals/pdf/${filename}?token=${token}`
          );
        })
        .catch(err => {
          console.log("err", err);
          this.$nuxt.error(err.response ? err.response.data : err);
        })
        .finally(() => {
          this.exporting = false;
        });
    }
  }
};
</script>
