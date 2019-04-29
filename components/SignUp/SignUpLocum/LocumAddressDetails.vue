<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex mx-4" style="flex: 0 1 600px;">
        <h4>What's your address?</h4>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start mt-5">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <form class="w-full rounded-lg bg-grey-light px-8 pb-8">
          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label for="post_code" class="text-sm" style="width:50%">Post code</label>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div
                class="flex flex-col border-b-2 border-white"
                style="width:100%"
                :class="[setFocus === 'post_code' ? 'border-yellow':'', formError.find(item => item.field === 'post_code') ? 'border-red':'']"
              >
                <div class="relative">
                  <input
                    type="text"
                    ref="post_code"
                    class="focus:outline-none font-bold bg-grey-light text-sm w-full"
                    style="height:40px"
                    @focus="setFocus = 'post_code'"
                    @blur="setFocus = ''"
                    v-model="form.post_code"
                    placeholder="Enter a post code and select from list"
                  >

                  <div
                    class="bg-white shadow-lg overflow-auto absolute pin-x z-10"
                    v-if="showPredictions"
                    v-on-clickaway="hidePredictions"
                  >
                    <div
                      v-for="(item,index) in predictions"
                      :key="`${item}-${index}`"
                      class="p-2 cursor-pointer border-b-2 border-grey-light"
                      @mouseover="selectedPredictionIndex=index"
                      :class="selectedPredictionIndex === index ? 'bg-grey-lighter':''"
                    >
                      <div class="text-xs" @click="selectPrediction(item, index)">
                        <strong>{{item.main_text}}</strong>
                        <span class="text-grey-dark">{{item.secondary_text}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'post_code')"
            >{{formError.find(item => item.field === 'post_code').message}}</div>
          </div>

          <div
            class="relative flex flex-col mt-8 border-b-2 border-white"
            :class="[setFocus === 'address_line_1' ? 'border-yellow':'', formError.find(item => item.field === 'address_line_1') ? 'border-red':'']"
          >
            <label for="address_line_1" class="text-sm mb-4">Address line 1</label>
            <input
              type="text"
              ref="address_line_1"
              class="focus:outline-none font-bold bg-grey-light text-sm"
              style="height:40px"
              @focus="setFocus = 'address_line_1'"
              @blur="setFocus = ''"
              v-model="form.address_line_1"
              :disabled="disabledInput"
            >
            <span
              class="absolute pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'address_line_1')"
            >{{formError.find(item => item.field === 'address_line_1').message}}</span>
          </div>
          <div
            class="relative flex flex-col mt-8 border-b-2 border-white"
            :class="[setFocus === 'address_line_2' ? 'border-yellow':'', formError.find(item => item.field === 'address_line_2') ? 'border-red':'']"
          >
            <label for="address_line_2" class="text-sm mb-4">Address line 2 (optional)</label>
            <input
              type="text"
              ref="address_line_2"
              class="focus:outline-none font-bold bg-grey-light text-sm"
              style="height:40px"
              @focus="setFocus = 'address_line_2'"
              @blur="setFocus = ''"
              v-model="form.address_line_2"
              :disabled="disabledInput"
            >
            <span
              class="absolute pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'address_line_2')"
            >{{formError.find(item => item.field === 'address_line_2').message}}</span>
          </div>
          <div
            class="relative flex flex-col mt-8 border-b-2 border-white"
            :class="[setFocus === 'address_line_3' ? 'border-yellow':'', formError.find(item => item.field === 'address_line_3') ? 'border-red':'']"
          >
            <label for="address_line_3" class="text-sm mb-4">City / Town / District</label>
            <input
              type="text"
              ref="address_line_3"
              class="focus:outline-none font-bold bg-grey-light text-sm"
              style="height:40px"
              @focus="setFocus = 'address_line_3'"
              @blur="setFocus = ''"
              v-model="form.address_line_3"
              :disabled="disabledInput"
            >
            <span
              class="absolute pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'address_line_3')"
            >{{formError.find(item => item.field === 'address_line_3').message}}</span>
          </div>
        </form>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex justify-center" style="width:600px">
        <button
          class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none mx-1"
          @click.prevent="$store.commit('signUp/SET_ACTIVE_TAB', 'account_details')"
          v-text="'<<'"
        ></button>
        <button
          class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none"
          @click.prevent="next"
        >Next</button>
      </div>
    </div>
  </div>
</template>
<script>
import debounce from 'lodash.debounce'
import { mixin as clickaway } from 'vue-clickaway'
export default {
  mixins: [clickaway],
  data() {
    return {
      showPredictions: false,
      predictions: [],
      selectedPredictionIndex: 0,
      form: {
        post_code: '',
        address_line_1: '',
        address_line_2: '',
        address_line_3: ''
      },
      formError: [],
      setFocus: ''
    }
  },
  computed: {
    addressDetails() {
      return this.$store.state.signUp.address_details
    },
    disabledInput() {
      return !this.form.post_code
    }
  },
  watch: {
    'form.post_code'(value) {
      this.getPredictions(value)
    }
  },
  mounted() {
    this.form.post_code = this.addressDetails.post_code
    this.form.address_line_1 = this.addressDetails.address_line_1
    this.form.address_line_2 = this.addressDetails.address_line_2
    this.form.address_line_3 = this.addressDetails.address_line_3

    // this.autocomplete = new google.maps.places.Autocomplete((this.$refs.post_code))
  },
  methods: {
    getPredictions: debounce(function (input) {
      // if (!input) {
      //   this.showPredictions = false
      //   return
      // }
      let results = []
      const params = {
        input: input
      }
      this.$axios
        .$get(`/api/v1/predictions`, { params })
        .then(res => {
          console.log(res)
          res.predictions.forEach(item => {
            let postal_code = item.details.result.address_components.find(item => item.types.includes('postal_code'))
              ? item.details.result.address_components.find(item => item.types.includes('postal_code')).long_name : ''
            let route = item.details.result.address_components.find(item => item.types.includes('route'))
              ? item.details.result.address_components.find(item => item.types.includes('route')).long_name : ''
            let postal_town = item.details.result.address_components.find(item => item.types.includes('postal_town'))
              ? item.details.result.address_components.find(item => item.types.includes('postal_town')).long_name : ''
            results.push({
              main_text: item.structured_formatting.main_text, secondary_text: item.structured_formatting.secondary_text,
              post_code: postal_code, line_1: route, line_2: '', line_3: postal_town
            })
            this.predictions = results
          })
          results.length > 0 ? this.showPredictions = true : this.showPredictions = false
        })
    }, 250),
    onFocus() {
      this.setFocus = 'post_code'
      // this.predictions.length > 0 && this.form.post_code ? this.showPredictions = true : this.showPredictions = false
    },
    onBlur() {
      this.setFocus = ''
      // this.showPredictions = false
    },
    selectPrediction(item, index) {
      this.form.post_code = item.post_code
      this.form.address_line_1 = item.line_1
      this.form.address_line_2 = item.line_2
      this.form.address_line_3 = item.line_3
      this.setFocus = ''
      this.showPredictions = false
    },
    hidePredictions() {
      if (!this.form.post_code) {
        this.setFocus = ''
        this.showPredictions = false
      }
    },
    next() {
      try {
        this.formError = []
        this.Validate(this.form, ['address_line_2'])
        if (!this.formError.length) {
          // alert('Waiting for API')
          this.$store.commit('signUp/SET_ADDRESS_DETAILS', this.form)
          this.$store.commit('signUp/SET_ACTIVE_TAB', 'professional_details')
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style scoped>
button:active {
  transform: translate(5px, 5px);
}
</style>
