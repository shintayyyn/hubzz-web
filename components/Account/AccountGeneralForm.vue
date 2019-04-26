<template>
  <div class="border-solid rounded-lg shadow-lg">
    <form class="w-full p-8">
      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="email" class="text-sm">Email Address</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'email' ? 'border-yellow':'', formError.find(item => item.field === 'email') ? 'border-red':'']"
          >
            <input
              type="email"
              name="email"
              id="email"
              ref="email"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'email'"
              @blur="setFocus = ''"
              v-model="form.email"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'email')"
        >{{formError.find(item => item.field === 'email').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="title" class="text-sm">Title</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'title' ? 'border-yellow':'', formError.find(item => item.field === 'title') ? 'border-red':'']"
          >
            <input
              type="text"
              name="title"
              id="title"
              ref="title"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'title'"
              @blur="setFocus = ''"
              v-model="form.title"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'title')"
        >{{formError.find(item => item.field === 'title').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="first_name" class="text-sm">First name</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'first_name' ? 'border-yellow':'', formError.find(item => item.field === 'first_name') ? 'border-red':'']"
          >
            <input
              type="text"
              name="first_name"
              id="first_name"
              ref="first_name"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'first_name'"
              @blur="setFocus = ''"
              v-model="form.first_name"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'first_name')"
        >{{formError.find(item => item.field === 'first_name').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="last_name" class="text-sm">Last name</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'last_name' ? 'border-yellow':'', formError.find(item => item.field === 'last_name') ? 'border-red':'']"
          >
            <input
              type="text"
              name="last_name"
              id="last_name"
              ref="last_name"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'last_name'"
              @blur="setFocus = ''"
              v-model="form.last_name"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'last_name')"
        >{{formError.find(item => item.field === 'last_name').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="suffix" class="text-sm">Suffix</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'suffix' ? 'border-yellow':'', formError.find(item => item.field === 'suffix') ? 'border-red':'']"
          >
            <input
              type="text"
              name="suffix"
              id="suffix"
              ref="suffix"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'suffix'"
              @blur="setFocus = ''"
              v-model="form.suffix"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'suffix')"
        >{{formError.find(item => item.field === 'suffix').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="gender" class="text-sm">Gender</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'gender' ? 'border-yellow':'', formError.find(item => item.field === 'gender') ? 'border-red':'']"
          >
            <select
              @focus="setFocus = 'gender'"
              @blur="setFocus = ''"
              v-model="form.gender"
              name="gender"
              id="gender"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
            >
              Role
              <option value selected>Select..</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'gender')"
        >{{formError.find(item => item.field === 'gender').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="mobile" class="text-sm">Mobile Number</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'mobile' ? 'border-yellow':'', formError.find(item => item.field === 'mobile') ? 'border-red':'']"
          >
            <input
              type="text"
              name="mobile"
              id="mobile"
              ref="mobile"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'mobile'"
              @blur="setFocus = ''"
              v-model="form.mobile"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'mobile')"
        >{{formError.find(item => item.field === 'mobile').message}}</div>
      </div>

      <div class="relative flex flex-col my-6">
        <div class="flex flex-row justify-start">
          <label for="home_number" class="text-sm">Home/Land line Number</label>
        </div>
        <div class="flex flex-row justify-start mt-4">
          <div
            class="flex flex-col border-b-2 border-grey-light w-full"
            :class="[setFocus === 'home_number' ? 'border-yellow':'', formError.find(item => item.field === 'home_number') ? 'border-red':'']"
          >
            <input
              type="text"
              name="home_number"
              id="home_number"
              ref="home_number"
              class="font-bold text-sm p-2 leading-tight focus:outline-none"
              @focus="setFocus = 'home_number'"
              @blur="setFocus = ''"
              v-model="form.home_number"
            >
          </div>
        </div>
        <div
          class="absolute pin-t pin-r bg-red text-white p-1"
          v-if="formError.find(item => item.field === 'home_number')"
        >{{formError.find(item => item.field === 'home_number').message}}</div>
      </div>

      <div class="p-5 border border-grey rounded-lg bg-grey-light">
        <div class="relative flex flex-col my-6">
          <div class="flex flex-row justify-start">
            <label for="post_code" class="text-sm">Post code</label>
          </div>
          <div class="flex flex-row justify-start mt-4">
            <div
              class="flex flex-col border-b-2 border-white w-full"
              :class="[setFocus === 'post_code' ? 'border-yellow':'', formError.find(item => item.field === 'post_code') ? 'border-red':'']"
            >
              <input
                type="text"
                name="post_code"
                id="post_code"
                ref="post_code"
                placeholder="Enter a post code and select from list"
                class="font-bold text-sm p-2 leading-tight focus:outline-none bg-grey-light"
                @focus="setFocus = 'post_code'"
                @blur="setFocus = ''"
                v-model="form.post_code"
                @change="onChange"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'post_code')"
          >{{formError.find(item => item.field === 'post_code').message}}</div>
        </div>

        <div class="relative flex flex-col my-6">
          <div class="flex flex-row justify-start">
            <label for="address_1" class="text-sm">Address line 1</label>
          </div>
          <div class="flex flex-row justify-start mt-4">
            <div
              class="flex flex-col border-b-2 border-white w-full"
              :class="[setFocus === 'address_1' ? 'border-yellow':'', formError.find(item => item.field === 'address_1') ? 'border-red':'']"
            >
              <input
                type="text"
                name="address_1"
                id="address_1"
                ref="address_1"
                class="font-bold text-sm p-2 leading-tight focus:outline-none bg-grey-light"
                @focus="setFocus = 'address_1'"
                @blur="setFocus = ''"
                v-model="form.address_1"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'address_1')"
          >{{formError.find(item => item.field === 'address_1').message}}</div>
        </div>

        <div class="relative flex flex-col my-6">
          <div class="flex flex-row justify-start">
            <label for="address_2" class="text-sm">Address line 2 (optional)</label>
          </div>
          <div class="flex flex-row justify-start mt-4">
            <div
              class="flex flex-col border-b-2 border-white w-full"
              :class="[setFocus === 'address_2' ? 'border-yellow':'', formError.find(item => item.field === 'address_2') ? 'border-red':'']"
            >
              <input
                type="text"
                name="address_2"
                id="address_2"
                ref="address_2"
                class="font-bold text-sm p-2 leading-tight focus:outline-none bg-grey-light"
                @focus="setFocus = 'address_2'"
                @blur="setFocus = ''"
                v-model="form.address_2"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'address_2')"
          >{{formError.find(item => item.field === 'address_2').message}}</div>
        </div>

        <div class="relative flex flex-col my-6">
          <div class="flex flex-row justify-start">
            <label for="city" class="text-sm">City / Town / District</label>
          </div>
          <div class="flex flex-row justify-start mt-4">
            <div
              class="flex flex-col border-b-2 border-white w-full"
              :class="[setFocus === 'city' ? 'border-yellow':'', formError.find(item => item.field === 'city') ? 'border-red':'']"
            >
              <input
                type="text"
                name="city"
                id="city"
                ref="city"
                class="font-bold text-sm p-2 leading-tight focus:outline-none bg-grey-light"
                @focus="setFocus = 'city'"
                @blur="setFocus = ''"
                v-model="form.city"
              >
            </div>
          </div>
          <div
            class="absolute pin-t pin-r bg-red text-white p-1"
            v-if="formError.find(item => item.field === 'city')"
          >{{formError.find(item => item.field === 'city').message}}</div>
        </div>
      </div>

      <div class="text-left mt-5">
        <button
          class="bg-yellow-dark hover:text-white focus:outline-none font-bold text-xl p-6 rounded-lg"
          @click.prevent="save"
        >Save changes</button>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      setFocus: '',
      form: {
        email: '',
        title: '',
        first_name: '',
        last_name: '',
        suffix: '',
        gender: '',
        mobile: '',
        home_number: '',
        post_code: '',
        address_1: '',
        address_2: '',
        city: ''
      },
      formError: []
    }
  },
  mounted() {
    this.form.email = this.generalDetails.email
    this.form.title = this.generalDetails.title
    this.form.first_name = this.generalDetails.first_name
    this.form.last_name = this.generalDetails.last_name
    this.form.suffix = this.generalDetails.suffix
    this.form.gender = this.generalDetails.gender
    this.form.mobile = this.generalDetails.mobile
    this.form.home_number = this.generalDetails.home_number
    this.form.post_code = this.generalDetails.post_code
    this.form.address_1 = this.generalDetails.address_1
    this.form.address_2 = this.generalDetails.address_2
    this.form.city = this.generalDetails.city

    // google map
    this.autocomplete = new google.maps.places.Autocomplete((this.$refs.post_code))
  },
  computed: {
    generalDetails() {
      return this.$store.state.account.generalDetails
    }
  },
  watch: {
    form: {
      handler: function (value) {
        // this.formError = []
        // this.Validate(this.form, ['title', 'suffix', 'home_number', 'address_2'])
      },
      deep: true
    }
  },
  methods: {
    save() {
      try {
        this.formError = []
        this.Validate(this.form, ['title', 'suffix', 'home_number', 'address_2'])
        this.ValidateEmail({ email: this.form.email, field: 'email' })
        this.ValidateMobile(this.form.mobile)
        if (!this.formError.length) {
          this.$store.commit('account/SET_GENERAL_DETAILS', this.form)
          // action dispatch to api, return promise
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Saved !' })
        }
      } catch (e) {
        console.log(e)
      }
    },
    onChange(value) {
      this.autocomplete.addListener('place_changed', () => {
        let place = this.autocomplete.getPlace();
        // ! ask arvi
        this.form.post_code = place.name.split(',')[0]
        this.form.address_line_1 = place.name.split(',')[1]
        this.form.city = place.name.split(',')[2]
      })
    },
  }
}
</script>
<style scoped>
button:active {
  transform: translate(2px, 2px);
}
</style>


