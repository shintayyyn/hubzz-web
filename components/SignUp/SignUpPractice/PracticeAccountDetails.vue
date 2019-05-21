<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <form class="w-full">
          <AppInput
            v-model="form.title"
            :type="'text'"
            :name="'title'"
            :label="'Title'"
            :placeholder="'(ex. Mr., Ms., Mrs.)'"
          />
          <AppInput
            v-model="form.first_name"
            :type="'text'"
            :name="'first_name'"
            :label="'First name'"
            :placeholder="'Your first name'"
            :error="formError.find(item => item.field === 'first_name')"
          />
          <AppInput
            v-model="form.last_name"
            :type="'text'"
            :name="'last_name'"
            :label="'Last name'"
            :placeholder="'Your last name'"
            :error="formError.find(item => item.field === 'last_name')"
          />
          <AppInput
            v-model="form.suffix"
            :type="'text'"
            :name="'suffix'"
            :label="'Suffix'"
            :placeholder="'(ex. Ph.D., M.D., etc.)'"
          />
          <AppSelect
            v-model="form.practice_role"
            :name="'practice_role'"
            :label="'Role'"
            :placeholder="'Select..'"
            :error="formError.find(item => item.field === 'practice_role')"
            :items="practice_roles"
          />
          <AppInput
            v-model="form.email"
            :type="'email'"
            :name="'email'"
            :label="'Email'"
            :placeholder="'Your email address'"
            :error="formError.find(item => item.field === 'email')"
          />
          <AppInput
            v-model="form.password"
            :type="'password'"
            :name="'password'"
            :label="'Password'"
            :placeholder="'Your password'"
            :error="formError.find(item => item.field === 'password')"
          />
          <AppInput
            v-model="form.password_confirmation"
            :type="'password'"
            :name="'password_confirmation'"
            :label="'Repeat password to verify'"
            :placeholder="'Repeat password'"
            :password="form.password"
            :error="formError.find(item => item.field === 'password_confirmation')"
          />
          <AppInput
            v-model="form.privacy_policy"
            :type="'checkbox'"
            :name="'privacy_policy'"
            :label="'I agree with the Terms and Conditions and Privacy Policy of Hubzz'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'privacy_policy')"
          />
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
import AppInput from '@/components/Base/AppInput'
import AppSelect from '@/components/Base/AppSelect'
import AppButton from '@/components/Base/AppButton'
const practice_roles = [
  'Partner', 'Practice Manager', 'Practice Staff'
]
export default {
  components: {
    AppInput,
    AppSelect,
    AppButton
  },
  data() {
    return {
      practice_roles,
      form: {
        title: '',
        first_name: '',
        last_name: '',
        suffix: '',
        practice_role: '',
        email: '',
        password: '',
        password_confirmation: '',
        privacy_policy: false
      },
      formError: []
    }
  },
  computed: {
    practiceAccountDetails() {
      return this.$store.state.signUp.practice_account_details
    },
    practiceAccountFormError() {
      return this.$store.state.signUp.practice_account_detail_form_error
    }
  },
  watch: {
    'form.first_name'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'first_name')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'first_name', message: 'Required' })
      }
    },
    'form.last_name'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'last_name')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'last_name', message: 'Required' })
      }
    },
    'form.email'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'email')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'email', message: 'Required' })
      } else {
        // validate option
        const error = this.ValidateEmail(value)
        if (error) {
          this.formError.push(error)
        }
      }
    },
    'form.practice_role'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'practice_role')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'practice_role', message: 'Required' })
      }
    },
    'form.password'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'password')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'password', message: 'Required' })
      } else if (value && value.length < 6) {
        this.formError.push({ field: 'password', message: 'Password Must Be Atleast 6 Characters' })
      }
    },
    'form.password_confirmation'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'password_confirmation')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'password_confirmation', message: 'Required' })
      }
      else if (value && value.length < 6) {
        this.formError.push({ field: 'password_confirmation', message: 'Password Confirmation Must Be Atleast 6 Characters' })
      } else {
        // validate option
        const error = this.ValidateSamePassword(value, this.form.password)
        if (error) {
          this.formError.push(error)
        }
      }
    },
    'form.privacy_policy'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'privacy_policy')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'privacy_policy', message: 'Required' })
      }
    },
    practiceAccountFormError(value) {
      if (value.length > 0) {
        value.forEach(item => {
          this.formError.push(item)
        })
      }
    }
  },
  mounted() {
    this.form.title = this.practiceAccountDetails.title
    this.form.first_name = this.practiceAccountDetails.first_name
    this.form.last_name = this.practiceAccountDetails.last_name
    this.form.suffix = this.practiceAccountDetails.suffix
    this.form.practice_role = this.practiceAccountDetails.practice_role
    this.form.email = this.practiceAccountDetails.email
    this.form.password = this.practiceAccountDetails.password
    this.form.password_confirmation = this.practiceAccountDetails.password_confirmation

    if (this.practiceAccountFormError.length > 0) {
      this.practiceAccountFormError.forEach(item => {
        this.formError.push(item)
      })
    }
  },
  methods: {
    signUp() {
      try {
        this.formError = []
        this.Validate(this.form, ['title', 'suffix'])
        this.ValidateSamePassword(this.form.password, this.form.password_confirmation)
        if (!this.formError.length) {
          this.$store.commit('signUp/SET_PRACTICE_ACCOUNT_DETAILS', this.form)
          setTimeout(() => {
            this.$store.dispatch('signUp/registeredPractice')
          }, 1000)
          // response here
          // this.$router.push('/sign-up/success')
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
