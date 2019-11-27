<template>
  <div class="job-notification" v-if="notifications.length > 0 || billingNotifications.length > 0">
    <div class="my-2 mt-1 flex items-center justify-end" :class="toggleNotification ? 'opacity-100' : 'opacity-50 hover:opacity-100 transition-hover'">
      <svgicon name="job-notification" class="w-8 h-8 cursor-pointer" color="#A5DDFF #DFF3FF #FE6663 #000" @click="toggleNotification = !toggleNotification"/>
    </div>
    <transition name="slide">
      <template v-if="toggleNotification">
        <div class="notifications overflow-y-auto">
          <transition-group name="drop" mode="out-in">
            <template v-for="notification in notifications">
              <div
                @click="goTo(notification.id, notification.status ? notification.status : notification.locum_status)"
                :key="`${notification.id}-${notification.notification_type}`"
                class="cards relative mx-1 my-2 p-3 flex flex-wrap bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md text-xs md:text-sm opacity-75 hover:opacity-100"
              >
                <span
                  class="absolute top-0 right-0 cursor-pointer px-2 rounded-full text-lg font-bold"
                  @click.prevent.stop="close(notification.id)"
                >x</span>
                <div class="flex flex-wrap mt-3 w-48 md:w-64">
                  <div class="flex flex-wrap justify-between items-center my-1 w-full">
                    <div class="font-bold md:text-lg">{{notification.title}}</div>
                    <div
                      class="px-2 py-1 md:text-sm font-bold rounded-lg max-w-sm cursor-pointer"
                      :class="bgStatus(notification.status ? notification.status : notification.locum_status)"
                    >{{notification.status ? notification.status.toUpperCase() : notification.locum_status.toUpperCase()}}</div>
                  </div>
                  <div class="flex justify-between items-center md:my-1 w-full">
                    <div>From</div>
                    <div>{{notification.date_start}}</div>
                  </div>
                  <div class="flex justify-between items-center md:my-1 w-full">
                    <div>To</div>
                    <div>{{notification.date_end}}</div>
                  </div>
                  <div class="flex justify-between items-center md:my-1 w-full">
                    <div>Rate</div>
                    <div v-text="`£ ${notification.rate} ${notification.locum_detail_rate_type}`"></div>
                  </div>
                  <div class="flex justify-between items-center md:my-1 w-full">
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
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      toggleNotification: true,
      showFocus: false
    }
  },
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
    },
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
    },
  },
  methods: {
    removeStatus() {
      return this.$router.push({
        path: this.$route.path
      });
    },
    removeParams() {
      return this.$router.push({
        path: this.$route.matched[0].path
      });
    },
    urlPush() {
      return this.$router.push({
        path: `/sessions`
      });
    },
    show(id) {
      return this.$router.push({
        path: `${this.url}/${id}`
      });
    },
    proceed(id, status) {
      return this.$router.push({
        path: `${this.url}/${id}`
      });
    },
    async goTo(id, status) {
      this.$store.commit("calendar/CREATE_JOB_MODAL", false);
      let path = `${this.url}/${id}`;
      let routeStatus = status === "Terminated" ? "Completed" : status;

      if (this.$route.path === path) {
        this.$router.push({
          path: `${this.url}`,
          query: { ...this.$route.query, status: routeStatus }
        });
        setTimeout(() => {
          this.$router.push({
            path: `${this.url}/${id}`,
            query: { ...this.$route.query, status: routeStatus }
          });
        }, 500);
      } else if (this.$route.path !== path) {
        this.$router.push({
          path: `${this.url}`,
          query: { ...this.$route.query, status: routeStatus }
        });
        setTimeout(() => {
          this.$router.push({
            path: `${this.url}/${id}`,
            query: { ...this.$route.query, status: routeStatus }
          });
        }, 500);
      }
      this.close(id);
    },
    close(id) {
      // this.$store.commit("calendar/CREATE_JOB_MODAL", false);
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
  max-height: 95%;
  margin: 50px 20px 0;
  padding: 0 4px 10px;
}

.notifications:hover .cards{
  opacity: 100%;
}

.notifications::-webkit-scrollbar{
  display: none;
} @media screen and (max-width: 767px){
  .notifications .cards{
    opacity: 100%;
  }
}

@media screen and (min-width: 1200px) {
  .job-notification {
    margin-left: 200px;
  }
}

@media screen and (min-width: 480px) {
  .job-notification {
    margin: 50px 5% 0;
  }
}

@media screen and (min-width: 320px) {
  .job-notification {
    margin: 50px 3% 0;
  }
}
</style>
