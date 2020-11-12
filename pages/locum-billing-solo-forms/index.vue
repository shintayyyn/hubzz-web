<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && (!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'to-be-invoiced')) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        To be invoiced
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'disputed') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Disputed Invoices
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'issued') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Invoiced
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'approved') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Approved Invoices
      </nuxt-link>
      
      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ name: 'locum-billing-solo-forms' }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'locum-billing-solo-forms' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Solo Forms
      </nuxt-link>
      
      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ name: 'locum-billing-form-as' }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'locum-billing-form-as' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        NHS Pensions Form A
      </nuxt-link>

      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'pension-form-b' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-b') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        NHS Pensions Form B
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
              v-model="job_ir35"
              class="px-1"
              :type="'select'"
              :name="'job_ir35'"
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
              v-model="job_part_number_includes"
              class="px-1"
              :type="'text'"
              :name="'job_part_number_includes'"
              :label="'Job Part number'"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="is_paid"
              class="px-1"
              :type="'select'"
              :name="'is_paid'"
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
          :current-page="current_page"
          :per-page="limit"
          :columns="columns"
          :order-by="order_by"
          :loading="loading"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <template v-slot:actions="slotProps">
            <div class="flex flex-wrap justify-center">
              <div
                class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                @click="viewLocumSoloSoloFormsPdf(slotProps.item.id)"
              >
                View Solo Form
              </div>

              <div
                v-if="!slotProps.item.locum_electronic_signature"
                class="my-1 py-2 px-3 font-bold rounded-lg focus:outline-none bg-yellow-500 hover:bg-yellow-400 cursor-pointer"
                @click="setLocumSoloFormIdToSign(slotProps.item.id)"
              >
                E-sign Form
              </div>

              <div
                v-if="!slotProps.item.paid_at"
                class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                @click.stop.prevent="setLocumSoloFormIdToPay(slotProps.item.id)"
              >
                Mark as Paid
              </div>
            </div>
          </template>
        </AppTable>

        <div v-if="!locumSoloForms.length && !isFiltered" class="flex justify-center">
          You do not have any solo forms.
        </div>

        <div v-if="!locumSoloForms.length && isFiltered" class="flex justify-center py-4">
          No solo forms found
        </div>
      </div>
    </transition>

    <div v-if="locumSoloFormIdToPay" class="p-2">
      <div class="relative rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
        <AppLoading :loading="payingLocumSoloForm" spinner />

        <AppDate
          v-model="form.paid_at"
          :name="'paid_at'"
          :label="'Payment made on'"
          :error="formErrors.find(formError => formError.field === 'paid_at')"
          is-before
        />

        <div class="flex flex-row flex-no-wrap justify-center">
          <AppButton
            v-if="!payingLocumSoloForm"
            class="mx-1"
            :label="'Save'"
            :in-style="'padding:5px 10px'"
            @click="payLocumSoloForm"
          />

          <AppButton
            v-if="payingLocumSoloForm"
            class="mx-1"
            :label="'Saving...'"
            :in-style="'padding:5px 10px'"
          />

          <AppButton
            class="mx-1"
            :label="'Cancel'"
            :in-style="'padding:5px 10px'"
            @click="locumSoloFormIdToPay = null"
          />
        </div>
      </div>
    </div>

    <div v-if="locumSoloFormIdToSign" class="p-2">
      <div class="relative rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
        <AppLoading :loading="locumESigningLocumSoloForm" spinner />

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
            v-if="!locumESigningLocumSoloForm"
            class="mx-1"
            :label="'Sign'"
            :in-style="'padding:5px 10px'"
            @click="locumESignLocumSoloForm"
          />

          <AppButton
            v-if="locumESigningLocumSoloForm"
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

    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="locumSoloFormIdToPay || locumSoloFormIdToSign"
        :to="{ name: 'locum-billing-solo-forms' }"
        class="shield"
        @click.native="locumSoloFormIdToPay = null, locumSoloFormIdToSign = null"
      />
    </transition>

    <nuxt-child />
  </section>
</template>

<script>
import AppButton from "@/components/Base/AppButton"
import AppTable from "@/components/Base/AppTable"
import AppInput from "@/components/Base/AppInput"
import AppDate from "@/components/Base/AppDate"
import AppLoading from "@/components/Base/AppLoading"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    AppInput,
    AppDate,
    AppLoading,
    AppButton,
    AppTable,
  },

  data () {
    return {
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

      job_ir35: null,
      invoice_number: null,
      job_part_number_includes: null,
      is_paid: null,

      locumSoloFormIdToPay: null,
      payingLocumSoloForm: false,

      form: {
        paid_at: null,
      },

      locumSoloFormIdToSign: null,
      locumESignText: "",
      fileFile: null,
      locumESigningLocumSoloForm: false,
      signSrc: null,

      formErrors: [],
    }
  },

  computed: {
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
          name: "Paid At",
          dataIndex: "paid_at_formatted",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Approved At",
          dataIndex: "approved_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center",
        },
      ]
    },

    disabledClearFilter () {
      let jobIr35 = this.job_ir35 === "" ? null : this.job_ir35
      let isPaid = this.is_paid === "" ? null : this.is_paid
      let invoiceNumber
        = this.invoice_number === "" ? null : this.invoice_number
      let jobPartNumberIncludes
        = this.job_part_number_includes === ""
          ? null
          : this.job_part_number_includes

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

  mounted () {
    this.$socket.on('Locum Notification Locum Solo Form', this.getLocumInvoiceRealTime)

    this.initialLoading = true
    this.getJobPartsPromiseAll().finally(() => {
      this.initialLoading = false
    })
  },

  destroyed () {
    this.$socket.removeListener('Locum Notification Locum Solo Form', this.getLocumInvoiceRealTime)
  },

  methods: {
    viewLocumSoloSoloFormsPdf (locumSoloFormId) {
      window.open(`${process.env.API_URL}/api/v1/locum-solo-form/${locumSoloFormId}/pdf`)
    },

    getJobPartsPromiseAll () {
      return Promise.all([
        this.$axios.get('/api/v1/locum/locum-solo-forms/count', {
          params: {
            type: "Platform",
            job_ir35: this.job_ir35,
            is_paid: this.is_paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.job_part_number_includes,
          },
        }),
        this.$axios.get('/api/v1/locum/locum-solo-forms', {
          params: {
            type: "Platform",
            job_ir35: this.job_ir35,
            is_paid: this.is_paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.job_part_number_includes,
            offset: 0,
            limit: 5,
          },
        }),
      ])
        .then(([responseTotal, response,]) => {
          this.locumSoloFormsCount = responseTotal.data.data.count
          this.locumSoloForms = response.data.data.locum_solo_forms
        })
        .catch(([errTotal, err,]) => {
          console.log(
            "err",
            errTotal.response || errTotal || err.response || err
          )
          throw err
        })
    },

    async filterJobParts () {
      this.current_page = 1
      this.offset = 0
      this.limit = 5
      this.initialLoading = true
      this.isFiltered = true
      await this.getJobPartsPromiseAll()
      this.initialLoading = false
      this.filterModal = false
    },

    getJobParts () {
      return this.$axios
        .get('/api/v1/locum/locum-solo-forms', {
          params: {
            type: "Platform",
            job_ir35: this.job_ir35,
            is_paid: this.is_paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.job_part_number_includes,
            order_by: this.order_by,
            offset: this.offset,
            limit: this.limit,
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
      await this.getJobPartsPromiseAll()
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

    locumESignLocumSoloForm () {
      const formData = new FormData()

      formData.append("text", this.locumESignText)

      if (this.fileFile) {
        formData.append("file", this.fileFile)
      }

      this.locumESigningLocumSoloForm = true

      this.$axios
        .put(
          `/api/v1/locum/locum-solo-forms/${this.locumSoloFormIdToSign}/e-sign`,
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
          this.locumESigningLocumSoloForm = false
        })
    },

    setLocumSoloFormIdToPay (locumSoloFormIdToPay) {
      this.form.paid_at = null
      this.locumSoloFormIdToPay = locumSoloFormIdToPay
    },

    payLocumSoloForm () {
      this.payingLocumSoloForm = true
      this.$axios
        .put(
          `/api/v1/locum/locum-solo-forms/${this.locumSoloFormIdToPay}/paid`,
          this.form
        )
        .then(response => {
          const locumSoloForm = response.data.data.locum_solo_form

          const index = this.locumSoloForms.findIndex(({ id, }) => id === locumSoloForm.id)

          if (index > -1) {
            this.locumSoloForms.splice(index, 1, locumSoloForm)
          }

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: [`${response.data.message}`,],
          })

          this.locumSoloFormIdToPay = null
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
            message = "Something weng wrong!"
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
          this.payingLocumSoloForm = false
        })
    },

    async sorted (order_by) {
      this.current_page = 1
      this.offset = 0
      this.order_by = order_by
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },

    async pagechanged (page) {
      this.current_page = page
      this.offset = this.limit * (page - 1)
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },

    async limitchanged (limit) {
      this.current_page = 1
      this.offset = 0
      this.limit = limit
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },

    clearFilters () {
      this.offset = 0
      this.limit = 5
      this.order_by = []
      this.job_ir35 = null
      this.is_paid = null
      this.invoice_number = null
      this.job_part_number_includes = null
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
