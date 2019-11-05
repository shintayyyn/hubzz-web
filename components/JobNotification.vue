<template>
  <div class="job-notification">
    <transition-group name="drop" mode="out-in">
      <template v-for="notification in notifications">
        <div
          @click="goTo(notification.id, notification.status ? notification.status : notification.locum_status)"
          :key="notification.id"
          class="relative m-1 p-3 flex flex-wrap bg-gray-100 rounded-lg shadow-lg"
        >
          <span
            class="absolute top-0 right-0 cursor-pointer my-1 mx-2 font-bold"
            @click.prevent.stop="close(notification.id)"
          >X</span>
          <div class="flex flex-wrap mt-3 w-48 md:w-64">
            <div class="flex justify-between items-center my-1 w-full">
              <div class="font-bold text-lg">{{notification.title}}</div>
              <div class="mx-1"></div>
              <div
                class="px-2 py-1 text-sm font-bold rounded-lg max-w-sm cursor-pointer"
                :class="bgStatus(notification.status ? notification.status : notification.locum_status)"
              >{{notification.status ? notification.status.toUpperCase() : notification.locum_status.toUpperCase()}}</div>
            </div>
            <div class="flex justify-between items-center my-1 w-full">
              <div>From</div>
              <div>{{notification.date_start}}</div>
            </div>
            <div class="flex justify-between items-center my-1 w-full">
              <div>To</div>
              <div>{{notification.date_end}}</div>
            </div>
            <div class="flex justify-between items-center my-1 w-full">
              <div>Rate</div>
              <div v-text="`$${notification.rate} ${notification.locum_detail_rate_type}`"></div>
            </div>
            <div class="flex justify-between items-center my-1 w-full">
              <div>Shift</div>
              <div>{{notification.shift}}</div>
            </div>
            <div v-if="notification.reminder">
              <div class="font-semibold">{{notification.reminder_message}}</div>
            </div>
          </div>
        </div>
      </template>
    </transition-group>
  </div>
</template>
<script>
export default {
  computed: {
    notifications() {
      if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
        return this.$store.getters["jobs/getPracticeJobNotifications"];
      }
      return this.$store.getters["jobs/getLocumJobNotifications"];
    },
    url() {
      return this.$auth.user.domain === "Practice" ? "/sessions" : "/jobs";
    }
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
  mounted() {
    console.log("notifications", this.notifications);
  },
  methods: {
    goTo(id, status) {
      if (
        this.$route.path.includes(`${this.url}`) &&
        this.$route.query.status &&
        this.$route.query.status !== status
      ) {
        this.$router.push({
          query: { ...this.$route.query, status }
        });

        setTimeout(() => {
          this.$router.push({
            path: `${this.url}/${id}`,
            query: { ...this.$route.query }
          });
        }, 500);
      } else {
        this.$router.push({
          path: `${this.url}/${id}`,
          query: { ...this.$route.query }
        });
      }
    },
    close(id) {
      this.$store.commit("jobs/REMOVE_PRACTICE_JOB_NOTIFICATION", id);
      this.$store.commit("jobs/REMOVE_LOCUM_JOB_NOTIFICATION", id);
    },
    bgStatus(status) {
      switch (status) {
        case "Live":
        case "Matched":
          return "bg-yellow-500";
          break;
        case "Applied":
          return "bg-orange-400 text-white";
          break;
        case "Completed":
          return "bg-green-400";
          break;
        case "Allocated":
          return "bg-green-300";
          break;
        case "Ongoing":
          return "bg-green-500";
          break;
        default:
          return "bg-red-500 text-white";
      }
    }
  }
};
</script>
<style>
.job-notification {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 700;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 50px;
  margin-right: 40px;
}
</style>
