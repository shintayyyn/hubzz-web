<template>
  <section class="relative max-w-3xl">
    <div class="flex flex-col md:flex-row justify-between">
      <div class="flex flex-wrap items-center">
        <AppButton
          class="m-1"
          v-if="!allApproved"
          :label="'Save changes'"
          @click="save(false)"
          :inStyle="'padding:5px 14px;font-size:1em'"
          :disabled="saveLoading || exportLoading"
        />
        <AppButton
          class="m-1"
          v-if="!allApproved && (!selectedInvoice || (selectedInvoice && selectedInvoice.status === 'Draft'))"
          :label="'Save and archive as final'"
          @click="save(true)"
          :inStyle="'padding:5px 14px;font-size:1em'"
          :disabled="saveLoading || exportLoading"
        />
        <AppButton
          class="m-1"
          :label="'Export to PDF'"
          @click="exportToPdf()"
          :inStyle="'padding:5px 14px;font-size:1em'"
          :disabled="saveLoading || exportLoading"
        />
      </div>

      <!-- INVOICE TYPE -->
      <div class="flex flex-row flex-wrap justify-start items-center my-2 md:my-4">
        <label class="mx-1">Type:</label>
        <button
          v-if="!selectedInvoice || ((selectedInvoice && selectedInvoice.status === 'Draft') || (selectedInvoice && (selectedInvoice.status === 'Issued' || selectedInvoice.status === 'Disputed') && type === 'Private'))"
          :class="type === 'Private' ? 'bg-yellow-500 border-yellow-500' : 'hover:bg-gray-200'"
          class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none"
          @click="type = 'Private'"
          :disabled="type === 'Private'"
        >Private</button>
        <button
          v-if="!selectedInvoice || ((selectedInvoice && selectedInvoice.status === 'Draft') || (selectedInvoice && (selectedInvoice.status === 'Issued' || selectedInvoice.status === 'Disputed') && type === 'Platform'))"
          :class="type === 'Platform' ? 'bg-yellow-500 border-yellow-500' : 'hover:bg-gray-200'"
          class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none"
          @click="type = 'Platform'"
          :disabled="type === 'Platform'"
        >Platform</button>
      </div>
    </div>

    <div id="htmlpdf" class="relative max-w-3xl mb-4 bg-white px-4 py-4 border shadow-md mb-32">
      <AppLoading :loading="exportLoading" spinner :message="'Exporting'" />
      <AppLoading :loading="saveLoading" spinner />
      <div class="flex flex-col" :ref="'pdf-header'">
        <!-- LOCUM INFO -->
        <div class="text-xs sm:text-sm sm:text-right leading-normal">
          <div>{{$auth.user.personal_detail.name}}</div>
          <div>{{$auth.user.address_detail.address.line_1}}</div>
          <div>{{$auth.user.address_detail.address.line_3}}</div>
          <div>{{$auth.user.address_detail.address.post_code}}</div>
          <div>Tel {{$auth.user.contact_detail.mobile_number}}</div>
          <div>{{$auth.user.email}}</div>
          <div>{{$auth.user.locum_detail.invoice_detail && $auth.user.locum_detail.invoice_detail.utr_number ? `UTR ${$auth.user.locum_detail.invoice_detail.utr_number}` : null}}</div>
        </div>
        <div class="flex flex-wrap justify-between my-2">
          <div
            class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3"
          >
            <!-- LIST OF SURGERIES/PRACTICES -->
            <section>
              <div class="relative flex flex-col py-2" v-on-clickaway="toggledOffSurgeries">
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
                    :class="formError.find(err => err.field === 'surgery_id') ? 'border-red-500' : ''"
                    @focus="toggledSurgeries = true"
                    readonly
                    :disabled="selectedInvoice !== null"
                  />
                  <transition name="drop-down">
                    <div
                      v-if="formError.find(err => err.field === 'surgery_id')"
                      class="text-red-500 py-1 text-xs text-white"
                    >Select a Surgery</div>
                  </transition>
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
                        <AppLoading :loading="loadingSurgeries" spinner />
                      </div>
                    </div>
                    <div class="relative" v-if="surgeries.length === 0">
                      <div
                        v-if="!loadingSurgeries"
                        class="text-xs sm:text-sm text-center font-bold my-2"
                      >No Practice / Surgeries Job Invoiceable Yet</div>
                      <div class="mt-20" v-if="loadingSurgeries">
                        <AppLoading :loading="loadingSurgeries" spinner />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <!-- SURGERY/PRACTICE ADDRESS -->
            <div class="text-xs sm:text-sm" v-if="selectedSurgery && selectedSurgery.address">
              <div>{{selectedSurgery.address.line_1}}</div>
              <div>{{selectedSurgery.address.line_2}}</div>
              <div>{{selectedSurgery.address.line_3}}</div>
              <div>{{selectedSurgery.address.post_code}}</div>
            </div>
          </div>
          <!-- INVOICE STATUS -->
          <div
            v-if="selectedInvoice"
            class="w-full sm:w-1/2 order-1 sm:order-2 sm:text-right leading-normal"
          >
            <div class="font-bold text-sm sm:text-lg">{{selectedInvoice.status.toUpperCase()}}</div>
            <div
              class="text-xs sm:text-sm"
              v-if="selectedInvoice.status === 'Issued'"
            >{{selectedInvoice.issued_at | localDate}}</div>
            <div
              class="text-xs sm:text-sm"
              v-if="selectedInvoice.status === 'Paid'"
            >{{selectedInvoice.paid_at | localDate}}</div>
            <div class="text-xs sm:text-sm" v-if="selectedInvoice.status === 'Draft'">Not yet issued</div>
          </div>
        </div>
        <div v-if="selectedSurgery && selectedInvoice === null && selectedJobParts.length < 1">
          <!-- LIST OF JOB PARTS-->
          <section>
            <div
              class="relative flex flex-col py-2 mb-3 md:mb-6 mt-2"
              v-on-clickaway="toggledOffJobParts"
            >
              <div class="relative flex flex-row flex-no-wrap justify-between">
                <label class="text-xs sm:text-sm py-1">Select a job to add to this invoice</label>
                <!-- <div class="flex justify-end">
                  <div
                    class="rounded-lg bg-red-500 p-1 text-xs sm:text-sm text-white"
                    v-if="formError.find(item => item.field === 'items')"
                  >{{formError.find(item => item.field === 'items').message}}</div>
                </div>-->
              </div>
              <div class="relative flex flex-row flex-wrap justify-start">
                <input
                  v-model="searchJobParts"
                  type="text"
                  placeholder="Select.."
                  ref="input"
                  class="border-b-2 w-full focus:border-yellow-400 focus:outline-none py-3 font-bold text-xs sm:text-sm"
                  :class="formError.find(err => err.field === 'items') ? 'border-red-500' : ''"
                  @focus="toggledJobParts = true"
                  readonly
                />
                <transition name="drop-down">
                  <div
                    v-if="formError.find(err => err.field === 'items')"
                    class="text-red-500 py-1 text-xs text-white"
                  >Select one of the completed job parts</div>
                </transition>
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
                      <AppLoading :loading="loadingJobParts" spinner />
                    </div>
                  </div>

                  <div class="relative" v-if="jobParts.length === 0">
                    <div
                      v-if="!loadingJobParts"
                      class="text-xs sm:text-sm text-center font-bold my-2"
                    >No Job Completed On This Surgery</div>
                    <div class="mt-20" v-if="loadingJobParts">
                      <AppLoading :loading="loadingJobParts" spinner />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="overflow-auto">
        <div class="items-table">
          <!-- ITEMS HEADER -->
          <div class="flex justify-start" :ref="'items-header'">
            <div
              class="w-1/2 bg-gray-900 text-white px-4 py-1 font-semibold border-r-2 border-white"
            >Description</div>
            <div class="w-1/2 bg-gray-900 text-white px-4 py-1 font-semibold flex justify-between">
              Total
              <!-- <div class="bg-gray-900 flex items-center justify-end">
                <span
                  v-if="type === 'Private' && hideToPrint"
                  class="cursor-pointer w-6 h-6 rounded-full bg-white text-gray-900 font-semibold text-xl flex justify-center items-center hover:bg-gray-200"
                  @click="addItem"
                >+</span>
              </div>-->
            </div>
          </div>
          <!-- ITEMS -->
          <div
            :id="`invoice-item-${index}`"
            class="flex flex-col border-b-2 pb-2"
            v-for="(item, index) in selectedJobParts"
            :ref="`item-${index}`"
            :key="item.id"
          >
            <div class="relative flex justify-start mt-2">
              <!-- FOR PRIVATE TYPE -->
              <template v-if="type === 'Private'">
                <div class="w-1/2 px-1">
                  <textarea
                    v-model="item.description"
                    rows="3"
                    placeholder="Enter description"
                    class="w-full text-xs sm:text-sm resize-none border-b-2 border-gray-300 focus:border-yellow-500 focus:outline-none px-4 my-2"
                  ></textarea>
                </div>
                <div class="w-1/2 flex items-end px-1">
                  <div :class="selectedInvoice ? 'w-full' : 'w-3/4'">
                    <input
                      type="number"
                      min="0"
                      v-model="item.total"
                      placeholder="Enter value"
                      class="w-full text-xs sm:text-sm text-right border-b-2 focus:border-yellow-500 focus:outline-none my-4"
                    />
                  </div>
                  <div class="w-1/4 h-full" v-if="selectedInvoice === null && hideToPrint">
                    <div class="flex justify-center items-center w-full h-full">
                      <span
                        class="bg-gray-900 hover:bg-black w-6 h-6 cursor-pointer float-right font-semibold inline-flex items-center justify-center px-3 mt-2 rounded-full text-white text-xl mx-auto"
                        @click="removeSelectedJobPart(item, index)"
                      >-</span>
                    </div>
                  </div>
                </div>
              </template>
              <!-- FOR PLATFORM TYPE -->
              <template v-if="type === 'Platform'">
                <div
                  class="w-1/2 text-xs sm:text-sm px-4 py-1 border-b-2 border-gray-300"
                >{{item.description}}</div>
                <div
                  class="text-xs sm:text-sm border-b-2 border-gray-300 px-4 py-1 text-right"
                  :class="approvedInvoices.includes(item.job_part_id) ? 'w-1/2':'w-1/3'"
                >{{item.total}}</div>
                <div
                  class="flex items-center align-middle sticky right-0 bg-white"
                  v-if="!approvedInvoices.includes(item.job_part_id)"
                >
                  <div class="px-2">
                    <div class="flex flex-row flex-no-wrap justify-start items-center">
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
                    <div class="flex flex-row flex-no-wrap justify-start items-center">
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
                  </div>
                  <div class="flex justify-center" v-if="selectedInvoice === null  && hideToPrint">
                    <span
                      class="bg-gray-900 hover:bg-black w-6 h-6 cursor-pointer float-right font-semibold inline-flex items-center justify-center px-3 mt-2 rounded-full text-white text-xl mx-auto"
                      @click="removeSelectedJobPart(item, index)"
                    >-</span>
                  </div>
                </div>
              </template>
            </div>
            <div
              class="flex justify-start mt-2"
              v-if="disputedInvoices.includes(item.job_part_id)  && !approvedInvoices.includes(item.job_part_id)"
            >
              <div class="w-1/3 flex flex-col px-2">
                <label for="absent_days">Days of absent</label>
                <input
                  :disabled="item.approve || approvedInvoices.includes(item.job_part_id)"
                  type="number"
                  min="0"
                  v-model="item.absent_days"
                  name="absent_days"
                  class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                />
              </div>
              <div class="w-1/3 flex flex-col px-2">
                <label for="late_hours">Hours of late</label>
                <input
                  :disabled="item.approve || approvedInvoices.includes(item.job_part_id)"
                  type="number"
                  min="0"
                  v-model="item.late_hours"
                  name="late_hours"
                  class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                />
              </div>
              <div class="w-1/3 flex flex-col px-2">
                <label for="final_hours">Final hours</label>
                <input
                  :disabled="item.approve || approvedInvoices.includes(item.job_part_id)"
                  type="number"
                  min="0"
                  v-model="item.final_hours"
                  name="final_hours"
                  class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                />
              </div>
            </div>
            <div
              class="flex justify-start mt-2"
              v-if="disputedInvoices.includes(item.job_part_id)  && !approvedInvoices.includes(item.job_part_id)"
            >
              <div class="flex flex-col w-full">
                <label for="remarks">Update remarks</label>
                <textarea
                  :disabled="item.approve || approvedInvoices.includes(item.job_part_id)"
                  v-model="item.remarks"
                  rows="3"
                  name="remarks"
                  class="w-full text-xs sm:text-sm resize-none border-b-2 border-gray-300 focus:border-yellow-500 focus:outline-none px-4 my-2"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ITEMS TOTAL -->
      <div :ref="'items-total'" class="flex justify-between md:m-2">
        <span class="font-bold">Total</span>
        <div class="relative">
          <!-- <div class="flex justify-end">
            <div
              class="rounded-lg bg-red-500 p-1 text-xs sm:text-sm text-white"
              v-if="formError.find(item => item.field === 'total_amount')"
            >{{formError.find(item => item.field === 'total_amount').message}}</div>
          </div>-->
          £ {{amount | currency}}
        </div>
      </div>
      <!-- ITEMS DAYS WORKED -->
      <div :ref="'days-worked'" class="flex flex-row flex-wrap justify-between px-2">
        <div class="w-full flex flex-row flex-wrap justify-between md:px-2">
          <div class="w-full md:w-1/2 md:pr-1">
            <AppDate
              :disabled="selectedInvoice && selectedInvoice.status !== 'Draft'"
              v-model="form.date_start"
              :name="'date_start'"
              :label="'Days worked from'"
              :error="formError.find(item => item.field === 'date_start')"
              @input="CheckEmptyField(form.date_start, 'date_start')"
            />
          </div>
          <div class="w-full md:w-1/2 md:pl-1">
            <AppDate
              :disabled="selectedInvoice && selectedInvoice.status !== 'Draft'"
              v-model="form.date_end"
              :name="'date_end'"
              :label="'To'"
              :error="formError.find(item => item.field === 'date_end')"
              @input="CheckEmptyField(form.date_end, 'date_end')"
            />
          </div>
        </div>
      </div>

      <div :ref="'pdf-footer'" class="rounded-lg border-2 border-gray-300 mt-4 p-4">
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
import AppLoading from "@/components/Base/AppLoading";
import AppButton from "@/components/Base/AppButton";
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
    AppLoading,
    AppButton,
    AppDate,
    AppInput,
    AppFilterSearch
  },
  data() {
    return {
      // loading: false,
      exportLoading: false,
      saveLoading: false,
      hideToPrint: true,

      disputedInvoices: [],
      approvedInvoices: [],

      type: "Platform",

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
    allApproved() {
      return (
        this.selectedInvoice &&
        this.selectedInvoice.items.filter(invoice => invoice.approved === false)
          .length === 0
      );
    }
  },
  watch: {
    async type(newValue, oldValue) {
      if (newValue && oldValue) {
        this.surgeries = [];
        this.selectedSurgery = null;
        this.searchSurgeries = "";
        this.jobParts = [];
        this.selectedJobParts = [];
        this.formError = [];
      }
      this.loadingSurgeries = true;
      await this.getSurgeriesPromiseAll();
      this.loadingSurgeries = false;
    },
    async selectedSurgery(newValue, oldValue) {
      if (newValue && oldValue) {
        this.jobParts = [];
        this.selectedJobParts = [];
      }
      if (newValue && !this.selectedInvoice) {
        this.loadingJobParts = true;
        await this.getJobPartsPromiseAll();
        this.loadingJobParts = false;
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
  async created() {
    if (!this.selectedInvoice) {
      this.loadingSurgeries = true;
      await this.getSurgeriesPromiseAll();
      this.loadingSurgeries = false;
    }
  },
  mounted() {
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
  },
  methods: {
    // SURGERIES
    getSurgeriesPromiseAll() {
      let url =
        this.type === "Platform"
          ? `/api/v1/locum/practices`
          : `/api/v1/locum/private-practices`;

      let countParams = {
        locum_invoiceable: true
      };
      let surgeriesParams = {
        locum_invoiceable: true,
        limit: 10,
        offset: 0
      };
      return Promise.all([
        this.$axios.$get(`${url}/count`, {
          params: countParams
        }),
        this.$axios.$get(`${url}`, { params: surgeriesParams })
      ])
        .then(([responseCount, responseSurgeries]) => {
          this.totalSurgeries = responseCount.data.count;
          let surgeries = responseSurgeries.data.practices
            ? responseSurgeries.data.practices
            : responseSurgeries.data.private_practices;

          this.loadMoreSurgeries = true;

          if (!surgeries.length) {
            this.loadMoreSurgeries = false;
          } else {
            surgeries.forEach(surgery => {
              if (this.surgeries.length === 0) {
                this.surgeries.push(surgery.surgery);
              } else if (this.surgeries.length > 0) {
                let index = this.surgeries.findIndex(
                  item => item.id === surgery.id
                );
                if (index < 0) {
                  this.surgeries.push(surgery.surgery);
                }
              }
            });
            if (
              surgeries.length < 10 ||
              (surgeries.length === 10 &&
                this.surgeries.length === this.totalSurgeries)
            ) {
              this.loadMoreSurgeries = false;
            }
          }
        })
        .catch(([errCount, errSurgeries]) => {
          console.log("err", errCount.response || errCount);
          if (errCount.response.data.message) {
            return this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${errCount.response.data.message}`]
            });
          }
          console.log("err", errSurgeries.response || errSurgeries);
          if (errSurgeries.response.data.message) {
            return this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${errSurgeries.response.data.message}`]
            });
          }
        });
    },
    // for scrolling
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
        console.log("err", err.response || err);
        if (err.response.data.message) {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`]
          });
        }
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
            if (this.surgeries.length === 0) {
              this.surgeries.push(surgery);
            } else if (this.surgeries.length > 0) {
              let index = this.surgeries.findIndex(
                item => item.id === surgery.id
              );
              if (index < 0) {
                this.surgeries.push(surgery);
              }
            }
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
        console.log("err", err.response || err);
        if (err.response.data.message) {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`]
          });
        }
        throw err;
      }
    },
    toggledOffSurgeries() {
      this.toggledSurgeries = false;
    },
    addSurgery(surgery) {
      let index = this.formError.findIndex(err => err.field === "surgery_id");
      if (index >= 0) {
        this.formError.splice(index, 1);
      }
      this.selectedSurgery = surgery;
      this.searchSurgeries = surgery.name;
      this.toggledSurgeries = false;
    },
    // JOB PARTS
    getJobPartsPromiseAll() {
      let countParams = {
        locum_status: ["Completed", "Terminated"],
        job_type: this.type,
        job_surgery_id: [this.selectedSurgery.id],
        order_by: "created_at:desc",
        invoiced: false
      };

      let jobPartsParams = {
        locum_status: ["Completed", "Terminated"],
        job_type: this.type,
        job_surgery_id: [this.selectedSurgery.id],
        limit: 10,
        offset: 0,
        order_by: "created_at:desc",
        invoiced: false
      };

      return Promise.all([
        this.$axios.$get(`/api/v1/locum/job-parts/count`, {
          params: countParams
        }),
        this.$axios.$get(`/api/v1/locum/job-parts`, {
          params: jobPartsParams
        })
      ]).then(([responseCount, responseJobParts]) => {
        this.totalJobParts = responseCount.data.count;
        let jobParts = responseJobParts.data.job_parts;

        this.loadMoreJobParts = true;

        if (!jobParts.length) {
          this.loadMoreJobParts = false;
        } else {
          jobParts.forEach(jobPart => {
            if (this.jobParts.length === 0) {
              this.jobParts.push(jobPart);
            } else if (this.jobParts.length > 0) {
              let index = this.jobParts.findIndex(
                item => item.id === jobPart.id
              );
              if (index < 0) {
                this.jobParts.push(jobPart);
              }
            }
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
      });
    },
    // for scrolling
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
    async fetchJobPartsCount() {
      try {
        this.loadingJobParts = true;
        const params = {
          locum_status: ["Completed", "Terminated"],
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
        console.log("err", err.response || err);
        if (err.response.data.message) {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`]
          });
        }
        throw err;
      }
    },
    async fetchJobParts() {
      try {
        const params = {
          locum_status: ["Completed", "Terminated"],
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
            if (this.jobParts.length === 0) {
              this.jobParts.push(jobPart);
            } else if (this.jobParts.length > 0) {
              let index = this.jobParts.findIndex(
                item => item.id === jobPart.id
              );
              if (index < 0) {
                this.jobParts.push(jobPart);
              }
            }
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
        console.log("err", err.response || err);
        if (err.response.data.message) {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`]
          });
        }
        throw err;
      }
    },
    toggledOffJobParts() {
      this.toggledJobParts = false;
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
    //
    async exportToPdf() {
      this.hideToPrint = false;
      this.exportLoading = true;
      if (process.client) {
        document.body.style.cursor = "wait";
      }

      let doc = this.$jspdf("p", "mm");
      let pageHeight = 1020;
      let yPosition = 0;

      // PDF HEADER
      const canvasPdfHeader = await this.$html2canvas(this.$refs["pdf-header"]);
      const imgWidthPdfHeader = 205;
      const imgHeightPdfHeader =
        (canvasPdfHeader.height * imgWidthPdfHeader) / canvasPdfHeader.width;
      const imgDataPdfHeader = canvasPdfHeader.toDataURL("image/png");

      pageHeight = pageHeight - this.$refs["pdf-header"].offsetHeight;

      doc.addImage(
        imgDataPdfHeader,
        "PNG",
        2.5,
        yPosition,
        imgWidthPdfHeader,
        imgHeightPdfHeader
      );

      yPosition = yPosition + imgHeightPdfHeader;

      // ITEMS HEADER
      const canvasItemsHeader = await this.$html2canvas(
        this.$refs["items-header"]
      );
      const imgWidthItemsHeader = 205;
      const imgHeightItemsHeader =
        (canvasItemsHeader.height * imgWidthItemsHeader) /
        canvasItemsHeader.width;
      const imgDataItemsHeader = canvasItemsHeader.toDataURL("image/png");

      pageHeight = pageHeight - this.$refs["items-header"].offsetHeight;

      doc.addImage(
        imgDataItemsHeader,
        "PNG",
        2.5,
        yPosition,
        imgWidthItemsHeader,
        imgHeightItemsHeader
      );

      yPosition = yPosition + imgHeightItemsHeader;

      // ITEMS
      let totalSelectedJobParts = this.selectedJobParts.length;

      for (let i = 0; i < totalSelectedJobParts; i++) {
        // minus the current item invoice height to the pageHeight
        pageHeight = pageHeight - this.$refs[`item-${i}`][0].offsetHeight;
        // if all pageHeight is used, add page
        if (pageHeight < 0) {
          pageHeight = 1020;
          yPosition = 0;
          doc.addPage();
          // add header to every new page, also subtract its height to page height
          doc.addImage(
            imgDataItemsHeader,
            "PNG",
            2.5,
            yPosition,
            imgWidthItemsHeader,
            imgHeightItemsHeader
          );

          yPosition = yPosition + imgHeightItemsHeader;

          pageHeight = pageHeight - this.$refs["items-header"].offsetHeight;
          pageHeight = pageHeight - this.$refs[`item-${i}`][0].offsetHeight;
        }

        // draw canvas
        let canvasItem = await this.$html2canvas(this.$refs[`item-${i}`][0]);
        let imgWidthItem = 205;
        let imgHeightItem =
          (canvasItem.height * imgWidthItem) / canvasItem.width;
        let imgDataItem = canvasItem.toDataURL("image/png");

        // add image
        doc.addImage(
          imgDataItem,
          "PNG",
          2.5,
          yPosition,
          imgWidthItem,
          imgHeightItem
        );

        yPosition = yPosition + imgHeightItem;
      }

      // sum up their offsetHeight
      let daysWorkedOffsetHeight = this.$refs["days-worked"].offsetHeight;
      let itemsTotalOffsetHeight = this.$refs["items-total"].offsetHeight;
      let pdfFooterOffsetHeight = this.$refs["pdf-footer"].offsetHeight;

      let totalOffsetHeight =
        daysWorkedOffsetHeight + itemsTotalOffsetHeight + pdfFooterOffsetHeight;

      pageHeight = pageHeight - totalOffsetHeight;

      // DAYS WORKED
      const canvasDaysWorked = await this.$html2canvas(
        this.$refs["days-worked"]
      );
      const imgWidthDaysWorked = 205;
      const imgHeightDaysWorked =
        (canvasDaysWorked.height * imgWidthDaysWorked) / canvasDaysWorked.width;
      const imgDataDaysWorked = canvasDaysWorked.toDataURL("image/png");

      // ITEMS TOTAL
      const canvasItemsTotal = await this.$html2canvas(
        this.$refs["items-total"]
      );
      const imgWidthItemsTotal = 205;
      const imgHeightItemsTotal =
        (canvasItemsTotal.height * imgWidthItemsTotal) / canvasItemsTotal.width;
      const imgDataItemsTotal = canvasItemsTotal.toDataURL("image/png");

      // PDF FOOTER
      const canvasPdfFooter = await this.$html2canvas(this.$refs["pdf-footer"]);
      const imgWidthPdfFooter = 205;
      const imgHeightPdfFooter =
        (canvasPdfFooter.height * imgWidthPdfFooter) / canvasPdfFooter.width;
      const imgDataPdfFooter = canvasPdfFooter.toDataURL("image/png");

      if (pageHeight < 0) {
        pageHeight = 1020;
        doc.addPage();
      }

      yPosition =
        290 - (imgHeightDaysWorked + imgHeightItemsTotal + imgHeightPdfFooter);

      doc.addImage(
        imgDataDaysWorked,
        "PNG",
        2.5,
        yPosition,
        imgWidthDaysWorked,
        imgHeightDaysWorked
      );

      yPosition = yPosition + imgHeightDaysWorked;

      doc.addImage(
        imgDataItemsTotal,
        "PNG",
        2.5,
        yPosition,
        imgWidthItemsTotal,
        imgHeightItemsTotal
      );

      yPosition = yPosition + imgHeightItemsTotal;

      doc.addImage(
        imgDataPdfFooter,
        "PNG",
        2.5,
        yPosition,
        imgWidthPdfFooter,
        imgHeightPdfFooter
      );

      yPosition = yPosition + imgHeightPdfFooter;

      doc.save("test.pdf");
      this.hideToPrint = true;
      this.exportLoading = false;

      if (process.client) {
        document.body.style.cursor = "auto";
      }
    },
    save(final) {
      this.formError = [];
      if (!this.selectedSurgery) {
        this.formError.push({ field: "surgery_id", message: "Select Surgery" });
        return;
      }
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
      console.log(this.selectedJobParts);
      console.log(this.form.items);
      console.log(this.disputedInvoices);
      return;
      this.Validate(this.form, ["final", "total_amount"]);
      if (!this.formError.length) {
        if (!this.$route.params.id) {
          this.saveLoading = true;
          this.$axios
            .$post(`/api/v1/locum/locum-invoices`, this.form)
            .then(res => {
              this.$emit("addInvoice", res.data.locum_invoice);
              // this.$router.push("/locum-billing");
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: [`${res.message}`]
              });
            })
            .catch(err => {
              console.log("err", err.response || err);
              if (err.response.data.message) {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "danger",
                  text: [`${err.response.data.message}`]
                });
              } else if (err.response.data.error_messages) {
                err.response.data.error_messages.forEach(error => {
                  this.formError.push(error);
                });
              }
            })
            .finally(() => {
              this.saveLoading = false;
            });
        } else if (this.$route.params.id) {
          this.saveLoading = true;
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
              // this.$router.push("/locum-billing");
            })
            .catch(err => {
              console.log("err", err.response || err);
              if (err.response.data.message) {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "danger",
                  text: [`${err.response.data.message}`]
                });
              } else if (err.response.data.error_messages) {
                err.response.data.error_messages.forEach(error => {
                  this.formError.push(error);
                });
              }
            })
            .finally(() => {
              this.saveLoading = false;
            });
        }
      }
    },
    addItem() {
      this.selectedJobParts.push({
        description: "",
        total: ""
      });
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
.invoice {
  min-height: 1050px;
}
</style>
