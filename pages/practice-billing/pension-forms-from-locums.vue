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
    try {
      console.log("pension forms from locums");
    } catch (err) {
      console.log("err", err.response || err);
    }
  }
};
</script>