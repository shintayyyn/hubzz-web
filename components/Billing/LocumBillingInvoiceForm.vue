<template>
  <section class="max-w-3xl">
    <div class="flex flex-col md:flex-row justify-between">
      <div class="flex flex-wrap items-center">
        <div
          class="save-button text-xs sm:text-sm px-4 py-2 border-2 rounded-lg font-bold flex items-center my-1 md:my-0 mr-1 md:mr-2"
          @click="save(false)"
        >Save changes</div>
        <div
          class="save-button text-xs sm:text-sm px-4 py-2 border-2 rounded-lg font-bold flex items-center my-1 md:my-0 mr-1 md:mr-2"
          @click="save(true)"
        >Save and archive as final</div>
        <div
          v-if="selectedInvoice"
          class="save-button text-xs sm:text-sm px-4 py-2 border-2 rounded-lg font-bold flex items-center my-1 md:my-0"
          @click="exportToPdf()"
        >Export to PDF</div>
      </div>

      <div class="flex flex-row flex-wrap justify-start items-center my-2 md:my-4">
        <label class="mx-1">Type:</label>
        <button
          :class="type === 'Private' ? 'bg-yellow-500 border-yellow-500' : 'hover:bg-gray-200'"
          class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none"
          @click="type = 'Private'"
          :disabled="type === 'Private'"
        >Private</button>
        <button
          :class="type === 'Platform' ? 'bg-yellow-500 border-yellow-500' : 'hover:bg-gray-200'"
          class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none"
          @click="type = 'Platform'"
          :disabled="type === 'Platform'"
        >Platform</button>
      </div>
    </div>

    <div id="htmlpdf" class="invoice max-w-3xl mb-4 bg-white px-4 py-4 shadow-md flex flex-col justify-between">
      <div>
        <div class="flex flex-col">
          <div class="text-xs sm:text-sm sm:text-right leading-normal">
            <div>{{$auth.user.personal_detail.name}}</div>
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
                <div
                  class="relative flex flex-col py-2"
                  v-on-clickaway="toggledOffSurgeries"
                >
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
                      :disabled="selectedInvoice !== null"
                    />
                  </div>
                  <div class="relative flex flex-col w-full z-10" v-if="selectedInvoice === null">
                    <div
                      ref="surgeryLists"
                      class="absolute z-10 w-full option-list flex flex-col bg-white shadow-md overflow-y-auto"
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
                          class="text-xs sm:text-sm text-center font-bold my-2"
                        >No Practice / Surgeries Job Invoiceable Yet</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <!-- TEST ! only return id and name -->
              <div class="text-xs sm:text-sm py-2" v-if="selectedSurgery && selectedSurgery.address">
                <div>{{selectedSurgery.address.line_1}}</div>
                <div>{{selectedSurgery.address.line_2}}</div>
                <div>{{selectedSurgery.address.line_3}}</div>
                <div>{{selectedSurgery.address.post_code}}</div>
              </div>
            </div>
            <div
              v-if="selectedInvoice"
              class="w-full sm:w-1/2 order-1 sm:order-2 sm:text-right leading-normal"
            >
              <div class="font-bold text-sm sm:text-lg">{{selectedInvoice.status.toUpperCase()}}</div>
              <div class="text-xs sm:text-sm">{{issuedAt | localDate}}</div>
            </div>
          </div>
          <div v-if="selectedSurgery && selectedInvoice === null">
            <section>
              <div
                class="relative flex flex-col py-2 mb-3 md:mb-6 mt-2"
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
                <div class="relative flex flex-col w-full z-10 shadow-lg">
                  <div
                    ref="jobPartsLists"
                    class="absolute z-0 w-full option-list flex flex-col bg-white shadow-md overflow-y-auto"
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
                        class="text-xs sm:text-sm text-center font-bold my-3"
                      >No Job Completed On This Surgery</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div class="overflow-auto">
          <table class="items-table">
            <thead>
              <tr>
                <th colspan="2" class="bg-gray-900  w-2/3 text-white text-left px-4 py-1">Description</th>
                <th
                  class="bg-gray-900  text-white text-center px-2 py-1"
                  :colspan="type === 'Private' ? 1:2"
                >
                  Total
                </th>
                <th v-if="type === 'Private'" class="sticky right-0 bg-gray-900 ">
                  <div class="flex items-center justify-end">
                    <span
                      class="cursor-pointer w-6 h-6 mx-2 md:mx-4 rounded-full bg-white text-gray-900 font-semibold text-xl flex justify-center items-center hover:bg-gray-200"
                      @click="addItem"
                    >+</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in selectedJobParts">
                <tr class="border-b" :key="item.id">
                  <td colspan="2">
                    <textarea
                      disabled
                      v-model="item.description"
                      rows="3"
                      placeholder="Enter description"
                      class="w-full text-xs sm:text-sm resize-none border-b-2 border-gray-300 focus:border-yellow-500 focus:outline-none px-4 pt-4 my-2"
                    ></textarea>
                  </td>
                  <td class="align-middle">
                    <input
                      disabled
                      type="number"
                      min="0"
                      v-model="item.total"
                      placeholder="Enter value"
                      class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                    />
                  </td>
                  <td class="align-middle sticky right-0">
                    <div class="flex justify-center" v-if="selectedInvoice === null">
                      <span
                        class="bg-gray-900 hover:bg-black w-6 h-6 cursor-pointer float-right font-semibold inline-flex items-center justify-center px-3 mt-2 rounded-full text-white text-xl mx-auto"
                        @click="removeSelectedJobPart(item, index)"
                      >-</span>
                    </div>
                    <div class="flex flex-row flex-no-wrap justify-start items-center py-1">
                      <input
                        :disabled="item.approve"
                        v-model="disputedInvoices"
                        :id="`${item.job_part_id}-disputed`"
                        type="checkbox"
                        :value="item.job_part_id"
                      />
                      <label
                        :for="`${item.job_part_id}-disputed`"
                        class="text-xs sm:text-sm py-1 flex items-center"
                      >Disputed</label>
                    </div>
                    <div class="flex flex-row flex-no-wrap justify-start items-center py-1">
                      <input
                        v-model="approvedInvoices"
                        :id="`${item.job_part_id}-approved`"
                        type="checkbox"
                        :value="item.job_part_id"
                        disabled
                      />
                      <label
                        :for="`${item.job_part_id}-approved`"
                        class="text-xs sm:text-sm py-1 flex items-center"
                      >Approved</label>
                    </div>
                  </td>
                </tr>
                <tr
                  class="border-b"
                  :key="`${item.id}-${item.job_part_id}`"
                  v-if="disputedInvoices.includes(item.job_part_id)"
                >
                  <td>
                    <div class="flex flex-col py-2">
                      <label for="absent_days">Days of absent</label>
                      <input
                        :disabled="item.approve"
                        type="number"
                        min="0"
                        v-model="item.absent_days"
                        name="absent_days"
                        class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                      />
                    </div>
                  </td>
                  <td>
                    <div class="flex flex-col py-2">
                      <label for="late_hours">Hours of late</label>
                      <input
                        :disabled="item.approve"
                        type="number"
                        min="0"
                        v-model="item.late_hours"
                        name="late_hours"
                        class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                      />
                    </div>
                  </td>
                  <td>
                    <div class="flex flex-col py-2">
                      <label for="final_hours">Final hours</label>
                      <input
                        :disabled="item.approve"
                        type="number"
                        min="0"
                        v-model="item.final_hours"
                        name="final_hours"
                        class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                      />
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr
                  class="border-b"
                  :key="`${item.id}-${item.job_part_id}-${item.job_part_id}`"
                  v-if="disputedInvoices.includes(item.job_part_id)"
                >
                  <td colspan="4">
                    <div class="flex flex-col mt-1">
                      <label for="remarks">Remarks</label>
                      <textarea
                        :disabled="item.approve"
                        v-model="item.remarks"
                        rows="3"
                        name="remarks"
                        class="w-full text-xs sm:text-sm resize-none border-b-2 border-gray-300 focus:border-yellow-500 focus:outline-none px-2 my-2"
                      ></textarea>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="flex flex-row flex-wrap justify-between md:px-2">
          <div class="w-full md:w-1/2 md:pr-1">
            <AppDate
              v-model="form.date_start"
              :name="'date_start'"
              :label="'Days worked from'"
              :error="formError.find(item => item.field === 'date_start')"
            />
          </div>
          <div class="w-full md:w-1/2 md:pl-1">
            <AppDate
              v-model="form.date_end"
              :name="'date_end'"
              :label="'To'"
              :error="formError.find(item => item.field === 'date_end')"
            />
          </div>
        </div>

        <div class="flex justify-between md:m-2">
          <span class="font-bold">Total</span>
          <div>
            <div class="flex justify-end">
              <div
                class="rounded-lg bg-red-500 p-1 text-xs sm:text-sm text-white"
                v-if="formError.find(item => item.field === 'total_amount')"
              >{{formError.find(item => item.field === 'total_amount').message}}</div>
            </div>
            £ {{amount | currency}}
          </div>
        </div>
      </div>
      <div class="rounded-lg border-2 border-gray-300 mt-4 p-4">
        <div class="flex flex-col text-xs sm:text-sm">
          <div>Payment by BACS:</div>
          <div>Account name: Rick Sanchez</div>
          <div>Bank: citadel of Ricks Mutiversal Bank</div>
          <div>Sort code: 13</div>
          <div>Account number: 7337#4*OR</div>
        </div>
      </div>
    </div>
  </section>
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
      disputedInvoices: [],
      approvedInvoices: [],

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
            amount += parseFloat(item.total);
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
    },
    issuedAt() {
      return this.selectedInvoice && this.selectedInvoice.issued_at
        ? this.selectedInvoice.issued_at
        : "Not yet issued";
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
          total: item.total.toString(),
          dispute: item.disputed,
          approve: item.approved,
          absent_days: item.absent_days,
          final_hours: item.final_hours,
          late_hours: item.late_hours,
          remarks: item.remarks
        });
        if (item.disputed === true) {
          this.disputedInvoices.push(item.job_part.id);
        }
        if (item.approved === true) {
          this.approvedInvoices.push(item.job_part.id);
        }
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
    exportToPdf() {
      this.$html2canvas(document.getElementById("htmlpdf")).then(canvas => {
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        var doc = this.$jspdf("p", "mm");
        var position = 0;

        var imgData = canvas.toDataURL("image/png");

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save(`locum-billing-invoice.pdf`);
      });
    },
    save(final) {
      this.formError = [];
      this.form.type = this.type;
      this.form.surgery_id = this.selectedSurgery.id;
      this.form.total_amount = this.amount;
      this.form.final = final;
      this.form.items = [];
      this.selectedJobParts.forEach(jobPart => {
        this.form.items.push({
          ...jobPart,
          dispute: this.disputedInvoices.includes(jobPart.job_part_id)
            ? true
            : false,
          approve: this.approvedInvoices.includes(jobPart.job_part_id)
            ? true
            : false
        });
      });
      console.log(this.form.items);
      this.Validate(this.form, ["final"]);
      if (!this.formError.length) {
        if (!this.$route.params.id) {
          this.$axios
            .$post(`/api/v1/locum/locum-invoices`, this.form)
            .then(res => {
              console.log(res);
              this.$emit("addInvoice", res.data.invoice);
              this.$router.push("/locum-billing/invoices");
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: [`${res.message}`]
              });
            })
            .catch(err => {
              console.log("err", err.response.data);
              err.response.data.error_messages.forEach(error => {
                this.formError.push(error);
              });
            });
        } else {
          this.$axios
            .$put(
              `/api/v1/locum/locum-invoices/${this.$route.params.id}`,
              this.form
            )
            .then(res => {
              this.$emit("updateInvoice", res.data.locum_invoice);
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: [`${res.message}`]
              });
              this.$router.push("/locum-billing/invoices");
            })
            .catch(err => {
              console.log("err", err.response.data);
              err.response.data.error_messages.forEach(error => {
                this.formError.push(error);
              });
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
      console.log(jobPart);
      let hasJobPart = this.selectedJobParts.find(
        selectedJobPart => selectedJobPart.job_id === jobPart.id
      );
      if (hasJobPart) {
        return;
      }
      let invoiceObj = {};
      let total = null;
      if (jobPart.job.locum_detail_rate_type.name === "Per Hour") {
        total = parseInt(jobPart.job.rate) * parseInt(jobPart.final_hours);
      } else if (
        jobPart.job.locum_detail_rate_type.name === "Per Whole Day Session"
      ) {
        total =
          (parseInt(jobPart.final_hours) / 8) * parseInt(jobPart.job.rate);
      } else if (
        jobPart.job.locum_detail_rate_type.name === "Per Half Day Session"
      ) {
        total =
          (parseInt(jobPart.final_hours) / 4) * parseInt(jobPart.job.rate);
      }
      invoiceObj = {
        type: "Job Part",
        job_part_id: jobPart.id,
        description: `Job number ${jobPart.job_part_number} ${jobPart.job.type} Job at £${jobPart.job.rate} ${jobPart.job.locum_detail_rate_type.name} from ${jobPart.date_start} to ${jobPart.date_end} / ${jobPart.job.shift.name} / Total hours of ${jobPart.final_hours}`,
        total: total.toFixed(2).toString(),
        dispute: jobPart.disputed,
        absent_days: jobPart.absent_days,
        final_hours: jobPart.final_hours,
        late_hours: jobPart.late_hours,
        remarks: ""
      };
      console.log(invoiceObj);
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
      this.selectedJobParts.splice(index, 1);
    },
    async fetchJobPartsCount() {
      try {
        this.loadingJobParts = true;
        const params = {
          locum_status: "Completed",
          job_type: this.type,
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
          job_type: this.type,
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
<style>
.save-button {
  border-color: #ecc94b;
  background-color: #ecc94b;
}
.save-button:hover {
  /* background-color: rgb(80, 80, 80); */
  background-color: #e2be3a;
  border-color: #e2be3a;
  cursor: pointer;
}
.option-list {
  transition: all 0.3s ease-in-out;
  height: 0;
}
.slide-down {
  transition: all 0.3s ease-in-out;
  height: 150px;
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
.items-table tbody tr {
  box-shadow: none;
  border: none;
  border-radius: 0;

  border-bottom: 1px solid #ddd;
}
.items-table {
  /* min-width: 749px; */
  width: 100%;
}
.items-table tbody {
  border: 2px solid #eff3f8;
  border-top-width: 0;
}
.items-table tbody td {
  padding: 0 8px;
}
.invoice{
  min-height: 1050px;
}
</style>
