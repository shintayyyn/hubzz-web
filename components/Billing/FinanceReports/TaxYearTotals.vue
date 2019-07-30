<template>
    <div class="flex flex-col-reverse md:flex-row justify-start">
        <div class="w-full md:w-2/3 p-2">
            <p class="text-sm">No invoice has been raised for this tax year</p>
        </div>
        <div class="w-full md:w-1/3 p-2">
            <div class="border-solid rounded-lg shadow-lg p-6 md:p-10">
                <label for="year_end" class="block text-sm mb-2">Tax year end</label>
                <select name="year_end" id="year_end"
                    class="p-2 font-semibold w-full" v-model="form.year_end">
                    <option v-for="(item, index) in year_end" :key="index" :value="item">{{item}}</option>
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
    }
}
</script>
