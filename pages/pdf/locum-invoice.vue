<template>
  <div>
    <div class="flex bg-gray-500 text-red-500" style="height: calc(1123px); width: calc(794px);">
      <pre>{{ locumInvoice }}</pre>
    </div>

    <div class="flex items-end justify-end bg-gray-500 text-red-500" style="height: calc(1123px); width: calc(794px);">
      <h1>LocumInvoice 1</h1>
    </div>

    <div class="flex items-end justify-end bg-gray-500 text-red-500" style="height: calc(1123px); width: calc(794px);">
      <h1>LocumInvoice 2</h1>
    </div>
  </div>
</template>

<script>
  export default {
    async asyncData({ app }) {
      try {
        const locumInvoice = await app.$axios.get('/api/v1/qualifications').then((response) => {
          return response.data.data.qualifications
        })

        return {
          locumInvoice,
        }
      } catch (err) {
        throw err
      }
    },

    data() {
      return {
        locumInvoice: null,
      }
    },
  }
</script>
