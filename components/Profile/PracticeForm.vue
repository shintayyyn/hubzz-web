<template>
  <div class="flex flex-col">
    <div class="flex flex-row flex-wrap justify0-between">
      <div class="w-full md:w-3/5 p-2">
        <div class="rounded-lg shadow-lg p-8">
          <div class="flex flex-row flex-wrap">
            <div class="flex flex-col w-full md:w-1/3 p-1">
              <div class="text-xs sm:text-sm">Practice name</div>
              <div class="text-xs font-bold py-2">{{practice_detail.name}}</div>
              <div class="text-xs sm:text-sm mt-4">CCG</div>
              <div class="text-xs font-bold py-2">{{practice_detail.ccg}}</div>
            </div>
            <div class="flex flex-col w-full md:w-1/3 p-1">
              <div class="text-xs sm:text-sm" mt-4>Practice code</div>
              <div class="text-xs font-bold py-2">{{practice_detail.code}}</div>
              <div class="text-xs sm:text-sm mt-4">Phone number</div>
              <div class="text-xs font-bold py-2">{{practice_detail.phone_number}}</div>
            </div>
            <div class="flex flex-col w-full md:w-1/3 p-1">
              <div class="text-xs sm:text-sm">Address</div>
              <div
                class="text-xs font-bold py-2"
              >{{practice_detail.address.line_1}} {{practice_detail.address.line_2}} {{practice_detail.address.line_3}} {{practice_detail.address.post_code}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full md:w-2/5 p-2">
        <div class="rounded-lg shadow-lg p-8">
          <div class="flex flex-col">
            <div class="text-xs sm:text-sm">Your Practice's standard terms</div>
            <div class="flex justify-start mt-4 cursor-pointer hover:underline">
              <svgicon name="cloud-upload" height="24" width="24"/>
              <div class="ml-2 text-xs sm:text-sm leading-loose">Upload</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full md:w-1/2 p-2">
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
      practice_detail: {
        name: '',
        code: '',
        address: '',
        phone_number: '',
        ccg: '',
      },
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
    this.practice_detail.name = this.$auth.user.practice_detail.practice.surgery.name
    this.practice_detail.code = this.$auth.user.practice_detail.practice.surgery.code
    this.practice_detail.address = this.$auth.user.practice_detail.practice.surgery.address
    this.practice_detail.phone_number = this.$auth.user.practice_detail.practice.surgery.phone_number
    this.practice_detail.ccg = this.$auth.user.practice_detail.practice.surgery.clinical_commissioning_group.name
    // get practice types
    this.$axios.$get(`/api/v1/practice-types`)
      .then(res => {
        this.practice_types = []
        res.data.practice_types.forEach(item => {
          this.practice_types.push({ value: item.id, label: item.name })
        })
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



