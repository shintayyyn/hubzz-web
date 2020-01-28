<template>
  <div></div>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  async asyncData({ app, params, error }) {
    // try {
    //   const response = await app.$axios
    //     .$get(`/api/v1/practice/locum-invoices-form-b`)
    //     .then(res => {
    //       console.log(res);
    //     });
    // } catch (err) {
    //   console.log("err", err.response || err);
    // }
  }
};
</script>