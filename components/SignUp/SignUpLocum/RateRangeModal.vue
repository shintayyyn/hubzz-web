<template>
  <div
    class="z-20 bg-white w-1/2 lg:w-1/3 rounded-lg shadow-lg p-5 absolute"
    style="left:35%;bottom:50%;"
  >
    <div class="flex flex-col">
      <div class="flex flex-row justify-end">
        <div class="font-bold text-lg cursor-pointer" @click="$emit('close')">X</div>
      </div>
      <form class="w-full">
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              for="min"
            >Min</label>
            <input
              class="text-right appearance-none block w-full bg-grey-lighter text-grey-darker border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              :class="formError.find(item => item.field === 'min') ? 'border-red' : ''"
              type="text"
              v-model="form.min"
            >
            <em
              v-if="formError.find(item => item.field === 'min')"
              class="text-xs lg:text-sm text-red"
            >{{formError.find(item => item.field === 'min').message}}</em>
          </div>
          <div class="w-full md:w-1/2 px-3">
            <label
              class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              for="max"
            >Max</label>
            <input
              class="text-right appearance-none block w-full bg-grey-lighter text-grey-darker border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey"
              :class="formError.find(item => item.field === 'max') ? 'border-red' : ''"
              type="text"
              v-model="form.max"
            >
            <em
              v-if="formError.find(item => item.field === 'max')"
              class="text-xs lg:text-sm text-red"
            >{{formError.find(item => item.field === 'max').message}}</em>
          </div>
        </div>
        <div class="flex justify-end">
          <button
            class="text:xs lg:text-base font-bold rounded-lg bg-yellow focus:outline-none hover:text-white py-4 px-2"
            @click.prevent="confirm"
          >Confirm</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      min: Number,
      max: Number
    }
  },
  data() {
    return {
      form: {
        min: 0,
        max: 0
      },
      formError: []
    }
  },
  created() {
    this.form.min = this.data.min
    this.form.max = this.data.max
  },
  methods: {
    confirm() {
      this.formError = []
      this.Validate(this.form)
      if (parseInt(this.form.max) < parseInt(this.form.min)) {
        this.formError.push(
          { field: 'max', message: 'Maximum amount should not be less than the amount of Minimum', validation: 'invalid' }
        )
      }
      if (!this.formError.length) {
        this.$emit('save', this.form)
      }
    },
    // numberWithCommas(value) {
    //   return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // }
  }
}
</script>
