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
          <div class="flex flex-col py-2 mb-6 mt-4">
            <div class="flex flex-row flex-nowrap justify-between">
              <label for="post_code" class="text-xs sm:text-sm py-1">Post code</label>
              <div
                class="bg-red p-1 text-xs sm:text-base text-white"
                v-if="formError.find(item => item.field === 'post_code')"
              >{{formError.find(item => item.field === 'post_code').message}}</div>
            </div>
            <div class="flex flex-row justify-start mt-1">
              <input
                v-model="form.post_code"
                type="text"
                placeholder="Enter a post code and select from list"
                class="bg-grey-light border-b-2 border-white focus:border-yellow focus:outline-none py-4 font-bold text-xs sm:text-sm w-full"
                :class="formError.find(item => item.field === 'post_code') ? 'border-red':''"
                @focus="setFocus = true"
                @input="input($event.target.value)"
              >
              <!-- @keydown="postCodeKeyDownHandler" -->
            </div>
            <!-- fix css -->
            <div class="bg-white shadow-lg" v-if="showLists">
              <div
                class="border-b-2 border-grey text-xs sm:text-sm cursor-pointer"
                :class="postCodeIndex === index ? 'bg-grey-lighter':''"
                @mouseover="postCodeIndex=index"
                v-for="(item, index) in predictions"
                :key="index"
              >
                <div class="p-2" @click="select(item)">
                  <!-- ! location svg -->
                  <!-- <svgicon name="location" height="10" width="10"/> -->
                  <span class="font-bold">{{item.main_text}}</span>,
                  <span class="text-grey-dark">{{item.secondary_text}}</span>
                </div>
              </div>
            </div>
          </div>

          <AppInput
            v-model="form.address_line_1"
            :type="'text'"
            :name="'address_line_1'"
            :label="'Address line 1'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'address_line_1')"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />

          <AppInput
            v-model="form.address_line_2"
            :type="'text'"
            :name="'address_line_2'"
            :label="'Address line 2 (optional)'"
            :placeholder="''"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />

          <AppInput
            v-model="form.address_line_3"
            :type="'text'"
            :name="'address_line_3'"
            :label="'City / Town / District'"
            :placeholder="''"
            :inStyle="'background-color:#dae1e7;border-color:white'"
          />
        </form>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex justify-between" style="width:180px">
        <AppButton
          :label="'<<'"
          @click="$store.commit('signUp/SET_ACTIVE_TAB', 'account_details')"
        />
        <AppButton :label="'Next'" @click="next"/>
      </div>
    </div>
  </div>
</template>
<script>
import debounce from 'lodash.debounce'
import AppInput from '@/components/Base/AppInput'
import AppButton from '@/components/Base/AppButton'
// import { mixin as clickaway } from 'vue-clickaway'
export default {
  // mixins: [clickaway],
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      predictions: [],
      postCodeIndex: -1,
      form: {
        post_code: '',
        address_line_1: '',
        address_line_2: '',
        address_line_3: ''
      },
      setFocus: false,
      formError: []
    }
  },
  computed: {
    addressDetails() {
      return this.$store.state.signUp.address_details
    },
    addressFormError() {
      return this.$store.state.signUp.address_detail_form_error
    },
    showLists() {
      if (this.predictions.length > 0 && this.setFocus && this.form.post_code.length > 0) {
        return true
      }
    }
  },
  mounted() {
    this.form.post_code = this.addressDetails.post_code
    this.form.address_line_1 = this.addressDetails.address_line_1
    this.form.address_line_2 = this.addressDetails.address_line_2
    this.form.address_line_3 = this.addressDetails.address_line_3

    if (this.addressFormError.length > 0) {
      this.addressFormError.forEach(item => {
        // if (item.field === 'post_code' && item.validation === 'ENGINE_EXCEPTION') {
        //   this.formError.push(
        //     { field: 'post_code', message: 'Invalid Post code', validation: 'ENGINE_EXCEPTION' }
        //   )
        // } else {
        this.formError.push(item)
        // }
      })
    }

    // this.autocomplete = new google.maps.places.Autocomplete((this.$refs.post_code))
  },
  watch: {
    'form.address_line_1'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'address_line_1')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'address_line_1', message: 'Required' })
      }
    },
    'form.address_line_3'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'address_line_3')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'address_line_3', message: 'Required' })
      }
    },
    // postCodeIndex(value) {
    //   if (value >= 0 && value <= this.predictions.length - 1) {
    //     console.log(this.predictions)
    //     this.form.post_code = `${this.predictions[value].main_text}, ${this.predictions[value].secondary_text}`
    //   }
    // }
  },
  methods: {
    // when input, find predictions
    input(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'post_code')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'post_code', message: 'Required' })
      } else {
        // validate options
        this.getPredictions(value)
      }
    },
    // postCodeKeyDownHandler(event) {
    //   if (!this.setFocus) {
    //     return
    //   } else {
    //     if (event.key === 'ArrowUp') {
    //       if (this.postCodeIndex < 0) {
    //         this.postCodeIndex = this.predictions.length - 1
    //       } else if (this.postCodeIndex === 0) {
    //         this.postCodeIndex = -1
    //       } else {
    //         this.postCodeIndex--
    //       }
    //     }
    //     if (event.key === 'ArrowDown') {
    //       if (this.postCodeIndex < 0) {
    //         this.postCodeIndex = 0
    //       } else if (this.postCodeIndex === this.predictions.length - 1) {
    //         this.postCodeIndex = -1
    //       } else {
    //         this.postCodeIndex++
    //       }
    //     }
    //   }
    // },
    getPredictions: debounce(function (input) {
      let results = []
      const params = {
        input: input
      }
      this.$axios
        .$get(`/api/v1/predictions`, { params })
        .then(res => {
          res.predictions.forEach(item => {
            let postal_code = item.details.result.address_components.find(item => item.types.includes('postal_code'))
              ? item.details.result.address_components.find(item => item.types.includes('postal_code')).long_name : ''
            let route = item.details.result.address_components.find(item => item.types.includes('route'))
              ? item.details.result.address_components.find(item => item.types.includes('route')).long_name : ''
            let postal_town = item.details.result.address_components.find(item => item.types.includes('postal_town'))
              ? item.details.result.address_components.find(item => item.types.includes('postal_town')).long_name : ''
            results.push({
              main_text: item.structured_formatting.main_text, secondary_text: item.structured_formatting.secondary_text,
              post_code: postal_code, address_line_1: route, address_line_2: '', address_line_3: postal_town
            })
          })
          this.predictions = results
        })
    }, 250),
    select(item) {
      this.form.post_code = item.post_code
      this.form.address_line_1 = item.address_line_1
      this.form.address_line_2 = item.address_line_2
      this.form.address_line_3 = item.address_line_3
      this.setFocus = false
    },
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
</style>
