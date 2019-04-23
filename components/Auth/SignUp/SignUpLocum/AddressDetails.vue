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
                <div class="relative flex flex-col mt-8 border-b-2 border-white"
                  :class="[setFocus === 'post_code' ? 'border-yellow':'', formError.find(item => item.field === 'post_code') ? 'border-red':'']">
                  <label for="post_code" class="text-sm mb-4">Post code</label>
                  <input type="text" name="post_code" ref="post_code" id="post_code" class="focus:outline-none font-bold bg-grey-light text-sm" style="height:40px"
                      @focus="setFocus = 'post_code'" @blur="setFocus = ''" v-model="form.post_code" @change="onChange"
                      placeholder="Enter a post code and select from list">
                  <span class="absolute pin-r bg-red text-white p-1" v-if="formError.find(item => item.field === 'post_code')">
                      {{formError.find(item => item.field === 'post_code').message}}
                  </span>
                </div>
                <div class="relative flex flex-col mt-8 border-b-2 border-white"
                  :class="[setFocus === 'address_line_1' ? 'border-yellow':'', formError.find(item => item.field === 'address_line_1') ? 'border-red':'']">
                  <label for="address_line_1" class="text-sm mb-4">Address line 1</label>
                  <input type="text" name="address_line_1" ref="address_line_1" id="address_line_1" class="focus:outline-none font-bold bg-grey-light text-sm"
                      style="height:40px" @focus="setFocus = 'address_line_1'" @blur="setFocus = ''" v-model="form.address_line_1"
                      :disabled="disabledInput">
                  <span class="absolute pin-r bg-red text-white p-1" v-if="formError.find(item => item.field === 'address_line_1')">
                      {{formError.find(item => item.field === 'address_line_1').message}}
                  </span>
                </div>
                <div class="relative flex flex-col mt-8 border-b-2 border-white"
                  :class="[setFocus === 'address_line_2' ? 'border-yellow':'', formError.find(item => item.field === 'address_line_2') ? 'border-red':'']">
                  <label for="address_line_2" class="text-sm mb-4">Address line 2 (optional)</label>
                  <input type="text" name="address_line_2" ref="address_line_2" id="address_line_2" class="focus:outline-none font-bold bg-grey-light text-sm"
                      style="height:40px" @focus="setFocus = 'address_line_2'" @blur="setFocus = ''" v-model="form.address_line_2"
                      :disabled="disabledInput">
                  <span class="absolute pin-r bg-red text-white p-1" v-if="formError.find(item => item.field === 'address_line_2')">
                      {{formError.find(item => item.field === 'address_line_2').message}}
                  </span>
                </div>
                <div class="relative flex flex-col mt-8 border-b-2 border-white"
                  :class="[setFocus === 'city' ? 'border-yellow':'', formError.find(item => item.field === 'city') ? 'border-red':'']">
                  <label for="city" class="text-sm mb-4">City / Town / District</label>
                  <input type="text" name="city" ref="city" id="city" class="focus:outline-none font-bold bg-grey-light text-sm" style="height:40px"
                      @focus="setFocus = 'city'" @blur="setFocus = ''" v-model="form.city"
                      :disabled="disabledInput">
                  <span class="absolute pin-r bg-red text-white p-1" v-if="formError.find(item => item.field === 'city')">
                      {{formError.find(item => item.field === 'city').message}}
                  </span>
                </div>
                
              </form>
            
          </div>
        </div>

        <div class="flex w-full justify-center xl:justify-start">
          <div class="flex justify-center" style="width:600px">
            <button class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none mx-1" @click.prevent="$store.commit('signUp/SET_ACTIVE_TAB', 'account_details')" v-text="'<<'"></button>
            <button class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none" @click.prevent="next">Next</button>
          </div>
        </div>

      </div>
</template>
<script>
export default {
    data () {
      return {
        form: {
          post_code: '',
          address_line_1: '',
          address_line_2: '',
          city: ''
        },
        formError: [],
        setFocus: ''
      }
    },
    computed: {
      addressDetails () {
        return this.$store.state.signUp.address_details
      },
      disabledInput () {
        return !this.form.post_code
      }
    },
    mounted () {
      this.form.post_code = this.addressDetails.post_code
      this.form.address_line_1 = this.addressDetails.address_line_1
      this.form.address_line_2 = this.addressDetails.address_line_2
      this.form.city = this.addressDetails.city

      this.autocomplete = new google.maps.places.Autocomplete((this.$refs.post_code))
    },
    methods: {
      onChange (value) {
        this.autocomplete.addListener('place_changed', () => {
          let place = this.autocomplete.getPlace();
          // ! ask arvi
          this.form.post_code = place.name.split(',')[0]
          this.form.address_line_1 = place.name.split(',')[1]
          this.form.city = place.name.split(',')[2]
        })
      },
      next () {
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
  transform: translate(5px, 5px)
}
</style>
