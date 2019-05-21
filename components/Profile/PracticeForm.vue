<template>
  <div class="flex flex-row flex-wrap justify-between">
    <div class="w-1/2 pr-4">
      <div class="rounded-lg shadow-lg p-8">
        <div class="w-full">
          <div class="flex flex-col mb-8">
            <div class="text-xs sm:text-base py-1">Practice name</div>
            <div class="text-xs sm:text-sm font-bold">practice name here</div>
          </div>
          <div class="flex flex-col my-8">
            <div class="text-xs sm:text-base py-1">Practice code</div>
            <div class="text-xs sm:text-sm font-bold">practice code here</div>
          </div>
          <div class="flex flex-col my-8">
            <div class="text-xs sm:text-base py-1">Address</div>
            <div class="text-xs sm:text-sm font-bold">address here</div>
          </div>
          <div class="flex flex-col my-8">
            <div class="text-xs sm:text-base py-1">Phone number</div>
            <div class="text-xs sm:text-sm font-bold">phone number here</div>
          </div>
          <div class="flex flex-col mt-8">
            <div class="text-xs sm:text-base py-1">CCG</div>
            <div class="text-xs sm:text-sm font-bold">ccg here</div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/2 pl-4">
      <div class="rounded-lg shadow-lg p-8">
        <form class="w-full">
          <AppInput
            v-model="form.email"
            :type="'email'"
            :name="'email'"
            :label="'Email'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'email')"
          />
          <AppInput
            v-model="form.phone_number"
            :type="'text'"
            :name="'phone_number'"
            :label="'Phone number'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'phone_number')"
          />
          <AppInput
            v-model="form.report_to"
            :type="'text'"
            :name="'report_to'"
            :label="'Report to'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'report_to')"
          />
          <AppInput
            :type="'multi-checkbox'"
            @checked="form.practice_type_id.push($event)"
            @unchecked="form.practice_type_id.splice(form.practice_type_id.findIndex(item => item === $event), 1)"
            :name="'practice_type_id'"
            :label="'What type of Practice are you?'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'practice_type_id')"
            :lists="practice_types"
          />
          <AppTextarea
            v-model="form.extra_information"
            :name="'extra_information'"
            :label="'Extra Information (Pracking restrictions, transport links, etc.)'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'extra_information')"
          />
          <AppButton :label="'Save changes'" @click="save"/>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
import AppTextarea from '@/components/Base/AppTextarea'
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    AppInput,
    AppTextarea,
    AppButton
  },
  data() {
    return {
      practice_types: [],
      form: {
        email: '',
        phone_number: '',
        report_to: '',
        extra_information: '',
        practice_type_id: [],
        // ! ask arvi on these
        mandatory_training_id: [],
        gp_compliance_document_id: [],
        others_compliance_document_id: []
      },
      formError: []
    }
  },
  watch: {
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
    'form.phone_number'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'phone_number')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'phone_number', message: 'Required' })
      } else {
        // validate options
        const error = this.ValidateMobile(value, 'phone_number')
        if (error) {
          this.formError.push(error)
        }
      }
    },
    'form.report_to'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'report_to')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'report_to', message: 'Required' })
      }
    },
    'form.extra_information'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'extra_information')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'extra_information', message: 'Required' })
      }
    },
    'form.practice_type_id'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'practice_type_id')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value.length) {
        // required
        this.formError.push({ field: 'practice_type_id', message: 'Required' })
      }
    }
  },
  created() {
    // ! ask arvi what endpoint to get the initial/updated data
    // get practice types
    this.$axios.$get(`/api/v1/practice-types`)
      .then(res => {
        this.practice_types = res.data.practice_types
      })
  },
  methods: {
    save() {
      try {
        this.formError = []
        this.Validate(this.form, ['mandatory_training_id', 'gp_compliance_document_id', 'others_compliance_document_id'])
        if (!this.formError.length) {
          this.$axios.$put(`/api/v1/practice/me/profile`).then(res => {
            //   ! ask arvi where to set the response
            console.log(res.message)
            console.log(res.data)
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>



