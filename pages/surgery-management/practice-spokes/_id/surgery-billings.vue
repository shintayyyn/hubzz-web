<template>
  <div>surgery billing</div>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  async asyncData({ app, route }) {
    try {
      console.log("route name", route.name);
    } catch (err) {
      console.log("get surgery sessions error!!!", err);
    }
  }
};
</script>