<template>
  <div class="invoice-modal shadow-lg">
    <section class="bg-white">
      <div class="p-8 max-w-xl h-screen">
        <div class="flex flex-row flex-wrap justify-start">
          <nuxt-link to="/locum-billing/invoices" class="cursor-pointer">
            <svgicon name="left-arrow" height="32" width="32" />
          </nuxt-link>
          <div
            class="save-button text-xs sm:text-sm mx-2 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
            @click="save(false)"
          >Save changes</div>
          <div
            class="save-button text-xs sm:text-sm mx-2 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
            @click="save(true)"
          >Save and archive as final</div>
        </div>

        <div class="flex flex-row flex-wrap justify-start items-center my-4">
          <label class="mx-1 py-2 px-3">Type:</label>
          <button
            :class="type === 'Private' ? 'bg-yellow-dark' : ''"
            class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
            @click="type = type !== 'Private' ? 'Private' : null"
          >Private</button>
          <button
            :class="type === 'Platform' ? 'bg-yellow-dark' : ''"
            class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
            @click="type = type !== 'Platform' ? 'Platform' : null"
          >Platform</button>
        </div>

        <div class="max-w-lg my-4 bg-white px-4 py-4 border shadow-md">
          <div class="flex flex-col">
            <div class="text-xs sm:text-sm text-right leading-normal">
              <div>Mr. QQ AA QQ ZZ</div>
              <div>wqe</div>
              <div>Oldham</div>
              <div>OL1 1NL</div>
              <div>Tel 090991191323</div>
              <div>cacheng.halcyondigital@gmail.com</div>
              <div>UTR 7337#4*OR</div>
            </div>
            <div class="flex justify-between my-2">
              <div
                class="text-xs sm:text-sm text-left rounded-lg border-2 border-black p-2 sm:w-1/2"
              >
                <section>
                  <!-- input select -->
                  <div
                    class="relative flex flex-col py-2 mb-6"
                    v-on-clickaway="toggledOffSurgeries"
                  >
                    <div class="relative flex flex-row flex-nowrap justify-between">
                      <label class="text-xs sm:text-sm py-1">To: Accounts Department</label>
                    </div>
                    <div class="relative flex flex-row flex-wrap justify-start">
                      <input
                        v-model="searchSurgeries"
                        type="text"
                        placeholder="Select.."
                        ref="input"
                        class="border-b-2 w-full focus:border-yellow focus:outline-none py-3 font-bold text-xs sm:text-sm"
                        @focus="toggledSurgeries = true"
                        readonly
                      />
                    </div>
                    <!-- @keydown="handleKeyDownEvent" -->
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
                            :class="{'bg-grey-light': activeIndexSurgeries === index}"
                            v-for="(item, index) in surgeries"
                            :key="item.id"
                            @mouseover="activeIndexSurgeries = index"
                            @click="addSurgery(item)"
                          >{{item.name}}</div>
                          <div
                            class="absolute bg-grey-light w-full h-full pin-t pin-b pin-l pin-r opacity-50"
                            v-if="loadingSurgeries"
                          >
                            <div
                              class="absolute pin-b text-center w-full text-sm font-bold"
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
              <div class="text-right leading-normal">
                <div class="font-bold text-sm sm:text-lg">INVOICE</div>
                <div class="text-xs sm:text-sm">Not yet issued</div>
              </div>
            </div>
            <div v-if="selectedSurgery">
              <section>
                <!-- input select -->
                <div class="relative flex flex-col py-2 mb-6" v-on-clickaway="toggledOffJobParts">
                  <div class="relative flex flex-row flex-nowrap justify-between">
                    <label class="text-xs sm:text-sm py-1">Select a job to add to this invoice</label>
                  </div>
                  <div class="relative flex flex-row flex-wrap justify-start">
                    <input
                      v-model="searchJobParts"
                      type="text"
                      placeholder="Select.."
                      ref="input"
                      class="border-b-2 w-full focus:border-yellow focus:outline-none py-3 font-bold text-xs sm:text-sm"
                      @focus="toggledJobParts = true"
                      readonly
                    />
                  </div>
                  <!-- @keydown="handleKeyDownEvent" -->
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
                          :class="{'bg-grey-light': activeIndexJobParts === index}"
                          v-for="(item, index) in filteredJobParts"
                          :key="item.id"
                          @mouseover="activeIndexJobParts = index"
                          @click="addJobPart(item)"
                        >{{item.job_part_number}}</div>
                        <div
                          class="absolute bg-grey-light w-full h-full pin-t pin-b pin-l pin-r opacity-50"
                          v-if="loadingJobParts"
                        >
                          <div
                            class="absolute pin-b text-center w-full text-sm font-bold"
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

          <table class="w-full">
            <thead>
              <tr class="text-center bg-grey-darkest">
                <th class="text-white" style="width:75%">Description</th>
                <th class="text-white" style="width:20%">Total</th>
                <th style="width:5%"></th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b" v-for="(item, index) in selectedJobParts" :key="index">
                <td style="width:75%">
                  <textarea
                    v-model="item.description"
                    placeholder="Enter description"
                    rows="4"
                    class="w-full text-xs sm:text-sm p-2 border border-black resize-none"
                  ></textarea>
                </td>
                <td style="width:20%;position:relative">
                  <input
                    type="text"
                    v-model="item.total"
                    placeholder="Enter value"
                    class="w-full text-xs sm:text-sm text-right border border-black p-2"
                  />
                </td>
                <td style="width:5%">
                  <span
                    class="cursor-pointer m-1 rounded-full bg-grey-darkest text-white font-semibold text-xl px-2 py-0"
                    @click="removeSelectedJobPart(item, index)"
                  >
                    <span class="text-2xl">-</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td style="width:75%"></td>
                <td style="width:20%"></td>
                <td style="width:5%">
                  <span
                    class="cursor-pointer m-1 rounded-full bg-grey-darkest text-white font-semibold text-xl px-2"
                    @click="addItem"
                    v-if="type === 'Private'"
                  >+</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div class="flex flex-row flex-nowrap justify-between">
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
                <td class="text-right">£ {{amount | currency}}</td>
              </tr>
            </tfoot>
          </table>

          <div class="rounded-lg border-2 border-black mt-24 p-4">
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
    </section>
  </div>
</template>

<script>
import AppDate from "@/components/Base/AppDate";
import AppSelect from "@/components/Base/AppSelect";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import { mixin as clickaway } from "vue-clickaway";
export default {
  mixins: [clickaway],
  transition: {
    name: 'slide',
    mode: 'out-in'
  },

  async asyncData({ app, error, route }) {
    try {
      if (process.client) {
        document.body.style.cursor = 'wait'
      }

      const type = 'Platform'

      const params = {
        invoiceable: true,
        type,
        limit: 10,
        offset: 0,
      }

      const response = await app.$axios.get('/api/v1/locum/surgeries', { params })

      const surgeries = response.data && response.data.data && response.data.data.surgeries ? response.data.data.surgeries : []

      if (process.client) {
        document.body.style.cursor = 'auto'
      }

      return {
        type,
        surgeries,
      }
    } catch (err) {
      console.log('locum-billing create err', err.response || err)
      console.log('locum-billing create error', {
        statusCode: err.status || 500,
        message: err.message || 'Something went wrong!',
      })
      error({
        statusCode: err.status || 500,
        message: err.message || 'Something went wrong!',
      })
    }
  },

  components: {
    AppDate,
    AppSelect,
    AppFilterSearch,
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
        return (
          index === -1 &&
          filterItem
        );
      });
    }
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
      invoice: '',
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
      surgeries: [],
      activeIndexSurgeries: 0,
      searchSurgeries: '',
      toggledSurgeries: false,
      loadingSurgeries: false,
      noMoreLoadSurgeries: false,
      selectedSurgery: null,
      // input select job
      jobParts: [],
      activeIndexJobParts: 0,
      searchJobParts: '',
      toggledJobParts: false,
      loadingJobParts: false,
      noMoreLoadJobParts: false,
      selectedJobParts: []


    };
  },

  watch: {
    type() {
      this.surgeries = []
      this.selectedSurgery = null
      if (this.type === 'Private' || this.type === 'Platform') {
        const params = {
          invoiceable: true,
          type: this.type,
          limit: 10,
          offset: 0,
        }

        this.$axios.get('/api/v1/locum/surgeries', { params }).then((response) => {
          const surgeries = response.data && response.data.data && response.data.data.surgeries ? response.data.data.surgeries : []

          this.surgeries = surgeries
        }).catch((err) => {
          console.log('err', err.response || err)
        })
      }
    },
    selectedSurgery() {
      this.jobParts = []
      this.loadingJobParts = true
      this.noMoreLoadJobParts = false

      if (this.selectedSurgery) {
        const params = {
          locum_status: 'Completed',
          type: this.type,
          surgery_id: this.selectedSurgery.id,
          limit: 10,
          offset: 0,
          order_by: 'created_at:desc',
          invoiced: false
        }

        this.$axios.get('/api/v1/locum/job-parts', { params }).then((response) => {
          const jobParts = response.data && response.data.data && response.data.data.job_parts ? response.data.data.job_parts : []
          if (jobParts.length < 10) {
            this.noMoreLoadJobParts = true
          }
          this.jobParts = jobParts
          this.loadingJobParts = false

        }).catch((err) => {
          console.log('err', err.response || err)
        })
      }
    },
    invoice(value) {
      if (value) {
        // type
        // job_id
        // description
        // total
        if (value) {
          this.rowData.push({ description: value, total: 5 });
        }
        this.invoice = null;
      }
    }
  },

  created() {
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
    document.body.style.overflow = 'hidden'
  },

  destroyed() {
    document.body.style.overflow = 'auto'
  },

  methods: {
    save(final) {
      this.formError = []
      this.form.type = this.type
      this.form.surgery_id = this.selectedSurgery.id
      this.form.date_start = this.$moment(this.form.date_start).format('YYYY-MM-DD');
      this.form.date_end = this.$moment(this.form.date_end).format('YYYY-MM-DD');
      this.form.items = this.selectedJobParts
      this.form.total_amount = this.amount
      this.form.final = final
      this.Validate(this.form, ['final'])
      if (!this.formError.length) {
        this.$axios.$post(`/api/v1/locum/invoices`, this.form).then(res => {
          this.$store.commit('billing/ADD_INVOICE', res.data.invoice)
          this.$router.push('/locum-billing/invoices')
        })
      }
    },
    addItem() {
      let my_object = {
        description: this.description,
        total: this.total
      };
      this.rowData.push(my_object);
      this.description = "";
      this.total = "";
    },
    // job part
    toggledOffJobParts() {
      this.toggledJobParts = false;
    },
    scrollHandlerJobParts(e) {
      if (this.$refs.jobPartsLists.offsetHeight + this.$refs.jobPartsLists.scrollTop >= this.$refs.jobPartsLists.scrollHeight - 1) {
        if (!this.noMoreLoadJobParts) {
          this.loadingJobParts = true
          this.fetchMoreJobParts()
        }
      }
    },
    addJobPart(jobPart) {
      let hasJobPart = this.selectedJobParts.find(selectedJobPart => selectedJobPart.job_id === jobPart.id)
      if (hasJobPart) {
        return
      }
      let invoiceObj = {}
      let total = null
      if (jobPart.job.locum_detail_rate_type.id === 1) {
        total = parseInt(jobPart.job.rate) * parseInt(jobPart.job.total_hours)
      } else {
        let dividerTotal = this.$moment(jobPart.date_end).diff(jobPart.date_start, 'days')
        total = parseInt(jobPart.job.rate) / dividerTotal
      }
      invoiceObj = {
        type: 'Job Part',
        job_part_id: jobPart.id,
        description: `Job number ${jobPart.job_part_number} ${jobPart.job.type} Job at £${jobPart.job.rate} per hour from ${jobPart.date_start} / OOH / Total hours at ${jobPart.job.total_hours}`,
        total: total.toString(),
      }
      this.selectedJobParts.push(invoiceObj)
    },
    removeSelectedJobPart(jobPart, index) {
      this.selectedJobParts.splice(index, 1)
    },
    async fetchMoreJobParts() {
      const params = {
        locum_status: 'Completed',
        type: this.type,
        surgery_id: this.selectedSurgery.id,
        limit: 10,
        offset: this.jobParts.length,
        order_by: 'created_at:desc'
      }

      this.$axios.get('/api/v1/locum/job-parts', { params }).then((response) => {
        const jobParts = response.data && response.data.data && response.data.data.job_parts ? response.data.data.job_parts : []

        jobParts.forEach(part => {
          this.jobParts.push(part)
        })

        if (jobParts.length < 10) {
          this.noMoreLoadJobParts = true
        }

        this.loadingJobParts = false
      }).catch((err) => {
        console.log('err', err.response || err)
      })
    },
    // surgeries
    toggledOffSurgeries() {
      this.toggledSurgeries = false
    },
    scrollHandlerSurgeries(e) {
      if (this.$refs.surgeryLists.offsetHeight + this.$refs.surgeryLists.scrollTop >= this.$refs.surgeryLists.scrollHeight - 1) {
        if (!this.noMoreLoadSurgeries) {
          this.loadingSurgeries = true
          this.fetchMoreSurgeries()
        }
      }
    },
    addSurgery(surgery) {
      this.selectedSurgery = surgery
      this.searchSurgeries = surgery.name
      this.toggledSurgeries = false
    },
    async fetchMoreSurgeries() {
      const params = {
        invoiceable: true,
        type: this.type,
        limit: 10,
        offset: this.surgeries.length,
      }

      const response = await this.$axios.get('/api/v1/locum/surgeries', { params })

      response.data.data.surgeries.forEach(surgery => {
        this.surgeries.push(surgery)
      })

      if (response.data.data.surgeries.length < 10) {
        this.noMoreLoadSurgeries = true
      }

      this.loadingSurgeries = false
    },
  }
}
</script>

<style scoped>
.invoice-modal {
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
  .invoice-modal {
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

/* absolute bg-grey-light w-full h-full pin-t pin-b pin-l pin-r */
</style>
