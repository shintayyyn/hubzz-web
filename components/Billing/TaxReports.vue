<template>
    <div class="flex flex-row flex-wrap justify-start">
        <div style="width:70%" class="p-2" id="printArea">
            <p class="text-sm">You have not yet completed your billing information.</p>
            <div class="mt-5 ml-2">
                <button class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg"
                    @click.prevent="$store.commit('billing/setActiveTab', 'invoicingDetails')">
                    Go to Invoicing details
                </button>
            </div>
        </div>
        <div style="width:30%" class="p-2">
            <div class="border-solid rounded-lg shadow-lg p-8">
                <label for="year_end" class="block text-sm mb-2">Tax year end</label>
                <select name="year_end" id="year_end"
                    class="p-2 font-semibold w-full" v-model="form.year_end">
                    <option v-for="(item, index) in year_end" :key="index" :value="item">{{item}}</option>
                </select>
            </div>
            <div class="mt-5">
                <span class="rounded-lg bg-yellow-dark font-bold p-2 shadow-md hover:text-white cursor-pointer" @click="print('printArea')">print</span>
            </div>
        </div>
    </div>
</template>
<script>
const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]
export default {
    data () {
        return {
            months,
            year_end: [],
            form: {
                year_end: ''
            }
        }
    },
    created () {
        for (let i=0;i<3;i++) {
            this.year_end.push(`${new Date().getDate()} ${this.months[new Date().getMonth()]}, ${new Date().getFullYear()-i}`)
        }
        this.form.year_end = this.year_end[0]
    },
    methods: {
        print (printArea) {
            let printAreaContent = document.getElementById(printArea).innerHTML
            let originalContent = document.body.innerHTML
            document.body.innerHTML = printAreaContent
            window.print()
            document.body.innerHTML = originalContent
        }
    }
}
</script>
