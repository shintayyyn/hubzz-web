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
            <!-- sample uploaded file -->
            <div class="mt-4 bg-grey-lighter rounded-lg p-4 cursor-pointer">
              <div class="flex flex-nowrap justify-between">
                <div class="text-xs sm:text-sm hover:underline">Sample Uploaded File</div>
                <div class="font-bold text-md sm:text-lg hover:null" @click="remove">X</div>
              </div>
            </div>
            <div></div>
            <div class="flex justify-start mt-4">
              <label for="file-upload">
                <div class="flex flex-row flex-nowrap cursor-pointer hover:underline">
                  <svgicon name="cloud-upload" height="24" width="24"/>
                  <div class="ml-2 text-xs sm:text-sm leading-loose">Upload</div>
                </div>
              </label>
              <input type="file" id="file-upload" style="display:none">
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
              v-model="form.practice_type_id"
              :type="'multi-checkbox'"
              @checked="form.practice_type_id.push($event)"
              @unchecked="uncheckPractice($event)"
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
            <AppInput
              v-model="form.mandatory_training_id"
              :type="'multi-checkbox'"
              @checked="form.mandatory_training_id.push($event)"
              @unchecked="uncheckMandatory($event)"
              :name="'mandatory_training_id'"
              :label="'Mandatory training required from Locums:'"
              :placeholder="''"
              :error="this.formError.find(item => item.field === 'mandatory_training_id')"
              :lists="mandatory_trainings"
            />
          </div>
          <div class="flex flex-col w-full md:w-2/3 pl-1">
            <div class="text-xs sm:text-sm mt-3">Compliance Documents</div>
            <div class="flex flex-row flex-wrap justify-between">
              <div class="flex flex-col w-full md:w-1/2 pr-1">
                <AppInput
                  v-model="form.gp_compliance_document_id"
                  :type="'multi-checkbox'"
                  @checked="form.gp_compliance_document_id.push($event)"
                  @unchecked="uncheckGp($event)"
                  :name="'gp_compliance_document_id'"
                  :label="'For GPs:'"
                  :placeholder="''"
                  :error="this.formError.find(item => item.field === 'gp_compliance_document_id')"
                  :lists="gp_documents"
                />
              </div>
              <div class="flex flex-col w-full md:w-1/2 pl-1">
                <AppInput
                  v-model="form.others_compliance_document_id"
                  :type="'multi-checkbox'"
                  @checked="form.others_compliance_document_id.push($event)"
                  @unchecked="uncheckOther($event)"
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
        <div class="mt-8">
          <AppButton :label="'Save changes'" @click="save"/>
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
      mandatory_trainings: [],
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
      mandatory_training: [],
      name: '',
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
    // get default data 
    this.practice_detail.name = this.$auth.user.practice_detail.practice.surgery.name
    this.practice_detail.code = this.$auth.user.practice_detail.practice.surgery.code
    this.practice_detail.address = this.$auth.user.practice_detail.practice.surgery.address
    this.practice_detail.phone_number = this.$auth.user.practice_detail.practice.surgery.phone_number
    this.practice_detail.ccg = this.$auth.user.practice_detail.practice.surgery.clinical_commissioning_group.name
    this.form.phone_number = this.$auth.user.practice_detail.practice.phone_number
    this.form.report_to = this.$auth.user.practice_detail.practice.report_to
    this.form.email = this.$auth.user.practice_detail.practice.email
    this.form.extra_information = this.$auth.user.practice_detail.practice.extra_information
    this.form.practice_type_id = this.$auth.user.practice_detail.practice.practice_types.map(item => item.id)
    this.form.mandatory_training_id = this.$auth.user.practice_detail.practice.mandatory_trainings.map(item => item.id)
    this.form.gp_compliance_document_id = this.$auth.user.practice_detail.practice.gp_compliance_documents.map(item => item.id)
    this.form.others_compliance_document_id = this.$auth.user.practice_detail.practice.others_compliance_documents.map(item => item.id)
    // get practice types
    this.$axios.$get(`/api/v1/practice-types`)
      .then(res => {
        this.practice_types = []
        res.data.practice_types.forEach(item => {
          this.practice_types.push({ value: item.id, label: item.name })
        })
      })
    // get mandatory training 
    this.$axios.$get(`/api/v1/mandatory-trainings`).then(res => {
      this.mandatory_trainings = []
      res.data.mandatory_trainings.forEach(item => {
        this.mandatory_trainings.push({ label: item.name, value: item.id })
      })
    })

    // get compliance documents based on profession category (GP, Other)
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
    uncheckPractice(value) {
      this.form.practice_type_id = this.form.practice_type_id.filter(id => id != value)
    },
    uncheckOther(value) {
      this.form.others_compliance_document_id = this.form.others_compliance_document_id.filter(id => id != value)
    },
    uncheckGp(value) {
      this.form.gp_compliance_document_id = this.form.gp_compliance_document_id.filter(id => id != value)
    },
    uncheckMandatory(value) {
      this.form.mandatory_training_id = this.form.mandatory_training_id.filter(id => id != value)
    },
    remove() {
      this.$store.commit('SET_REMOVEUPLOADED_MODAL', true)
      this.$store.commit('SET_REMOVEUPLOADED_SHIELD', true)
    },
    save() {
      try {
        this.formError = []
        this.Validate(this.form, ['mandatory_training_id', 'extra_information'])
        if (!this.formError.length) {
          this.$axios.$put(`/api/v1/practice/me/profile`, this.form).then(res => {
            console.log(res)
            // set mandatory training
            this.$store.commit('profile/SET_MANDATORY_TRAINING', res.data.practice.mandatory_trainings)
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: res.message })
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>



