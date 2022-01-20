<template>
  <section class="w-full">
    <div class="w-full xl:max-w-3xl p-4 md:p-6">
      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex flex-col items-start mb-6 mt-1 md:mx-4" style="flex: 0 1 600px;">
          <nuxt-link to="/" class="text-black focus:outline-none">
            <svgicon name="left-arrow" height="32" width="32" />
          </nuxt-link>
          <div class="mt-1 text-xl font-bold">
            Change Email Request
          </div>
        </div>
      </div>

      <div v-if="success" class="flex flex-col items-center justify-center w-full">
        <div class="flex w-full justify-center xl:justify-start">
          <div class="flex md:mx-4" style="flex: 0 1 600px;">
            <h3>
              Check your email inbox for further instructions
              <strong>should your email address match our records.</strong>
            </h3>
          </div>
        </div>
      </div>

      <div v-if="!success" class="flex flex-col items-center justify-center w-full">
        <div class="flex w-full justify-center xl:justify-start">
          <div class="flex md:mx-4" style="flex: 0 1 600px;">
            <h3>Please enter the details of your account at Hubzz. If your details matches our records, you'll receive an email with further instruction to proceed.</h3>
          </div>
        </div>

        <div class="flex w-full justify-center xl:justify-start">
          <div class="md:mx-4 flex flex-col p-2 md:p-4 m-1 rounded-lg border" style="flex: 0 1 600px;">
            <form class="w-full">
              <AppInput
                v-model="memorableWordCategoryId"
                type="select"
                label="Memorable Word Category"
                placeholder="Select..."
                :error="formErrors.find(item => item.field === 'memorable_word_category_id')"
                :items="memorableWordCategoriesSelectionList"
                required
              />

              <AppInput
                v-model="memorableWord"
                type="text"
                label="Memorable Word"
                placeholder="Your memorable word"
                :error="formErrors.find(error => error.field === 'memorable_word')"
                required
              />

              <AppDate
                v-model="memorableDate"
                label="Memorable Date"
                :error="formErrors.find(item => item.field === 'memorable_date')"
                required
              />

              <AppInput
                v-model="memorableNumber"
                type="number"
                label="Memorable 6 Digit Number"
                placeholder="Your memorable number"
                :error="formErrors.find(error => error.field === 'memorable_number')"
                required
                :limit="6"
              />

              <AppDate
                v-model="dateOfBirth"
                label="Date of Birth (optional for Locum)"
                :error="formErrors.find(item => item.field === 'date_of_birth')"
                isBefore
                :limitYear="100"
                :maxYearBefore="10"
              />

              <AppInput
                v-model="professionId"
                type="select"
                label="Profession (optional for Locum)"
                placeholder="Select..."
                :error="formErrors.find(item => item.field === 'profession_id')"
                :items="professionsSelectionList"
              />

              <AppInput
                v-model="practiceName"
                type="text"
                label="Practice Name (optional for Practice)"
              />

              <AppInput
                v-model="newEmail"
                type="email"
                label="New email"
                info="If you have an NHS email address, please use this"
                placeholder="Your new email address"
                :error="formErrors.find(item => item.field === 'new_email')"
                required
              />
            </form>
          </div>
        </div>

        <div class="flex w-full justify-center xl:justify-start mt-3">
          <div class="flex md:mx-4 justify-center" style="flex: 0 1 600px;">
            <AppButton label="Submit" @click="submit" />
          </div>
        </div>
        <!-- <button
          class="rounded-lg bg-yellow-500 shadow-md py-2 px-4 mt-3 font-bold md:text-xl focus:outline-none hover:text-white transition-hover"
          @click="submit"
        >
          Submit
        </button> -->
      </div>
     
    </div>
  </section>
</template>

<script>
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppDate from "@/components/Base/AppDate"

export default {

  components: {
    AppInput,
    AppDate,
    AppButton
  },

  layout: 'auth',

  data () {
    return {
      loading: false,

      professions: [],
      memorableWordCategories: [],

      memorableWordCategoryId: null,
      memorableWord: '',
      memorableDate: '',
      memorableNumber: '',
      dateOfBirth: null,
      professionId: null,
      practiceName: '',
      reference: '',
      newEmail: '',
        
      formErrors: [],
      setFocus: '',
      // sample
      success: false,
    }
  },

  computed: {

    professionsSelectionList () {
      return this.professions.map(({ id, name, }) => ({ label: name, value: id, }))
    },

    memorableWordCategoriesSelectionList () {
      return this.memorableWordCategories.map(({ id, name, }) => ({ label: name, value: id, }))
    },

    form () {
      return {
        memorable_word_category_id: this.memorableWordCategoryId,
        memorable_word: this.memorableWord,
        memorable_date: this.memorableDate,
        memorable_number: this.memorableNumber,
        date_of_birth: this.dateOfBirth,
        profession_id: this.professionId,
        practice_name: this.practiceName,
        new_email: this.newEmail,
      }
    },

    rules () {
      return {
        memorable_word_category_id: 'required',
        memorable_word: 'required|string',
        memorable_date: 'required|string',
        memorable_number: 'required|min:6|max:6',
        date_of_birth: 'string',
        practice_name: 'string',
        new_email: 'required|email',
      }
    },

    messages () {
      return {
        'memorable_word_category_id.required': 'Memorable word category is required.',
        'memorable_word.required': 'Memorable word is required.',
        'memorable_word.string': 'Invalid memorable word.',
        'memorable_date.required': 'Memorable date is required.',
        'memorable_date.string': 'Invalid memorable date.',
        'memorable_number.required': 'Memorable 6 digit number is required.',
        // 'memorable_number.integer': 'Invalid memorable 6 digit number.',
        'memorable_number.min': 'Memorable 6 digit number must be 6 digit.',
        'memorable_number.max': 'Memorable 6 digit number must be 6 digit.',
        'date_of_birth.string': 'Invalid date of birth.',
        'practice_name.string': 'Invalid practice name.',
        'new_email.required': 'New email is required.',
        'new_email.email': 'Invalid new email.',
      }
    },

  },

  watch: {
    memorableWordCategoryId () {
      const index = this.formErrors.findIndex((formError) => formError.field === 'memorable_word_category_id')

      if (this.memorableWordCategoryId) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
      } else {
        if (index === -1) {
          this.formErrors.push({
            field: 'memorable_word_category_id',
            message: 'Memorable word category is required.',
            validation: 'required',
          })
        }
      }
    },

    memorableWord () {
      const index = this.formErrors.findIndex((formError) => formError.field === 'memorable_word')

      if (this.memorableWord) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
      } else {
        if (index === -1) {
          this.formErrors.push({
            field: 'memorable_word',
            message: 'Memorable word is required.',
            validation: 'required',
          })
        }
      }
    },

    memorableDate () {
      const index = this.formErrors.findIndex((formError) => formError.field === 'memorable_date')

      if (this.memorableDate) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
      } else {
        if (index === -1) {
          this.formErrors.push({
            field: 'memorable_date',
            message: 'Memorable date is required.',
            validation: 'required',
          })
        }
      }
    },

    memorableNumber () {
      this.formErrors = this.formErrors.filter((formError) => {
        return formError.field !== 'memorable_number' && ['required', 'integer', 'min', 'max',].includes(formError.validation)
      })

      if (!this.memorableNumber) {
        this.formErrors.push({
          field: 'memorable_number',
          message: 'Memorable 6 digit number is required.',
          validation: 'required',
        })
        return
      }

      if (!(/^\d+$/.test(this.memorableNumber))) {
        this.formErrors.push({
          field: 'memorable_number',
          message: 'Invalid memorable 6 digit number.',
          validation: 'integer',
        })
        return
      }

      if (this.memorableNumber.toString().length !== 6) {
        console.log('mali eh', this.memorableNumber)
        this.formErrors.push({
          field: 'memorable_number',
          message: 'Memorable 6 digit number must be 6 digit.',
          validation: this.memorableNumber.toString().length > 6 ? 'max' : 'min',
        })
        return
      }
    },

    professionId () {
      const index = this.formErrors.findIndex((formError) => formError.field === 'profession_id')

      if (this.professionId) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
      } else {
        if (index === -1) {
          this.formErrors.push({
            field: 'profession_id',
            message: 'Profession is required.',
            validation: 'required',
          })
        }
      }
    },

    newEmail () {
      const index = this.formErrors.findIndex((formError) => formError.field === 'new_email')

      if (this.newEmail) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
      } else {
        if (index === -1) {
          this.formErrors.push({
            field: 'new_email',
            message: 'New email is required.',
            validation: 'required',
          })
        }
      }
    },

  },

  mounted () {
    this.success = false

    this.$axios.get('/api/v1/professions', {
      params: {
        limit: 999,
      },
    }).then((response) => {
      this.professions = response.data.data.professions
    })

    this.$axios.get('/api/v1/memorable-word-categories', {
      params: {
        limit: 999,
      },
    }).then((response) => {
      this.memorableWordCategories = response.data.data.memorable_word_categories
    })
  },

  methods: {

    async submit () {
      try {
        this.formErrors = await this.$validator(this.form, this.rules, this.messages).then(() => []).catch((errors) => errors)

        if (this.formErrors.length > 0) {
          return
        }

        await this.$axios.post(`/api/v1/change-email-requests`, this.form).then((res) => {
          console.log('res', res)
          this.success = true
        })

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
      }
    },
      
  },

}
</script>

<style scoped>
  button:active {
    transform: translate(2px, 2px);
  }
</style>
