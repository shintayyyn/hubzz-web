<template>
  <div class="flex justify-start mt-5">
    <div style="width:60%" class="px-1">
      <textarea
        v-model="form.description"
        name="description"
        id="description"
        rows="3"
        style="width:100%;"
        class="border border-solid border-gray-400"
      ></textarea>
    </div>
    <div style="width:35%" class="px-1">
      <input
        type="text"
        v-model="form.total"
        class="border border-solid border-gray-400"
        style="width:100%"
      />
    </div>
    <div style="width:5%" class="px-1">
      <div
        class="rounded-full bg-black h-6 w-6 flex items-center justify-center text-white font-bold text-xl cursor-pointer"
        @click.prevent="$emit('remove', id)"
      >-</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['id', 'description', 'total'],
  data() {
    return {
      form: {
        description: '',
        total: ''
      }
    }
  },
  mounted() {
    this.form.description = this.description
    this.form.total = this.total
  },
  watch: {
    'form.description'(value) {
      this.$emit('changeDescription', value, this.id)
    },
    'form.total'(value) {
      this.$emit('changeTotal', value, this.id)
    }
  },

}
</script>
