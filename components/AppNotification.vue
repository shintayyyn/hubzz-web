<template>
  <div class="w-full app-notification">
    <div class="flex justify-center">
      <div
        class="rounded-b-lg py-2 px-12 flex flex-row flex-nowrap justify-center"
        :class="notificationStatus"
        v-if="$store.state.notification.enabled"
      >
        <div class="mr-2">
          <svgicon :name="notificationIcon" height="20" width="20" :color="iconSvgColor" />
        </div>
        <div class="font-bold text-sm leading-normal">{{$store.state.notification.text}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    notificationStatus() {
      switch (this.$store.state.notification.status) {
        case "success":
          return "bg-green-lighter";
          break;
        case "danger":
          return "bg-red text-white";
          break;
        case "alert":
          return "bg-yellow";
          break;
        case "info":
          return "bg-blue text-blue-lightest";
        default:
          return "bg-white";
      }
    },

    notificationIcon() {
      switch (this.$store.state.notification.status) {
        case "success":
          return "success-checkmark";
          break;
        case "danger":
          return "exclamation-mark";
          break;
        case "alert":
          return "alert";
          break;
        case "info":
          return "info";
          break;
        default:
          return "alert";
      }
    },

    iconSvgColor() {
      switch (this.$store.state.notification.status) {
        case "danger":
          return "#fff";
          break;
        case "info":
          return "#dae1e7";
          break;
        default:
          return "#000";
      }
    }
  }
};
</script>
<style>
.app-notification {
  position: fixed;
  top: 0;
  /* left: 40%; */
  z-index: 999;
  margin-left: -40px;
}
@media screen and (min-width: 1200px) {
  .app-notification {
    margin-left: -240px;
  }
}
@media screen and (max-width: 600px) {
  .app-notification {
    width: 100%;
    left: 0;
  }
}
</style>
