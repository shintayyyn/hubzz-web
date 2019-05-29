<template>
  <!-- //! add transition of sliding up -->
  <div
    class="rounded-b-lg py-2 px-12 flex flex-row flex-nowrap justify-start"
    :class="notificationStatus"
    v-if="$store.state.notification.enabled"
  >
    <div class="mr-2">
      <svgicon name="success-checkmark" height="20" width="20"/>
    </div>
    <div class="font-bold text-sm leading-normal">{{$store.state.notification.text}}</div>
  </div>
</template>
<script>
export default {
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
