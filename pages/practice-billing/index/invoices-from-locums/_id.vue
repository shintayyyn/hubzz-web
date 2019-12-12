<template>
  <div class="invoice-modal shadow-lg">
    <div class="px-4 md:px-8 py-4 max-w-5xl h-screen">
      <div class="flex flex-row flex-wrap justify-start">
        <nuxt-link :to="`/practice-billing`">
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
      </div>
      <PracticeBillingInvoiceForm
        :selectedInvoice="invoice"
        @updateInvoice="$emit('updateInvoice', $event)"
      />
    </div>
  </div>
</template>

<script>
import PracticeBillingInvoiceForm from "@/components/Billing/PracticeBillingInvoiceForm";
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    PracticeBillingInvoiceForm
  },
  async asyncData({ app, error, params }) {
    try {
      if (process.client) {
        document.body.style.cursor = "wait";
      }
      const response = await app.$axios.get(
        `/api/v1/practice/locum-invoices/${params.id}`
      );
      const invoice =
        response.data && response.data.data && response.data.data.locum_invoice
          ? response.data.data.locum_invoice
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
  },

  data() {
    return {
      invoice: null
    };
  },

  // watch: {
  //   $route({ params }) {
  //     if (params && params.id) {
  //       this.removeNotification(parseInt(params.id));
  //     }
  //   }
  // },

  mounted() {
    document.body.style.overflow = "hidden";
    // this.removeNotification(parseInt(this.$route.params.id));
  },

  destroyed() {
    document.body.style.overflow = "auto";
  }

  // methods: {
  //   removeNotification(id) {
  //     let index = this.$store.state.billing.practice_billing_notifications.findIndex(
  //       billing => billing.id === id
  //     );
  //     if (index >= 0) {
  //       this.$store.commit("billing/REMOVE_PRACTICE_BILLING_NOTIFICATION", id);
  //     }
  //   }
  // }
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
