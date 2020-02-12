<template>
  <div class="invoice-modal shadow-lg">
    <div class="px-4 md:px-8 py-4 max-w-5xl h-screen">
      <div class="flex flex-row flex-wrap justify-start">
        <!-- <div @click="$router.go(-1)" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" width="32" />
        </div>-->
        <nuxt-link 
          :to="{ name: 'practice-billing-invoices-from-hubzz' }">
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>

      </div>
      <!-- billing -->
      <section>
        <div class="flex flex-wrap justify-start items-center">
          <div
            class="save-button text-xs sm:text-sm ml-4 mx-2 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
            @click="exportToPdf()"
          >Export to PDF</div>
        </div>

        <div class="flex flex-row flex-wrap justify-start items-center my-4">
          <label class="mx-1 py-2 px-3">Type:</label>
          <button
            class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none bg-yellow-500 border-yellow-500"
            :disabled="true"
          >Platform</button>
        </div>

        <div id="htmlpdf" class="max-w-3xl my-4 bg-white px-4 py-4 border shadow-md mb-32">
          <div class="flex flex-col">
            <div class="text-xs sm:text-sm sm:text-right leading-normal">
              <!-- <div>{{locum_user.name}}</div>
              <div>{{locum_user.email}}</div>-->
            </div>
            <div class="flex flex-wrap justify-between my-2">
              <div
                class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3"
              >
                <section>
                  <div class="relative flex flex-col py-2 mb-3 md:mb-6">
                    <div class="relative flex flex-row flex-no-wrap justify-between">
                      <label class="text-xs sm:text-sm py-1">To: Accounts Department</label>
                    </div>
                    <div class="relative flex flex-row flex-wrap justify-start">
                      <input
                        v-model="surgery_name"
                        type="text"
                        placeholder="Select.."
                        ref="input"
                        class="border-b-2 w-full focus:border-yellow-400 focus:outline-none py-3 font-bold text-xs sm:text-sm"
                        readonly
                      />
                    </div>
                  </div>
                </section>
              </div>
              <div class="w-full sm:w-1/2 order-1 sm:order-2 sm:text-right leading-normal">
                <div class="font-bold text-sm sm:text-lg">{{invoice.paid ? 'PAID':'ISSUED'}}</div>
                <div class="text-xs sm:text-sm">{{issuedOrPaid | localDate}}</div>
              </div>
            </div>
          </div>
          <div class="overflow-auto">
            <div class="items-table">
              <!-- thead -->
              <div class="flex justify-start">
                <div
                  style="width:430px"
                  class="bg-gray-900 text-white px-4 py-1 font-semibold border-r-2 border-white"
                >Description</div>
                <div
                  style="width:200px"
                  class="bg-gray-900 text-white px-4 py-1 font-semibold"
                >Total</div>
              </div>
              <!-- tbody -->
              <div v-if="invoice.practice_invoice_items.length > 0">
                <div
                  :id="`invoice-item-${index}`"
                  class="flex flex-col"
                  v-for="(item, index) in invoice.practice_invoice_items"
                  :key="item.id"
                >
                  <div class="flex justify-start mt-2">
                    <div
                      style="width:430px;min-height:80px;"
                      class="text-xs sm:text-sm border-b-2 border-gray-300 px-4 py-1"
                    >{{item.description}}</div>
                    <div
                      style="width:200px;min-height:80px;"
                      class="text-xs sm:text-sm border-b-2 border-gray-300 px-4 py-1 text-right"
                    >{{item.total}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-row flex-wrap justify-between px-2">
            <div class="w-full md:w-1/2 pr-1">
              <AppDate
                v-model="form.date_start"
                :name="'date_start'"
                :label="'Days worked from'"
                :error="formError.find(item => item.field === 'date_start')"
                :disabled="true"
              />
            </div>
            <div class="w-full md:w-1/2 pl-1">
              <AppDate
                v-model="form.date_end"
                :name="'date_end'"
                :label="'To'"
                :error="formError.find(item => item.field === 'date_end')"
                :disabled="true"
              />
            </div>
          </div>

          <div class="flex justify-between m-2">
            <span class="font-bold">Total</span>
            <div>
              <div class="flex justify-end">
                <div
                  class="rounded-lg bg-red-500 p-1 text-xs sm:text-sm text-white"
                  v-if="formError.find(item => item.field === 'total_amount')"
                >{{formError.find(item => item.field === 'total_amount').message}}</div>
              </div>
              £ {{invoice.total_amount | currency}}
            </div>
          </div>

          <div class="rounded-lg border-2 border-gray-300 mt-4 p-4">
            <div class="flex flex-col text-xs sm:text-sm">
              <div>Payment by BACS:</div>
              <div>Account name: Rick Sanchez</div>
              <div>Bank: citadel of Ricks Mutiversal Bank</div>
              <div>Sort code: 13</div>
              <div>Account number: 7337#4*OR</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import PracticeBillingInvoiceForm from "@/components/Billing/PracticeBillingInvoiceForm";
import AppDate from "@/components/Base/AppDate";
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    // PracticeBillingInvoiceForm,
    AppDate
  },
  async asyncData({ app, error, params }) {
    try {
      if (process.client) {
        document.body.style.cursor = "wait";
      }
      const response = await app.$axios.get(
        `/api/v1/practice/practice-invoices/${params.id}`
      );
      const invoice =
        response.data &&
        response.data.data &&
        response.data.data.practice_invoice
          ? response.data.data.practice_invoice
          : null;

      if (process.client) {
        document.body.style.cursor = "auto";
      }

      console.log("invoice", invoice);

      return {
        invoice
      };
    } catch (err) {
      if (err && err.response.status === 404) {
        return error({ status: 404, message: "This page could not be found" });
      } else if (err & (err.response.status === 500)) {
        return error({ status: 500, message: "Something went wrong!" });
      }
      throw err;
    }
  },

  data() {
    return {
      form: {
        date_start: null,
        date_end: null
      },
      formError: [],
      surgery_name: "",
      invoice: null
    };
  },

  computed: {
    issuedOrPaid() {
      return this.invoice.paid_at
        ? this.invoice.paid_at
        : this.invoice.issued_at;
    }
  },
  
  methods: {
    exportToPdf(){
      window.open(
        `${process.env.API_URL}/api/v1/practice-invoices/${this.invoice.id}/pdf?filename=${'hubzz_invoice_'+this.invoice.invoice_number}`
      );
    }
  },

  mounted() {
    this.surgery_name = this.invoice.practice.name;
    this.form.date_start = this.invoice.date_start;
    this.form.date_end = this.invoice.date_end;
    document.body.style.overflow = "hidden";
  },

  destroyed() {
    document.body.style.overflow = "auto";
  }
};
</script>

<style scoped>
.invoice-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  /* border-left: solid 2px #edf2f7; */
  transition: all 0.3s ease-in-out;
  /* background-color: rgb(80, 80, 80); */
  background: #fff;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .invoice-modal {
    width: 70%;
  }
}
.save-button {
  border-color: #ecc94b;
  background-color: #ecc94b;
}
.save-button:hover {
  color: #fff;
  /* background-color: rgb(80, 80, 80); */
  background-color: #d1b244;
  border-color: #d1b244;
  cursor: pointer;
}
.option-list {
  transition: all 0.3s ease-in-out;
  height: 0;
}
.slide-down {
  transition: all 0.3s ease-in-out;
  height: 200px;
}
/* surgery */
.loader-surgery {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  color: #ccc;
}
/* absolute bg-gray-300 w-full h-full top-0 bottom-0 left-0 right-0 */
</style>
