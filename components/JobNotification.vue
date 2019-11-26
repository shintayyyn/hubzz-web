<template>
  <div class="job-notification">
    <transition-group name="drop" mode="out-in">
      <template v-for="notification in notifications">
        <div
          @click="goTo(notification.id, notification.status ? notification.status : notification.locum_status)"
          :key="`${notification.id}-${notification.notification_type}`"
          class="relative mx-1 my-2 p-3 flex flex-wrap bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md text-xs md:text-sm"
        >
          <span
            class="absolute top-0 right-0 cursor-pointer px-2 rounded-full text-lg font-bold"
            @click.prevent.stop="close(notification.id)"
          >x</span>
          <div class="flex flex-wrap mt-3 w-48 md:w-64">
            <div class="flex flex-wrap justify-between items-center my-1 w-full">
              <div class="font-bold text-lg">{{notification.title}}</div>
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
              <div v-text="`£ ${notification.rate} ${notification.locum_detail_rate_type}`"></div>
            </div>
            <div class="flex justify-between items-center my-1 w-full">
              <div>Shift</div>
              <div>{{notification.shift}}</div>
            </div>
            <div>
              <div class="font-semibold">{{notification.message}}</div>
            </div>
          </div>
        </div>
      </template>
      <template v-for="billingNotification in billingNotifications">
        <nuxt-link
          :to="billingNotification.url"
          :key="`${billingNotification.id}-${billingNotification.notification_type}`"
        >
          <div class="relative mx-1 my-2 p-3 flex flex-wrap bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md">
            <span
              class="absolute top-0 right-0 cursor-pointer px-2 rounded-full text-lg font-bold"
              @click.prevent.stop="close(billingNotification.id)"
            >x</span>
            <div class="flex flex-wrap mt-3 w-48 md:w-64">
              <div class="flex flex-wrap justify-between items-center my-1 w-full">
                <div class="font-bold text-lg">{{billingNotification.invoice_number}}</div>
                <div
                  class="px-2 py-1 text-sm font-bold rounded-lg max-w-sm cursor-pointer"
                  :class="bgStatus(billingNotification.status)"
                >{{billingNotification.status.toUpperCase()}}</div>
              </div>
              <div class="flex justify-between items-center my-1 w-full">
                <div>From</div>
                <div class="text-right">{{billingNotification.date_start}}</div>
              </div>
              <div class="flex justify-between items-center my-1 w-full">
                <div>To</div>
                <div class="text-right">{{billingNotification.date_end}}</div>
              </div>
              <div class="flex justify-between items-center my-1 w-full">
                <div>Issued At</div>
                <div class="text-right">{{billingNotification.issued_at | localDate}}</div>
              </div>
              <div class="flex justify-between items-center my-1 w-full">
                <div>Paid At</div>
                <div class="text-right">{{billingNotification.paid_at | localDate}}</div>
              </div>
              <div
                class="flex justify-between items-center my-1 w-full"
                v-if="billingNotification.locum_user"
              >
                <div>Locum</div>
                <div class="text-right">{{billingNotification.locum_user}}</div>
              </div>
              <div
                class="flex justify-between items-center my-1 w-full"
                v-if="billingNotification.practice"
              >
                <div>Practice</div>
                <div class="text-right">{{billingNotification.practice}}</div>
              </div>
              <div>
                <div class="font-semibold">{{billingNotification.message}}</div>
              </div>
            </div>
          </div>
        </nuxt-link>
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
    billingNotifications() {
      if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
        return this.$store.getters["billing/getPracticeBillingNotifications"];
      }
      return this.$store.getters["billing/getLocumBillingNotifications"];
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
      let path = `${this.url}/${id}`;
      if (this.$route.path === path) {
        this.$router.push({
          path: `${this.url}`,
          query: { ...this.$route.query, status }
        });
        setTimeout(() => {
          this.$router.push({
            path: `${this.url}/${id}`,
            query: { ...this.$route.query, status }
          });
        }, 500);
      } else if (this.$route.path !== path) {
        this.$router.push({
          path: `${this.url}/${id}`,
          query: { ...this.$route.query, status }
        });
      }
      this.close(id);
    },
    close(id) {
      this.$store.commit("jobs/REMOVE_PRACTICE_JOB_NOTIFICATION", id);
      this.$store.commit("jobs/REMOVE_LOCUM_JOB_NOTIFICATION", id);
      this.$store.commit("billing/REMOVE_PRACTICE_BILLING_NOTIFICATION", id);
      this.$store.commit("billing/REMOVE_LOCUM_BILLING_NOTIFICATION", id);
    },
    bgStatus(status) {
      switch (status) {
        case "Issued":
        case "Live":
        case "Available":
        case "Matched":
          return "bg-yellow-500";
          break;
        case "Applied":
          return "bg-orange-400 text-white";
        case "Paid":
        case "Completed":
        case "Approved":
          return "bg-green-500 text-white";
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
  margin-top: 50px;
  height: 95%;
  overflow-y: auto;
  padding: 0 4px 10px;
  /* margin-right: 40px; */
}

.job-notification:hover{
  background: linear-gradient(to top right, rgba(0, 0, 0, 0),  rgba(0, 0, 0, 0.01), rgba(202, 202, 202, 0.5));
}

.job-notification::-webkit-scrollbar{
  display: none;
}
</style>
