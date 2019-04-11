<template>
  <div>
    <PracticeSelectForm v-if="step === 1" @nextStep="nextStep"/>
    <PracticeInputForm v-if="step === 2" @backStep="step = 1" @submitForm="submitForm"/>
  </div>
</template>
<script>
import PracticeSelectForm from '@/components/Practice/PracticeSelectForm'
import PracticeInputForm from '@/components/Practice/PracticeInputForm'
export default {
  components: {
    PracticeSelectForm,
    PracticeInputForm
  },
  data () {
    return {
      step: 1,
      selectedPractice: ''
    }
  },
  watch: {
    step(value) {
      this.$emit('signUpProgress', value)
    }
  },
  methods: {
    nextStep(id) {
      this.selectedPractice = id
      this.step = 2
    },
    submitForm(form) {
      console.log(form)
      // if success thru api
      this.$emit('success')
    }
  }
}
</script>
