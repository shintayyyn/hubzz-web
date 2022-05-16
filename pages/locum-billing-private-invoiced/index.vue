<template>
  <section class="relative">
    <LocumBillingPrivateInvoicesTabs />

    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>

      <div v-if="!initialLoading">
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          @click="refreshInvoices"
        />

        <AppTable
          v-if="job_parts.length > 0"
          :total="total"
          :items="job_parts"
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
            <div class="relative flex flex-col bg-white border rounded border-gray-500 z-20">
              <div
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="$router.push({ name: 'locum-billing-private-invoices-locumInvoiceId-edit', params: { locumInvoiceId: slotProps.item.locum_invoice_id } })"
              >
                Edit
              </div>

              <button
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer text-left"
                @click.stop.prevent="select_invoice(slotProps.item.locum_invoice_id, 'deleteInvoice')"
              >
                Delete
              </button>

              <button
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer text-left"
                @click.stop.prevent="locumInvoiceIdToSendToPrivatePractice = slotProps.item.locum_invoice_id"
              >
                Send to private practice
              </button>

              <button
                v-if="!slotProps.item.locum_invoice_item.locum_invoice.paid_at"
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer text-left"
                @click.stop.prevent="select_invoice(slotProps.item.locum_invoice_id, 'markAsPaid')"
              >
                Mark as Paid
              </button>

              <div
                v-if="
                  (authUser && authUser.profession_category_name === 'GP')
                    && !slotProps.item.locum_form_a_id
                    && !slotProps.item.locum_solo_form_id
                    && slotProps.item.shift && slotProps.item.shift.name !== 'OOH'
                    && claimNhs
                "
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="select_invoice(slotProps.item.locum_invoice_id, 'generateFormA')"
              >
                Generate Form A
              </div>

              <div
                v-if="
                  (authUser && authUser.profession_category_name === 'GP')
                    && !slotProps.item.locum_form_a_id
                    && !slotProps.item.locum_solo_form_id
                    && slotProps.item.shift && slotProps.item.shift.name === 'OOH'
                "
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="select_invoice(slotProps.item.locum_invoice_id, 'generateSoloForm')"
              >
                Generate Solo Form
              </div>
            </div>
          </template>
        </AppTable>

        <div v-else class="flex justify-center">
          You do not have any issued invoices.
        </div>
      </div>
    </transition>

    <AppConfirmationModal
      :label="'Proceed to delete this invoice?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="delete_invoice_modal"
      @confirm="deleteInvoice"
      @cancel="delete_invoice_modal = false"
    />

    <AppConfirmationModal
      :label="'Proceed to send this form a?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="locumInvoiceIdToSendToPrivatePractice ? true : false"
      :loading="sendingToPrivatePractice"
      @confirm="sendToPrivatePractice"
      @cancel="locumInvoiceIdToSendToPrivatePractice = null"
    />

    <AppConfirmationModal
      :label="'Generate NHS Form A for this Private Invoice?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="generate_form_a_modal"
      @confirm="generateFormA"
      @cancel="generate_form_a_modal = false"
    />

    <AppConfirmationModal
      :label="'Generate Solo Form for this Private Invoice?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="generate_solo_form_modal"
      @confirm="generateSoloForm"
      @cancel="generate_solo_form_modal = false"
    />

    <div v-if="payment_modal" class="p-2">
      <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
        <AppDate
          v-model="form.paid_at"
          :name="'paid_at'"
          :label="'Payment made on'"
          :error="formError.find(item => item.field === 'paid_at')"
          is-before
        />
        <AppInput
          v-model="form.ni"
          :type="'select'"
          :name="'ni'"
          :label="'NI'"
          :items="[{ label: 'No', value: false }, { label: 'Yes', value: true }]"
        />
        <AppInput
          v-if="[true, 'true'].includes(form.ni)"
          v-model="form.ni_amount"
          :type="'number'"
          :name="'ni_amount'"
          :label="'NI Amount'"
          :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
          :error="formError.find(item => item.field === 'ni_amount')"
        />
        <AppInput
          v-model="form.paye"
          :type="'select'"
          :name="'paye'"
          :label="'PAYE'"
          :items="[{ label: 'No', value: false }, { label: 'Yes', value: true }]"
        />
        <AppInput
          v-if="[true, 'true'].includes(form.paye)"
          v-model="form.paye_amount"
          :type="'number'"
          :name="'paye_amount'"
          :label="'PAYE Amount'"
          :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
          :error="formError.find(item => item.field === 'paye_amount')"
        />
        <div class="flex flex-row flex-no-wrap justify-center">
          <AppButton
            class="mx-1"
            :label="loadingPayment ? 'Loading...' : 'Save'"
            :in-style="'padding:5px 10px'"
            @click="loadingPayment ? null : confirmPayment()"
          />
          <AppButton
            class="mx-1"
            :label="'Cancel'"
            :in-style="'padding:5px 10px'"
            @click="payment_modal = false"
          />
        </div>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="[
          'locum-billing-private-invoices-id',
          'locum-billing-private-invoices-id-create',
          'locum-billing-private-invoices-id-edit',
          'locum-billing-private-invoices-form-b-create'
        ].includes($route.name)
          || generate_solo_form_modal
          || delete_invoice_modal
          || payment_modal
          || generate_form_a_modal
        "
        :to="{ name: 'locum-billing-private-invoices', query: {...$route.query }}"
        :event="payment_modal || generate_form_a_modal || generate_solo_form_modal || delete_invoice_modal ? '' : 'click'"
        class="shield"
      />
    </transition>

    <nuxt-child
      @updateInvoice="updateInvoice"
    />
  </section>
</template>

<script>
import LocumBillingPrivateInvoicesTabs from "@/components/LocumBilling/LocumBillingPrivateInvoicesTabs"
import AppDate from "@/components/Base/AppDate"
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppTable from "@/components/Base/AppTable"
import AppLoading from "@/components/Base/AppLoading"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    LocumBillingPrivateInvoicesTabs,
    AppDate,
    AppInput,
    AppButton,
    AppConfirmationModal,
    AppLoading,
    AppTable,
  },

  data () {
    return {
      initialLoading: false,
      loading: false,
      total: 0,
      job_parts: [],
      locum_form_bs: [],

      showRefresh: false,
      current_page: 1,

      offset: 0,
      limit: 15,
      order_by: [],

      form: {
        paid_at: null,
        ni: false,
        ni_amount: null,
        paye: false,
        paye_amount: null,
      },
      formError: [],

      delete_invoice_modal: false,
      generate_form_a_modal: false,
      generate_solo_form_modal: false,
      payment_modal: false,
      invoice_id: null,

      locumSoloFormIdToPay: null,
      locumFormAIdToPay: null,

      claimNhs: false,
      loadingPayment: false,

      authUser: null,

      locumInvoiceIdToSendToPrivatePractice: null,
      sendingToPrivatePractice: false,
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
          name: "Issued",
          dataIndex: "issued_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Invoice Number",
          dataIndex: "invoice_number",
          width: 130,
        },
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true,
          width: 130,
        },
        {
          name: "£ Amount",
          dataIndex: "job_part_gross_rate_formatted",
          class: "text-center",
          sortable: true,
          width: 130,
        },
        {
          name: "Sent At",
          dataIndex: "private_practice_emailed_at_in_gb_formatted",
          class: "text-center",
          width: 100,
        },
        {
          name: "Paid",
          dataIndex: "paid",
          class: "text-center",
          width: 100,
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: 'dropdown',
          initialDropdown: 'Edit',
          width: 120,
        },
      ]
    },
  },

  mounted () {
    this.current_page = 1
    this.showRefresh = false
    this.total = 0
    this.job_parts = []
    this.initialLoading = true
    this.getCountAndPrivateLocumInvoiced().finally(() => {
      this.initialLoading = false
    })

    this.$axios.get('/api/v1/me').then((response) => {
      this.claimNhs = response.data.data.user.locum_detail.claim_nhs
      this.authUser = response.data.data.user
    }).catch((err) => {
      console.log('err', err)
    })
  },

  methods: {
    getCountAndPrivateLocumInvoiced () {
      let url = `/api/v1/locum/job-parts`
      let locum_status = []
      let has_solo_form
      let has_form_a

      locum_status = ["Approved",]

      return Promise.all([
        this.$axios.$get(`${url}/count`, {
          params: {
            locum_status,
            has_solo_form,
            has_form_a,
            job_type: "Private",
            type: "Private",
          },
        }),
        this.$axios.$get(`${url}`, {
          params: {
            locum_status,
            has_solo_form,
            has_form_a,
            job_type: "Private",
            type: "Private",
            offset: 0,
            limit: 15,
          },
        }),
      ])
        .then(([responseTotal, response,]) => {
          this.total = responseTotal.data.count

          let job_parts = response.data.job_parts
          this.job_parts = job_parts.map(jobPart => {
            let total = jobPart.locum_invoice_id
              ? jobPart.locum_invoice_item.total
              : jobPart.job.locum_detail_rate_type.name === "Hourly"
                ? jobPart.job.rate * jobPart.final_hours
                : (jobPart.job.rate / jobPart.job.total_hours)
                * jobPart.final_hours

            total
              = jobPart.locum_invoice_item
              && jobPart.locum_invoice_item.locum_invoice
              && jobPart.locum_invoice_item.locum_invoice.paid_at
                ? total
                  - jobPart.locum_invoice_item.locum_invoice.ni_amount
                  - jobPart.locum_invoice_item.locum_invoice.paye_amount
                : total

            return {
              ...jobPart,
              practice_name:
                jobPart.job.type === "Platform"
                  ? jobPart.job.platform_job.practice.name
                  : jobPart.job.private_job.private_practice.name,
              issued_at: jobPart.locum_invoice_id
                ? jobPart.locum_invoice_item.locum_invoice.issued_at
                : null,
              invoice_number: jobPart.locum_invoice_id
                ? jobPart.locum_invoice_item.locum_invoice.invoice_number
                : null,
              total_amount: total,
              paid:
                jobPart.locum_status === "Approved"
                && jobPart.locum_invoice_item.locum_invoice.paid_at
                  ? "Yes"
                  : "No",
            }
          })
        })
        .catch(([errTotal, errJobParts,]) => {
          console.log(
            "err",
            errTotal.response || errTotal || errJobParts.response || errJobParts
          )
        })
    },

    getPrivateLocumInvoiced () {
      let url = `/api/v1/locum/job-parts`
      let locum_status = []
      let nhs_claimable
      let ooh

      locum_status = ["Approved",]

      return this.$axios
        .$get(`${url}`, {
          params: {
            locum_status,
            nhs_claimable,
            ooh,
            job_type: "Private",
            type: "Private",
            order_by: this.order_by,
            offset: this.offset,
            limit: this.limit,
          },
        })
        .then(res => {
          let job_parts = res.data.job_parts

          this.job_parts = job_parts.map(jobPart => {
            let total = jobPart.locum_invoice_id
              ? jobPart.locum_invoice_item.total
              : jobPart.job.locum_detail_rate_type.name === "Hourly"
                ? jobPart.job.rate * jobPart.final_hours
                : (jobPart.job.rate / jobPart.job.total_hours)
                * jobPart.final_hours

            total
              = jobPart.locum_invoice_item
              && jobPart.locum_invoice_item.locum_invoice
              && jobPart.locum_invoice_item.locum_invoice.paid_at
                ? total
                  - jobPart.locum_invoice_item.locum_invoice.ni_amount
                  - jobPart.locum_invoice_item.locum_invoice.paye_amount
                : total

            return {
              ...jobPart,
              practice_name:
                jobPart.job.type === "Platform"
                  ? jobPart.job.platform_job.practice.name
                  : jobPart.job.private_job.private_practice.name,
              issued_at: jobPart.locum_invoice_id
                ? jobPart.locum_invoice_item.locum_invoice.issued_at
                : null,
              invoice_number: jobPart.locum_invoice_id
                ? jobPart.locum_invoice_item.locum_invoice.invoice_number
                : null,
              total_amount: total,
              paid:
                jobPart.locum_status === "Approved"
                && jobPart.locum_invoice_item.locum_invoice.paid_at
                  ? "Yes"
                  : "No",
            }
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
    },

    async refreshInvoices () {
      this.$store.commit("billing/CLEAR_LOCUM_BILLING_NOTIFICATION")
      this.loading = true
      await this.getCountAndPrivateLocumInvoiced()
      this.loading = false
      this.showRefresh = false
    },

    select_invoice (id, type) {
      this.invoice_id = id
      if (type === "deleteInvoice") {
        this.delete_invoice_modal = true
      } else if (type === "generateFormA") {
        this.generate_form_a_modal = true
      } else if (type === "generateSoloForm") {
        this.generate_solo_form_modal = true
      } else if (type === "markAsPaid") {
        this.payment_modal = true
      }
    },

    deleteInvoice () {
      this.$axios
        .$delete(`/api/v1/locum/locum-invoices/${this.invoice_id}`)
        .then(res => {
          let job_part = this.job_parts.find(item => {
            return item.locum_invoice_id === this.invoice_id
          })

          job_part.locum_invoice_id = null
          job_part.total_amount
            = job_part.job.locum_detail_rate_type.name === "Hourly"
              ? job_part.final_hours * job_part.job.rate
              : job_part.job.rate

          let index = this.job_parts.findIndex(item => item.id === job_part.id)

          if (index >= 0) {
            this.job_parts.splice(index, 1)
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
          this.delete_invoice_modal = false
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`,],
            })
          }
        })
    },

    updateInvoice () {
      this.getPrivateLocumInvoiced()
    },

    sendToPrivatePractice () {
      this.sendingToPrivatePractice = true
      this.$axios
        .put(
          `/api/v1/locum/locum-invoices/${this.locumInvoiceIdToSendToPrivatePractice}/send-to-private-practice`)
        .then(res => {
          this.getPrivateLocumInvoiced()

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.data.message}`,],
          })

          this.locumInvoiceIdToSendToPrivatePractice = null
        })
        .catch(err => {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            if (err.response.status === 400 && err.response.data.error_messages) {
              this.formError = err.response.data.error_messages
              // const formErrors = err.response.data.error_messages

              // console.log('formErrors', formErrors)

              // message = formErrors.map(({ message, }) => message)
              //   .join('\n')
            } else {
              message = err.response.data.message
            }
          } else if (err.request) {
            message = 'Something went wrong!'
          } else {
            message = err.message
          }

          console.log('message', message)

          if (message) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: [`${message}`,],
            })
          }
        })
        .finally(() => {
          this.sendingToPrivatePractice = false
        })
    },

    generateFormA () {
      this.$axios
        .$post(`/api/v1/locum/locum-invoices-form-a`, {
          locum_invoice_id: this.invoice_id,
        })
        .then(res => {
          // get job part
          const jobPart = this.job_parts.find((jobPart) => !jobPart.locum_form_a_id && !jobPart.locum_solo_form_id && jobPart.locum_invoice_id === this.invoice_id)

          // put temp value
          jobPart.locum_form_a_id = 'generating form...'
          jobPart.locum_solo_form_id = 'loading...'

          this.getPrivateLocumInvoiced()

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
        })
        .catch(err => {
          console.log("err", err.response || err)

          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`,],
            })
          }

          throw err
        })
        .finally(() => {
          this.generate_form_a_modal = false
        })
    },

    generateSoloForm () {
      this.$axios
        .$post(`/api/v1/locum/locum-solo-form`, {
          locum_invoice_id: this.invoice_id,
        })
        .then(res => {
          this.getPrivateLocumInvoiced()

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
        })
        .catch(err => {
          console.log("err", err.response || err)

          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`,],
            })
          }

          throw err
        })
        .finally(() => {
          this.generate_solo_form_modal = false
        })
    },
    
    confirmPayment () {
      let notRequired = ["ni", "paye",]
      if ([false, "false",].includes(this.form.ni)) {
        notRequired.push("ni_amount")
      }
      if ([false, "false",].includes(this.form.paye)) {
        notRequired.push("paye_amount")
      }
      this.formError = []
      this.Validate(this.form, notRequired)
      if (!this.formError.length) {
        this.loadingPayment = true
        this.$axios
          .$put(
            `/api/v1/locum/locum-invoices/${this.invoice_id}/paid`,
            this.form
          )
          .then(res => {
            this.getPrivateLocumInvoiced()
            // let job_part = this.job_parts.find(
            //   item => item.id === res.data.locum_invoice.items[0].job_part.id
            // );

            // let index = this.job_parts.findIndex(
            //   item => item.id === job_part.id
            // );

            // if (index >= 0) {
            //   job_part.locum_invoice_item.locum_invoice.paid_at =
            //     res.data.locum_invoice.paid_at;
            //   job_part.locum_invoice_item.locum_invoice.ni =
            //     res.data.locum_invoice.ni;
            //   job_part.locum_invoice_item.locum_invoice.ni_amount =
            //     res.data.locum_invoice.ni_amount;
            //   job_part.locum_invoice_item.locum_invoice.paye =
            //     res.data.locum_invoice.paye;
            //   job_part.locum_invoice_item.locum_invoice.paye_amount =
            //     res.data.locum_invoice.paye_amount;
            //   this.job_parts.splice(index, 1, job_part);
            // }

            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`,],
            })

            this.payment_modal = false
            this.form.ni = false
            this.form.ni_amount = null
            this.form.paye = false
            this.form.paye_amount = null
          })
          .catch(err => {
            console.log('err', err.response || err)

            let message = null

            if (err.response) {
              if (err.response.status === 400 && err.response.data.error_messages) {
                this.formError = err.response.data.error_messages
                // const formErrors = err.response.data.error_messages

                // console.log('formErrors', formErrors)

                // message = formErrors.map(({ message, }) => message)
                //   .join('\n')
              } else {
                message = err.response.data.message
              }
            } else if (err.request) {
              message = 'Something went wrong!'
            } else {
              message = err.message
            }

            console.log('message', message)

            if (message) {
              this.$store.commit('SET_NOTIFICATION', {
                enabled: true,
                status: 'danger',
                text: [`${message}`,],
              })
            }
          })
          .finally(() => {
            this.loadingPayment = false
          })
      }
    },

    async sorted (order_by) {
      this.current_page = 1
      this.offset = 0
      this.order_by = order_by
      this.loading = true
      await this.getPrivateLocumInvoiced()
      this.loading = false
    },

    async pagechanged (page) {
      this.current_page = page
      this.offset = this.limit * (page - 1)
      this.loading = true
      await this.getPrivateLocumInvoiced()
      this.loading = false
    },

    async limitchanged (limit) {
      this.current_page = 1
      this.offset = 0
      this.limit = limit
      this.loading = true
      await this.getPrivateLocumInvoiced()
      this.loading = false
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
