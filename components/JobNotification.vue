<template>
  <div class="job-notification" v-if="notifications.length > 0 || billingNotifications.length > 0">
    <div
      class="my-2 mt-1 flex items-center"
      :class="toggleNotification ? 'justify-between' : 'justify-end'"
    >
      <button
        class="bg-yellow-500 px-4 py-1 rounded-lg hover:bg-yellow-400 transition-hover text-xs"
        v-if="toggleNotification"
      >Mark all as read</button>
      <svgicon
        name="job-notification"
        class="w-8 h-8 cursor-pointer"
        color="#A5DDFF #DFF3FF #FE6663 #000"
        :class="toggleNotification ? 'opacity-100' : 'opacity-50 hover:opacity-100 transition-hover'"
        @click="toggleNotification = !toggleNotification"
      />
    </div>
    <transition name="slide">
      <template v-if="toggleNotification">
        <div class="notifications overflow-y-auto">
          <transition-group name="drop" mode="out-in">
            <template v-for="notification in notifications">
              <div
                @click="goTo(notification.type, notification.id, notification.status ? notification.status : notification.locum_status)"
                :key="`${notification.id}-${notification.notification_type}`"
                class="cards relative mx-1 my-2 p-3 flex flex-wrap bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md text-xs md:text-sm opacity-75 hover:opacity-100 transition-hover cursor-pointer"
              >
                <span
                  class="absolute top-0 right-0 cursor-pointer py-2 px-4 rounded-full text-lg font-bold hover:text-gray-700"
                  @click.prevent.stop="close(notification.id)"
                >x</span>
                <div class="flex flex-wrap w-48 md:w-64">
                  <div class="flex flex-col items-start my-1 w-full">
                    <div
                      class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer"
                      :class="bgStatus(notification.status ? notification.status : notification.locum_status)"
                    >{{notification.status ? notification.status.toUpperCase() : notification.locum_status.toUpperCase()}}</div>
                    <div
                      class="font-bold md:text-md leading-none mr-1 uppercase pt-4 truncate-title"
                      style="-webkit-box-orient: vertical;"
                    >{{notification.title}}</div>
                  </div>
                  <!-- <div class="py-2 flex flex-col w-full">
                    <div class="flex justify-between items-center w-full">
                      <div>From</div>
                      <div>{{notification.date_start}}</div>
                    </div>
                    <div class="flex justify-between items-center w-full">
                      <div>To</div>
                      <div>{{notification.date_end}}</div>
                    </div>
                    <div class="flex justify-between items-center w-full">
                      <div>Rate</div>
                      <div v-text="`£ ${notification.rate} ${notification.locum_detail_rate_type}`"></div>
                    </div>
                    <div class="flex justify-between items-center w-full">
                      <div>Shift</div>
                      <div>{{notification.shift}}</div>
                    </div>
                  </div>-->
                  <div>
                    <div class="leading-tight pt-1">{{notification.message}}</div>
                  </div>
                </div>
              </div>
            </template>
            <template v-for="billingNotification in billingNotifications">
              <div
                @click="goTo(billingNotification.type, billingNotification.id)"
                :key="`${billingNotification.id}-${billingNotification.notification_type}`"
                class="relative mx-1 my-2 p-3 flex flex-wrap bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md"
              >
                <span
                  class="absolute top-0 right-0 cursor-pointer py-2 px-4 rounded-full text-lg font-bold hover:text-gray-700"
                  @click.prevent.stop="close(billingNotification.id)"
                >x</span>
                <div class="flex flex-wrap w-48 md:w-64">
                  <div class="flex flex-col items-start my-1 w-full">
                    <div
                      class="px-2 py-1 text-sm font-bold rounded-lg max-w-sm cursor-pointer"
                      :class="bgStatus(billingNotification.status)"
                    >{{billingNotification.status.toUpperCase()}}</div>
                    <div
                      v-if="billingNotification.status !== 'Draft'"
                      class="font-bold md:text-md leading-none mr-1 uppercase pt-4 truncate-title"
                      style="-webkit-box-orient: vertical;"
                    >{{billingNotification.invoice_number}}</div>
                  </div>
                  <!-- <div class="py-2 flex flex-col w-full">
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
                  </div>-->
                  <div
                    class="flex flex-col my-1 w-full leading-none"
                    v-if="billingNotification.locum_user"
                  >
                    <div class="text-sm uppercase">Locum</div>
                    <div class="font-bold">{{billingNotification.locum_user}}</div>
                  </div>
                  <div
                    class="flex flex-col my-1 w-full leading-none"
                    v-if="billingNotification.practice"
                  >
                    <div class="text-sm uppercase">Practice</div>
                    <div class="font-bold">{{billingNotification.practice}}</div>
                  </div>
                  <div>
                    <div class="leading-tight pt-1">{{billingNotification.message}}</div>
                  </div>
                </div>
              </div>
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
    };
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
    },
    billingNotifications(value) {
      console.log(value);
      this.toggleNotification = true;
    },
    notifications(value) {
      this.toggleNotification = true;
    }
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
    async goTo(type, id, status) {
      this.$store.commit("calendar/CREATE_JOB_MODAL", false);

      let url = "";

      if (type === "Jobs") {
        url = this.$auth.user.domain === "Practice" ? "/sessions" : "/jobs";
      } else if (type === "Billings") {
        url =
          this.$auth.user.domain === "Practice"
            ? "/practice-billing/invoices-from-locums"
            : "/locum-billing/invoices";
      }

      let path = `${url}/${id}`;

      if (type === "Jobs") {
        let routeStatus = "";

        if (status === "Terminated") {
          routeStatus = "Completed";
        } else if (status === "Updated") {
          routeStatus = null;
        } else if (!["Terminated", "Updated"].includes(status)) {
          routeStatus = status;
        }

        this.$router.push({
          path: `${url}`,
          query: { ...this.$route.query, status: routeStatus }
        });
        setTimeout(() => {
          this.$router.push({
            path: `${url}/${id}`,
            query: { ...this.$route.query, status: routeStatus }
          });
        }, 500);
      } else if (type === "Billings") {
        this.$router.push({
          path: `${url}`
        });
        setTimeout(() => {
          this.$router.push({
            path: `${url}/${id}`
          });
        }, 500);
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
        case "Draft":
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

.notifications:hover .cards {
  opacity: 100%;
}

.notifications::-webkit-scrollbar {
  display: none;
}
@media screen and (max-width: 767px) {
  .notifications .cards {
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
.truncate-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s linear;
}
.truncate-title:hover {
  display: block;
}
</style>
