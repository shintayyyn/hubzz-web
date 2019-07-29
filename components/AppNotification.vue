<template>
  <div class="app-notification">
    <div
      class="relative rounded-b-lg py-2 px-12 flex flex-row flex-nowrap justify-center"
      :class="notificationStatus"
      v-if="$store.state.notification.enabled"
    >
      <div class="mr-2">
        <svgicon
          name="success-checkmark"
          height="20"
          width="20"
          v-if="$store.state.notification.status === 'success'"
        />
      </div>
      <div class="flex flex-col">
        <div
          class="font-bold text-sm leading-normal"
          v-for="(message, index) in $store.state.notification.text"
          :key="index"
        >{{message}}</div>
      </div>
      <!-- <div
        class="absolute pin-r pin-t px-2 py-1 text-lg font-bold cursor-pointer"
        @click="close"
        v-if="closable"
      >x</div>-->
    </div>
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
          return 'bg-red-light text-white'
          break;
        case 'alert':
          return 'bg-yellow'
          break;
        case 'info':
          return 'bg-blue'
        default:
          return 'bg-white';
      }
    },
    // closable() {
    //   return this.$store.state.notification.closable
    // }
  },
  methods: {
    close() {
      this.$store.commit('SET_NOTIFICATION', {
        enabled: false,
        status: '',
        text: '',
        // closable: false
      })
    }
  }
}
</script>
<style>
.app-notification {
  position: fixed;
  top: 0;
  left: 40%;
  z-index: 999;
}
@media screen and (max-width: 600px) {
  .app-notification {
    width: 100%;
    left: 0;
  }
}
</style>
