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
          v-if="locumFormAs.length > 0"
          :total="locumFormAsCount"
          :items="locumFormAs"
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
                v-if="slotProps.item.id"
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="viewLocumFormAPdf(slotProps.item.id)"
              >
                View Form A
              </div>

              <div
                v-if="!slotProps.item.locum_electronic_signature"
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="setLocumFormAIdToSign(slotProps.item.id)"
              >
                E-sign Form
              </div>

              <button
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer text-left"
                @click.stop.prevent="locumFormAIdToSendToPrivatePractice = slotProps.item.id"
              >
                Send to private practice
              </button>

              <div
                v-if="slotProps.item.id && !slotProps.item.paid"
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="locumFormAIdToPay = slotProps.item.id"
              >
                Mark as Paid
              </div>
            </div>
          </template>
        </AppTable>

        <div v-else class="flex justify-center">
          You do not have any NHS Pension Form A.
        </div>
      </div>
    </transition>

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
      :label="'Proceed to send this invoice?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="locumFormAIdToSendToPrivatePractice ? true : false"
      :loading="sendingToPrivatePractice"
      @confirm="sendToPrivatePractice"
      @cancel="locumFormAIdToSendToPrivatePractice = null"
    />

    <div v-if="locumFormAIdToPay" class="p-2">
      <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
        <AppDate
          v-model="form.paid_at"
          :name="'paid_at'"
          :label="'Payment made on'"
          :error="formErrors.find(item => item.field === 'paid_at')"
          is-before
        />

        <div class="flex flex-row flex-no-wrap justify-center">
          <AppButton
            class="mx-1"
            :label="'Save'"
            :in-style="'padding:5px 10px'"
            @click="payPrivateLocumFormA"
          />

          <AppButton
            class="mx-1"
            :label="'Cancel'"
            :in-style="'padding:5px 10px'"
            @click="locumFormAIdToPay = null"
          />
        </div>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="locumFormAIdToPay || locumFormAIdToSign"
        :to="{ name: 'locum-billing-private-form-as' }"
        :event="'click'"
        class="shield"
      />
    </transition>
  </section>
</template>

<script>
import LocumBillingPrivateInvoicesTabs from "@/components/LocumBilling/LocumBillingPrivateInvoicesTabs"
import AppDate from "@/components/Base/AppDate"
import AppButton from "@/components/Base/AppButton"
import AppTable from "@/components/Base/AppTable"
import AppLoading from "@/components/Base/AppLoading"
import AppInput from "@/components/Base/AppInput"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    LocumBillingPrivateInvoicesTabs,
    AppDate,
    AppButton,
    AppLoading,
    AppTable,
    AppInput,
    AppConfirmationModal,
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

      locumFormAsCount: 0,
      locumFormAs: [],

      locumFormAIdToSign: null,
      locumESignText: "",
      fileFile: null,
      locumESigningLocumFormA: false,
      signSrc: null,
      
      formErrors: [],

      delete_invoice_modal: false,
      generate_form_a_modal: false,
      generate_solo_form_modal: false,
      payment_modal: false,
      invoice_id: null,

      locumSoloFormIdToPay: null,
      locumFormAIdToPay: null,

      locumFormAIdToSendToPrivatePractice: null,
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
          name: "Paid At",
          dataIndex: "paid_at_formatted",
          class: "text-center",
          width: 100,
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "dropdown",
          initialDropdown: 'View Form A',
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
    this.getCountAndPrivateLocumFormAs().finally(() => {
      this.initialLoading = false
    })
  },

  methods: {
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
    },

    sendToPrivatePractice () {
      this.sendingToPrivatePractice = true
      this.$axios
        .put(
          `/api/v1/locum/locum-form-as/${this.locumFormAIdToSendToPrivatePractice}/send-to-private-practice`)
        .then(res => {
          const locumFormA = res.data.data.locum_form_a

          const index = this.locumFormAs.findIndex(
            ({ id, }) => id === locumFormA.id
          )

          if (index > -1) {
            this.locumFormAs.splice(index, 1, locumFormA)
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.data.message}`,],
          })

          this.locumFormAIdToSendToPrivatePractice = null
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

    payPrivateLocumFormA () {
      if (!this.locumFormAIdToPay) {
        return
      }

      this.$axios.put(`/api/v1/locum/locum-form-as/${this.locumFormAIdToPay}/paid`, {
        paid_at: this.form.paid_at,
      }).then((response) => {
        const locumFormA = response.data.data.locum_form_a

        const index = this.locumFormAs.findIndex(
          ({ id, }) => id === locumFormA.id
        )

        if (index > -1) {
          this.locumFormAs.splice(index, 1, locumFormA)
        }

        // const jobPart = this.job_parts
        //   .find(jobPart => jobPart.locum_invoice_id === response.data.data.locum_form_a.locum_invoice_id)

        // jobPart.locum_form_a_paid = 1

        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: [`${response.data.message}`,],
        })
      }).catch((err) => {
        this.errorHandler(err)
      }).finally(() => {
        this.locumFormAIdToPay = null
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
          this.errorHandler(err)
        })
        .finally(() => {
          this.locumESigningLocumFormA = false
        })
    },

    viewLocumFormAPdf (locumFormAId) {
      window.open(`${process.env.API_URL}/api/v1/locum-form-a/${locumFormAId}/pdf`)
    },

    getCountAndPrivateLocumFormAs () {
      return Promise.all([
        this.$axios.get("/api/v1/locum/locum-form-as/count", {
          params: {
            type: "Private",
          },
        }),
        this.$axios.get("/api/v1/locum/locum-form-as", {
          params: {
            type: "Private",
            offset: 0,
            limit: 15,
          },
        }),
      ]).then(([responseTotal, response,]) => {
        this.locumFormAsCount = responseTotal.data.data.count
        this.locumFormAs = response.data.data.locum_form_as
      })
    },

    getPrivateLocumFormAs () {
      return this.$axios
        .get("/api/v1/locum/locum-form-as", {
          params: {
            type: "Platform",
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
      this.$store.commit("billing/CLEAR_LOCUM_BILLING_NOTIFICATION")
      this.loading = true
      await this.getCountAndPrivateLocumFormAs()
      this.loading = false
      this.showRefresh = false
    },

    async sorted (order_by) {
      this.current_page = 1
      this.offset = 0
      this.order_by = order_by
      this.loading = true
      await this.getPrivateLocumFormAs()
      this.loading = false
    },

    async pagechanged (page) {
      this.current_page = page
      this.offset = this.limit * (page - 1)
      this.loading = true
      await this.getPrivateLocumFormAs()
      this.loading = false
    },

    async limitchanged (limit) {
      this.current_page = 1
      this.offset = 0
      this.limit = limit
      this.loading = true
      await this.getPrivateLocumFormAs()
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
