<template>
  <section class="w-full">
    <div class="w-full xl:max-w-3xl p-4 md:p-6">
      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex flex-col items-start mb-6 mt-1 md:mx-4" style="flex: 0 1 600px;">
          <nuxt-link to="/" class="text-black focus:outline-none">
            <svgicon name="left-arrow" height="32" width="32" />
          </nuxt-link>
          <div class="mt-1 text-xl font-bold">
            Locum Change Email Request
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
          <div class="md:mx-4 flex flex-col p-2 md:p-4 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
            <form class="w-full">
              <AppInput
                v-model="title"
                type="text"
                label="Title"
                placeholder="(ex. Mr., Ms., Mrs.)"
              />

              <AppInput
                v-model="firstName"
                type="text"
                label="First Name"
                placeholder="Your first name"
                :error="formErrors.find(error => error.field === 'first_name')"
                required
              />

              <AppInput
                v-model="lastName"
                type="text"
                label="Last Name"
                placeholder="Your last name"
                :error="formErrors.find(error => error.field === 'last_name')"
                required
              />

              <AppInput
                v-if="false"
                v-model="suffix"
                type="text"
                label="Suffix"
                placeholder="(ex. Ph.D., M.D., etc.)"
              />

              <AppInput
                v-model="mobileNumber"
                type="text"
                name="mobile_number"
                label="Mobile number"
                :limit="11"
                :showMobilePrefix="true"
                @keydown="inputNumberOnly($event)"
              />

              <AppInput
                v-model="professionId"
                type="select"
                label="Profession"
                placeholder="Select..."
                :error="formErrors.find(item => item.field === 'profession_id')"
                :items="professionsSelectionList"
                required
              />

              <AppInput
                v-if="professionId && complianceDocument"
                v-model="reference"
                type="text"
                :label="complianceDocumentName || 'Reference'"
                :error="formErrors.find(item => item.field === 'reference')"
                required
              />

              <AppInput
                v-if="professionId && !complianceDocument"
                v-model="nhsSmartCardIdNumber"
                type="text"
                label="NHS smart card ID number"
                :error="formErrors.find(item => item.field === 'nhs_smart_card_id_number')"
                required
              />

              <AppInput
                v-model="mandatoryTrainingIds"
                type="multi-checkbox"
                :name="'mandatory_training_id'"
                label="Please select at least 3 additional training courses completed."
                :lists="mandatoryTrainingsSelectionList"
                @checked="(mandatoryTrainingId) => mandatoryTrainingIds.push(parseInt(mandatoryTrainingId))"
                @unchecked="(mandatoryTrainingId) => mandatoryTrainingIds = mandatoryTrainingIds.filter(id => id !== parseInt(mandatoryTrainingId))"
                @uncheckAll="mandatoryTrainingIds = []"
              />

              <AppInput
                v-model="email"
                type="email"
                label="New email"
                info="If you have an NHS email address, please use this"
                placeholder="Your new email address"
                :error="formErrors.find(item => item.field === 'email')"
                required
              />
            </form>
          </div>
        </div>

        <button
          class="rounded-lg bg-yellow-500 shadow-md py-2 px-4 mt-3 font-bold md:text-xl focus:outline-none hover:text-white transition-hover"
          @click="submit"
        >
          Submit
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import AppInput from "@/components/Base/AppInput"

export default {

  components: {
    AppInput,
  },

  layout: 'auth',

  data () {
    return {
      loading: false,

      professions: [],
      mandatoryTrainings: [],

      title: '',
      firstName: '',
      lastName: '',
      suffix: '',
      mobileNumber: '',
      professionId: null,
      reference: '',
      nhsSmartCardIdNumber: '',
      mandatoryTrainingIds: [],
      email: '',
        
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

    mandatoryTrainingsSelectionList () {
      return this.mandatoryTrainings.map(({ id, name, }) => ({ label: name, value: id, }))
    },

    selectedProfession () {
      return this.professionId
        ? this.professions.find(profession => profession.id.toString() === this.professionId.toString()) || null
        : null
    },

    complianceDocument () {
      return this.selectedProfession
            && this.selectedProfession.profession_compliance_category
        ? this.selectedProfession.profession_compliance_category.locum_change_email_request_compliance_document
        : null
    },

    complianceDocumentId () {
      return this.complianceDocument
        ? this.complianceDocument.compliance_document_id
        : null
    },

    complianceDocumentName () {
      return this.complianceDocument
        ? this.complianceDocument.compliance_document_name
        : null
    },

    form () {
      return {
        title: this.title,
        first_name: this.firstName,
        last_name: this.lastName,
        suffix: this.suffix,
        mobile_number: this.mobileNumber,
        profession_id: this.professionId,
        compliance_document_id: this.professionId && this.complianceDocumentId,
        reference: this.complianceDocumentId
          ? this.reference
          : null,
        nhs_smart_card_id_number: this.professionId && !this.complianceDocumentId
          ? this.nhsSmartCardIdNumber
          : null,
        email: this.email,
      }
    },

    rules () {
      return {
        title: 'string',
        first_name: 'required|string',
        last_name: 'required|string',
        suffix: 'string',
        mobile_number: 'string',
        profession_id: 'required',
        reference: 'required_with_all:compliance_document_id',
        nhs_smart_card_id_number: 'required_without_all:compliance_document_id',
        email: 'required|email',
      }
    },

    messages () {
      return {
        'title.string': 'Invalid title.',
        'first_name.required': 'First name is required.',
        'first_name.string': 'Invalid first name.',
        'last_name.required': 'Last name is required.',
        'last_name.string': 'Invalid last name.',
        'suffix.string': 'Invalid suffix.',
        'mobile_number.string': 'Invalid mobile number.',
        'profession_id.required': 'Profession is required.',
        'reference.required_with_all': `${this.complianceDocumentName || 'Reference'} is required.`,
        'nhs_smart_card_id_number.required_without_all': 'NHS smart card ID number is required.',
        'email.required': 'New email is required.',
        'email.email': 'Invalid new email.',
      }
    },

  },

  watch: {

    firstName () {
      const index = this.formErrors.findIndex((formError) => formError.field === 'first_name')

      if (this.firstName) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
      } else {
        if (index === -1) {
          this.formErrors.push({
            field: 'first_name',
            message: 'First name is required.',
            validation: 'required',
          })
        }
      }
    },

    lastName () {
      const index = this.formErrors.findIndex((formError) => formError.field === 'last_name')

      if (this.lastName) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
      } else {
        if (index === -1) {
          this.formErrors.push({
            field: 'last_name',
            message: 'Last name is required.',
            validation: 'required',
          })
        }
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

    complianceDocumentId () {
      const referenceIndex = this.formErrors.findIndex((formError) => formError.field === 'reference')

      if (referenceIndex > -1) {
        this.formErrors.splice(referenceIndex, 1)
      }

      const nhsSmartCardIdNumberIndex = this.formErrors.findIndex((formError) => formError.field === 'nhs_smart_card_id_number')

      if (this.complianceDocumentId && nhsSmartCardIdNumberIndex > -1) {
        this.formErrors.splice(nhsSmartCardIdNumberIndex, 1)
      }
    },

    reference () {
      const index = this.formErrors.findIndex((formError) => formError.field === 'reference')

      if (!this.professionId) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
        return
      }

      if (!this.complianceDocumentId) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
        return
      }

      if (this.reference) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
      } else {
        if (index === -1) {
          this.formErrors.push({
            field: 'reference',
            message: `${this.complianceDocumentName || 'Reference'} is required.`,
            validation: 'required',
          })
        }
      }
    },

    nhsSmartCardIdNumber () {
      const index = this.formErrors.findIndex((formError) => formError.field === 'nhs_smart_card_id_number')

      if (!this.professionId) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
        return
      }

      if (this.complianceDocumentId) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
        return
      }

      if (this.nhsSmartCardIdNumber) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
      } else {
        if (index === -1) {
          this.formErrors.push({
            field: 'nhs_smart_card_id_number',
            message: 'NHS smart card ID number is required.',
            validation: 'required',
          })
        }
      }
    },

    email () {
      const index = this.formErrors.findIndex((formError) => formError.field === 'email')

      if (this.email) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
      } else {
        if (index === -1) {
          this.formErrors.push({
            field: 'email',
            message: 'Email is required.',
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

    this.$axios.get('/api/v1/mandatory-trainings', {
      params: {
        limit: 999,
      },
    }).then((response) => {
      this.mandatoryTrainings = response.data.data.mandatory_trainings
    })
  },

  methods: {

    async submit () {
      try {
        this.formErrors = await this.$validator(this.form, this.rules, this.messages).then(() => []).catch((errors) => errors)

        if (this.formErrors.length) {
          return
        }

        await this.$axios.post(`/api/v1/locum-change-email-requests`, this.form)

        this.success = true
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
