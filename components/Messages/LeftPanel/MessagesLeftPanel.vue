<template>
  <div class="messages-left-panel">
    <div class="flex flex-col">
      <div
        class="p-2 cursor-pointer"
        :class="parseInt($route.params.slug) === item.id ? 'bg-grey-dark text-white' : 'hover:bg-grey-light'"
        v-for="item in conversations"
        :key="item.id"
        @click="goTo(item.id)"
      >
        <div>{{item.personal_detail.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    conversations: {
      type: Array,
      required: true
    }
  },
  methods: {
    goTo(id) {
      this.$router.push(`/messages/${id}`)
    }
  }
}
</script>
<style scoped>
.messages-left-panel {
  float: left;
  width: 25%;
  /* border: 1px solid black; */
}
</style>
