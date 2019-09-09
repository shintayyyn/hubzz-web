<template>
  <div class="app-notification">
    <div
      class="rounded-b-lg py-2 px-12 inline-block text-center"
      :class="notificationStatus"
      v-if="$store.state.notification.enabled"
    >
      <span class="mr-2 inline-block align-middle">
        <svgicon :name="notificationIcon" height="20" width="20" :color="iconSvgColor" />
      </span>
      <div
        class="font-bold text-sm leading-normal inline-block"
        v-for="(message, index) in $store.state.notification.text"
        :key="index"
      >{{message}}</div>
      <!-- <div
        class="absolute right-0 top-0 px-2 py-1 text-lg font-bold cursor-pointer"
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
        case "success":
          return "bg-green-400 text-white";
          break;
        case "danger":
          return "bg-red-500 text-white";
          break;
        case "uploading":
          return "bg-yellow-500 text-white";
          break;
        case "alert":
          return "bg-yellow-400";
          break;
        case "info":
          return "bg-blue-500 text-white";
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
        case "uploading":
          return "cloud-upload";
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
        case "success":
          return "#fff";
          break;
        case "danger":
          return "#fff";
          break;
        case "uploading":
          return "#fff";
          break;
        case "info":
          return "#dae1e7";
          break;
        default:
          return "#fff, #000";
      }
    },
    notify() {
      return this.$store.state.notification.enabled;
    }
    // closable() {
    //   return this.$store.state.notification.closable
    // }
  },
  watch: {
    notify(value) {
      if (!this.$store.state.notification.closable) {
        setTimeout(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: false,
            status: "",
            text: "",
            closable: false
          });
        }, 2000);
      }
    }
  },
  methods: {
    close() {
      this.$store.commit("SET_NOTIFICATION", {
        enabled: false,
        status: "",
        text: ""
        // closable: false
      });
    }
  }
};
</script>
<style>
.app-notification {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  display: flex;
  justify-content: center;
  /* margin-left: -40px; */
}
@media screen and (min-width: 1200px) {
  .app-notification {
    /* margin-left: -240px; */
  }
}
@media screen and (max-width: 600px) {
  .app-notification {
    width: 100%;
    left: 0;
  }
}
</style>
