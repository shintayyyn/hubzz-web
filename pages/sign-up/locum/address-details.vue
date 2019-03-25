<template>
  <div class="h-full w-full flex flex-col overflow-auto">


    <div class="flex flex-col items-center justify-center w-full">

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex mx-4" style="flex: 0 1 600px;">
          <h3>What's your address?</h3>
        </div>
      </div>

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">

          <div class="flex flex-col p-6 rounded-lg" style="background-color: #E6E6E6;">
            <div class="flex flex-col">
              <div class="relative">
                <label class="text-xs">Post code *</label>
                <span class="text-xs absolute pin-r pin-b bg-red p-1 text-white" v-if="showPostCodeRequired && !showPostCodeFocus">Required</span>
              </div>
              <div class="relative" v-on-clickaway="hidePredictions">
                <input class="w-full bg-transparent outline-none py-1 mt-1 mb-8 border-b" :class="showPostCodeFocus ? 'border-yellow-dark' : showPostCodeRequired ? 'border-red' : 'border-grey-dark'" v-model="postCode" @focus="showPostCodeFocus = true" @click="showPredictions = !showPredictions" @blur="showPostCodeFocus = false, checkPostCode()" placeholder="Enter a post code and select from list">
                <div class="bg-white absolute pin-l pin-r z-10 border rounded-lg" style="top: 32px;" v-if="showPredictions">
                  <div v-for="(prediction, index) in predictions" class="p-2 hover:bg-grey-light cursor-pointer" :class="index !== predictions.length ? 'border-b' : ''" @click="selectPrediction(prediction)">
                    <strong class="">{{ prediction.structured_formatting.main_text }}</strong>
                    <span class="text-xs">{{ prediction.structured_formatting.secondary_text }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="relative">
              <label class="text-xs">Address line 1 *</label>
              <span class="text-xs absolute pin-r pin-b bg-red p-1 text-white" v-if="showAddressLine1Required && !showAddressLine1Focus">Required</span>
            </div>
            <input class="bg-transparent outline-none py-1 mt-1 mb-8 border-b" :class="showAddressLine1Focus ? 'border-yellow-dark' : showAddressLine1Required ? 'border-red' : 'border-grey-dark'" v-model="addressLine1" @focus="showAddressLine1Focus = true" @blur="showAddressLine1Focus = false, checkAddressLine1()">

            <label class="text-xs">Address line 2 (optional)</label>
            <input class="bg-transparent outline-none py-1 mt-1 mb-8 border-b" :class="showAddressLine2Focus ? 'border-yellow-dark' : false ? 'border-red' : 'border-grey-dark'" v-model="addressLine2" @focus="showAddressLine2Focus = true" @blur="showAddressLine2Focus = false">

            <div class="relative">
              <label class="text-xs">City / Town / District *</label>
              <span class="text-xs absolute pin-r pin-b bg-red p-1 text-white" v-if="showAddressLine3Required && !showAddressLine3Focus">Required</span>
            </div>
            <input class="bg-transparent outline-none py-1 mt-1 mb-8 border-b" :class="showAddressLine3Focus ? 'border-yellow-dark' : showAddressLine3Required ? 'border-red' : 'border-grey-dark'" v-model="addressLine3" @focus="showAddressLine3Focus = true" @blur="showAddressLine3Focus = false, checkAddressLine3()">
          </div>

        </div>
      </div>

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex justify-center" style="flex: 0 1 600px;">
          <nuxt-link class="inline-flex border rounded-lg text-black no-underline p-4 my-2" style="background-color: #FFDA3A;" to="/sign-up/locum/account-details">< <</nuxt-link>
          <nuxt-link class="inline-flex border rounded-lg text-black no-underline p-4 my-2" style="background-color: #FFDA3A;" to="/sign-up/locum/professional-details" @click.native="$store.dispatch('sign-up/locum/addressDetailsNext')">Next</nuxt-link>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  import { mixin as clickaway } from 'vue-clickaway'

  export default {
    layout: 'index',

    mixins: [ clickaway ],

    async asyncData({ store, redirect }) {
      try {
        console.log('asyncData pages sign-up locum address-details')

        if (!store.getters['sign-up/locum/isAccountDetailsValid']) {
          redirect('/sign-up/locum/account-details')

          return
        }
      } catch (err) {
        console.log('asyncData pages sign-up locum address-details err', err)      }
    },

    data() {
      return {
        settingPostCode: false,
        predictions: [],
        showPredictions: false,

        showPostCodeFocus: false,
        showAddressLine1Focus: false,
        showAddressLine2Focus: false,
        showAddressLine3Focus: false
      }
    },

    computed: {
      postCode: {
        get() {
          return this.$store.getters['sign-up/locum/getPostCode']
        },
        set(postCode) {
          this.$store.commit('sign-up/locum/setPostCode', postCode)
        }
      },
      addressLine1: {
        get() {
          return this.$store.getters['sign-up/locum/getAddressLine1']
        },
        set(addressLine1) {
          this.$store.commit('sign-up/locum/setAddressLine1', addressLine1)
        }
      },
      addressLine2: {
        get() {
          return this.$store.getters['sign-up/locum/getAddressLine2']
        },
        set(addressLine2) {
          this.$store.commit('sign-up/locum/setAddressLine2', addressLine2)
        }
      },
      addressLine3: {
        get() {
          return this.$store.getters['sign-up/locum/getAddressLine3']
        },
        set(addressLine3) {
          this.$store.commit('sign-up/locum/setAddressLine3', addressLine3)
        }
      },

      accountDetailsValid() {
        return this.$store.getters['sign-up/locum/isAccountDetailsValid']
      },


      showPostCodeRequired: {
        get() {
          return this.$store.getters['sign-up/locum/isShowPostCodeRequired']
        },
        set(showPostCodeRequired) {
          this.$store.commit('sign-up/locum/setShowPostCodeRequired', showPostCodeRequired)
        }
      },
      showAddressLine1Required: {
        get() {
          return this.$store.getters['sign-up/locum/isShowAddressLine1Required']
        },
        set(showAddressLine1Required) {
          this.$store.commit('sign-up/locum/setShowAddressLine1Required', showAddressLine1Required)
        }
      },
      showAddressLine3Required: {
        get() {
          return this.$store.getters['sign-up/locum/isShowAddressLine3Required']
        },
        set(showAddressLine3Required) {
          this.$store.commit('sign-up/locum/setShowAddressLine3Required', showAddressLine3Required)
        }
      }
    },

    watch: {
      postCode() {
        if (this.settingPostCode) {
          this.settingPostCode = false
          return
        }

        this.getPredictions(this.postCode)
      },
      accountDetailsValid() {
        if (!this.accountDetailsValid) {
          this.$router.replace('/sign-up/locum/account-details')
        }
      }
    },

    methods: {
      hidePredictions() {
        this.showPredictions = false
      },

      getPredictions: debounce(function (input) {
        const params = {
          input: input
        }

        this.predictions = []

        this.$axios.get('/api/v1/predictions', { params }).then((response) => {
          console.log('response', response)
          this.predictions = response.data.predictions
        }).catch((err) => {
          console.log('err', err)
        })
      }, 250),

      selectPrediction(prediction) {
        console.log('selectPrediction', prediction)
        const postCode = prediction.details.result.address_components.find((address_component) => {
          return address_component.types.some((type) => {
            return type === 'postal_code'
          })
        })

        this.predictions = []

        if (postCode) {
          // this.settingPostCode = true
          this.showPredictions = false

          this.postCode = postCode.long_name

          const route = prediction.details.result.address_components.find((address_component) => {
            return address_component.types.some((type) => {
              return type === 'route'
            })
          })

          if (route) {
            this.addressLine1 = route.long_name
          }

          const postalTown = prediction.details.result.address_components.find((address_component) => {
            return address_component.types.some((type) => {
              return type === 'postal_town'
            })
          })

          if (postalTown) {
            this.addressLine3 = postalTown.long_name
          }
        } else {
          this.postCode = ''
          this.addressLine1 = ''
          this.addressLine2 = ''
          this.addressLine3 = ''
        }
      },

      checkPostCode() {
        if (this.postCode.trim() !== '') {
          this.showPostCodeRequired = false
        } else {
          this.showPostCodeRequired = true
        }
      },

      checkAddressLine1() {
        if (this.addressLine1.trim() !== '') {
          this.showAddressLine1Required = false
        } else {
          this.showAddressLine1Required = true
        }
      },

      checkAddressLine3() {
        if (this.addressLine3.trim() !== '') {
          this.showAddressLine3Required = false
        } else {
          this.showAddressLine3Required = true
        }
      }
    },

    mounted() {
      this.showPostCodeRequired = false
      this.showAddressLine1Required = false
      this.showAddressLine3Required = false
    }
  }
</script>
