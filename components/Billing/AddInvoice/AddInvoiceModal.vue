<template>
  <div
    class="absolute right-0 top-0 z-10 p-10 bg-grey-darkest"
    style="height:130%"
    :style="$store.state.mobile ? 'width:100%' : 'width:70%'"
  >
    <div class="flex flex-row flex-no-wrap justify-start">
      <div
        @click="$store.commit('TOGGLE_INVOICE_MODAL', false)"
        class="flex text-xl cursor-pointer text-yellow-300 items-center"
      >
        <span v-text="'<'"></span>
      </div>
      <button
        class="border border-solid border-yellow-400 bg-yellow-400 text-black font-bold p-2 rounded-lg mx-2 hover:text-yellow-300 hover:bg-grey-darkest"
        @click.prevent="save_changes"
      >Save changes</button>
      <button
        class="border border-solid border-yellow-400 bg-yellow-400 text-black font-bold p-2 rounded-lg mx-2 hover:text-yellow-300 hover:bg-grey-darkest"
        @click.prevent="archive_as_file"
      >Save and archive as file</button>
    </div>

    <div class="border-solid bg-white mt-10 mb-5 pt-20 px-5 pb-5" style="width:70%">
      <div class="flex justify-end mt-5 text-sm">Tel</div>
      <div class="flex justify-end mt-5 text-sm">UTR</div>

      <div class="flex justify-start mt-5">
        <div
          class="mb-4 border border-solid border-black px-5 pt-5 pb-8 rounded-lg"
          style="width:50%"
        >
          <label for="accounts_department" class="block text-sm mb-2">To: Accounts Department</label>
          <select name="accounts_department" id="accounts_department" class="w-full">
            <option value selected>Select the practice for this invoice</option>
            <option v-for="(item, index) in practiceLists" :key="index" :value="item">{{item}}</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end">
        <div class="mt-5">
          <div class="text-md font-bold">INVOICE</div>
          <div class="text-sm">Not yet issued</div>
        </div>
      </div>

      <div class="flex justify-start mt-20 text-sm">Select a job to add to this invoice</div>

      <div class="flex justify-start mt-5">
        <div
          class="bg-black text-sm text-center text-white font-bold"
          style="width:60%;font-family:Nunito"
        >Description</div>
        <div
          class="bg-black text-sm text-center text-white font-bold"
          style="width:35%;font-family:Nunito"
        >Total</div>
      </div>

      <transition-group name="list">
        <JobInvoiceForm
          v-for="(item) in form.jobs"
          :key="item.id"
          :id="item.id"
          :description="item.description"
          :total="item.total"
          @changeDescription="changeDescription"
          @changeTotal="changeTotal"
          @remove="remove"
        />
      </transition-group>

      <div class="flex justify-end mt-2">
        <div style="width:5%" class="px-1">
          <div
            class="rounded-full bg-black h-6 w-6 flex items-center justify-center text-white font-bold text-xl cursor-pointer"
            @click.prevent="add"
          >+</div>
        </div>
      </div>

      <div class="flex justify-start mt-5">
        <div class="mr-1" style="width:30%;">
          <div
            class="mb-4 border-b border-b-2 border-grey py-2"
            :class="{'border-yellow-400':setFocus === 'days_work_from'}"
          >
            <label for="days_work_from" class="block text-sm mb-2">Days worked from</label>
            <input
              @focus="setFocus = 'days_work_from'"
              @blur="setFocus = ''"
              v-model="form.from"
              type="date"
              name="days_work_from"
              id="days_work_from"
              class="appearance-none bg-transparent border-none w-full text-gray-500 mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
          </div>
        </div>
        <div cclass style="width:30%;">
          <div
            class="mb-4 border-b border-b-2 border-grey py-2"
            :class="{'border-yellow-400':setFocus === 'days_work_to'}"
          >
            <label for="days_work_to" class="block text-sm mb-2">To</label>
            <input
              @focus="setFocus = 'days_work_to'"
              @blur="setFocus = ''"
              v-model="form.to"
              type="date"
              name="days_work_to"
              id="days_work_to"
              class="appearance-none bg-transparent border-none w-full text-gray-500 mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-between mt-5">
        <div class="text-sm">Total</div>
        <div>£ {{total}}</div>
      </div>

      <div class="flex justify-start mt-32">
        <div class="border border-solid border-black rounded-lg p-2 text-sm" style="width:100%">
          <div>Payment by BACS:</div>
          <div>Account name:</div>
          <div>Bank:</div>
          <div>Sort code:</div>
          <div>Account number:</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const practiceLists = [
  'test1', 'test2'
]
import JobInvoiceForm from '@/components/Billing/AddInvoice/JobInvoiceForm'
import { all } from 'q';
export default {
  components: {
    JobInvoiceForm
  },
  data() {
    return {
      practiceLists,
      form: {
        accounts_department: '',
        jobs: [],
        days_work_from: null,
        days_work_to: null
      },
      setFocus: '',
      formError: [],
      id: 0
    }
  },
  computed: {
    total() {
      let allTotal = []
      this.form.jobs.forEach(item => allTotal.push(Number(item.total)))
      if (allTotal.length) {
        return allTotal.reduce((total, amount) => total + amount).toFixed(2)
      } else {
        return `0.00`
      }
    }
  },
  methods: {
    save_changes() {

    },
    archive_as_file() {

    },
    add() {
      this.form.jobs.push({ description: '', total: '', id: this.id++ })
    },
    changeDescription(value, id) {
      let item = this.form.jobs.find(job => job.id === id)
      item.description = value
    },
    changeTotal(value, id) {
      let item = this.form.jobs.find(job => job.id === id)
      item.total = value
    },
    remove(id) {
      let item = this.form.jobs.findIndex(job => job.id === id)
      this.form.jobs.splice(item, 1)
    }
  }
}
</script>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
}
</style>

