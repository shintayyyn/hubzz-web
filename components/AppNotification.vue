<template>
  <div class="fixed pin-t pin-none z-50" style="left:50%">
    <div class="rounded-b-lg py-2 px-12" :class="notificationStatus">
      <div class="font-bold text-sm">{{$store.state.notification.text}}</div>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    setTimeout(() => {
      this.$store.commit('SET_NOTIFICATION', { enabled: false, status: '', text: '' })
    }, 3000)
  },
  computed: {
    notificationStatus() {
      switch (this.$store.state.notification.status) {
        case 'success':
          return 'bg-green-lighter'
          break;
        case 'danger':
          return 'bg-red'
          break;
        case 'alert':
          return 'bg-yellow'
          break;
        case 'info':
          return 'bg-blue'
        default:
          return 'bg-white';
      }
    }
  }
}
</script>
