<template>
  <div class="h-full w-full flex flex-col overflow-auto">
    <div class="flex flex-col items-center justify-center w-full">
      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex mx-4" style="flex: 0 1 600px;">
          <h3>What's your address?</h3>
        </div>
      </div>

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex flex-col p-4 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
          <div class="flex flex-col p-6 rounded-lg bg-gray-300">
            <div class="flex flex-col">
              <div class="relative">
                <label class="text-xs">Post code *</label>
                <span
                  class="text-xs absolute right-0 bottom-0 bg-red-500 p-1 text-white"
                  v-if="showPostCodeRequired && !showPostCodeFocus"
                >Required</span>
              </div>
              <div class="relative" v-on-clickaway="hidePredictions">
                <input
                  class="w-full bg-transparent outline-none py-1 mt-1 mb-8 border-b"
                  :class="showPostCodeFocus ? 'border-yellow-500' : showPostCodeRequired ? 'border-red-500' : 'border-gray-500'"
                  v-model="postCode"
                  @focus="showPostCodeFocus = true"
                  @click="showPredictions = true, getPredictionsIfNoPredictions()"
                  @blur="showPostCodeFocus = false, checkPostCode()"
                  @keydown="inputKeydownHandler"
                  placeholder="Enter a post code and select from list"
                />
                <div
                  class="bg-white absolute left-0 right-0 z-10 border shadow-lg rounded-lg"
                  style="top: 32px;"
                  v-if="showPredictions"
                >
                  <div class="p-2 border-b" v-if="gettingPredictions">
                    <strong>Loading...</strong>
                  </div>
                  <div
                    v-for="(prediction, index) in predictions"
                    class="p-2 cursor-pointer"
                    :class="`${index !== predictions.length ? 'border-b' : ''} ${index === predictionIndex ? 'bg-gray-300' : ''}`"
                    @click="selectPrediction(prediction)"
                    @mouseover="predictionIndex = index"
                  >
                    <strong class>{{ prediction.structured_formatting.main_text }}</strong>
                    <span class="text-xs">{{ prediction.structured_formatting.secondary_text }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="relative">
              <label class="text-xs">Address line 1 *</label>
              <span
                class="text-xs absolute right-0 bottom-0 bg-red-500 p-1 text-white"
                v-if="showAddressLine1Required && !showAddressLine1Focus"
              >Required</span>
            </div>
            <input
              class="bg-transparent outline-none py-1 mt-1 mb-8 border-b"
              :class="showAddressLine1Focus ? 'border-yellow-500' : showAddressLine1Required ? 'border-red-500' : 'border-gray-500'"
              v-model="addressLine1"
              @focus="showAddressLine1Focus = true"
              @blur="showAddressLine1Focus = false, checkAddressLine1()"
            />

            <label class="text-xs">Address line 2 (optional)</label>
            <input
              class="bg-transparent outline-none py-1 mt-1 mb-8 border-b"
              :class="showAddressLine2Focus ? 'border-yellow-500' : false ? 'border-red-500' : 'border-gray-500'"
              v-model="addressLine2"
              @focus="showAddressLine2Focus = true"
              @blur="showAddressLine2Focus = false"
            />

            <div class="relative">
              <label class="text-xs">City / Town / District *</label>
              <span
                class="text-xs absolute right-0 bottom-0 bg-red-500 p-1 text-white"
                v-if="showAddressLine3Required && !showAddressLine3Focus"
              >Required</span>
            </div>
            <input
              class="bg-transparent outline-none py-1 mt-1 mb-8 border-b"
              :class="showAddressLine3Focus ? 'border-yellow-500' : showAddressLine3Required ? 'border-red-500' : 'border-gray-500'"
              v-model="addressLine3"
              @focus="showAddressLine3Focus = true"
              @blur="showAddressLine3Focus = false, checkAddressLine3()"
            />
          </div>
        </div>
      </div>

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex justify-center" style="flex: 0 1 600px;">
          <nuxt-link
            class="inline-flex border rounded-lg text-black no-underline p-4 my-2"
            style="background-color: #FFDA3A;"
            to="/sign-up/locum/account-details"
          ></nuxt-link>
          <nuxt-link
            class="inline-flex border rounded-lg text-black no-underline p-4 my-2"
            style="background-color: #FFDA3A;"
            to="/sign-up/locum/professional-details"
            @click.native="$store.dispatch('sign-up/locum/addressDetailsNext')"
          >Next</nuxt-link>
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

  mixins: [clickaway],

  async asyncData({ store, redirect }) {
    try {
      console.log('asyncData pages sign-up locum address-details')

      if (!store.getters['sign-up/locum/isAccountDetailsValid']) {
        redirect('/sign-up/locum/account-details')

        return
      }
    } catch (err) {
      console.log('asyncData pages sign-up locum address-details err', err)    }
  },

  data() {
    return {
      settingPostCode: false,
      predictions: [],
      showPredictions: false,
      gettingPredictions: false,
      predictionIndex: -1,

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

    getPredictionsIfNoPredictions() {
      if (this.predictions.length === 0) {
        this.getPredictions(this.postCode)
      }
    },

    getPredictions: debounce(function (input) {
      if (!input) {
        this.predictions = []
        return
      }

      const params = {
        input: input
      }

      this.gettingPredictions = true
      this.predictions = []

      this.$axios.get('/api/v1/predictions', { params }).then((response) => {
        console.log('response', response)
        this.predictions = response.data.predictions
        this.showPredictions = true
      }).catch((err) => {
        console.log('err', err)
      }).finally(() => {
        this.gettingPredictions = false
      })
    }, 250),

    inputKeydownHandler(event) {
      if (event.key === 'ArrowUp') {
        if (this.predictionIndex > 0) {
          this.predictionIndex--
        }
        return
      }

      if (event.key === 'ArrowDown') {
        if (this.predictionIndex < this.predictions.length - 1) {
          this.predictionIndex++
        }
        return
      }

      if (event.key === 'Enter') {
        if (this.predictionIndex > -1 && this.predictionIndex < this.predictions.length) {
          this.selectPrediction(this.predictions[this.predictionIndex])
        }
        return
      }
    },

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
