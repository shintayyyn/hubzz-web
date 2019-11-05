<template>
  <section>
    <div class="flex flex-wrap justify-start items-center">
      <div
        class="save-button text-xs sm:text-sm ml-4 mx-2 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
        @click="save(false)"
      >Save changes</div>
    </div>

    <div class="flex flex-row flex-wrap justify-start items-center my-4">
      <label class="mx-1 py-2 px-3">Type:</label>
      <button
        :class="type === 'Platform' ? 'bg-yellow-500 border-yellow-500' : 'hover:bg-gray-200'"
        class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none"
        @click="type = 'Platform'"
        :disabled="true"
      >Platform</button>
    </div>

    <div class="max-w-3xl my-4 bg-white px-4 py-4 border shadow-md mb-32">
      <div class="flex flex-col">
        <div class="text-xs sm:text-sm sm:text-right leading-normal">
          <div>{{locum_user.name}}</div>
          <div>{{locum_user.email}}</div>
        </div>
        <div class="flex flex-wrap justify-between my-2">
          <div
            class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3"
          >
            <section>
              <div class="relative flex flex-col py-2 mb-3 md:mb-6">
                <div class="relative flex flex-row flex-no-wrap justify-between">
                  <label class="text-xs sm:text-sm py-1">To: Accounts Department</label>
                </div>
                <div class="relative flex flex-row flex-wrap justify-start">
                  <input
                    v-model="surgery_name"
                    type="text"
                    placeholder="Select.."
                    ref="input"
                    class="border-b-2 w-full focus:border-yellow-400 focus:outline-none py-3 font-bold text-xs sm:text-sm"
                    readonly
                  />
                </div>
              </div>
            </section>
          </div>
          <div class="w-full sm:w-1/2 order-1 sm:order-2 sm:text-right leading-normal">
            <div class="font-bold text-sm sm:text-lg">{{selectedInvoice.status.toUpperCase()}}</div>
            <div class="text-xs sm:text-sm">{{issuedAt | localDate}}</div>
          </div>
        </div>
      </div>
      <div class="overflow-auto">
        <table class="items-table">
          <thead>
            <tr>
              <th colspan="2" class="bg-gray-900 w-2/3 text-white text-left px-4 py-1">Description</th>
              <th
                class="bg-gray-900 w-1/3 text-white text-left px-2 py-1"
                :colspan="type === 'Private' ? 1:2"
              >
                <span class="flex justify-between items-center">Total</span>
              </th>
              <th v-if="type === 'Private'" class="sticky right-0 bg-gray-900">
                <span
                  class="cursor-pointer w-6 h-6 mx-2 md:mx-4 rounded-full bg-white text-gray-900 font-semibold text-xl flex justify-center items-center hover:bg-gray-200"
                  @click="addItem"
                >+</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item) in selectedJobParts">
              <tr class="border-b" :key="item.id">
                <td colspan="2">
                  <textarea
                    v-model="item.description"
                    rows="3"
                    placeholder="Enter description"
                    class="w-full text-xs sm:text-sm resize-none border-b-2 border-gray-300 focus:border-yellow-500 focus:outline-none px-4 my-2"
                  ></textarea>
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    v-model="item.total"
                    placeholder="Enter value"
                    class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs mt-1 md:mt-3 w-full focus:border-yellow-500"
                  />
                </td>
                <td class="align-middle sticky right-0">
                  <AppInput
                    v-model="item.dispute"
                    :type="'single-checkbox'"
                    :name="'disputed'"
                    :label="'Dispute'"
                    :disabled="true"
                  />
                  <AppInput
                    v-model="item.dispute"
                    :type="'single-checkbox'"
                    :name="'approve'"
                    :label="'Approve'"
                  />
                </td>
              </tr>
              <tr class="border-b" :key="`${item.id}-${item.id}`" v-if="item.dispute">
                <td>
                  <div class="flex flex-col">
                    <label for="absent_days">Days of absent</label>
                    <input
                      type="number"
                      min="0"
                      v-model="item.absent_days"
                      name="absent_days"
                      class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                    />
                  </div>
                </td>
                <td>
                  <div class="flex flex-col">
                    <label for="late_hours">Hours of late</label>
                  </div>
                  <input
                    type="number"
                    min="0"
                    v-model="item.late_hours"
                    name="late_hours"
                    class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                  />
                </td>
                <td>
                  <div class="flex flex-col">
                    <label for="final_hours">Final hours</label>
                    <input
                      type="number"
                      min="0"
                      v-model="item.final_hours"
                      name="final_hours"
                      class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                    />
                  </div>
                </td>
              </tr>
              <tr class="border-b" :key="`${item.id}-${item.id}-${item.id}`" v-if="item.dispute">
                <td colspan="3">
                  <div class="flex flex-col mt-1">
                    <label for="remarks">Update remarks</label>
                    <textarea
                      v-model="item.remarks"
                      rows="3"
                      name="remarks"
                      class="w-full text-xs sm:text-sm resize-none border-b-2 border-gray-300 focus:border-yellow-500 focus:outline-none px-4 my-2"
                    ></textarea>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="flex flex-row flex-wrap justify-between px-2">
        <div class="w-full md:w-1/2 pr-1">
          <AppDate
            v-model="form.date_start"
            :name="'date_start'"
            :label="'Days worked from'"
            :error="formError.find(item => item.field === 'date_start')"
            :disabled="true"
          />
        </div>
        <div class="w-full md:w-1/2 pl-1">
          <AppDate
            v-model="form.date_end"
            :name="'date_end'"
            :label="'To'"
            :error="formError.find(item => item.field === 'date_end')"
            :disabled="true"
          />
        </div>
      </div>

      <div class="flex justify-between m-2">
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
      type: null,

      practices: [],
      practice_id: "",
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
      surgery_name: "",
      // input select job
      searchJobParts: "",
      selectedJobParts: [],
      locum_user: null
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
      return this.selectedInvoice.issued_at
        ? this.selectedInvoice.issued_at
        : "Not yet issued";
    }
  },
  watch: {
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
    this.locum_user = this.selectedInvoice.locum_user;
    this.type = this.selectedInvoice.type;
    this.surgery_name = this.selectedInvoice.surgery.name;
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
        absent_days: item.absent_days,
        final_hours: item.final_hours,
        late_hours: item.late_hours,
        remarks: item.remarks
      });
    });
    // get surgery name / id
    // this.$axios.$get(`/api/v1/locum/private-practices`).then(res => {
    //   this.practices = [];
    //   res.data.private_practices.forEach(practice => {
    //     this.practices.push({
    //       label: practice.surgery.name,
    //       value: practice.id
    //     });
    //   });
    // });
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
      this.form.surgery_id = this.form.surgery_id;
      this.form.items = this.selectedJobParts;
      this.form.total_amount = this.amount;
      this.form.final = final;
      this.Validate(this.form, ["final"]);
      if (!this.formError.length) {
        if (!this.$route.params.id) {
          this.$axios
            .$post(`/api/v1/practice/locum-invoices`, this.form)
            .then(res => {
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
              `/api/v1/practice/locum-invoices/${this.$route.params.id}`,
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
    addItem() {},
    // surgeries
    toggledOffSurgeries() {},
    scrollHandlerSurgeries(e) {},
    addSurgery(surgery) {},
    async fetchSurgeriesCount() {},
    async fetchSurgeries() {},
    // job part
    toggledOffJobParts() {},
    scrollHandlerJobParts(e) {},
    addJobPart(jobPart) {},
    removeSelectedJobPart(jobPart, index) {},
    async fetchJobPartsCount() {},
    async fetchJobParts() {}
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
  height: auto;
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
}
.items-table {
  width: 733px;
}
.items-table tbody {
  border: 2px solid #eff3f8;
  border-top-width: 0;
}
.items-table tbody td {
  padding: 0 8px;
}
</style>
