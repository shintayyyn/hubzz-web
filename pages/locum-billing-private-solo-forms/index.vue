<template>
  <section class="relative">
    <LocumBillingPrivateInvoicesTabs />

    <transition name="fade" mode="out-in">
      <div
        v-if="initialLoading"
        class="relative flex w-full"
        style="min-height:80px"
      >
        <AppLoading :loading="initialLoading" spinner />
      </div>

      <div v-if="!initialLoading">
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          @click="refreshInvoices"
        />

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
                v-if="slotProps.item.id"
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="viewLocumSoloFormPdf(slotProps.item.id, 'solo-form')"
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
                v-if="slotProps.item.id && !slotProps.item.paid_at"
                class="rounded text-xs px-2  hover:bg-orange-300 cursor-pointer"
                @click="locumSoloFormIdToPay = slotProps.item.id"
              >
                Mark as Paid
              </div>
            </div>
          </template>
        </AppTable>

        <div v-else class="flex justify-center">
          You do not have any Solo Forms.
        </div>
      </div>
    </transition>

    <div v-if="locumSoloFormIdToPay" class="p-2">
      <div
        class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3"
      >
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
            @click="payLocumSoloForm"
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
      <div
        class="relative rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3"
      >
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
            <img
              :src="signSrc"
              style="max-height: 200px;"
              class="mx-auto p-2 object-contain"
            >
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
        :to="{ name: 'locum-billing-private-solo-forms' }"
        :event="'click'"
        class="shield"
      />
    </transition>
  </section>
</template>

<script>
import LocumBillingPrivateInvoicesTabs from "@/components/LocumBilling/LocumBillingPrivateInvoicesTabs";
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppTable from "@/components/Base/AppTable";
import AppLoading from "@/components/Base/AppLoading";
import AppInput from "@/components/Base/AppInput";

export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },

  components: {
    LocumBillingPrivateInvoicesTabs,
    AppDate,
    AppButton,
    AppLoading,
    AppTable,
    AppInput
  },

  data() {
    return {
      initialLoading: false,
      loading: false,
      total: 0,
      job_parts: [],
      locum_form_bs: [],

      locumSoloFormsCount: 0,
      locumSoloForms: [],

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
        paye_amount: null
      },

      locumSoloFormIdToSign: null,
      locumESignText: "",
      fileFile: null,
      locumESigningLocumSoloForm: false,
      signSrc: null,

      formErrors: [],

      invoice_id: null,

      locumSoloFormIdToPay: null
    };
  },

  computed: {
    columns() {
      return [
        {
          name: "Practice / Surgery",
          dataIndex: "member_name", //from practice_name to member_name
          class: "text-center",
          sortable: true
        },
        {
          name: "Issued",
          dataIndex: "issued_at_in_gb_formatted",
          class: "text-center",
          sortable: true
        },
        {
          name: "Invoice Number",
          dataIndex: "invoice_number",
          width: 130
        },
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true,
          width: 130
        },
        {
          name: "£ Amount",
          dataIndex: "job_part_gross_rate_formatted",
          class: "text-center",
          sortable: true,
          width: 130
        },
        {
          name: "Paid At",
          dataIndex: "paid_at_formatted",
          class: "text-center",
          width: 100
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "dropdown",
          initialDropdown: "View Solo Form",
          width: 140
        }
      ];
    }
  },

  mounted() {
    this.current_page = 1;
    this.showRefresh = false;
    this.total = 0;
    this.job_parts = [];
    this.initialLoading = true;
    this.getCountAndPrivateLocumSoloForms().finally(() => {
      this.initialLoading = false;
    });
  },

  methods: {
    setLocumSoloFormIdToSign(locumSoloFormIdToSign) {
      this.locumSoloFormIdToSign = locumSoloFormIdToSign;
      this.locumESignText = `${
        this.$auth.user.name
      } - ${this.$moment.utc().format("DD/MM/YYYY")}`;
      this.fileFile = null;
    },

    inputfileHandler(event) {
      this.fileFile = null;

      if (event.target.files.length === 0) {
        return;
      }

      let file = event.target.files[0];

      let fileType = file.type.split("/")[0];

      if (fileType !== "image") {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format"]
        });

        return;
      }

      this.signSrc = URL.createObjectURL(file);
      this.fileFile = file;
    },

    errorHandler(err) {
      console.log("err", err.response || err);

      let message = null;

      if (err.response) {
        if (
          err.response.data.error_messages &&
          err.response.data.error_messages.length > 0
        ) {
          this.formErrors = err.response.data.error_messages;
        } else {
          message = err.response.data.message;
        }
      } else if (err.request) {
        message = "Something went wrong!";
      } else {
        message = err.message;
      }

      if (message) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: [`${message}`]
        });
      }
    },

    locumESignLocumSoloForm() {
      const formData = new FormData();

      formData.append("text", this.locumESignText);

      if (this.fileFile) {
        formData.append("file", this.fileFile);
      }

      this.locumESigningLocumSoloForm = true;

      this.$axios
        .put(
          `/api/v1/locum/locum-solo-forms/${this.locumSoloFormIdToSign}/e-sign`,
          formData
        )
        .then(response => {
          const locumSoloForm = response.data.data.locum_solo_form;

          const index = this.locumSoloForms.findIndex(
            ({ id }) => id === locumSoloForm.id
          );

          if (index > -1) {
            this.locumSoloForms.splice(index, 1, locumSoloForm);
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.data.message}`]
          });

          this.locumSoloFormIdToSign = null;
        })
        .catch(err => {
          this.errorHandler(err);
        })
        .finally(() => {
          this.locumESigningLocumSoloForm = false;
        });
    },

    payLocumSoloForm() {
      if (!this.locumSoloFormIdToPay) {
        return;
      }

      this.$axios
        .put(
          `/api/v1/locum/locum-solo-forms/${this.locumSoloFormIdToPay}/paid`,
          {
            paid_at: this.form.paid_at
          }
        )
        .then(response => {
          const locumSoloForm = response.data.data.locum_solo_form;

          const index = this.locumSoloForms.findIndex(
            ({ id }) => id === locumSoloForm.id
          );

          if (index > -1) {
            this.locumSoloForms.splice(index, 1, locumSoloForm);
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.data.message}`]
          });
        })
        .catch(err => {
          this.errorHandler(err);
        })
        .finally(() => {
          this.locumSoloFormIdToPay = null;
        });
    },

    viewLocumSoloFormPdf(locumSoloFormId) {
      window.open(
        `${process.env.API_URL}/api/v1/locum-solo-form/${locumSoloFormId}/pdf`
      );
    },

    getCountAndPrivateLocumSoloForms() {
      return Promise.all([
        this.$axios.get("/api/v1/locum/locum-solo-forms/count", {
          params: {
            type: "Private"
          }
        }),
        this.$axios.get("/api/v1/locum/locum-solo-forms", {
          params: {
            type: "Private",
            offset: 0,
            limit: 15
          }
        })
      ])
        .then(([responseTotal, response]) => {
          console.log(
            "Solo Form API response →",
            response.data.data.locum_solo_forms[0]
          );
          this.locumSoloFormsCount = responseTotal.data.data.count;
          this.locumSoloForms = response.data.data.locum_solo_forms;
        })
        .catch(([errTotal, err]) => {
          console.log(
            "err",
            errTotal.response || errTotal || err.response || err
          );
          throw err;
        });
    },

    getPrivateLocumSoloForms() {
      return this.$axios
        .get("/api/v1/locum/locum-solo-forms", {
          params: {
            type: "Private",
            order_by: this.order_by,
            offset: this.offset,
            limit: this.limit
          }
        })
        .then(response => {
          this.locumSoloForms = response.data.data.locum_solo_forms;
        })
        .catch(err => {
          console.log("err", err.response || err);
        });
    },

    async refreshInvoices() {
      this.$store.commit("billing/CLEAR_LOCUM_BILLING_NOTIFICATION");
      this.loading = true;
      await this.getCountAndPrivateLocumSoloForms();
      this.loading = false;
      this.showRefresh = false;
    },

    async sorted(order_by) {
      this.current_page = 1;
      this.offset = 0;
      this.order_by = order_by;
      this.loading = true;
      await this.getPrivateLocumSoloForms();
      this.loading = false;
    },

    async pagechanged(page) {
      this.current_page = page;
      this.offset = this.limit * (page - 1);
      this.loading = true;
      await this.getPrivateLocumSoloForms();
      this.loading = false;
    },

    async limitchanged(limit) {
      this.current_page = 1;
      this.offset = 0;
      this.limit = limit;
      this.loading = true;
      await this.getPrivateLocumSoloForms();
      this.loading = false;
    }
  }
};
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
