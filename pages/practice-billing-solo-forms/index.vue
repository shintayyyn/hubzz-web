<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto lg:overflow-y-hidden border-b border-gray-500 mb-4 pt-1">
      <nuxt-link
        :event="initialLoading ? '' : 'click'"
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && (!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'to-be-invoiced')) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        To be Invoiced
      </nuxt-link>

      <nuxt-link
        :event="initialLoading ? '' : 'click'"
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'disputed') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Disputed Invoices
      </nuxt-link>

      <nuxt-link
        :event="initialLoading ? '' : 'click'"
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'issued') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Invoiced
      </nuxt-link>

      <nuxt-link
        :event="initialLoading ? '' : 'click'"
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'approved') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Approved Invoices
      </nuxt-link>

      <nuxt-link
        :to="{ name: 'practice-billing-solo-forms' }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'practice-billing-solo-forms' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Solo Forms
      </nuxt-link>

      <nuxt-link
        :to="{ name: 'practice-billing-form-as' }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'practice-billing-form-as' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        NHS Pension Form A
      </nuxt-link>
    </div>

    <AppFilter :enableSearch="false" class="mt-4">
      <template v-slot:extraButton>
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          customTheme="border"
          @click="refreshInvoices"
        />
      </template>
      <template v-slot:filter>
        <div class="w-32">
          <AppInput
            v-model="ir35"
            :wrapperClass="'px-1'"
            :type="'select'"
            :name="'ir35'"
            :placeholder="'Inside ir35'"
            :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: ''} ]"
            nolabel
            border
          />
        </div>

        <div class="">
          <AppInput
            v-model="invoice_number"
            :wrapperClass="'px-1'"
            :type="'text'"
            :name="'invoice_number'"
            :label="'Invoice number'"
            nolabel
            border
          />
        </div>

        <div class="">
          <AppInput
            v-model="jobPartNumberIncludes"
            :wrapperClass="'px-1'"
            :type="'text'"
            :name="'jobPartNumberIncludes'"
            :label="'Job Part number'"
            nolabel
            border
          />
        </div>

        <div v-if="false" class="w-32">
          <AppInput
            v-model="paid"
            :wrapperClass="'px-1'"
            :type="'select'"
            :name="'paid'"
            :placeholder="'Paid'"
            :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: ''} ]"
            nolabel
            border
          />
        </div>
        
        <div class="">
          <AppInput
            v-model="locum_user_name_includes"
            :wrapperClass="'px-1'"
            :type="'text'"
            :name="'locum_user_name_includes'"
            :label="'Locum Name'"
            nolabel
            border
          />
        </div>

        <AppButton
          :label="'Apply'"
          class="mx-1"
          @click="filterJobParts"
        />

         <AppButton
          :disabled="disabledClearFilter"
          :label="'Clear'"
          customTheme="border hover:bg-gray-200"
          @click="clearFilters"
        />
      </template>
    </AppFilter>
    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
    </transition>

    <transition name="fade" mode="out-in">
      <div v-if="!initialLoading">
        <!-- <div class="flex items-center">
          <button
            class="flex items-center justify-between text-sm p-1 border border-gray-500 rounded mr-2"
            @click="filterModal = !filterModal"
          >
            <p class="mx-2">Filter</p>
            <span class="mx-2"><svgicon name="caret-down" width="10" :style="filterModal ? 'transform: rotate(180deg)' : ''" /></span>
          </button>

          <transition name="fade">
          <div class="md:px-1 flex w-full" v-if="filterModal">
            <AppButton
              :disabled="disabledClearFilter"
              :label="'Clear'"
              :in-style="'padding:5px 14px;margin-bottom:5px'"
              @click="clearFilters"
            />

            <AppButton
              class="mx-2"
              :label="'Search'"
              :in-style="'padding:5px 14px;margin-bottom:5px'"
              @click="filterJobParts"
            />
          </div>
          </transition>

          <AppButton
            v-if="showRefresh"
            :label="'Refresh'"
            :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
            customTheme="border-2"
            @click="refreshInvoices"
          />
        </div>

        <transition name="drop-down">
        <div class="flex flex-col md:flex-row items-start mt-2" v-if="filterModal">
          <div class="my-1 md:my-0 md:px-1 w-full md:flex-1">
            <AppInput
              v-model="ir35"
              :wrapperClass="'px-1'"
              :type="'select'"
              :name="'ir35'"
              :label="'Inside ir35'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: null} ]"
            />
          </div>

          <div class="my-1 md:my-0 md:px-1 w-full md:flex-1">
            <AppInput
              v-model="invoice_number"
              :wrapperClass="'px-1'"
              :type="'text'"
              :name="'invoice_number'"
              :label="'Invoice number'"
            />
          </div>

          <div class="my-1 md:my-0 md:px-1 w-full md:flex-1">
            <AppInput
              v-model="jobPartNumberIncludes"
              :wrapperClass="'px-1'"
              :type="'text'"
              :name="'jobPartNumberIncludes'"
              :label="'Job Part number'"
            />
          </div>

          <div v-if="false" class="my-1 md:my-0 md:px-1 w-full md:flex-1">
            <AppInput
              v-model="paid"
              :wrapperClass="'px-1'"
              :type="'select'"
              :name="'paid'"
              :label="'Paid'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: null} ]"
            />
          </div>

          
        </div>
        </transition> -->

        <AppTable
          v-if="locumSoloForms.length > 0"
          :total="locumSoloFormsCount"
          :items="locumSoloForms"
          :loading="loading"
          :current-page="current_page"
          :per-page="limit"
          :columns="columns"
          :order-by="order_by"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <template v-slot:actions="slotProps">
            <div
              v-if="practice.type !== 'Spoke' || 
                (practice.type === 'Spoke' && !practice.parent_practice_id) ||
                (practice.type === 'Spoke' && practice.parent_practice_id && practice.allow_surgery_bill_locum === true)"
              class="flex flex-col bg-white border rounded border-gray-500"
            >
              <div
                class="rounded text-xs px-2 hover:bg-sunglow cursor-pointer "
                @click="viewAsPdf(slotProps.item.id)"
              >
                View Solo Form
              </div>

              <div
                v-if="!slotProps.item.practice_electronic_signature"
                class="rounded text-xs px-2 hover:bg-sunglow cursor-pointer "
                @click="setLocumSoloFormIdToSign(slotProps.item.id)"
              >
                E-sign Form
              </div>

              <div
                v-if="!slotProps.item.sent_to_locum && authPermissions.includes('Process Billings')"
                class="rounded text-xs px-2 hover:bg-sunglow cursor-pointer "
                @click="locumSoloFormIdToBeSend = slotProps.item.id"
              >
                Send Form to Locum
              </div> 
            </div>

            <div v-else class="text-gray-600">
              Disabled by Hub
            </div>
          </template>
        </AppTable>

        <div
          v-if="!locumSoloForms.length && !isFiltered"
          class="flex justify-center"
        >
          You do not have any Solo Forms.
        </div>

        <div
          v-if="!locumSoloForms.length && isFiltered"
          class="flex justify-center py-4"
        >
          No Solo Forms found.
        </div>

        <div v-if="locumSoloFormIdToSign" class="p-2">
          <div
            class="relative rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3"
          >
            <AppLoading :loading="practiceESigningLocumSoloForm" spinner />

            <div :wrapperClass="'px-1'">
              <small class="italic">Please type in or upload your signature.</small>
            </div>

            <AppInput
              v-model="locumESignText"
              :wrapperClass="'px-1'"
              :type="'text'"
              :label="'Signature'"
              :error="formErrors.find(formError => formError.field === 'text')"
            />

            <div
              class="hover:underline flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 px-4 py-2 rounded cursor-pointer -mt-5"
              @click="$refs.inputFile.click()"
            >
              <input
                ref="inputFile"
                type="file"
                accept="image/*"
                class="inputfile hidden"
                @input="inputfileHandler"
              >

              <svgicon name="cloud-upload" height="24" width="24" />
              <label class="leading-loose mx-2 cursor-pointer">Upload Signature</label>
            </div>

            <div v-if="fileFile" class="w-full text-center break-words">
              <small>Uploaded file: {{ fileFile.name }}</small>
              <div class="w-full border mt-4">
                <img :src="signSrc" style="max-height: 200px;" class="mx-auto p-2 object-contain">
              </div>
            </div>

            <div class="flex flex-row flex-no-wrap justify-center mt-5">
              <AppButton
                v-if="!practiceESigningLocumSoloForm"
                class="mx-1"
                :label="'Sign'"
                :in-style="'padding:5px 10px'"
                @click="practiceESignLocumSoloForm"
              />

              <AppButton
                v-if="practiceESigningLocumSoloForm"
                class="mx-1"
                :label="'Signing...'"
                :in-style="'padding:5px 10px'"
              />

              <AppButton
                class="mx-1"
                :label="'Cancel'"
                :in-style="'padding:5px 10px'"
                @click="locumSoloFormIdToSign = null"
              />
            </div>
          </div>
        </div>

        <AppConfirmationModal
          :label="'Send this Solo Form to Locum?'"
          :confirm-label="'Yes'"
          :cancel-label="'Cancel'"
          :modal="!!locumSoloFormIdToBeSend"
          @confirm="sendLocumSoloFormToLocum"
          @cancel="locumSoloFormIdToBeSend = null"
        />

        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="locumSoloFormIdToBeSend || locumSoloFormIdToSign"
            :to="{ name: 'practice-billing-solo-forms' }"
            class="shield"
            @click.native="locumSoloFormIdToBeSend = null, locumSoloFormIdToSign = null"
          />
        </transition>

        <nuxt-child />
      </div>
    </transition>
  </section>
</template>

<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppTable from "@/components/Base/AppTable"
import AppButton from "@/components/Base/AppButton"
import AppInput from "@/components/Base/AppInput"
import AppLoading from "@/components/Base/AppLoading"
import AppFilter from "@/components/Base/AppFilter"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    AppConfirmationModal,
    AppTable,
    AppButton,
    AppLoading,
    AppInput,
    AppFilter
  },

  data () {
    return {
      user: "",
      practice: "",

      initialLoading: true,
      loading: false,
      filterModal: false,
      isFiltered: false,
      locumSoloFormsCount: 0,
      locumSoloForms: [],

      showRefresh: false,
      current_page: 1,

      offset: 0,
      limit: 15,
      order_by: [],
      ir35: null,
      invoice_number: null,
      jobPartNumberIncludes: null,
      locum_user_name_includes: null,
      paid: null,

      payment_modal: false,
      invoice_id: null,
      send_solo_form_modal: false,
      form: {
        paid_at: null,
        ni: false,
        ni_amount: null,
        paye: false,
        paye_amount: null,
      },

      locumSoloFormIdToSign: null,
      locumESignText: "",
      fileFile: null,
      signSrc: null,
      practiceESigningLocumSoloForm: false,

      locumSoloFormIdToBeSend: null,

      formErrors: [],
    }
  },

  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },

    columns () {
      return [
        {
          name: "Practice / Surgery",
          dataIndex: "practice_name",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Invoice Number",
          dataIndex: "invoice_number",
          sortable: true,
          width: 120
        },
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true,
          width: 150
        },
        {
          name: "Job Title",
          dataIndex: "job_title",
          sortable: true,
        },
        {
          name: "£ Amount",
          dataIndex: "job_part_gross_rate_formatted",
          class: "text-center",
          sortable: true,
          width: 120
        },
        {
          name: "Under IR35",
          dataIndex: "ir35_formatted",
          class: "text-center",
          width: 100
        },
        {
          name: "Under Parent Practice",
          dataIndex: "under_parent_practice_formatted",
          class: "text-center",
          width: 150
        },
        {
          name: "Approved At",
          dataIndex: "approved_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
          width: 150
        },
        {
          name: "Locum",
          dataIndex: "locum_user_name",
          class: "text-center",
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "dropdown",
          initialDropdown: 'View Solo Form',
          width: 165
        },
      ]
    },

    disabledClearFilter () {
      let jobIr35 = this.ir35 === "" ? null : this.ir35

      let isPaid = this.paid === "" ? null : this.paid

      let invoiceNumber
        = this.invoice_number === "" ? null : this.invoice_number

      let jobPartNumberIncludes
        = this.jobPartNumberIncludes === "" ? null : this.jobPartNumberIncludes

      let locumName = this.locum_user_name_includes === "" ? null : this.locum_user_name_includes 

      if (
        isPaid === null
        && jobIr35 === null
        && invoiceNumber === null
        && jobPartNumberIncludes === null
        && locumName === null
      ) {
        return true
      }

      return false
    },
  },

  watch: {
    locumESignText () {
      this.formErrors = this.formErrors.filter(
        formError => formError.field !== "text"
      )

      if (!this.locumESignText) {
        this.formErrors.push({
          field: "text",
          message: "E-sign text is required.",
          validation: "required",
        })
      } else if (this.locumESignText.length > 100) {
        this.formErrors.push({
          field: "text",
          message: "E-sign text maximum length is 100 characters.",
          validation: "max",
        })
      }
    },
  },

  created () {
    this.user = this.$auth.user
    this.practice
      = this.$auth.user
      && this.$auth.user.domain === "Practice"
      && this.$auth.user.practice_detail
        ? this.$auth.user.practice_detail.practice
        : null
  },

  mounted () {
    this.$socket.on(
      "Practice Notification Locum Solo Form",
      this.getLocumInvoiceRealTime
    )
    this.$socket.on(
      "Practice Notification Locum Solo Form Locum E-signed",
      this.getLocumInvoiceRealTime
    )
    this.$socket.on(
      "Practice Notification Locum Solo Form Practice E-signed",
      this.getLocumInvoiceRealTime
    )

    this.initialLoading = true
    this.getLocumSoloFormsPromiseAll()
      .catch(err => {
        console.log("err", err.response || err)
      })
      .finally(() => {
        this.initialLoading = false
      })
  },

  destroyed () {
    this.$socket.removeListener(
      "Practice Notification Locum Solo Form",
      this.getLocumInvoiceRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Locum Solo Form Locum E-signed",
      this.getLocumInvoiceRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Locum Solo Form Practice E-signed",
      this.getLocumInvoiceRealTime
    )
  },

  methods: {
    viewAsPdf (locumSoloFormId) {
      window.open(
        `${process.env.API_URL}/api/v1/locum-solo-form/${locumSoloFormId}/pdf`
      )
    },

    getLocumSoloFormsPromiseAll () {
      this.initialLoading = true
      return Promise.all([
        this.$axios.get("/api/v1/practice/locum-solo-forms/count", {
          params: {
            type: "Platform",
            ir35: this.ir35,
            paid: this.paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.jobPartNumberIncludes,
            practice_id: this.$auth.user.practice_id,
            locum_user_name_includes: this.locum_user_name_includes
          },
        }),
        this.$axios.get("/api/v1/practice/locum-solo-forms", {
          params: {
            type: "Platform",
            ir35: this.ir35,
            paid: this.paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.jobPartNumberIncludes,
            practice_id: this.$auth.user.practice_id,
            locum_user_name_includes: this.locum_user_name_includes,
            offset: 0,
            limit: 15,
          },
        }),
      ])
        .then(([responseTotal, responseJobParts,]) => {
          this.locumSoloFormsCount = responseTotal.data.data.count
          this.locumSoloForms = responseJobParts.data.data.locum_solo_forms
        })
        .catch(err => {
          console.log("err", err.response || err)
          this.$nuxt.error(err)
        })
        .finally(() => {
          this.initialLoading = false
        })
    },

    async filterJobParts () {
      this.current_page = 1
      this.offset = 0
      this.limit = 15
      this.initialLoading = true
      this.isFiltered = true
      await this.getLocumSoloFormsPromiseAll()
      this.initialLoading = false
      this.filterModal = false
    },

    getLocumSoloForms () {
      return this.$axios
        .get("/api/v1/practice/locum-solo-forms", {
          params: {
            type: "Platform",
            ir35: this.ir35,
            paid: this.paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.jobPartNumberIncludes,
            locum_user_name_includes: this.locum_user_name_includes,
            practice_id: this.$auth.user.practice_id,
            offset: this.offset,
            limit: this.limit,
            order_by: this.order_by,
          },
        })
        .then(response => {
          this.locumSoloForms = response.data.data.locum_solo_forms
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
    },

    async refreshInvoices () {
      this.loading = true
      this.current_page = 1
      this.offset = 0
      this.limit = 15
      await this.getLocumSoloFormsPromiseAll()
      this.loading = false
      this.showRefresh = false
    },

    getLocumInvoiceRealTime () {
      this.showRefresh = true
    },

    setLocumSoloFormIdToSign (locumSoloFormIdToSign) {
      this.locumSoloFormIdToSign = locumSoloFormIdToSign
      this.locumESignText = `${
        this.$auth.user.name
      } - ${this.$moment.utc().format("DD/MM/YYYY")}`
      this.fileFile = null
    },

    inputfileHandler (event) {
      this.fileFile = null

      if (event.target.files.length === 0) {
        return
      }

      let file = event.target.files[0]

      let fileType = file.type.split("/")[0]

      if (fileType !== "image") {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format",],
        })

        return
      }

      this.signSrc = URL.createObjectURL(file)
      this.fileFile = file
    },

    practiceESignLocumSoloForm () {
      const formData = new FormData()

      formData.append("text", this.locumESignText)

      if (this.fileFile) {
        formData.append("file", this.fileFile)
      }

      this.practiceESigningLocumSoloForm = true

      this.$axios
        .put(
          `/api/v1/practice/locum-solo-forms/${this.locumSoloFormIdToSign}/e-sign`,
          formData
        )
        .then(response => {
          const locumSoloForm = response.data.data.locum_solo_form

          const index = this.locumSoloForms.findIndex(
            ({ id, }) => id === locumSoloForm.id
          )

          if (index > -1) {
            this.locumSoloForms.splice(index, 1, locumSoloForm)
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.data.message}`,],
          })

          this.locumSoloFormIdToSign = null
        })
        .catch(err => {
          console.log("err", err.response || err)

          let message = null

          if (err.response) {
            if (
              err.response.data.error_messages
              && err.response.data.error_messages.length > 0
            ) {
              this.formErrors = err.response.data.error_messages
            } else {
              message = err.response.data.message
            }
          } else if (err.request) {
            message = "Something went wrong!"
          } else {
            message = err.message
          }

          if (message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${message}`,],
            })
          }
        })
        .finally(() => {
          this.practiceESigningLocumSoloForm = false
        })
    },

    sendLocumSoloFormToLocum () {
      this.$axios
        .put(
          `/api/v1/practice/locum-solo-forms/${this.locumSoloFormIdToBeSend}/send-to-locum`
        )
        .then(response => {
          const locumSoloForm = response.data.data.locum_solo_form

          const index = this.locumSoloForms.findIndex(({ id, }) => id === locumSoloForm.id)

          if (index > -1) {
            this.locumSoloForms.splice(index, 1, locumSoloForm)
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.data.message}`,],
          })

          this.locumSoloFormIdToBeSend = null
        })
        .catch(err => {
          console.log("err", err.response || err)

          let message = null

          if (err.response) {
            message = err.response.data.message
          } else if (err.request) {
            message = "Something went wrong!"
          } else {
            message = err.message
          }

          if (message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${message}`,],
            })
          }
        })
        
    },

    async sorted (order_by) {
      this.current_page = 1
      this.offset = 0
      this.order_by = order_by
      this.loading = true
      await this.getLocumSoloForms()
      this.loading = false
    },

    async pagechanged (page) {
      this.current_page = page
      this.offset = this.limit * (page - 1)
      this.loading = true
      await this.getLocumSoloForms()
      this.loading = false
    },

    async limitchanged (limit) {
      this.current_page = 1
      this.offset = 0
      this.limit = limit
      this.loading = true
      await this.getLocumSoloForms()
      this.loading = false
    },

    clearFilters () {
      this.offset = 0
      this.limit = 15
      this.order_by = []
      this.ir35 = null
      this.paid = null
      this.invoice_number = null
      this.jobPartNumberIncludes = null
      this.locum_user_name_includes = null
      this.filterJobParts()
    },
  },
}
</script>

<style scoped>
.shield {
  z-index: 511;
}

.payment-modal {
  position: fixed;
  background-color: white;
  z-index: 512;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
