<template>
  <div>
    <div class="border-solid rounded-lg shadow-md mb-8">
      <div class="w-full">
        <form class="px-8 pt-6 pb-8 mb-4">
          <div class="mb-4 border-b border-b-2 border-grey py-2" >
            <label for="title" class="block text-grey-darker text-sm font-bold mb-2" >Title</label>
            <input v-model="form.title" type="text" name="title" id="title" placeholder="(ex. Mr., Ms., Mrs.)" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{ 'border-red': formError.includes('firstName') }">
            <label for="firstName" class="block text-grey-darker text-sm font-bold mb-2">First name</label>
            <em v-if="formError.includes('firstName')" class="text-xs text-red-darker float-right">Required</em>
            <input v-model="form.firstName" type="text" name="firstName" id="firstName" placeholder="Your first name" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{ 'border-red': formError.includes('lastName') }">
            <label for="lastName" class="block text-grey-darker text-sm font-bold mb-2">Last name</label>
            <em v-if="formError.includes('lastName')" class="text-xs text-red-darker float-right">Required</em>
            <input v-model="form.lastName" type="text" name="lastName" id="lastName" placeholder="Your last name" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" >
            <label for="suffix" class="block text-grey-darker text-sm font-bold mb-2">Suffix</label>
            <input v-model="form.suffix" type="text" name="suffix" id="suffix" placeholder="(ex. Ph.D., M.D., etc)" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{ 'border-red': formError.includes('role') }">
            <label for="role" class="block text-grey-darker text-sm font-bold mb-2">Role</label>
            <em v-if="formError.includes('role')" class="text-xs text-red-darker float-right">Required</em>
            <select v-model="form.role" name="role" id="role" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">Role
              <option value="">Select..</option>
              <option value="partner">Partner</option>
              <option value="practice-manager">Practice Manager</option>
              <option value="practice-staff">Practice Staff</option>
            </select>
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{ 'border-red': formError.includes('email') }">
            <label for="email" class="block text-grey-darker text-sm font-bold mb-2">Email</label>
            <em v-if="formError.includes('email')" class="text-xs text-red-darker float-right">Required</em>
            <input v-model="form.email" type="email" name="email" id="email" placeholder="Your email address" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{ 'border-red': formError.includes('password') }">
            <label for="password" class="block text-grey-darker text-sm font-bold mb-2" >Password</label>
            <em v-if="formError.includes('password')" class="text-xs text-red-darker float-right">Required</em>
            <input v-model="form.password" type="password" name="password" id="password" placeholder="Your password address" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{ 'border-red': formError.includes('confirmPassword') }">
            <label for="confirmPassword" class="block text-grey-darker text-sm font-bold mb-2">Repeat password to verify</label>
            <em v-if="formError.includes('confirmPassword')" class="text-xs text-red-darker float-right">Required</em>
            <input v-model="form.confirmPassword" type="password" name="confirmPassword" id="confirmPassword" placeholder="Repeat Password" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 py-2">
            <label for="agree" class="text-grey-darker">
              <input v-model="form.agree" type="checkbox" name="agree" id="agree" class="mr-2 leading-tight">
              <em v-if="formError.includes('agree')" class="text-xs text-red-darker float-right">Required</em>
              <span class="text-sm font-bold">
                I agree with the Terms and Conditions and Privacy Policy of Hubzz
              </span>
            </label>
          </div>
        </form>
      </div>
    </div>
    <div class="text-center" >
      <button class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg" @click.prevent="$emit('backStep')" v-text="`<<`"></button>
      <button class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg" @click.prevent="signUp">Sign Up</button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      form: {
        title: '',
        firstName: '',
        lastName: '',
        suffix: '',
        role: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: false
      },
      formError: []
    }
  },
  watch: {
    'form.firstName' (value) {
      if (this.formError.includes('firstName')) {
        this.formError.splice(this.formError.findIndex(value => 'firstName' === value), 1)
      } else {
        !value ? this.formError.push('firstName') : ''
      }
    }
  },
  methods: {
    signUp () {
      this.loading = true
      this.formError = []
      this.Validate(this.form)
      if (!this.formError.length) {
        this.$emit('submitForm', this.form)
      } else {
        this.loading = false
      }
    },

  }
}
</script>
