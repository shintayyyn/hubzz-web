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
          customTheme="border-2"
          @click="filterModal = !filterModal"
        />

        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
          customTheme="border-2"
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
          v-if="locumFormAs.length > 0"
          :total="locumFormAsCount"
          :items="locumFormAs"
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
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="viewAsPdf(slotProps.item.id)"
              >
                View Form A
              </div>

              <div
                v-if="!slotProps.item.practice_electronic_signature"
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="setLocumFormAIdToSign(slotProps.item.id)"
              >
                E-sign Form
              </div>

              <div
                v-if="!slotProps.item.paid_by_practice"
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click.stop.prevent="locumFormAIdToBePaid = slotProps.item.id, locumFormAPaidAt = null"
              >
                Mark as Paid
              </div>
            </div>

            <div v-else class="text-gray-600">
              Disabled by Hub
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

        <div v-if="locumFormAIdToBePaid" class="p-2">
          <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
            <AppDate
              v-model="locumFormAPaidAt"
              :name="'paid_at'"
              :label="'Payment made on'"
              :error="formErrors.find(formError => formError.field === 'paid_at')"
              is-before
            />

            <div class="flex flex-row flex-no-wrap justify-center">
              <AppButton
                class="mx-1"
                :label="'Save'"
                :in-style="'padding:5px 10px'"
                @click="formAPaidByPractice"
              />

              <AppButton
                class="mx-1"
                :label="'Cancel'"
                :in-style="'padding:5px 10px'"
                @click="locumFormAIdToBePaid = null"
              />
            </div>
          </div>
        </div>

        <div v-if="locumFormAIdToSign" class="p-2">
          <div
            class="relative rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3"
          >
            <AppLoading :loading="practiceESigningLocumFormA" spinner />

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
                v-if="!practiceESigningLocumFormA"
                class="mx-1"
                :label="'Sign'"
                :in-style="'padding:5px 10px'"
                @click="practiceESignLocumFormA"
              />

              <AppButton
                v-if="practiceESigningLocumFormA"
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

        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="locumFormAIdToBePaid || locumFormAIdToSign"
            :to="{ name: 'practice-billing-form-as' }"
            class="shield"
            @click.native="locumFormAIdToBePaid = null, locumFormAIdToSign = null"
          />
        </transition>

        <nuxt-child />
      </div>
    </transition>
  </section>
</template>

<script>
import AppTable from "@/components/Base/AppTable"
import AppDate from "@/components/Base/AppDate"
import AppButton from "@/components/Base/AppButton"
import AppInput from "@/components/Base/AppInput"
import AppLoading from "@/components/Base/AppLoading"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    AppTable,
    AppDate,
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
      locumFormAsCount: 0,
      locumFormAs: [],

      showRefresh: false,
      current_page: 1,

      offset: 0,
      limit: 15,
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

      locumFormAPaidAt: null,
      locumFormAIdToBePaid: null,

      locumFormAIdToSign: null,
      locumESignText: "",
      fileFile: null,
      signSrc: null,
      practiceESigningLocumFormA: false,

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
          width: 130,
        },
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true,
          width: 130,
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
          width: 120,
        },
        {
          name: "Under IR35",
          dataIndex: "ir35_formatted",
          class: "text-center",
          width: 100,
        },
        {
          name: "Under Parent Practice",
          dataIndex: "under_parent_practice_formatted",
          class: "text-center",
          width: 150,
        },
        {
          name: "Paid By Practice At",
          dataIndex: "paid_by_practice_at_formatted",
          class: "text-center",
          width: 150,
        },
        {
          name: "Paid By Locum At",
          dataIndex: "paid_at_formatted",
          class: "text-center",
          width: 150,
        },
        {
          name: "Approved At",
          dataIndex: "approved_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
          width: 150,
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
          initialDropdown: 'View Form A',
          width: 125
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
      "Practice Notification Locum Form A Paid",
      this.getLocumInvoiceRealTime
    )
    this.$socket.on(
      "Practice Notification Locum Form A Sent To Practice",
      this.getLocumInvoiceRealTime
    )
    this.$socket.on(
      "Practice Notification Locum Form A Locum E-signed",
      this.getLocumInvoiceRealTime
    )
    this.$socket.on(
      "Practice Notification Locum Form A Practice E-signed",
      this.getLocumInvoiceRealTime
    )

    this.initialLoading = true
    this.getLocumFormAsPromiseAll()
      .catch(err => {
        console.log("err", err.response || err)
      })
      .finally(() => {
        this.initialLoading = false
      })
  },

  destroyed () {
    this.$socket.removeListener(
      "Practice Notification Locum Form A Paid",
      this.getLocumInvoiceRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Locum Form A Sent To Practice",
      this.getLocumInvoiceRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Locum Form A Locum E-signed",
      this.getLocumInvoiceRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Locum Form A Practice E-signed",
      this.getLocumInvoiceRealTime
    )
  },

  methods: {
    toggleSendFormAModal (locumInvoiceId, alreadySent) {
      if (alreadySent) return
      this.send_solo_form_modal = true
      this.invoice_id = locumInvoiceId
    },

    viewAsPdf (locumFormAId) {
      window.open(
        `${process.env.API_URL}/api/v1/locum-form-a/${locumFormAId}/pdf`
      )
    },

    getLocumFormAsPromiseAll () {
      this.initialLoading = true
      return Promise.all([
        this.$axios.get("/api/v1/practice/locum-form-as/count", {
          params: {
            type: "Platform",
            ir35: this.ir35,
            paid: this.paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.jobPartNumberIncludes,
            practice_id: this.$auth.user.practice_id,
          },
        }),
        this.$axios.get("/api/v1/practice/locum-form-as", {
          params: {
            type: "Platform",
            ir35: this.ir35,
            paid: this.paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.jobPartNumberIncludes,
            practice_id: this.$auth.user.practice_id,
            offset: 0,
            limit: 15,
          },
        }),
      ])
        .then(([responseTotal, responseJobParts,]) => {
          this.locumFormAsCount = responseTotal.data.data.count
          this.locumFormAs = responseJobParts.data.data.locum_form_as
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
      await this.getLocumFormAsPromiseAll()
      this.initialLoading = false
      this.filterModal = false
    },

    getLocumFormAs () {
      return this.$axios
        .get("/api/v1/practice/locum-form-as", {
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
          this.locumFormAs = response.data.data.locum_form_as
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
      await this.getLocumFormAsPromiseAll()
      this.loading = false
      this.showRefresh = false
    },

    getLocumInvoiceRealTime () {
      this.showRefresh = true
    },

    formAPaidByPractice () {
      this.formErrors = []

      this.Validate({
        paid_at: this.locumFormAPaidAt,
      })

      if (this.formErrors.length === 0) {
        this.$axios
          .put(
            `/api/v1/practice/locum-form-as/${this.locumFormAIdToBePaid}/paid`,
            {
              paid_at: this.locumFormAPaidAt,
            }
          )
          .then(response => {
            const locumFormA = response.data.data.locum_form_a

            const jobPart = this.locumFormAs.find(
              jobPart => jobPart.id === locumFormA.id
            )

            const index = this.locumFormAs.findIndex(
              jobPart => jobPart.id === locumFormA.id
            )

            if (jobPart && index > -1) {
              jobPart.paid_by_practice = locumFormA.paid_by_practice
              jobPart.paid_by_practice_formatted
                = locumFormA.paid_by_practice_formatted
              jobPart.paid_by_practice_at = locumFormA.paid_by_practice_at
              jobPart.paid_by_practice_at_formatted
                = locumFormA.paid_by_practice_at_formatted

              this.locumFormAs.splice(index, 1, jobPart)
            }

            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${response.data.message}`,],
            })

            this.locumFormAIdToBePaid = null
            this.locumFormAPaidAt = null
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
      }
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

    practiceESignLocumFormA () {
      const formData = new FormData()

      formData.append("text", this.locumESignText)

      if (this.fileFile) {
        formData.append("file", this.fileFile)
      }

      this.practiceESigningLocumFormA = true

      this.$axios
        .put(
          `/api/v1/practice/locum-form-as/${this.locumFormAIdToSign}/e-sign`,
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
          this.practiceESigningLocumFormA = false
        })
    },

    async sorted (order_by) {
      this.current_page = 1
      this.offset = 0
      this.order_by = order_by
      this.loading = true
      await this.getLocumFormAs()
      this.loading = false
    },

    async pagechanged (page) {
      this.current_page = page
      this.offset = this.limit * (page - 1)
      this.loading = true
      await this.getLocumFormAs()
      this.loading = false
    },

    async limitchanged (limit) {
      this.current_page = 1
      this.offset = 0
      this.limit = limit
      this.loading = true
      await this.getLocumFormAs()
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
