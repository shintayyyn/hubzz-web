<template>
  <section class="bg-white">
    <div class="p-8 max-w-xl h-screen">
      <div class="flex flex-row flex-wrap justify-start">
        <div @click="$emit('close')" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" width="32" />
        </div>
        <div
          class="save-button text-xs sm:text-sm mx-2 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
          @click="save"
        >Save changes</div>
        <div
          class="save-button text-xs sm:text-sm mx-2 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
          @click="archive"
        >Save and archive as final</div>
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
            <div class="text-xs sm:text-sm text-left rounded-lg border-2 border-black p-2 sm:w-1/2">
              <AppSelect
                v-model="practice_id"
                :name="'profession_id'"
                :label="'To: Accounts Department'"
                :placeholder="'Select the practice for this invoice'"
                :items="practices"
              />
              <div class="text-xs sm:text-sm" v-if="practice_id">
                <div>{{address.line_1}}</div>
                <div>{{address.line_2}}</div>
                <div>{{address.line_3}}</div>
                <div>{{address.post_code}}</div>
              </div>
            </div>
            <div class="text-right leading-normal">
              <div class="font-bold text-sm sm:text-lg">INVOICE</div>
              <div class="text-xs sm:text-sm">Not yet issued</div>
            </div>
          </div>
          <div v-if="practice_id">
            <AppSelect
              v-model="invoice"
              :name="'description'"
              :label="'Select a job to add to this invoice'"
              :placeholder="'Select...'"
              :items="jobs"
            />
          </div>
        </div>

        <div class="my-4 text-xs sm:text-sm">Select a job to add to this invoice</div>
        <table class="w-full">
          <thead>
            <tr class="text-center bg-grey-darkest">
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
                  class="w-full text-xs sm:text-sm p-2 border border-black"
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
                  class="cursor-pointer m-1 rounded-full bg-grey-darkest text-white font-semibold text-xl px-2"
                  @click="addItem"
                >+</span>
              </td>
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
</template>
<script>
import AppDate from "@/components/Base/AppDate";
import AppSelect from "@/components/Base/AppSelect";
export default {
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
  watch: {
    practice_id(value) {
      if (value) {
        this.getPracticeDetail(value);
      }
    },
    invoice(value) {
      if (value) {
        this.rowData.push({ description: value, total: 5 });
      }
      this.invoice = null;
    }
  },
  methods: {
    getPracticeDetail(id) {
      this.$axios.$get(`/api/v1/locum/private-practices/${id}`).then(res => {
        this.address = res.data.private_practice.surgery.address;
        this.getPracticeJobs(res.data.private_practice.id);
      });
    },
    getPracticeJobs(id) {
      // ! ask arvi get all the jobs based on practice
      // sample
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
};
</script>

<style scoped>
textarea {
  resize: none;
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

