<template>
  <div class="flex flex-col">
    <div class="flex flex-row flex-wrap justify-between">
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

    <div class="w-full p-2">
      <div class="rounded-lg shadow-lg p-8">
        <div class="flex flex-row flex-wrap justify-between">
          <div class="flex flex-col w-full md:w-1/3 pr-1">
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
              v-model="form.email"
              :type="'email'"
              :name="'email'"
              :label="'Email Address'"
              :placeholder="''"
              :error="this.formError.find(item => item.field === 'email')"
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
          </div>
          <div class="flex flex-col w-full md:w-2/3 pl-1">
            <div class="text-xs sm:text-sm mt-3">Compliance Documents</div>
            <div class="flex flex-row flex-wrap justify-between">
              <div class="flex flex-col w-full md:w-1/2 pr-1">
                <AppInput
                  :type="'multi-checkbox'"
                  @checked="form.gp_compliance_document_id.push($event)"
                  @unchecked="form.gp_compliance_document_id.splice(form.gp_compliance_document_id.findIndex(item => item === $event), 1)"
                  :name="'gp_compliance_document_id'"
                  :label="'For GPs:'"
                  :placeholder="''"
                  :error="this.formError.find(item => item.field === 'gp_compliance_document_id')"
                  :lists="gp_documents"
                />
              </div>
              <div class="flex flex-col w-full md:w-1/2 pl-1">
                <AppInput
                  :type="'multi-checkbox'"
                  @checked="form.others_compliance_document_id.push($event)"
                  @unchecked="form.others_compliance_document_id.splice(form.others_compliance_document_id.findIndex(item => item === $event), 1)"
                  :name="'others_compliance_document_id'"
                  :label="'For Nurses, et al:'"
                  :placeholder="''"
                  :error="this.formError.find(item => item.field === 'others_compliance_document_id')"
                  :lists="others_documents"
                />
              </div>
            </div>
          </div>
        </div>
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
      gp_documents: [],
      gp_mandatory_compliance_documents: [],
      gp_optional_compliance_documents: [],
      others_documents: [],
      others_mandatory_compliance_documents: [],
      others_optional_compliance_documents: [],
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
    },
    'form.gp_compliance_document_id'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'gp_compliance_document_id')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value.length) {
        // required
        this.formError.push({ field: 'gp_compliance_document_id', message: 'Required' })
      }
    },
    'form.others_compliance_document_id'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'others_compliance_document_id')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value.length) {
        // required
        this.formError.push({ field: 'others_compliance_document_id', message: 'Required' })
      }
    },
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
    // get profession category
    this.$axios.$get(`/api/v1/profession-categories`)
      .then(res => {
        const gp = res.data.profession_categories.find(item => item.id === 1)
        const others = res.data.profession_categories.find(item => item.id === 2)
        this.gp_mandatory_compliance_documents = []
        gp.mandatory_compliance_documents.forEach(item => {
          this.gp_mandatory_compliance_documents.push({ value: item.id, label: item.name })
        })
        this.gp_optional_compliance_documents = []
        gp.optional_compliance_documents.forEach(item => {
          this.gp_optional_compliance_documents.push({ value: item.id, label: item.name })
        })
        this.gp_documents = [...this.gp_mandatory_compliance_documents, ...this.gp_optional_compliance_documents]
        this.others_mandatory_compliance_documents = []
        others.mandatory_compliance_documents.forEach(item => {
          this.others_mandatory_compliance_documents.push({ value: item.id, label: item.name })
        })
        this.others_optional_compliance_documents = []
        others.optional_compliance_documents.forEach(item => {
          this.others_optional_compliance_documents.push({ value: item.id, label: item.name })
        })
        this.others_documents = [...this.others_mandatory_compliance_documents, ...this.others_optional_compliance_documents]
      })
  },
  methods: {
    save() {
      try {
        this.formError = []
        this.Validate(this.form, ['mandatory_training_id', 'extra_information'])
        if (!this.formError.length) {
          this.$axios.$put(`/api/v1/practice/me/profile`, this.form).then(res => {
            console.log(res)
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
Alvin 05/23/2019
Tasks Completed:
- Registration Locums and Practices
- Practice Update Account Tab - User/Password
- Practice Update Profile - Compliance Documents for GPs and Others
Work in Progress:
- Practice Dashboard Create Job

Problems Encountered:
- Google API auto complete



