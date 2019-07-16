<template>
  <section>
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
        <div v-if="showErrorModal" class="absolute pin-t" >
          <div class="fixed text-white bg-red-light py-4 px-12 mr-10 md:mr-0 md:w-1/3 shadow" style="border-radius: 0 0 10px 10px">
            <span class="text-base font-bold">Failed to upload file</span>
            <div class="flex flex-wrap md:flex-no-wrap">
              <div class="w-full md:w-2/3 text-sm mt-2">
                <span>File format should be any of the following: </span>
                <ul>
                  <li>.pdf</li>
                  <li>.jpeg</li>
                  <li>.msword</li>
                  <li>.tif</li>
                </ul>
              </div>
              <button class="mx-auto md:mx-10 md:absolute pin-r pin-b w-32 my-2 md:my-10 p-4 text-sm rounded-lg shadow border border-white text-white hover:bg-white hover:text-black" @click="showErrorModal = false">Okay</button>
            </div>
          </div>
        </div>
        <div class="w-full md:w-2/5 p-2">
          <div class="rounded-lg shadow-lg p-8">
            <div class="flex flex-col">
              <div class="text-xs sm:text-sm">Your Practice's standard terms</div>
              <div class="mt-4 bg-grey-lighter rounded-lg p-4 ">
                <div class="flex flex-nowrap justify-between">
                  <div
                    class="text-xs sm:text-sm document-filename"
                  >{{ standard_terms && standard_terms.file ? standard_terms.file.filename : '' }}</div>
                  <div class="font-bold text-md sm:text-lg hover:null cursor-pointer ml-2" @click="modal = true">X</div>
                </div>
              </div>
              <div></div>
              <div class="flex justify-start mt-4">
                <label for="file-upload">
                  <div class="flex flex-row flex-nowrap cursor-pointer hover:underline">
                    <svgicon name="cloud-upload" height="24" width="24" />
                    <div class="ml-2 text-xs sm:text-sm leading-loose">Upload</div>
                  </div>
                </label>
                <input type="file" id="file-upload" class="hidden" @input="onFileInput($event)" />
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
                    @checked="form.others_compliance_document_id.push(parseInt($event))"
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
            <AppButton :label="'Save changes'" @click="save" />
          </div>
        </div>
      </div>
    </div>

    <div class="remove-confirmation-shield" v-if="modal"></div>
    <transition name="drop" mode="out-in">
      <div class="remove-confirmation-modal shadow-lg" v-if="modal">
        <RemoveConfirmationModal @close="modal = false" @remove="remove" />
      </div>
    </transition>
  </section>
</template>
<script>
import AppInput from '@/components/Base/AppInput'
import AppTextarea from '@/components/Base/AppTextarea'
import AppButton from '@/components/Base/AppButton'
import RemoveConfirmationModal from '@/components/Profile/RemoveConfirmationModal'
export default {
  components: {
    AppInput,
    AppTextarea,
    AppButton,
    RemoveConfirmationModal,
  },
  data() {
    return {
      modal: false,
      standard_terms: {
        file: {
          create_at: null,
          filename: '',
          id: '',
          size: '',
          subtype: '',
          type: '',
          url: ''
        }
      },
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
      formError: [],
      showErrorModal: false
    };
  },
  watch: {
    modal(value) {
      value ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto'
    }
  },
  created() {
    // get default data 
    this.$axios.$get(`/api/v1/me`).then(res => {
      console.log(res)
      // this.standard_terms = res.data.user.practice_detail.practice.standard_terms
      this.practice_detail.name = res.data.user.practice_detail.practice.surgery.name
      this.practice_detail.code = res.data.user.practice_detail.practice.surgery.code
      this.practice_detail.address = res.data.user.practice_detail.practice.surgery.address
      this.practice_detail.phone_number = res.data.user.practice_detail.practice.surgery.phone_number
      this.practice_detail.ccg = res.data.user.practice_detail.practice.surgery.clinical_commissioning_group.name
      this.form.phone_number = res.data.user.practice_detail.practice.phone_number
      this.form.report_to = res.data.user.practice_detail.practice.report_to
      this.form.email = res.data.user.practice_detail.practice.email
      this.form.extra_information = res.data.user.practice_detail.practice.extra_information

      res.data.user.practice_detail.practice.practice_types.forEach(item => {
        this.form.practice_type_id.push(item.id)
      })
      res.data.user.practice_detail.practice.mandatory_trainings.forEach(item => {
        this.form.mandatory_training_id.push(item.id)
      })
      res.data.user.practice_detail.practice.gp_compliance_documents.forEach(item => {
        this.form.gp_compliance_document_id.push(item.id)
      })
      res.data.user.practice_detail.practice.others_compliance_documents.forEach(item => {
        this.form.others_compliance_document_id.push(item.id)
      })
    })
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
    onFileInput(e) {
      if (!e.target.files.length) {
        return
      }
      let types = ['pdf', 'jpeg', 'msword', 'tif']
      let file = e.target.files[0]
      let fileType = file.type.split('/')[1]
      if (!types.includes(fileType)) {
        this.showErrorModal = true;
        return
      }
      const formData = new FormData()
      formData.append('file', file)
      this.$axios.$put(`/api/v1/practice/me/standard-terms`, formData).then(res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: res.message })
      })
      this.standard_terms.file.filename = file.name
      console.log(file.name)
    },
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
      // ! ask arvi hind na reremove ung document
      this.$axios.$delete(`/api/v1/practice/me/standard-terms`).then(res => {
        this.modal = false
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: res.message })
        this.standard_terms.file.filename = null
        console.log(this.standard_terms)
      })
    },
    save() {
      try {
        this.formError = []
        console.log(this.form)
        this.Validate(this.form, ['mandatory_training_id', 'extra_information'])
        if (!this.formError.length) {
          this.$axios.$put(`/api/v1/practice/me/profile`, this.form).then(res => {
            console.log(res)
            // set mandatory training
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
<style scoped>
.document-filename {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.remove-confirmation-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.remove-confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  z-index: 512;
}
</style>



