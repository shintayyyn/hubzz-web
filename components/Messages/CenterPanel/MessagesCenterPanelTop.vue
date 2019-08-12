<template>
  <div
    v-if="$route.params.slug !== 'new'"
    class="panel-top p-4 w-full flex flex-col justify-center border-b"
  >
    <div v-for="item in messages" :key="item.id" class="font-bold text-lg">
      <span
        :class="parseInt($route.params.slug) === item.id ? '' : 'hidden'"
      >{{ item.receiver_first_name }} {{ item.receiver_last_name }}</span>
    </div>
    <div class="text-sm text-gray-400">
      <span class>{{ profession }}</span>
      <span class="px-2 text-lg">|</span>
      <span class>
        <span class="inline-block py-1 px-1 bg-green-200 rounded-full"></span>
        Online
      </span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      messages: [],
      profession: 'asd'
    };
  },
  created() {
    let route = this.$router.app._route.params.slug
    this.$axios.$get(`/api/v1/conversations`).then(res => {
      let conversations = res.data.conversations
      this.messages = conversations
    });
  }
}
</script>
<style>
.panel-top {
  min-height: 77px;
}
</style>
