<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto mb-4 pt-1 border-b border-gray-500">
      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && (!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'to-be-invoiced')) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        To be invoiced
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'disputed') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Disputed Invoices
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'issued') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Invoiced
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'approved') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Approved Invoices
      </nuxt-link>
      
      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ name: 'locum-billing-solo-forms' }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'locum-billing-solo-forms' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Solo Forms
      </nuxt-link>
      
      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ name: 'locum-billing-form-as' }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'locum-billing-form-as' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        NHS Pensions Form A
      </nuxt-link>

      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'pension-form-b' } }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-b') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        NHS Pensions Form B
      </nuxt-link>
    </div>

    <AppFilter v-if="(!locumSoloForms.length && isFiltered) || (!initialLoading && locumSoloForms.length > 0) || (initialLoading && isFiltered)" :enableSearch="false">
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
            v-model="invoiceNumberIncludes"
            :wrapperClass="'px-1'"
            :type="'text'"
            :name="'invoiceNumberIncludes'"
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

        <div class="w-32">
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
        <AppButton
          class="mx-1"
          :label="'Apply'"
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
          <button @click="filterModal = !filterModal" class="flex items-center justify-between text-sm p-1 border rounded mr-1">
            <p class="mx-2">Filter</p>
            <span class="mx-2"><svgicon name="caret-down" width="10" :style="filterModal ? 'transform: rotate(180deg)' : ''" /></span>
          </button>

          <transition name="fade">
            <div v-if="filterModal" class="md:px-1 flex w-full">
              <AppButton
                :disabled="disabledClearFilter"
                :label="'Clear'"
                :in-style="'padding:5px 14px;margin-bottom:0'"
                @click="clearFilters"
              />

              <AppButton
                class="mx-2"
                :label="'Search'"
                :in-style="'padding:5px 14px;margin-bottom:0'"
                @click="filterJobParts"
              />
            </div>
            </transition>

          <AppButton
            v-if="showRefresh"
            :label="'Refresh'"
            :in-style="'padding:5px 14px;margin-bottom:0;font-size:14px;'"
            customTheme="border-2"
            @click="refreshInvoices"
          />
        </div>

       <transition name="drop-down">
        <div class="flex flex-col md:flex-row items-start mt-2" v-if="filterModal" >
          <div class="md:px-1 flex-1">
            <AppInput
              v-model="ir35"
              :wrapperClass="'px-1'"
              :type="'select'"
              :name="'ir35'"
              :label="'Inside ir35'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: null} ]"
            />
          </div>

          <div class="md:px-1 flex-1">
            <AppInput
              v-model="invoiceNumberIncludes"
              :wrapperClass="'px-1'"
              :type="'text'"
              :name="'invoiceNumberIncludes'"
              :label="'Invoice number'"
            />
          </div>

          <div class="md:px-1 flex-1">
            <AppInput
              v-model="jobPartNumberIncludes"
              :wrapperClass="'px-1'"
              :type="'text'"
              :name="'jobPartNumberIncludes'"
              :label="'Job Part number'"
            />
          </div>

          <div class="md:px-1 flex-1">
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
          :current-page="current_page"
          :per-page="limit"
          :columns="columns"
          :order-by="order_by"
          :loading="loading"
          :customWidth="800"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <template v-slot:actions="slotProps">
            <div class="flex flex-col bg-white border rounded border-gray-500">
              <div
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="viewLocumSoloSoloFormsPdf(slotProps.item.id)"
              >
                View Solo Form
              </div>

              <div
                v-if="!slotProps.item.locum_electronic_signature"
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="setLocumSoloFormIdToSign(slotProps.item.id)"
              >
                E-sign Form
              </div>

              <div
                v-if="!slotProps.item.paid_at"
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click.stop.prevent="setLocumSoloFormIdToPay(slotProps.item.id)"
              >
                Mark as Paid
              </div>
            </div>
          </template>
        </AppTable>

        <div v-if="!locumSoloForms.length && !isFiltered" class="flex justify-center py-4">
          You do not have any Solo Forms.
        </div>

        <div v-if="!locumSoloForms.length && isFiltered" class="flex justify-center py-4">
          No Solo Forms found
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
          class="hover:underline flex flex-row flex-no-wrap justify-center items-center bg-yellow-500 px-4 py-2 rounded cursor-pointer mt-5"
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
import AppFilter from "@/components/Base/AppFilter"

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
    AppFilter,
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
      limit: 15,
      order_by: [],

      ir35: null,
      invoiceNumberIncludes: null,
      jobPartNumberIncludes: null,
      paid: null,

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
          class: "text-center",
        },
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true,
          class: "text-center",
        },
        {
          name: "Job Title",
          dataIndex: "job_title",
          sortable: true,
          class: "text-center",
        },
        {
          name: "£ Amount",
          dataIndex: "job_part_gross_rate_formatted",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Locum Paid At",
          dataIndex: "paid_at_formatted",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Practice Paid At",
          dataIndex: "practice_paid_at_formatted",
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
          class: "dropdown",
          initialDropdown: 'View Solo Form',
          width: 140,
        },
      ]
    },

    disabledClearFilter () {
      let jobIr35 = this.ir35 === "" ? null : this.ir35
      let isPaid = this.paid === "" ? null : this.paid
      let invoiceNumber
        = this.invoiceNumberIncludes === "" ? null : this.invoiceNumberIncludes
      let jobPartNumberIncludes
        = this.jobPartNumberIncludes === ""
          ? null
          : this.jobPartNumberIncludes

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
    this.$socket.on(
      "Locum Notification Locum Solo Form Locum E-signed",
      this.getLocumInvoiceRealTime
    )
    this.$socket.on(
      "Locum Notification Locum Solo Form Practice E-signed",
      this.getLocumInvoiceRealTime
    )

    this.initialLoading = true
    this.getJobPartsPromiseAll().finally(() => {
      this.initialLoading = false
    })
  },

  destroyed () {
    this.$socket.removeListener('Locum Notification Locum Solo Form', this.getLocumInvoiceRealTime)
    this.$socket.removeListener(
      "Locum Notification Locum Solo Form Locum E-signed",
      this.getLocumInvoiceRealTime
    )
    this.$socket.removeListener(
      "Locum Notification Locum Solo Form Practice E-signed",
      this.getLocumInvoiceRealTime
    )
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
            ir35: this.ir35,
            paid: this.paid,
            invoice_number_includes: this.invoiceNumberIncludes,
            job_part_number_includes: this.jobPartNumberIncludes,
          },
        }),
        this.$axios.get('/api/v1/locum/locum-solo-forms', {
          params: {
            type: "Platform",
            ir35: this.ir35,
            paid: this.paid,
            invoice_number_includes: this.invoiceNumberIncludes,
            job_part_number_includes: this.jobPartNumberIncludes,
            offset: 0,
            limit: 15,
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
      this.limit = 15
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
            ir35: this.ir35,
            paid: this.paid,
            invoice_number_includes: this.invoiceNumberIncludes,
            job_part_number_includes: this.jobPartNumberIncludes,
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
      this.limit = 15
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

    errorHandler (err) {
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
          this.errorHandler(err)
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
          this.errorHandler(err)
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
      this.limit = 15
      this.order_by = []
      this.ir35 = null
      this.paid = null
      this.invoiceNumberIncludes = null
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
