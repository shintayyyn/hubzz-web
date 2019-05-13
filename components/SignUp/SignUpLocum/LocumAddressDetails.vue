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
          <!-- <div class="relative flex flex-col mt-8">
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
          </div>-->
          <div class="relative flex flex-col mt-8">
            <label for="post_code" class="text-xs lg:text-base mb-4">Post code</label>
            <input
              type="text"
              ref="post_code"
              class="py-2 font-bold text-xs lg:text-base bg-grey-light border-b-2 border-white focus:outline-none focus:border-yellow"
              :class="formError.find(item => item.field === 'post_code') ? 'border-red':''"
              @focus="''"
              @blur="ValidateText(form.post_code, 'post_code')"
              v-model="form.post_code"
              placeholder="Enter a post code and select from list"
            >
            <span
              class="absolute pin-r bg-red text-white p-1 text-xs lg:text-base"
              v-if="formError.find(item => item.field === 'post_code')"
            >{{formError.find(item => item.field === 'post_code').message}}</span>
          </div>
          <div class="relative flex flex-col mt-8">
            <label for="address_line_1" class="text-xs lg:text-base mb-4">Address line 1</label>
            <input
              type="text"
              ref="address_line_1"
              class="py-2 font-bold text-xs lg:text-base bg-grey-light border-b-2 border-white focus:outline-none focus:border-yellow"
              :class="formError.find(item => item.field === 'address_line_1') ? 'border-red':''"
              @focus="''"
              @blur="ValidateText(form.address_line_1, 'address_line_1')"
              v-model="form.address_line_1"
              placeholder="Enter a post code and select from list"
            >
            <span
              class="absolute pin-r bg-red text-white p-1 text-xs lg:text-base"
              v-if="formError.find(item => item.field === 'address_line_1')"
            >{{formError.find(item => item.field === 'address_line_1').message}}</span>
          </div>
          <div class="relative flex flex-col mt-8">
            <label for="address_line_2" class="text-xs lg:text-base mb-4">Address line 2</label>
            <input
              type="text"
              ref="address_line_2"
              class="py-2 font-bold text-xs lg:text-base bg-grey-light border-b-2 border-white focus:outline-none focus:border-yellow"
              :class="formError.find(item => item.field === 'address_line_2') ? 'border-red':''"
              @focus="''"
              @blur="''"
              v-model="form.address_line_2"
              placeholder="Enter a post code and select from list"
            >
            <span
              class="absolute pin-r bg-red text-white p-1 text-xs lg:text-base"
              v-if="formError.find(item => item.field === 'address_line_2')"
            >{{formError.find(item => item.field === 'address_line_2').message}}</span>
          </div>
          <div class="relative flex flex-col mt-8">
            <label for="address_line_3" class="text-xs lg:text-base mb-4">City / Town / District</label>
            <input
              type="text"
              ref="address_line_3"
              class="py-2 font-bold text-xs lg:text-base bg-grey-light border-b-2 border-white focus:outline-none focus:border-yellow"
              :class="formError.find(item => item.field === 'address_line_3') ? 'border-red':''"
              @focus="''"
              @blur="ValidateText(form.address_line_3, 'address_line_3')"
              v-model="form.address_line_3"
              placeholder="Enter a post code and select from list"
            >
            <span
              class="absolute pin-r bg-red text-white p-1 text-xs lg:text-base"
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
  scrollToTop: true,
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
    addressFormError() {
      return this.$store.state.signUp.address_detail_form_error
    }
  },
  mounted() {
    this.form.post_code = this.addressDetails.post_code
    this.form.address_line_1 = this.addressDetails.address_line_1
    this.form.address_line_2 = this.addressDetails.address_line_2
    this.form.address_line_3 = this.addressDetails.address_line_3

    if (this.addressFormError.length > 0) {
      this.addressFormError.forEach(item => {
        if (item.field === 'post_code' && item.validation === 'ENGINE_EXCEPTION') {
          this.formError.push(
            { field: 'post_code', message: 'Invalid Post code', validation: 'ENGINE_EXCEPTION' }
          )
        } else {
          this.formError.push(item)
        }
      })
    }

    // this.autocomplete = new google.maps.places.Autocomplete((this.$refs.post_code))
  },
  methods: {
    getPredictions: debounce(function (input) {
      if (!input) {
        this.showPredictions = false
        return
      }
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
    next() {
      try {
        this.formError = []
        this.Validate(this.form, ['address_line_2'])
        if (!this.formError.length) {
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
