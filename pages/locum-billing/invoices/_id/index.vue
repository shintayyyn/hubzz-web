<template>
  <div class="invoice-modal shadow-lg">
    <section class="bg-gray-700">
      <div class="p-8 max-w-3xl h-screen">
        <div class="flex flex-row flex-wrap justify-start">
          <nuxt-link to="/locum-billing/invoices" class="cursor-pointer">
            <svgicon name="left-arrow" height="32" width="32" />
          </nuxt-link>
        </div>

        <iframe :src="invoice.file.url" height="100%" width="100%"></iframe>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  transition: {
    name: 'slide',
    mode: 'out-in'
  },

  async asyncData({ app, error, params }) {
    try {
      if (process.client) {
        document.body.style.cursor = 'wait'
      }
      const response = await app.$axios.get(`/api/v1/locum/invoices/${params.id}`)
      const invoice = response.data && response.data.data && response.data.data.invoice ? response.data.data.invoice : null
      console.log('invoice', invoice)

      if (process.client) {
        document.body.style.cursor = 'auto'
      }

      return {
        invoice,
      }
    } catch (err) {
      if (err && err.response.status === 404) {
        return error({ status: 404, message: 'This page could not be found' })
      } else if (err & err.response.status === 500) {
        return error({ status: 500, message: 'Something went wrong!' })
      }
      throw err
    }
  },

  data() {
    return {
      invoice: null,
    };
  },

  mounted() {
    document.body.style.overflow = 'hidden'
  },

  destroyed() {
    document.body.style.overflow = 'auto'
  },


}
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
/* absolute bg-gray-200 w-full h-full top-0 bottom-0 left-0 right-0 */
</style>
