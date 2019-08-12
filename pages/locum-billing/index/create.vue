<template>
  <div class="invoice-modal shadow-lg">
    <section class="bg-white">
      <div class="p-8 max-w-3xl h-screen">
        <div class="flex flex-row flex-wrap justify-start">
          <nuxt-link to="/locum-billing" class="cursor-pointer">
            <svgicon name="left-arrow" height="32" width="32" />
          </nuxt-link>
          <div
            class="save-button text-xs sm:text-sm mx-2 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
            @click="save"
          >Save changes</div>
          <div
            class="save-button text-xs sm:text-sm mx-2 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
            @click="archive"
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
                  <div class="flex flex-col py-2 mb-6">
                    <div class="relative flex flex-row flex-nowrap justify-between">
                      <label class="text-xs sm:text-base py-1">To: Accounts Department</label>
                    </div>
                    <div class="flex flex-row justify-start mt-1">
                      <select
                        v-model="selectedSurgery"
                        class="border-b-2 focus:border-yellow focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
                      >
                        <option :value="null">Select the practice for this invoice</option>
                        <option
                          v-for="(surgery, index) in surgeries"
                          :key="index"
                          :value="surgery"
                        >{{surgery.name}}</option>
                      </select>
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
              <AppSelect
                v-model="invoice"
                :name="'description'"
                :label="'Select a job to add to this invoice'"
                :placeholder="'Select...'"
                :items="jobs"
              />
              <section>
                <!-- input select -->
                <div class="flex flex-col py-2 mb-6">
                  <div class="relative flex flex-row flex-nowrap justify-between">
                    <label class="text-xs sm:text-base py-1">Select a job to add to this invoice</label>
                  </div>
                  <div class="flex flex-row justify-start mt-1">
                    <select
                      v-model="invoice"
                      class="border-b-2 focus:border-yellow focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
                    >
                      <option :value="null">Select a job to add to this invoice</option>
                      <option
                        v-for="(jobPart, index) in jobParts"
                        :key="index"
                        :value="jobPart"
                      >{{jobPart.job_part_number}}</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div class="my-4 text-xs sm:text-sm">Select a job to add to this invoice</div>
          <table class="w-full">
            <thead>
              <tr class="text-center bg-gray-800">
                <th class="text-white" style="width:75%">Description</th>
                <th class="text-white" style="width:20%">Total</th>
                <th style="width:5%"></th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b" v-for="(item, index) in rowData" :key="index">
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
                    class="cursor-pointer m-1 rounded-full bg-gray-800 text-white font-semibold text-xl px-2 py-0"
                    @click="removeItem(index)"
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
                    class="cursor-pointer m-1 rounded-full bg-gray-800 text-white font-semibold text-xl px-2"
                    @click="addItem"
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

export default {

  transition: {
    name: 'slide',
    mode: 'out-in'
  },

  async asyncData({ app, error }) {
    try {
      if (process.client) {
        document.body.style.cursor = 'wait'
      }

      const type = 'Platform'

      const params = {
        invoiceable: true,
        type,
        limit: 1000000,
        offset: 0,
      }

      const response = await app.$axios.get('/api/v1/locum/surgeries', { params })

      const surgeries = response.data && response.data.data && response.data.data.surgeries ? response.data.data.surgeries : []

      console.log('surgeries', surgeries)

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
    AppSelect
  },

  computed: {
    amount() {
      if (this.rowData && this.rowData.length > 0) {
        let amount = 0;
        this.rowData.forEach(item => {
          if (item.total) {
            amount += parseInt(item.total);
          }
        });
        return amount;
      }
    }
  },

  data() {
    return {
      type: null,
      surgeries: [],
      selectedSurgery: null,
      jobParts: [],

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
        date_start: null,
        date_end: null
      },
      formError: []
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
          limit: 1000000,
          offset: 0,
        }

        this.$axios.get('/api/v1/locum/surgeries', { params }).then((response) => {
          const surgeries = response.data && response.data.data && response.data.data.surgeries ? response.data.data.surgeries : []

          console.log('surgeries', surgeries)

          this.surgeries = surgeries
        }).catch((err) => {
          console.log('err', err.response || err)
        })
      }
    },

    selectedSurgery() {
      this.jobParts = []

      if (this.selectedSurgery) {
        const params = {
          locum_status: 'Completed',
          type: this.type,
          surgery_id: this.selectedSurgery.id,
          limit: 1000000,
          offset: 0,
          order_by: 'created_at:desc'
        }

        this.$axios.get('/api/v1/locum/job-parts', { params }).then((response) => {
          const jobParts = response.data && response.data.data && response.data.data.job_parts ? response.data.data.job_parts : []

          console.log('jobParts', jobParts)

          this.jobParts = jobParts
        }).catch((err) => {
          console.log('err', err.response || err)
        })
      }

      this.jobs = [
        {
          label:
            "Job number P0000000099 Private appointment at £1 per hour from 26/04/2019 / OOH / Total hours at 1",
          value:
            "Job number P0000000099 Private appointment at £1 per hour from 26/04/2019 / OOH / Total hours at 1"
        },
        {
          label:
            "Job number P0000000109 Private appointment at £43 per hour from 26/04/2019 / AM / Total hours at 5",
          value:
            "Job number P0000000109 Private appointment at £43 per hour from 26/04/2019 / AM / Total hours at 5"
        },
        {
          label:
            "Job number P0000000129 Private appointment at £9 per hour from 26/04/2019 / OOH / Total hours at 51",
          value:
            "Job number P0000000129 Private appointment at £9 per hour from 26/04/2019 / OOH / Total hours at 51"
        },
        {
          label:
            "Job number P0000000090 Private appointment at £2 per hour from 26/04/2019 / PM / Total hours at 4",
          value:
            "Job number P0000000090 Private appointment at £2 per hour from 26/04/2019 / PM / Total hours at 4"
        },
        {
          label:
            "Job number P0000000095 Private appointment at £76 per hour from 26/04/2019 / Whole Day / Total hours at 27",
          value:
            "Job number P0000000095 Private appointment at £76 per hour from 26/04/2019 / Whole Day / Total hours at 27"
        }
      ];
    },
    invoice(value) {
      if (value) {
        this.rowData.push({ description: value, total: 5 });
      }
      this.invoice = null;
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
    save() {
      let invoiceForm = {};
      invoiceForm.practice_id = this.practice_id;
      invoiceForm.total_amount = this.amount;
      invoiceForm.invoices = this.rowData;
      invoiceForm.date_start = this.form.date_start;
      invoiceForm.date_end = this.form.date_end;
      this.$emit("add", invoiceForm);
    },
    archive() { },
    removeItem(index) {
      this.rowData.splice(index, 1);
    },
    addItem() {
      let my_object = {
        description: this.description,
        total: this.total
      };
      this.rowData.push(my_object);
      this.description = "";
      this.total = "";
    }
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
</style>
