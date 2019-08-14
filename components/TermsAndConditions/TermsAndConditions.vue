<template>
  <div class="rounded-lg shadow-lg pt-10 px-5 pb-5 font-bold text-sm">
    <div
      class="mb-4 border-b border-b-2 border-gray-400 py-2"
      :class="{'border-yellow-500':setFocus}"
    >
      <textarea
        rows="30"
        name="terms_and_conditions"
        id="terms_and_conditions"
        @focus="setFocus = true"
        @blur="setFocus = false"
        v-html="form.terms_and_conditions"
        v-model="form.terms_and_conditions"
        class="appearance-none bg-transparent border-none w-full px-2 leading-tight font-bold focus:outline-none"
        style="font-family:Nunito"
      ></textarea>
    </div>
  </div>
</template>
<script>
export default {
  props: ['terms'],
  data() {
    return {
      form: {
        terms_and_conditions: ''
      },
      setFocus: false
    }
  },
  created() {
    this.form.terms_and_conditions = this.terms.terms_and_conditions
  }
}
</script>
<style scoped>
textarea {
  resize: none;
}
</style>


