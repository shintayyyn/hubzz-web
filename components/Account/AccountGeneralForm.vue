<template>
  <div class="border-solid rounded-lg shadow-lg">
    <div class="w-full">
        <form class="px-8 pt-6 pb-8 mb-4">
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'email', 'border-red': formError.includes('email')}">
            <label for="email" class="block text-grey-darker text-sm font-bold mb-2">Email Address</label>
            <em v-if="formError.includes('email')" class="text-xs text-red-darker float-right">Required</em>
            <input @focus="setFocus = 'email'" @blur="setFocus = ''" v-model="form.email" type="email" name="email" id="email" placeholder="Your email address" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'title'}">
            <label for="title" class="block text-grey-darker text-sm font-bold mb-2" >Title</label>
            <input @focus="setFocus = 'title'" @blur="setFocus = ''" v-model="form.title" type="text" name="title" id="title" placeholder="(ex. Mr., Ms., Mrs.)" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'firstName', 'border-red': formError.includes('firstName')}">
            <label for="firstName" class="block text-grey-darker text-sm font-bold mb-2">First name</label>
            <em v-if="formError.includes('firstName')" class="text-xs text-red-darker float-right">Required</em>
            <input @focus="setFocus = 'firstName'" @blur="setFocus = ''" v-model="form.firstName" type="text" name="firstName" id="firstName" placeholder="Your first name" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'lastName', 'border-red': formError.includes('lastName')}">
            <label for="lastName" class="block text-grey-darker text-sm font-bold mb-2">Last name</label>
            <em v-if="formError.includes('lastName')" class="text-xs text-red-darker float-right">Required</em>
            <input @focus="setFocus = 'lastName'" @blur="setFocus = ''" v-model="form.lastName" type="text" name="lastName" id="lastName" placeholder="Your last name" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'suffix'}">
            <label for="suffix" class="block text-grey-darker text-sm font-bold mb-2">Suffix</label>
            <input @focus="setFocus = 'suffix'" @blur="setFocus = ''" v-model="form.suffix" type="text" name="suffix" id="suffix" placeholder="(ex. Ph.D., M.D., etc)" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'gender', 'border-red': formError.includes('gender')}">
            <label for="gender" class="block text-grey-darker text-sm font-bold mb-2">Gender</label>
            <em v-if="formError.includes('gender')" class="text-xs text-red-darker float-right">Required</em>
            <select @focus="setFocus = 'gender'" @blur="setFocus = ''" v-model="form.gender" name="gender" id="gender" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">Role
              <option value="">Select..</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
           <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'mobile', 'border-red': formError.includes('mobile')}">
            <label for="mobile" class="block text-grey-darker text-sm font-bold mb-2">Mobile Number</label>
            <em v-if="formError.includes('mobile')" class="text-xs text-red-darker float-right">Required</em>
            <input @focus="setFocus = 'mobile'" @blur="setFocus = ''" v-model="form.mobile" type="text" name="mobile" id="mobile" placeholder="Your mobile number" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
           <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'home_number'}">
            <label for="home_number" class="block text-grey-darker text-sm font-bold mb-2">Home/Land line Number</label>
            <input @focus="setFocus = 'home_number'" @blur="setFocus = ''" v-model="form.home_number" type="text" name="home_number" id="home_number" placeholder="Your Home/Land line number" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>

          <div class="p-5 border border-grey rounded-lg bg-grey-light">
            <div class="mb-4 border-b border-b-2 border-white py-2" :class="{'border-red': formError.includes('post_code')}">
              <label for="post_code" class="block text-grey-darker text-sm font-bold mb-2">Post code</label>
              <em v-if="formError.includes('post_code')" class="text-xs text-red-darker float-right">Required</em>
              <input @focus="setFocus = 'post_code'" @blur="setFocus = ''" v-model="form.post_code" type="text" name="post_code" id="post_code" placeholder="Your Postal code" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
            </div>
            <div class="mb-4 border-b border-b-2 border-white py-2" :class="{'border-red': formError.includes('address_1')}">
              <label for="address_1" class="block text-grey-darker text-sm font-bold mb-2">Address line 1</label>
              <em v-if="formError.includes('address_1')" class="text-xs text-red-darker float-right">Required</em>
              <input @focus="setFocus = 'address_1'" @blur="setFocus = ''" v-model="form.address_1" type="text" name="address_1" id="address_1" placeholder="Your Main address" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
            </div>
            <div class="mb-4 border-b border-b-2 border-white py-2">
              <label for="address_2" class="block text-grey-darker text-sm font-bold mb-2">Address line 2 (optional)</label>
              <input @focus="setFocus = 'address_2'" @blur="setFocus = ''" v-model="form.address_2" type="text" name="address_2" id="address_2" placeholder="Your Secondary address" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
            </div>
            <div class="mb-4 border-b border-b-2 border-white py-2" :class="{'border-red': formError.includes('city')}">
              <label for="city" class="block text-grey-darker text-sm font-bold mb-2">City / Town / District</label>
              <em v-if="formError.includes('city')" class="text-xs text-red-darker float-right">Required</em>
              <input @focus="setFocus = 'city'" @blur="setFocus = ''" v-model="form.city" type="text" name="city" id="city" placeholder="Your city / town / district" class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
            </div>
          </div>


          <div class="text-left mt-5">
            <button class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg" @click.prevent="save">Save changes</button>
          </div>

        </form>
      </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      setFocus: '',
      form: {
        email: '',
        title: '',
        firstName: '',
        lastName: '',
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
    save () {
      this.loading = true
      this.formError = []
      this.Validate(this.form, ['title', 'suffix', 'home_number', 'address_2'])
      if (!this.formError.length) {
      } else {
        this.loading = false
      }
    }
  }
}
</script>

