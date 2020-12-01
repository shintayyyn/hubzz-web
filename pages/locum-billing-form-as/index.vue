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
              v-model="locumInvoiceNumberIncludes"
              class="px-1"
              :type="'text'"
              :name="'locumInvoiceNumberIncludes'"
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
          v-if="locumFormAs.length > 0"
          :total="locumFormAsCount"
          :items="locumFormAs"
          :current-page="currentPage"
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
                @click="viewLocumFormA(slotProps.item.id)"
              >
                View Form A
              </div>

              <div
                v-if="!slotProps.item.locum_electronic_signature"
                class="my-1 py-2 px-3 font-bold rounded-lg focus:outline-none bg-yellow-500 hover:bg-yellow-400 cursor-pointer"
                @click="setLocumFormAIdToSign(slotProps.item.id)"
              >
                E-sign Form
              </div>

              <div
                v-if="!slotProps.item.sent_to_practice"
                class="my-1 py-2 px-3 font-bold rounded-lg focus:outline-none bg-yellow-500 hover:bg-yellow-400 cursor-pointer"
                @click="locumInvoiceIdToSend = slotProps.item.locum_invoice_id"
              >
                Send Form to Practice
              </div>

              <div
                v-if="slotProps.item.sent_to_practice && !slotProps.item.paid"
                class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                @click.stop.prevent="form.paid_at = null, locumFormAIdToPay = slotProps.item.id"
              >
                Mark as Paid
              </div>
            </div>
          </template>
        </AppTable>

        <div
          v-if="!locumFormAs.length && !isFiltered"
          class="flex justify-center"
        >
          You do not have any nhs form a.
        </div>

        <div
          v-if="!locumFormAs.length && isFiltered"
          class="flex justify-center py-4"
        >
          No nhs form a found.
        </div>
      </div>
    </transition>

    <div v-if="locumFormAIdToPay" class="p-2">
      <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
        <AppDate
          v-model="form.paid_at"
          :name="'paid_at'"
          :label="'Payment made on'"
          :error="formErrors.find(formError => formError.field === 'paid_at')"
          is-before
        />

        <div class="flex flex-row flex-no-wrap justify-center">
          <AppButton class="mx-1" :label="'Save'" :in-style="'padding:5px 10px'" @click="payFormA" />

          <AppButton
            class="mx-1"
            :label="'Cancel'"
            :in-style="'padding:5px 10px'"
            @click="locumFormAIdToPay = null"
          />
        </div>
      </div>
    </div>

    <div v-if="locumFormAIdToSign" class="p-2">
      <div class="relative rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
        <AppLoading :loading="locumESigningLocumFormA" spinner />

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
            v-if="!locumESigningLocumFormA"
            class="mx-1"
            :label="'Sign'"
            :in-style="'padding:5px 10px'"
            @click="locumESignLocumFormA"
          />

          <AppButton
            v-if="locumESigningLocumFormA"
            class="mx-1"
            :label="'Signing...'"
            :in-style="'padding:5px 10px'"
          />

          <AppButton
            class="mx-1"
            :label="'Cancel'"
            :in-style="'padding:5px 10px'"
            @click="locumFormAIdToSign = null"
          />
        </div>
      </div>
    </div>

    <AppConfirmationModal
      :label="'Send this Form A to Practice?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="locumInvoiceIdToSend"
      @confirm="sendForm"
      @cancel="locumInvoiceIdToSend = null"
    />

    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="locumFormAIdToPay || locumFormAIdToSign"
        :to="{ name: 'locum-billing-form-as' }"
        class="shield"
        @click.native="locumFormAIdToPay = null, locumFormAIdToSign = null"
      />
    </transition>

    <nuxt-child />
  </section>
</template>

<script>
import AppButton from "@/components/Base/AppButton"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
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
    AppConfirmationModal,
    AppTable,
  },

  data () {
    return {
      initialLoading: true,
      loading: false,

      filterModal: false,
      isFiltered: false,

      locumFormAsCount: 0,
      locumFormAs: [],

      showRefresh: false,
      currentPage: 1,

      offset: 0,
      limit: 5,
      order_by: [],

      ir35: null,
      locumInvoiceNumberIncludes: null,
      jobPartNumberIncludes: null,
      paid: null,

      locumFormAIdToPay: null,

      locumInvoiceIdToSend: null,

      form: {
        paid_at: null,
      },

      locumFormAIdToSign: null,
      locumESignText: "",
      fileFile: null,
      locumESigningLocumFormA: false,
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
        // {
        //   name: 'OOH',
        //   dataIndex: 'ooh',
        //   class: 'text-center',
        //   sortable: true,
        // },
        // {
        //   name: 'NHS Claimable',
        //   dataIndex: 'nhs_claimable_formatted',
        //   class: 'text-center',
        //   sortable: true,
        // },
        {
          name: "Paid By Practice At",
          dataIndex: "paid_by_practice_at_formatted",
          class: "text-center",
        },
        {
          name: "Paid By Locum At",
          dataIndex: "paid_at_formatted",
          class: "text-center",
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
      let jobIr35 = this.ir35 === "" ? null : this.ir35
      let isPaid = this.paid === "" ? null : this.paid

      let locumInvoiceNumberIncludes
        = this.locumInvoiceNumberIncludes === ""
          ? null
          : this.locumInvoiceNumberIncludes

      let jobPartNumberIncludes
        = this.jobPartNumberIncludes === "" ? null : this.jobPartNumberIncludes

      if (
        isPaid === null
        && jobIr35 === null
        && locumInvoiceNumberIncludes === null
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

  mounted () {
    this.$socket.on(
      "Locum Notification Locum Form A Paid",
      this.showRefreshLocumFormAs
    )
    this.$socket.on(
      "Locum Notification Locum Form A Paid By Practice",
      this.showRefreshLocumFormAs
    )
    this.$socket.on(
      "Locum Notification Locum Form A Sent To Practice",
      this.showRefreshLocumFormAs
    )
    this.$socket.on(
      "Locum Notification Locum Form A Locum E-signed",
      this.showRefreshLocumFormAs
    )
    this.$socket.on(
      "Locum Notification Locum Form A Practice E-signed",
      this.showRefreshLocumFormAs
    )

    this.initialLoading = true
    this.getJobPartsPromiseAll().finally(() => {
      this.initialLoading = false
    })
  },

  destroyed () {
    this.$socket.removeListener(
      "Locum Notification Locum Form A Paid",
      this.showRefreshLocumFormAs
    )
    this.$socket.removeListener(
      "Locum Notification Locum Form A Paid By Practice",
      this.showRefreshLocumFormAs
    )
    this.$socket.removeListener(
      "Locum Notification Locum Form A Sent To Practice",
      this.showRefreshLocumFormAs
    )
    this.$socket.removeListener(
      "Locum Notification Locum Form A Locum E-signed",
      this.showRefreshLocumFormAs
    )
    this.$socket.removeListener(
      "Locum Notification Locum Form A Practice E-signed",
      this.showRefreshLocumFormAs
    )
  },

  methods: {
    showRefreshLocumFormAs () {
      this.showRefresh = true
    },

    sendForm () {
      this.$axios
        .$put(
          `/api/v1/locum/locum-invoices-form-a/${this.locumInvoiceIdToSend}/send-to-practice`
        )
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
          this.locumInvoiceIdToSend = null

          const updatedFormA = this.locumFormAs.find(
            jobPart =>
              jobPart.locum_invoice_id
              === res.data.locum_form_a.locum_invoice_id
          )

          if (updatedFormA) {
            updatedFormA.sent_to_practice = true
          }
        })
    },

    viewLocumFormA (locumFormAId) {
      window.open(
        `${process.env.API_URL}/api/v1/locum-form-a/${locumFormAId}/pdf`
      )
    },

    getJobPartsPromiseAll () {
      return Promise.all([
        this.$axios.get("/api/v1/locum/locum-form-as/count", {
          params: {
            type: "Platform",
            ir35: this.ir35,
            paid: this.paid,
            locum_invoice_number_includes: this.locumInvoiceNumberIncludes,
            job_part_number_includes: this.jobPartNumberIncludes,
          },
        }),
        this.$axios.get("/api/v1/locum/locum-form-as", {
          params: {
            type: "Platform",
            ir35: this.ir35,
            paid: this.paid,
            locum_invoice_number_includes: this.locumInvoiceNumberIncludes,
            job_part_number_includes: this.jobPartNumberIncludes,
            offset: 0,
            limit: 5,
          },
        }),
      ]).then(([responseTotal, response,]) => {
        this.locumFormAsCount = responseTotal.data.data.count
        this.locumFormAs = response.data.data.locum_form_as
      })
    },

    async filterJobParts () {
      this.currentPage = 1
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
        .get("/api/v1/locum/locum-form-as", {
          params: {
            type: "Platform",
            offset: this.offset,
            limit: this.limit,

            ir35: this.ir35,
            paid: this.paid,
            locum_invoice_number_includes: this.locumInvoiceNumberIncludes,
            job_part_number_includes: this.jobPartNumberIncludes,

            order_by: this.order_by,
          },
        })
        .then(response => {
          this.locumFormAs = response.data.data.locum_form_as
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
    },

    async refreshInvoices () {
      this.loading = true
      this.currentPage = 1
      this.offset = 0
      this.limit = 5
      await this.getJobPartsPromiseAll()
      this.loading = false
      this.showRefresh = false
    },

    payFormA () {
      this.$axios
        .put(
          `/api/v1/locum/locum-form-as/${this.locumFormAIdToPay}/paid`,
          this.form
        )
        .then(response => {
          const locumFormA = response.data.data.locum_form_a

          const index = this.locumFormAs.findIndex(
            ({ id, }) => id === locumFormA.id
          )

          if (index > -1) {
            this.locumFormAs.splice(index, 1, locumFormA)
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.data.message}`,],
          })

          this.locumFormAIdToPay = null
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
    },

    setLocumFormAIdToSign (locumFormAIdToSign) {
      this.locumFormAIdToSign = locumFormAIdToSign
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

    locumESignLocumFormA () {
      const formData = new FormData()

      formData.append("text", this.locumESignText)

      if (this.fileFile) {
        formData.append("file", this.fileFile)
      }

      this.locumESigningLocumFormA = true

      this.$axios
        .put(
          `/api/v1/locum/locum-form-as/${this.locumFormAIdToSign}/e-sign`,
          formData
        )
        .then(response => {
          const locumFormA = response.data.data.locum_form_a

          const index = this.locumFormAs.findIndex(
            ({ id, }) => id === locumFormA.id
          )

          if (index > -1) {
            this.locumFormAs.splice(index, 1, locumFormA)
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.data.message}`,],
          })

          this.locumFormAIdToSign = null
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
          this.locumESigningLocumFormA = false
        })
    },

    async sorted (order_by) {
      this.currentPage = 1
      this.offset = 0
      this.order_by = order_by
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },

    async pagechanged (page) {
      this.currentPage = page
      this.offset = this.limit * (page - 1)
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },

    async limitchanged (limit) {
      this.currentPage = 1
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
      this.ir35 = null
      this.paid = null
      this.locumInvoiceNumberIncludes = null
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
