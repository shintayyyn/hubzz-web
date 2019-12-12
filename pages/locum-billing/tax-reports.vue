<template>
  <div>
    <h1>Tax Reports</h1>
  </div>
</template>

<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  async asyncData({ app, error }) {
    try {
      console.log("tax reports");
    } catch (err) {
      console.log("err", err.response || err);
    }
  }
};
</script>