<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex mx-4" style="flex: 0 1 600px;">
        <h3>What's your account details?</h3>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex m-4" style="flex: 0 1 600px;">
        <span>Basic details about yourself</span>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <form class="w-full">
          <div class="relative flex flex-col">
            <label for="title" class="text-xs lg:text-base mb-4">Title</label>
            <input
              type="text"
              ref="title"
              class="py-2 font-bold text-xs lg:text-base border-b-2 focus:outline-none focus:border-yellow"
              :class="formError.find(item => item.field === 'title') ? 'border-red':''"
              @focus="''"
              @blur="''"
              v-model="form.title"
              placeholder="(ex. Mr., Ms., Mrs.)"
            >
            <span
              class="absolute pin-r bg-red text-white p-1 text-xs lg:text-base"
              v-if="formError.find(item => item.field === 'title')"
            >{{formError.find(item => item.field === 'title').message}}</span>
          </div>
          <div class="relative flex flex-col mt-8">
            <label for="first_name" class="text-xs lg:text-base mb-4">First name</label>
            <input
              type="text"
              ref="first_name"
              class="py-2 font-bold text-xs lg:text-base border-b-2 focus:outline-none focus:border-yellow"
              :class="formError.find(item => item.field === 'first_name') ? 'border-red':''"
              @focus="''"
              @blur="ValidateText(form.first_name, 'first_name')"
              v-model="form.first_name"
              placeholder="Your first name"
            >
            <span
              class="absolute pin-r bg-red text-white p-1 text-xs lg:text-base"
              v-if="formError.find(item => item.field === 'first_name')"
            >{{formError.find(item => item.field === 'first_name').message}}</span>
          </div>
          <div class="relative flex flex-col mt-8">
            <label for="last_name" class="text-xs lg:text-base mb-4">Last name</label>
            <input
              type="text"
              ref="last_name"
              class="py-2 font-bold text-xs lg:text-base border-b-2 focus:outline-none focus:border-yellow"
              :class="formError.find(item => item.field === 'last_name') ? 'border-red':''"
              @focus="''"
              @blur="ValidateText(form.last_name, 'last_name')"
              v-model="form.last_name"
              placeholder="Your last name"
            >
            <span
              class="absolute pin-r bg-red text-white p-1 text-xs lg:text-base"
              v-if="formError.find(item => item.field === 'last_name')"
            >{{formError.find(item => item.field === 'last_name').message}}</span>
          </div>
          <div class="relative flex flex-col mt-8">
            <label for="suffix" class="text-xs lg:text-base mb-4">Suffix</label>
            <input
              type="text"
              ref="suffix"
              class="py-2 font-bold text-xs lg:text-base border-b-2 focus:outline-none focus:border-yellow"
              :class="formError.find(item => item.field === 'suffix') ? 'border-red':''"
              @focus="''"
              @blur="''"
              v-model="form.suffix"
              placeholder="(ex. Ph.D., M.D., etc.)"
            >
            <span
              class="absolute pin-r bg-red text-white p-1 text-xs lg:text-base"
              v-if="formError.find(item => item.field === 'suffix')"
            >{{formError.find(item => item.field === 'suffix').message}}</span>
          </div>
          <div class="relative flex flex-col mt-8">
            <label for="gender" class="text-xs lg:text-base mb-4">Gender</label>
            <select
              class="py-2 font-bold text-xs lg:text-base border-b-2 focus:outline-none focus:border-yellow"
              :class="formError.find(item => item.field === 'gender') ? 'border-red':''"
              @focus="''"
              @blur="ValidateText(form.gender, 'gender')"
              v-model="form.gender"
            >
              <option value selected disabled>Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <span
              class="absolute pin-r bg-red text-white p-1 text-xs lg:text-base"
              v-if="formError.find(item => item.field === 'gender')"
            >{{formError.find(item => item.field === 'gender').message}}</span>
          </div>
          <div class="relative flex flex-col mt-8">
            <label for="mobile_number" class="text-xs lg:text-base mb-4">Mobile</label>
            <input
              type="text"
              ref="mobile_number"
              class="py-2 font-bold text-xs lg:text-base border-b-2 focus:outline-none focus:border-yellow"
              :class="formError.find(item => item.field === 'mobile_number') ? 'border-red':''"
              @focus="''"
              @blur="ValidateMobile(form.mobile_number, 'mobile_number')"
              v-model="form.mobile_number"
              placeholder
              @keypress="ValidateInput"
            >
            <span
              class="z-10 absolute pin-r bg-red text-white p-1 text-xs lg:text-base"
              v-if="formError.find(item => item.field === 'mobile_number')"
            >{{formError.find(item => item.field === 'mobile_number').message}}</span>
            <span
              class="absolute pin-r text-xs lg:text-base rounded-lg bg-grey-light px-2 py-1"
            >In case of emergency</span>
          </div>
          <div class="relative flex flex-col mt-8">
            <label for="home_number" class="text-xs lg:text-base mb-4">Home/Land line number</label>
            <input
              type="text"
              ref="home_number"
              class="py-2 font-bold text-xs lg:text-base border-b-2 focus:outline-none focus:border-yellow"
              :class="formError.find(item => item.field === 'home_number') ? 'border-red':''"
              @focus="''"
              @blur="''"
              v-model="form.home_number"
              placeholder
            >
            <span
              class="z-10 absolute pin-r bg-red text-white p-1 text-xs lg:text-base"
              v-if="formError.find(item => item.field === 'home_number')"
            >{{formError.find(item => item.field === 'home_number').message}}</span>
          </div>
          <div class="relative flex flex-col mt-8">
            <label for="work_number" class="text-xs lg:text-base mb-4">Work/Company line number</label>
            <input
              type="text"
              ref="work_number"
              class="py-2 font-bold text-xs lg:text-base border-b-2 focus:outline-none focus:border-yellow"
              :class="formError.find(item => item.field === 'work_number') ? 'border-red':''"
              @focus="''"
              @blur="''"
              v-model="form.work_number"
              placeholder
            >
            <span
              class="z-10 absolute pin-r bg-red text-white p-1 text-xs lg:text-base"
              v-if="formError.find(item => item.field === 'work_number')"
            >{{formError.find(item => item.field === 'work_number').message}}</span>
          </div>
        </form>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start mt-5">
      <div class="flex justify-center" style="width:600px">
        <button
          class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none"
          @click.prevent="next"
        >Next</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  scrollToTop: true,
  data() {
    return {
      form: {
        title: '',
        first_name: '',
        last_name: '',
        suffix: '',
        gender: '',
        mobile_number: '',
        home_number: '',
        work_number: ''
      },
      formError: [],
      setFocus: ''
    }
  },
  computed: {
    accountDetails() {
      return this.$store.state.signUp.account_details
    },
    accountFormError() {
      return this.$store.state.signUp.account_detail_form_error
    }
  },
  mounted() {
    this.form.title = this.accountDetails.title
    this.form.first_name = this.accountDetails.first_name
    this.form.last_name = this.accountDetails.last_name
    this.form.suffix = this.accountDetails.suffix
    this.form.gender = this.accountDetails.gender
    this.form.mobile_number = this.accountDetails.mobile_number
    this.form.home_number = this.accountDetails.home_number
    this.form.work_number = this.accountDetails.work_number

    if (this.accountFormError.length > 0) {
      this.accountFormError.forEach(item => {
        this.formError.push(item)
      })
    }
  },
  methods: {
    next() {
      try {
        this.formError = []
        this.Validate(this.form, ['title', 'suffix', 'home_number', 'work_number'])
        this.ValidateMobile(this.form.mobile_number, 'mobile_number')
        if (!this.formError.length) {
          this.$store.commit('signUp/SET_ACCOUNT_DETAILS', this.form)
          this.$store.commit('signUp/SET_ACTIVE_TAB', 'address_details')
        }
      } catch (e) {
        console.log(e)
      }
    },
    // validateMobile(e) {
    //   if ()
    // }
  }
}
</script>
<style scoped>
button:active {
  transform: translate(5px, 5px);
}
</style>
