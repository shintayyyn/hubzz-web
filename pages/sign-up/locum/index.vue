<template>
  <div ref="signUpContainer" class="w-full">
    <div class="w-full xl:max-w-3xl p-4 md:p-6">
      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex flex-col items-start mb-6 mt-1 md:mx-4" style="flex: 0 1 600px;">
          <nuxt-link to="/sign-up" class="text-black focus:outline-none">
            <svgicon name="left-arrow" height="32" width="32" />
          </nuxt-link>
          <div class="mt-1 text-xl font-bold">
            Sign up for a Locum account
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center w-full">
        <AppLoading :loading="loading" spinner />

        <div v-if="!loading" class="flex flex-col items-center justify-center w-full">
          <div class="flex w-full justify-center xl:justify-start">
            <div class="flex md:mx-4" style="flex: 0 1 600px;">
              <h3>What's your account details?</h3>
            </div>
          </div>

          <div class="flex w-full justify-center xl:justify-start">
            <div class="md:mx-4 flex flex-col p-4 md:p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
              <form class="w-full">
                <div class="flex justify-between text-sm">
                  <div>Select which jobs to view:</div>

                  <div class="bg-gray-300 rounded px-2">
                    Must select atleast one
                  </div>
                </div>

                <AppInput
                  v-model="viewLocumJobs"
                  type="single-checkbox"
                  name="view_locum_jobs"
                  label="Hubzz Jobs"
                  :error="formErrors.find(({ field }) => field === 'view_locum_jobs')"
                />

                <AppInput
                  v-model="viewPermanentJobs"
                  type="single-checkbox"
                  name="view_permanent_jobs"
                  label="Permanent / Salaried Roles"
                  :error="formErrors.find(({ field }) => field === 'view_permanent_jobs')"
                />

                <AppInput
                  v-model="professionId"
                  type="select"
                  label="Profession"
                  placeholder="Select..."
                  :error="formErrors.find(({ field }) => field === 'profession_id')"
                  :items="professionsSelectionList"
                  required
                />

                <AppInput
                  v-model="title"
                  type="text"
                  label="Title"
                  placeholder="(ex. Mr., Ms., Mrs.)"
                />

                <AppInput
                  v-model="firstName"
                  type="text"
                  label="First name"
                  placeholder="Your first name"
                  :error="formErrors.find(({ field }) => field === 'first_name')"
                  required
                />

                <AppInput
                  v-model="lastName"
                  type="text"
                  label="Last name"
                  placeholder="Your last name"
                  :error="formErrors.find(({ field }) => field === 'last_name')"
                  required
                />
                
                <AppInput
                  v-model="suffix"
                  type="text"
                  label="Suffix"
                  placeholder="(ex. Ph.D., M.D., etc.)"
                />

                <AppInput
                  v-model="mobileNumber"
                  type="text"
                  label="Mobile Number"
                  :limit="10"
                  format="mobile"
                  @keydown="inputNumberOnly($event)"
                />

                <AppInput
                  v-model="email"
                  type="email"
                  label="Email"
                  info="If you have an NHS email address, please use this"
                  placeholder="Your email address"
                  :error="formErrors.find(({ field }) => field === 'email')"
                  required
                />

                <AppInput
                  v-model="password"
                  type="password"
                  label="Password"
                  placeholder="Password"
                  info="Must be at least 6 characters"
                  :error="formErrors.find(({ field }) => field === 'password')"
                  required
                />

                <AppInput
                  v-model="passwordConfirmation"
                  type="password"
                  label="Repeat password to verify"
                  placeholder="Repeat password"
                  :password="password"
                  :error="formErrors.find(({ field }) => field === 'password_confirmation')"
                  required
                />

                <AppInput
                  v-model="hasReferral"
                  name="has_referral"
                  type="single-checkbox"
                  label="Do you have any referral code with you?"
                />

                <AppInput
                  v-if="hasReferral"
                  v-model="referralCode"
                  type="text"
                  label="Referral Code"
                  required
                />

                <div class="flex flex-col py-2 mb-6">
                  <div class="flex flex-row flex-no-wrap justify-between">
                    <input
                      id="privacy_policy"
                      v-model="agreePrivacyPolicy"
                      type="checkbox"
                      class="checkbox mt-1 mr-1"
                    >

                    <label for="privacy_policy" class="text-xs sm:text-sm py-1">
                      I agree with the
                      <span class="cursor-pointer underline" @click="modal = true">Terms and Conditions and Privacy Policy</span>
                      of Hubzz
                      <span class="text-red-500">*</span>
                    </label>
                  </div>

                  <transition name="drop-down">
                    <div v-if="showPrivacyPolicyError" class="py-1 text-xs text-red-500">
                      Privacy policy is required
                    </div>
                  </transition>
                </div>
              </form>
            </div>
          </div>

          <div class="flex justify-center mt-4">
            <AppButton :label="!signingUp ? 'Sign Up' : 'Signing Up...'" :inStyle="'padding:6px 16px;'" :disabled="loading" @click="signUp" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="modal" class="shield" @click="modal = false" />
    
    <transition name="slide" mode="out-in">
      <div v-if="modal" class="py-8 modal-container">
        <div class="px-4 lg:px-10 pb-4">
          <svgicon
            name="left-arrow"
            height="32"
            width="32"
            class="cursor-pointer"
            @click="modal = false"
          />
        </div>
        <TermsAndConditions />
      </div>
    </transition>
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import TermsAndConditions from "@/components/TermsAndConditions"
import debounce from "lodash.debounce"

export default {

  components: {
    AppLoading,
    AppInput,
    AppButton,
    TermsAndConditions,
  },

  layout: "auth",

  data () {
    return {
      loading: false,
      professions: [],

      viewPermanentJobs: false,
      viewLocumJobs: false,
      professionId: '',
      title: '',
      firstName: '',
      lastName: '',
      suffix: '',
      mobileNumber: '',
      email: '',
      password: '',
      passwordConfirmation: '',

      hasReferral: false,
      referralCode: '',
      agreePrivacyPolicy: false,

      showPrivacyPolicyError: false,

      signingUp: false,
      formErrors: [],

      modal: false,
    }
  },

  computed: {
    professionsSelectionList () {
      return this.professions.map(profession => ({
        label: profession.name,
        value: profession.id,
      }))
    },
  },

  watch: {
    agreePrivacyPolicy () {
      this.showPrivacyPolicyError = !this.agreePrivacyPolicy
    },

    viewLocumJobs () {
      this.formErrors = this.formErrors.filter(formError => formError.field !== 'view_locum_jobs')
      this.formErrors = this.formErrors.filter(formError => formError.field !== 'view_permanent_jobs')
    },

    viewPermanentJobs () {
      this.formErrors = this.formErrors.filter(formError => formError.field !== 'view_locum_jobs')
      this.formErrors = this.formErrors.filter(formError => formError.field !== 'view_permanent_jobs')
    },

    professionId () {
      this.formErrors = this.formErrors.filter(formError => formError.field !== 'profession_id')

      if (!this.professionId) {
        this.formErrors.push({
          field: 'profession_id',
          message: 'Profession is required.',
          validation: 'required',
        })
        
        return
      }
    },

    firstName () {
      this.formErrors = this.formErrors.filter(formError => formError.field !== 'first_name')

      if (!this.firstName) {
        this.formErrors.push({
          field: 'first_name',
          message: 'First name is required.',
          validation: 'required',
        })
        
        return
      }
    },

    lastName () {
      this.formErrors = this.formErrors.filter(formError => formError.field !== 'last_name')

      if (!this.lastName) {
        this.formErrors.push({
          field: 'last_name',
          message: 'Last name is required.',
          validation: 'required',
        })
        
        return
      }
    },

    email () {
      this.formErrors = this.formErrors.filter(formError => formError.field !== 'email')

      if (!this.email) {
        this.formErrors.push({
          field: 'email',
          message: 'Email is required.',
          validation: 'required',
        })
        
        return
      }
    },

    password () {
      this.formErrors = this.formErrors.filter(formError => formError.field !== 'password')

      if (!this.password) {
        this.formErrors.push({
          field: 'password',
          message: 'Password is required.',
          validation: 'required',
        })
        
        return
      }
    },

    passwordConfirmation () {
      this.formErrors = this.formErrors.filter(formError => formError.field !== 'password_confirmation')

      if (!this.passwordConfirmation) {
        this.formErrors.push({
          field: 'password_confirmation',
          message: 'Password confirmation is required.',
          validation: 'required',
        })
        
        return
      }
    },
  },

  mounted () {
    this.loading = true
    this.$axios.get('/api/v1/professions?limit=999').then((response) => {
      this.professions = response.data.data.professions
    }).finally(() => {
      this.loading = false
    })
  },

  methods: {

    signUp: debounce(async function () {
      try {
        if (!this.agreePrivacyPolicy) {
          this.showPrivacyPolicyError = true
        }

        if (this.signingUp) {
          return
        }

        const data = {
          view_locum_jobs: this.viewLocumJobs,
          view_permanent_jobs: this.viewPermanentJobs,
          profession_id: this.professionId,
          title: this.title,
          first_name: this.firstName,
          last_name: this.lastName,
          suffix: this.suffix,
          mobile_number: this.mobileNumber,
          email: this.email,
          password: this.password,
          password_confirmation: this.password,
        }

        this.formErrors = await this.$validator(data, {
          view_locum_jobs: 'boolean',
          view_permanent_jobs: 'boolean',

          profession_id: 'required',

          title: 'string',
          first_name: 'required|string',
          last_name: 'required|string',
          suffix: 'string',

          mobile_number: 'string',

          email: 'required|email',
          password: 'required|string|min:6',
          password_confirmation: 'required|string|min:6|same:password',
        }, {
          'view_locum_jobs.boolean': 'Invalid view locum jobs.',

          'view_permanent_jobs.boolean': 'Invalid view permanent jobs.',

          'profession_id.required': 'Profession is required.',
          'profession_id.exists': 'Invalid profession.',

          'title.string': 'Invalid title.',

          'first_name.required': 'First name is required.',
          'first_name.string': 'Invalid first name.',

          'last_name.required': 'Last name is required.',
          'last_name.string': 'Invalid last name.',

          'suffix.string': 'Invalid suffix.',

          'mobile_number.string': 'Invalid mobile number.',

          'email.required': 'Email is required.',
          'email.email': 'Invalid email.',

          'password.required': 'Password is required.',
          'password.string': 'Invalid password.',
          'password.min': 'Password must be at least {{ argument.0 }} characters.',

          'password_confirmation.required': 'Password confirmation is required.',
          'password_confirmation.string': 'Invalid password confirmation.',
          'password_confirmation.min': 'Password confirmation must be at least {{ argument.0 }} characters.',
          'password_confirmation.same': 'Password do not match.',
        }).then(() => []).catch((errors) => errors)

        if (this.formErrors.length || this.showPrivacyPolicyError) {
          return
        }

        this.signingUp = true

        await this.$axios.post('/api/v1/locum/register', data, {
          params: {
            referral_code: this.referralCode,
          },
        })
        
        this.signingUp = false

        this.$router.push('/sign-up/success')
      } catch (err) {
        console.log('err', err.response || err)

        let message = null

        if (err.response) {
          if (err.response.status === 400 && err.response.data.error_messages) {
            this.formErrors = err.response.data.error_messages
          } else {
            message = err.response.data.message
          }
        } else if (err.request) {
          message = 'Something went wrong!'
        } else {
          message = err.message
        }

        if (message) {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: [`${message}`,],
          })
        }

        this.signingUp = false
      }
    }, 10),
  },
}
</script>

<style scoped>
  .modal-container {
    z-index: 510;
  }

  .upload-modal {
    position: fixed;
    top: 25%;
    left: 0;
    right: 0;
    height: auto;
    z-index: 601;
  }
  
  @media screen and (min-width: 1200px) {
    .modal-container {
      width: 50%;
    }
  }
  .shield {
    z-index: 509;
  }
</style>
