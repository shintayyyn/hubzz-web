<template>
  <div class="modal shadow-lg">
    <div class="p-8 max-w-4xl">
      <div class="flex flex-wrap justify-start items-center">
        <nuxt-link to="/locum-billing/invoices" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
        <div
          class="save-button text-xs sm:text-sm mx-2 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
          @click="save(false)"
        >Save changes</div>
        <div
          class="save-button text-xs sm:text-sm my-2 mx-2 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
          @click="save(true)"
        >Save and archive as final</div>
      </div>

      <div class="flex flex-row flex-wrap justify-start items-center my-4">
        <label class="mx-1 py-2 px-3">Type:</label>
        <button
          :class="type === 'Private' ? 'bg-yellow-500 border-yellow-500' : ''"
          class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none"
          @click="type = 'Private'"
          :disabled="type === 'Private'"
        >Private</button>
        <button
          :class="type === 'Platform' ? 'bg-yellow-500 border-yellow-500' : ''"
          class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none"
          @click="type = 'Platform'"
          :disabled="type === 'Platform'"
        >Platform</button>
      </div>

      <div class="max-w-3xl my-4 bg-white px-4 py-4 border shadow-md">
        <div class="flex flex-col">
          <div class="text-xs sm:text-sm sm:text-right leading-normal">
            <div>Mr. {{$auth.user.personal_detail.name}}</div>
            <div>{{$auth.user.address_detail.address.line_1}}</div>
            <div>{{$auth.user.address_detail.address.line_3}}</div>
            <div>{{$auth.user.address_detail.address.post_code}}</div>
            <div>Tel {{$auth.user.contact_detail.mobile_number}}</div>
            <div>{{$auth.user.email}}</div>
            <div>UTR {{$auth.user.locum_detail.invoice_detail && $auth.user.locum_detail.invoice_detail.utr_number ? $auth.user.locum_detail.invoice_detail.utr_number : null}}</div>
          </div>
          <div class="flex flex-wrap justify-between my-2">
            <div
              class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3"
            >
              <section>
                <div class="relative flex flex-col py-2 mb-6" v-on-clickaway="toggledOffSurgeries">
                  <div class="relative flex flex-row flex-no-wrap justify-between">
                    <label class="text-xs sm:text-sm py-1">To: Accounts Department</label>
                  </div>
                  <div class="relative flex flex-row flex-wrap justify-start">
                    <input
                      v-model="searchSurgeries"
                      type="text"
                      placeholder="Select.."
                      ref="input"
                      class="border-b-2 w-full focus:border-yellow-400 focus:outline-none py-3 font-bold text-xs sm:text-sm"
                      @focus="toggledSurgeries = true"
                      readonly
                    />
                  </div>
                  <div class="relative flex flex-col w-full z-10">
                    <div
                      ref="surgeryLists"
                      class="absolute w-full option-list flex flex-col bg-white shadow-md overflow-y-auto"
                      :class="{'slide-down': toggledSurgeries}"
                      @scroll="scrollHandlerSurgeries"
                    >
                      <div class="relative" v-if="surgeries.length > 0">
                        <div
                          class="py-2 px-3 cursor-pointer text-xs sm:text-sm"
                          :class="{'bg-gray-300': activeIndexSurgeries === index}"
                          v-for="(item, index) in surgeries"
                          :key="item.id"
                          @mouseover="activeIndexSurgeries = index"
                          @click="addSurgery(item)"
                        >{{item.name}}</div>
                        <div
                          class="absolute bg-gray-300 w-full h-full top-0 bottom-0 left-0 right-0 opacity-50"
                          v-if="loadingSurgeries"
                        >
                          <div
                            class="absolute bottom-0 text-center w-full text-sm font-bold"
                          >loading icon</div>
                        </div>
                      </div>
                      <div class="relative" v-else>
                        <div
                          class="text-xs sm:text-sm text-center font-bold mt-5"
                        >No Practice / Surgeries Job Invoicable Yet</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <div class="text-xs sm:text-sm" v-if="selectedSurgery && selectedSurgery.address">
                <div>{{selectedSurgery.address.line_1}}</div>
                <div>{{selectedSurgery.address.line_2}}</div>
                <div>{{selectedSurgery.address.line_3}}</div>
                <div>{{selectedSurgery.address.post_code}}</div>
              </div>
            </div>
            <div class="w-full sm:w-1/2 order-1 sm:order-2 sm:text-right leading-normal">
              <div class="font-bold text-sm sm:text-lg">INVOICE</div>
              <div class="text-xs sm:text-sm">Not yet issued</div>
            </div>
          </div>
          <div v-if="selectedSurgery">
            <section>
              <div
                class="relative flex flex-col py-2 mb-6 mt-2"
                v-on-clickaway="toggledOffJobParts"
              >
                <div class="relative flex flex-row flex-no-wrap justify-between">
                  <label class="text-xs sm:text-sm py-1">Select a job to add to this invoice</label>
                  <div class="flex justify-end">
                    <div
                      class="rounded-lg bg-red-500 p-1 text-xs sm:text-sm text-white"
                      v-if="formError.find(item => item.field === 'items')"
                    >{{formError.find(item => item.field === 'items').message}}</div>
                  </div>
                </div>
                <div class="relative flex flex-row flex-wrap justify-start">
                  <input
                    v-model="searchJobParts"
                    type="text"
                    placeholder="Select.."
                    ref="input"
                    class="border-b-2 w-full focus:border-yellow-400 focus:outline-none py-3 font-bold text-xs sm:text-sm"
                    @focus="toggledJobParts = true"
                    readonly
                  />
                </div>
                <div class="relative flex flex-col w-full z-10">
                  <div
                    ref="jobPartsLists"
                    class="absolute w-full option-list flex flex-col bg-white shadow-md overflow-y-auto"
                    :class="{'slide-down': toggledJobParts}"
                    @scroll="scrollHandlerJobParts"
                  >
                    <div class="relative" v-if="jobParts.length > 0">
                      <div
                        class="py-2 px-3 cursor-pointer text-xs sm:text-sm"
                        :class="{'bg-gray-300': activeIndexJobParts === index}"
                        v-for="(item, index) in filteredJobParts"
                        :key="item.id"
                        @mouseover="activeIndexJobParts = index"
                        @click="addJobPart(item)"
                      >{{item.job_part_number}}</div>
                      <div
                        class="absolute bg-gray-300 w-full h-full top-0 bottom-0 left-0 right-0 opacity-50"
                        v-if="loadingJobParts"
                      >
                        <div
                          class="absolute bottom-0 text-center w-full text-sm font-bold"
                        >loading icon</div>
                      </div>
                    </div>
                    <div class="relative" v-else>
                      <div
                        class="text-xs sm:text-sm text-center font-bold mt-5"
                      >No Job Completed On This Surgery</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div class="overflow-x-scroll">
          <table class="items-table">
            <thead>
              <tr class="text-center bg-gray-900">
                <th class="w-1/2 text-white">Description</th>
                <th class="w-1/2 text-white" :colspan="type === 'Private' ? 1:2">
                  <span class="flex justify-between items-center">
                    Total
                    <span
                      v-if="type === 'Private'"
                      class="cursor-pointer w-8 h-8 rounded-full bg-white text-gray-900 font-semibold text-xl text-center flex justify-center"
                      @click="addItem"
                    >+</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b" v-for="(item, index) in selectedJobParts" :key="item.id">
                <td class="w-1/2">
                  <textarea
                    v-model="item.description"
                    placeholder="Enter description"
                    rows="4"
                    class="w-full text-xs sm:text-sm p-2 resize-none border-b-2 border-gray-300 focus:outline-none focus:border-yellow-300"
                  ></textarea>
                </td>
                <td class="w-1/2">
                  <span class="flex justify-between items-center">
                    <input
                      type="text"
                      v-model="item.total"
                      placeholder="Enter value"
                      class="pt-12 w-full h-full text-xs sm:text-sm p-2 border-b-2 border-gray-300 focus:outline-none focus:border-yellow-300 text-right"
                    />
                    <span
                      class="cursor-pointer w-8 h-8 rounded-full bg-gray-900 text-white font-semibold text-xl text-center flex justify-center items-center"
                      @click="removeSelectedJobPart(item, index)"
                    >-</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colspan="2">
                  <div class="flex flex-row flex-no-wrap justify-between">
                    <div class="w-full pr-1">
                      <AppDate
                        v-model="form.date_start"
                        :name="'date_start'"
                        :label="'Days worked from'"
                        :error="formError.find(item => item.field === 'date_start')"
                        isAfter
                      />
                    </div>
                    <div class="w-full pl-1">
                      <AppDate
                        v-model="form.date_end"
                        :name="'date_end'"
                        :label="'To'"
                        :error="formError.find(item => item.field === 'date_end')"
                        isAfter
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td class="text-right">
                  <div class="flex justify-end">
                    <div
                      class="rounded-lg bg-red-500 p-1 text-xs sm:text-sm text-white"
                      v-if="formError.find(item => item.field === 'total_amount')"
                    >{{formError.find(item => item.field === 'total_amount').message}}</div>
                  </div>
                  £ {{amount | currency}}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="rounded-lg border-2 border-gray-300 mt-24 p-4">
          <div class="flex flex-col text-xs sm:text-sm">
            <div>Payment by BACS:</div>
            <div>Account name: Rick Sanchez</div>
            <div>Bank: citadel of Ricks Mutiversal Bank</div>
            <div>Sort code: 13</div>
            <div>Account number: 7337#4*OR</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppDate from "@/components/Base/AppDate";
import AppInput from "@/components/Base/AppInput";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import { mixin as clickaway } from "vue-clickaway";
export default {
  mixins: [clickaway],
  props: ["selectedInvoice"],
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    AppDate,
    AppInput,
    AppFilterSearch
  },
  data() {
    return {
      type: null,

      practices: [],
      practice_id: "",
      address: {
        line_1: "",
        line_2: "",
        line_3: "",
        post_code: ""
      },
      jobs: [],
      invoice: "",
      rowData: [],
      description: "",
      total: "",
      form: {
        surgery_id: null,
        date_start: null,
        date_end: null,
        items: [],
        final: null
      },
      formError: [],
      // input select surgeries
      totalSurgeries: 0,
      surgeries: [],
      activeIndexSurgeries: 0,
      searchSurgeries: "",
      toggledSurgeries: false,
      loadingSurgeries: false,
      loadMoreSurgeries: true,
      selectedSurgery: null,
      // input select job
      totalJobParts: 0,
      jobParts: [],
      activeIndexJobParts: 0,
      searchJobParts: "",
      toggledJobParts: false,
      loadingJobParts: false,
      loadMoreJobParts: true,
      selectedJobParts: []
    };
  },
  computed: {
    amount() {
      if (this.selectedJobParts && this.selectedJobParts.length > 0) {
        let amount = 0;
        this.selectedJobParts.forEach(item => {
          if (item.total) {
            amount += parseInt(item.total);
          }
        });
        return amount;
      }
    },
    filteredJobParts() {
      return this.jobParts.filter(filterItem => {
        const index = this.selectedJobParts.findIndex(item => {
          return item.job_part_id === filterItem.id;
        });
        return index === -1 && filterItem;
      });
    }
  },
  watch: {
    type(newValue, oldValue) {
      if (oldValue) {
        this.surgeries = [];
        this.selectedSurgery = null;
        this.searchSurgeries = "";
        this.jobParts = [];
        this.selectedJobParts = [];
      }
      this.fetchSurgeriesCount();
    },
    selectedSurgery(newValue, oldValue) {
      if (newValue && oldValue) {
        this.jobParts = [];
        this.selectedJobParts = [];
      }
      if (newValue) {
        this.fetchJobPartsCount();
      }
    },
    invoice(value) {
      if (value) {
        if (value) {
          this.rowData.push({ description: value, total: 5 });
        }
        this.invoice = null;
      }
    }
  },
  created() {
    this.type = "Platform";
    if (this.selectedInvoice) {
      this.type = this.selectedInvoice.type;
      this.selectedSurgery = this.selectedInvoice.surgery;
      this.searchSurgeries = this.selectedInvoice.surgery.name;
      this.form.surgery_id = this.selectedInvoice.surgery.id;
      this.form.date_start = this.selectedInvoice.date_start;
      this.form.date_end = this.selectedInvoice.date_end;
      this.selectedInvoice.items.forEach(item => {
        this.selectedJobParts.push({
          type: item.type,
          job_part_id: item.job_part.id,
          description: item.description,
          total: item.total.toString()
        });
      });
    }
    this.$axios.$get(`/api/v1/locum/private-practices`).then(res => {
      this.practices = [];
      res.data.private_practices.forEach(practice => {
        this.practices.push({
          label: practice.surgery.name,
          value: practice.id
        });
      });
    });
  },
  mounted() {
    document.body.style.overflow = "hidden";
  },
  destroyed() {
    document.body.style.overflow = "auto";
  },
  methods: {
    save(final) {
      this.formError = [];
      this.form.type = this.type;
      this.form.surgery_id = this.selectedSurgery.id;
      this.form.items = this.selectedJobParts;
      this.form.total_amount = this.amount;
      this.form.final = final;
      this.Validate(this.form, ["final"]);
      if (!this.formError.length) {
        this.form.date_start = this.$moment(this.form.date_start).format(
          "YYYY-MM-DD"
        );
        this.form.date_end = this.$moment(this.form.date_end).format(
          "YYYY-MM-DD"
        );
        if (!this.$route.params.id) {
          this.$axios.$post(`/api/v1/locum/invoices`, this.form).then(res => {
            // this.$store.commit("billing/ADD_LOCUM_INVOICE", res.data.invoice);
            this.$emit("addInvoice", res.data.invoice);
            this.$router.push("/locum-billing/invoices");
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
          });
        } else {
          this.$axios
            .$put(`/api/v1/locum/invoices/${this.$route.params.id}`, this.form)
            .then(res => {
              this.$emit("updateInvoice", res.data.invoice);
              // this.$store.commit(
              //   "billing/UPDATE_LOCUM_INVOICE",
              //   res.data.invoice
              // );
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: [`${res.message}`]
              });
              this.$router.push("/locum-billing/invoices");
            });
        }
      }
    },
    addItem() {
      this.selectedJobParts.push({
        description: "",
        total: ""
      });
    },
    // surgeries
    toggledOffSurgeries() {
      this.toggledSurgeries = false;
    },
    scrollHandlerSurgeries(e) {
      if (
        this.$refs.surgeryLists.offsetHeight +
          this.$refs.surgeryLists.scrollTop >=
        this.$refs.surgeryLists.scrollHeight - 1
      ) {
        if (this.loadMoreSurgeries && !this.loadingSurgeries) {
          this.fetchSurgeriesCount();
        }
      }
    },
    addSurgery(surgery) {
      this.selectedSurgery = surgery;
      this.searchSurgeries = surgery.name;
      this.toggledSurgeries = false;
    },
    async fetchSurgeriesCount() {
      try {
        this.loadingSurgeries = true;
        let params = {
          invoiceable: true,
          type: this.type
        };

        const responseCount = await this.$axios.$get(
          `/api/v1/locum/surgeries/count`,
          { params }
        );

        this.totalSurgeries =
          responseCount.data && responseCount.data.count
            ? responseCount.data.count
            : 0;

        this.fetchSurgeries();
      } catch (err) {
        throw err;
      }
    },
    async fetchSurgeries() {
      try {
        const params = {
          invoiceable: true,
          type: this.type,
          limit: 10,
          offset: this.surgeries.length
        };

        const responseSurgeries = await this.$axios.$get(
          `/api/v1/locum/surgeries`,
          {
            params
          }
        );

        let surgeries =
          responseSurgeries.data && responseSurgeries.data.surgeries
            ? responseSurgeries.data.surgeries
            : [];

        this.loadMoreSurgeries = true;

        if (!surgeries.length) {
          this.loadMoreSurgeries = false;
        } else {
          surgeries.forEach(surgery => {
            this.surgeries.push(surgery);
          });
          if (
            surgeries.length < 10 ||
            (surgeries.length === 10 &&
              this.surgeries.length === this.totalSurgeries)
          ) {
            this.loadMoreSurgeries = false;
          }
        }

        this.loadingSurgeries = false;
      } catch (err) {
        throw err;
      }
    },
    // job part
    toggledOffJobParts() {
      this.toggledJobParts = false;
    },
    scrollHandlerJobParts(e) {
      if (
        this.$refs.jobPartsLists.offsetHeight +
          this.$refs.jobPartsLists.scrollTop >=
        this.$refs.jobPartsLists.scrollHeight - 1
      ) {
        if (this.loadMoreJobParts && !this.loadingJobParts) {
          this.fetchJobPartsCount();
        }
      }
    },
    addJobPart(jobPart) {
      let hasJobPart = this.selectedJobParts.find(
        selectedJobPart => selectedJobPart.job_id === jobPart.id
      );
      if (hasJobPart) {
        return;
      }
      let invoiceObj = {};
      let total = null;
      if (jobPart.job.locum_detail_rate_type.id === 1) {
        total = parseInt(jobPart.job.rate) * parseInt(jobPart.job.total_hours);
      } else {
        let dividerTotal = this.$moment(jobPart.date_end).diff(
          jobPart.date_start,
          "days"
        );
        total = parseInt(jobPart.job.rate) / dividerTotal;
      }
      invoiceObj = {
        type: "Job Part",
        job_part_id: jobPart.id,
        description: `Job number ${jobPart.job_part_number} ${jobPart.job.type} Job at £${jobPart.job.rate} per hour from ${jobPart.date_start} / OOH / Total hours at ${jobPart.job.total_hours}`,
        total: total.toString()
      };
      this.selectedJobParts.push(invoiceObj);

      if (!this.filteredJobParts.length) {
        if (this.jobParts.length < this.totalJobParts) {
          this.fetchJobParts();
        } else {
          this.toggledJobParts = false;
        }
      }
    },
    removeSelectedJobPart(jobPart, index) {
      console.log(this.filteredJobParts);
      this.selectedJobParts.splice(index, 1);
    },
    async fetchJobPartsCount() {
      try {
        this.loadingJobParts = true;
        const params = {
          locum_status: "Completed",
          type: this.type,
          surgery_id: this.selectedSurgery.id,
          order_by: "created_at:desc",
          invoiced: false
        };

        const responseCount = await this.$axios.get(
          `/api/v1/locum/job-parts/count`,
          { params }
        );

        this.totalJobParts =
          responseCount.data &&
          responseCount.data.data &&
          responseCount.data.data.count
            ? responseCount.data.data.count
            : 0;

        this.fetchJobParts();
      } catch (err) {
        throw err;
      }
    },
    async fetchJobParts() {
      try {
        const params = {
          locum_status: "Completed",
          type: this.type,
          surgery_id: this.selectedSurgery.id,
          limit: 10,
          offset: this.jobParts.length,
          order_by: "created_at:desc",
          invoiced: false
        };

        const responseJobParts = await this.$axios.$get(
          `/api/v1/locum/job-parts`,
          {
            params
          }
        );

        let jobParts =
          responseJobParts.data && responseJobParts.data.job_parts
            ? responseJobParts.data.job_parts
            : [];

        this.loadMoreJobParts = true;

        if (!jobParts.length) {
          this.loadMoreJobParts = false;
        } else {
          jobParts.forEach(jobPart => {
            this.jobParts.push(jobPart);
          });
          if (
            jobParts.length < 10 ||
            (jobParts.length === 10 &&
              this.jobParts.length === this.totalJobParts)
          ) {
            this.loadMoreJobParts = false;
          }
        }

        this.loadingJobParts = false;
      } catch (err) {
        throw err;
      }
    }
  }
};
</script>
<style scoped>
.items-table {
  width: 730px;
}
.modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  /* border-left: solid 2px #edf2f7; */
  transition: all 0.3s ease-in-out;
  /* background-color: rgb(80, 80, 80); */
  background: #fff;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .modal {
    width: 70%;
  }
}
.save-button {
  border-color: #ecc94b;
  background-color: #ecc94b;
}
.save-button:hover {
  color: #fff;
  /* background-color: rgb(80, 80, 80); */
  background-color: #d1b244;
  border-color: #d1b244;
  cursor: pointer;
}
.option-list {
  transition: all 0.3s ease-in-out;
  height: 0;
}
.slide-down {
  transition: all 0.3s ease-in-out;
  height: 200px;
}
/* surgery */
.loader-surgery {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  color: #ccc;
}
</style>
