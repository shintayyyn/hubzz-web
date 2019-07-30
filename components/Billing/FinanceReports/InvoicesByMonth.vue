<template>
    <div class="flex flex-col-reverse md:flex-row justify-start">
        <div class="w-full md:w-2/3 p-2">
            <p class="text-sm">No invoice has been raised fo this month</p>
        </div>
        <div class="w-full md:w-1/3 p-2">
            <div class="border-solid rounded-lg shadow-lg p-6 md:p-10">
                <label for="month" class="block mb-2 text-sm">Month</label>
                <select name="month" id="month"
                    class="p-2 font-semibold w-full" v-model="form.month">
                    <option v-for="(month, index) in yearMonths" :key="index" :value="month">{{month}}</option>
                </select>
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
            yearMonths: [],
            form: {
                month: '',
                year: new Date().getFullYear()
            }
        }
    },
    created () {
        // get last year months
        this.months.forEach((month, index) => {
            if (index > new Date().getMonth()) {
                this.yearMonths.push(`${new Date().getFullYear()-1} ${month}`)
            } 
        })
        // get current year months
        this.months.forEach((month, index) => {
            if (index <= new Date().getMonth()) {
                this.yearMonths.push(`${new Date().getFullYear()} ${month}`)
            }
        })

        this.form.month = this.yearMonths[this.yearMonths.length-1]
    }
}
</script>

