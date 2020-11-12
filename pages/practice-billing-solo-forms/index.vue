<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :event="initialLoading ? '' : 'click'"
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && (!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'to-be-invoiced')) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        To be Invoiced
      </nuxt-link>

      <nuxt-link
        :event="initialLoading ? '' : 'click'"
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'disputed') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Disputed Invoices
      </nuxt-link>

      <nuxt-link
        :event="initialLoading ? '' : 'click'"
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'issued') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Invoiced
      </nuxt-link>

      <nuxt-link
        :event="initialLoading ? '' : 'click'"
        :to="{ path: '/practice-billing/invoices-from-locums', query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-locums') && ($route.query.status && $route.query.status.toLowerCase() === 'approved') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Approved Invoices
      </nuxt-link>

      <nuxt-link
        :to="{ name: 'practice-billing-solo-forms' }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'practice-billing-solo-forms' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Solo Forms
      </nuxt-link>

      <nuxt-link
        :to="{ name: 'practice-billing-form-as' }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'practice-billing-form-as' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        NHS Pension Form A
      </nuxt-link>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
    </transition>

    <transition name="fade" mode="out-in">
      <div v-if="!initialLoading">
        <AppButton
          :label="'Filter'"
          :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
          @click="filterModal = !filterModal"
        />

        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
          @click="refreshInvoices"
        />

        <div
          class="flex-wrap justify-start items-end z-10 absolute w-full bg-white shadow-lg p-3 rounded-lg"
          :class="filterModal ? 'flex' : 'hidden'"
        >
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="ir35"
              class="px-1"
              :type="'select'"
              :name="'ir35'"
              :label="'Inside ir35'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: null} ]"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="invoice_number"
              class="px-1"
              :type="'text'"
              :name="'invoice_number'"
              :label="'Invoice number'"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="jobPartNumberIncludes"
              class="px-1"
              :type="'text'"
              :name="'jobPartNumberIncludes'"
              :label="'Job Part number'"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="paid"
              class="px-1"
              :type="'select'"
              :name="'paid'"
              :label="'Paid'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: null} ]"
            />
          </div>

          <div class="md:px-1 flex w-full">
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

            <AppButton
              class="mx-2 md:hidden"
              :label="'Close'"
              :in-style="'padding:5px 14px;margin-bottom:5px'"
              @click="filterModal = false"
            />
          </div>
        </div>

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
              class="flex flex-wrap justify-center"
            >
              <div
                class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                @click="viewAsPdf(slotProps.item.id)"
              >
                View Solo Form
              </div>

              <div
                v-if="!slotProps.item.practice_electronic_signature"
                class="my-1 py-2 px-3 font-bold rounded-lg focus:outline-none bg-yellow-500 hover:bg-yellow-400 cursor-pointer"
                @click="setLocumSoloFormIdToSign(slotProps.item.id)"
              >
                E-sign Form
              </div>

              <div
                v-if="!slotProps.item.sent_to_locum && authPermissions.includes('Process Billings')"
                class="my-1 py-2 px-3 font-bold rounded-lg focus:outline-none bg-yellow-500 hover:bg-yellow-400 cursor-pointer"
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
          You do not have any nhs form a.
        </div>

        <div
          v-if="!locumSoloForms.length && isFiltered"
          class="flex justify-center py-4"
        >
          No nhs form a found.
        </div>

        <div v-if="locumSoloFormIdToSign" class="p-2">
          <div
            class="relative rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3"
          >
            <AppLoading :loading="practiceESigningLocumSoloForm" spinner />

            <div class="px-1">
              <small class="italic">Please type in or upload your signature.</small>
            </div>

            <AppInput
              v-model="locumESignText"
              class="px-1"
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
      limit: 5,
      order_by: [],
      ir35: null,
      invoice_number: null,
      jobPartNumberIncludes: null,
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
        },
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true,
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
        },
        {
          name: "Under IR35",
          dataIndex: "ir35_formatted",
          class: "text-center",
        },
        {
          name: "Under Parent Practice",
          dataIndex: "under_parent_practice_formatted",
          class: "text-center",
        },
        {
          name: "Approved At",
          dataIndex: "approved_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Locum",
          dataIndex: "locum_user_name",
          class: "text-center",
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center",
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

      if (
        isPaid === null
        && jobIr35 === null
        && invoiceNumber === null
        && jobPartNumberIncludes === null
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
            offset: 0,
            limit: 5,
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
      this.limit = 5
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
      this.limit = 5
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
      this.limit = 5
      this.order_by = []
      this.ir35 = null
      this.paid = null
      this.invoice_number = null
      this.jobPartNumberIncludes = null
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
