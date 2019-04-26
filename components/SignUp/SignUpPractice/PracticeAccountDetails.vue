<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <form class="w-full">
          <div
            class="relative flex flex-col mt-8 border-b-2 border-grey-light"
            :class="[setFocus === 'title' ? 'border-yellow':'', formError.find(item => item.field === 'title') ? 'border-red':'']"
          >
            <label for="title" class="text-sm mb-4">Title</label>
            <input
              type="text"
              name="title"
              ref="title"
              id="title"
              class="focus:outline-none font-bold text-sm"
              style="height:40px"
              @focus="setFocus = 'title'"
              @blur="setFocus = ''"
              v-model="form.title"
              placeholder="(ex. Mr., Ms., Mrs.)"
            >
            <span
              class="absolute pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'title')"
            >{{formError.find(item => item.field === 'title').message}}</span>
          </div>
          <div
            class="relative flex flex-col mt-8 border-b-2 border-grey-light"
            :class="[setFocus === 'first_name' ? 'border-yellow':'', formError.find(item => item.field === 'first_name') ? 'border-red':'']"
          >
            <label for="first_name" class="text-sm mb-4">First name</label>
            <input
              type="text"
              name="first_name"
              ref="first_name"
              id="first_name"
              class="focus:outline-none font-bold text-sm"
              style="height:40px"
              @focus="setFocus = 'first_name'"
              @blur="setFocus = ''"
              v-model="form.first_name"
              placeholder="Your first name"
            >
            <span
              class="absolute pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'first_name')"
            >{{formError.find(item => item.field === 'first_name').message}}</span>
          </div>
          <div
            class="relative flex flex-col mt-8 border-b-2 border-grey-light"
            :class="[setFocus === 'last_name' ? 'border-yellow':'', formError.find(item => item.field === 'last_name') ? 'border-red':'']"
          >
            <label for="last_name" class="text-sm mb-4">Last name</label>
            <input
              type="text"
              name="last_name"
              ref="last_name"
              id="last_name"
              class="focus:outline-none font-bold text-sm"
              style="height:40px"
              @focus="setFocus = 'last_name'"
              @blur="setFocus = ''"
              v-model="form.last_name"
              placeholder="Your last name"
            >
            <span
              class="absolute pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'last_name')"
            >{{formError.find(item => item.field === 'last_name').message}}</span>
          </div>
          <div
            class="relative flex flex-col mt-8 border-b-2 border-grey-light"
            :class="[setFocus === 'suffix' ? 'border-yellow':'', formError.find(item => item.field === 'suffix') ? 'border-red':'']"
          >
            <label for="suffix" class="text-sm mb-4">Suffix</label>
            <input
              type="text"
              name="suffix"
              ref="suffix"
              id="suffix"
              class="focus:outline-none font-bold text-sm"
              style="height:40px"
              @focus="setFocus = 'suffix'"
              @blur="setFocus = ''"
              v-model="form.suffix"
              placeholder="(ex. Ph.D., M.D., etc.)"
            >
            <span
              class="absolute pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'suffix')"
            >{{formError.find(item => item.field === 'suffix').message}}</span>
          </div>
          <div
            class="relative flex flex-col mt-8 border-b-2 border-grey-light"
            :class="[setFocus === 'role' ? 'border-yellow':'', formError.find(item => item.field === 'role') ? 'border-red':'']"
          >
            <label for="role" class="text-sm mb-4">Role</label>
            <select
              class="focus:outline-none font-bold text-sm"
              style="height:40px;"
              @focus="setFocus = 'role'"
              @blur="setFocus = ''"
              v-model="form.role"
            >
              <option value selected disabled>Select..</option>
              <option v-for="(item, index) in roles" :key="index" :value="item.value">{{item.label}}</option>
            </select>
            <span
              class="absolute pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'role')"
            >{{formError.find(item => item.field === 'role').message}}</span>
          </div>

          <div
            class="relative flex flex-col mt-8 border-b-2 border-grey-light"
            :class="[setFocus === 'email' ? 'border-yellow':'', formError.find(item => item.field === 'email') ? 'border-red':'']"
          >
            <label for="email" class="text-sm mb-4">Email address</label>
            <input
              type="email"
              name="email"
              ref="email"
              id="email"
              class="focus:outline-none font-bold text-sm"
              style="height:40px"
              @focus="setFocus = 'email'"
              @blur="setFocus = ''"
              v-model="form.email"
              placeholder="Your email address"
            >
            <span
              class="absolute pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'email')"
            >{{formError.find(item => item.field === 'email').message}}</span>
          </div>

          <div
            class="relative flex flex-col mt-8 border-b-2 border-grey-light"
            :class="[setFocus === 'password' ? 'border-yellow':'', formError.find(item => item.field === 'password') ? 'border-red':'']"
          >
            <label for="password" class="text-sm mb-4">Password</label>
            <input
              type="password"
              name="password"
              ref="password"
              id="password"
              class="focus:outline-none font-bold text-sm"
              style="height:40px"
              @focus="setFocus = 'password'"
              @blur="setFocus = ''"
              v-model="form.password"
              placeholder="Password"
            >
            <span
              class="absolute pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'password')"
            >{{formError.find(item => item.field === 'password').message}}</span>
          </div>

          <div
            class="relative flex flex-col mt-8 border-b-2 border-grey-light"
            :class="[setFocus === 'repeat_password' ? 'border-yellow':'', formError.find(item => item.field === 'repeat_password') ? 'border-red':'']"
          >
            <label for="repeat_password" class="text-sm mb-4">Repeat password to verify</label>
            <input
              type="password"
              name="repeat_password"
              ref="repeat_password"
              id="repeat_password"
              class="focus:outline-none font-bold text-sm"
              style="height:40px"
              @focus="setFocus = 'repeat_password'"
              @blur="setFocus = ''"
              v-model="form.repeat_password"
              placeholder="Repeat password"
            >
            <span
              class="absolute pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'repeat_password')"
            >{{formError.find(item => item.field === 'repeat_password').message}}</span>
          </div>

          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-start">
              <input
                type="checkbox"
                name="privacy_policy"
                id="privacy_policy"
                ref="privacy_policy"
                v-model="form.privacy_policy"
              >
              <label
                for="privacy_policy"
                class="text-sm ml-1"
              >I agree with the Terms and Conditions and Privacy Policy of Hubzz</label>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'privacy_policy')"
            >{{formError.find(item => item.field === 'privacy_policy').message}}</div>
          </div>
        </form>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start mt-5">
      <div class="flex justify-center" style="width:600px">
        <button
          class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none mx-1"
          @click.prevent="$store.commit('signUp/SET_ACTIVE_TAB', 'practice_details')"
          v-text="'<<'"
        ></button>
        <button
          class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none"
          @click.prevent="signUp"
        >Sign Up</button>
      </div>
    </div>
  </div>
</template>
<script>
const roles = [
  { value: 'partner', label: 'Partner' },
  { value: 'practice_manager', label: 'Practice Manager' },
  { value: 'practice_staff', label: 'Practice Staff' }
]
export default {
  data() {
    return {
      roles,
      form: {
        title: '',
        first_name: '',
        last_name: '',
        suffix: '',
        role: '',
        email: '',
        password: '',
        repeat_password: '',
        privacy_policy: false
      },
      formError: [],
      setFocus: ''
    }
  },
  computed: {
    practiceAccountDetails() {
      return this.$store.state.signUp.practice_account_details
    }
  },
  mounted() {
    this.form.title = this.practiceAccountDetails.title
    this.form.first_name = this.practiceAccountDetails.first_name
    this.form.last_name = this.practiceAccountDetails.last_name
    this.form.suffix = this.practiceAccountDetails.suffix
    this.form.role = this.practiceAccountDetails.role
    this.form.email = this.practiceAccountDetails.email
    this.form.password = this.practiceAccountDetails.password
    this.form.repeat_password = this.practiceAccountDetails.repeat_password
    this.form.privacy_policy = this.practiceAccountDetails.privacy_policy
  },
  methods: {
    signUp() {
      try {
        this.formError = []
        this.Validate(this.form, ['title', 'suffix'])
        this.ValidatePassword(this.form.password, this.form.repeat_password)
        if (!this.formError.length) {
          this.$store.commit('signUp/SET_PRACTICE_ACCOUNT_DETAILS', this.form)
          this.$store.dispatch('signUp/registeredPractice')
          // response here
          this.$router.push('/sign-up/success')
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
