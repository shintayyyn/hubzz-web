<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8 max-w-5xl h-screen">
      <div class="flex flex-row flex-wrap justify-start pb-4">
        <nuxt-link to="/locum-billing/invoices" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
      </div>
      <template v-if="isEditable">
        <BillingInvoiceForm
          :selectedInvoice="invoice"
          @updateInvoice="$emit('updateInvoice', $event)"
        />
      </template>
      <template v-if="!isEditable">
        <iframe :src="invoice.file.url" height="90%" width="100%"></iframe>
      </template>
    </div>
  </div>
</template>

<script>
import BillingInvoiceForm from "@/components/Billing/BillingInvoiceForm";
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    BillingInvoiceForm
  },
  computed: {
    isEditable() {
      return !this.invoice.file;
    }
  },
  async asyncData({ app, error, params }) {
    try {
      if (process.client) {
        document.body.style.cursor = "wait";
      }
      const response = await app.$axios.get(
        `/api/v1/locum/invoices/${params.id}`
      );
      const invoice =
        response.data && response.data.data && response.data.data.invoice
          ? response.data.data.invoice
          : null;

      if (process.client) {
        document.body.style.cursor = "auto";
      }

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
  }
};
</script>

<style scoped>
.modal-container {
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
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
