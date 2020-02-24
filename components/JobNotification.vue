<template>
  <transition name="slide">
    <div
      class="job-notification"
      v-if="jobNotifications.length > 0 || billingNotifications.length > 0"
    >
      <div
        class="my-2 mt-1 flex items-center"
        :class="toggleNotification ? 'justify-between' : 'justify-end'"
      >
        <button
          class="bg-yellow-500 px-4 py-1 rounded-lg hover:bg-yellow-400 transition-hover text-xs focus:outline-none"
          v-if="toggleNotification"
          @click="clearNotifications"
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
                  @click="goTo(notification)"
                  :key="`${notification.id}-${notification.notification_type}`"
                  class="cards relative mx-1 my-2 p-3 flex flex-wrap bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md text-xs md:text-sm opacity-100 md:opacity-75 hover:opacity-100 transition-hover cursor-pointer"
                >
                  <span
                    class="absolute top-0 right-0 cursor-pointer py-2 px-4 rounded-full text-lg font-bold hover:text-gray-700"
                    @click.prevent.stop="close(notification.id, notification.type, notification.notification_type)"
                  >x</span>
                  <div class="flex flex-wrap w-48 md:w-64">
                    <div class="flex flex-col items-start my-1 w-full">
                      <div class="flex flex-wrap">
                        <div
                          v-if="!notification.billingStatus"
                          class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
                          :class="bgStatus(notification.status ? notification.status : notification.locum_status)"
                        >{{status(notification.status ? notification.status : notification.locum_status)}}</div>
                        <div
                          class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
                        >{{notification.status_tag}}</div>
                      </div>
                      <div
                        v-if="notification.type === 'Jobs' && notification.billingStatus"
                        class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase mt-1"
                        :class="bgStatus(notification.billingStatus)"
                      >{{notification.billingStatus}}</div>
                      <div
                        v-if="notification.status !== 'Draft' && notification.type === 'Billings'"
                        class="font-bold md:text-md leading-none mr-1 uppercase pt-4 truncate-title"
                        style="-webkit-box-orient: vertical;"
                      >{{notification.invoice_number}}</div>
                      <div
                        v-else
                        class="font-bold md:text-md leading-tight mr-1 uppercase pt-4 truncate-title"
                        style="-webkit-box-orient: vertical;"
                      >{{notification.title}}</div>
                    </div>
                    <div class="w-full">
                      <div class="leading-tight pt-1">{{notification.message}}</div>
                      <div
                        class="leading-tight text-xs pt-2 text-right text-gray-600"
                      >{{$moment(notification.updated_at).format('MM-DD-YYYY, hh:mm A')}}</div>
                    </div>
                  </div>
                </div>
              </template>
            </transition-group>
          </div>
        </template>
      </transition>
    </div>
  </transition>
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
    jobNotifications() {
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
    notifications() {
      return [...this.jobNotifications, ...this.billingNotifications].sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
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
      this.notifications.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    },
    jobNotifications(value) {
      this.notifications.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    },
    notifications(value) {
      value.forEach((item, index) => {
        if (!item.updated_at) {
          item.updated_at = this.$moment().format("MM-DD-YYYY h:mm a");
        }
      });
      this.notifications.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    }
  },
  methods: {
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
    async goTo(notification) {
      let type = notification.type;
      let id = notification.id;
      let status = notification.status
        ? notification.status
        : notification.locum_status;
      let dateStart = notification.date_start;

      this.$store.commit("calendar/CREATE_JOB_MODAL", false);

      // path url
      let url = "";
      if (type === "Jobs") {
        url = this.$route.name.includes("dashboard")
          ? this.$route.path
          : !this.$route.name.includes("dashboard") &&
            this.$auth.user.domain === "Practice" &&
            notification.practice_id === this.$auth.user.practice_id
          ? `/sessions`
          : !this.$route.name.includes("dashboard") &&
            this.$auth.user.domain === "Practice" &&
            notification.practice_id !== this.$auth.user.practice_id
          ? // pass practice surgery id here
            // `/hub-surgery-management`
            null
          : !this.$route.name.includes("dashboard") &&
            this.$auth.user.domain === "Locum"
          ? `/jobs`
          : null;
      } else if (type === "Billings") {
        url =
          this.$auth.user.domain === "Practice"
            ? `/practice-billing/invoices-from-locums`
            : this.$auth.user.domain === "Locum" &&
              notification.notification_billing_type === "Platform"
            ? `/locum-billing/invoices`
            : this.auth.user.domain === "Locum" &&
              notification.notification_billing_type === "Private"
            ? `/locum-billing/private-invoices`
            : null;
      }

      // for dashboard viewing, moves the date according to the job
      if (url && url.includes("/dashboard")) {
        let selectedMonth =
          this.$moment()
            .month(dateStart)
            .format("M") - 1;

        let selectedYear = this.$moment()
          .month(dateStart)
          .format("YYYY");

        this.$store.commit(
          "calendar/SELECT_DATE",
          this.$moment(dateStart, "YYYY-MM-DD")
            .set("month", selectedMonth)
            .set("year", selectedYear)
            .format("YYYY-MM-DD")
        );
      }

      // query
      if (type === "Jobs") {
        let routeStatus = "";

        switch (status) {
          case "Terminated":
            routeStatus = "Completed";
            break;
          case "Updated":
            routeStatus = null;
            break;
          default:
            routeStatus = status;
        }
        // console.log(url, status, routeStatus, notification);
        // return;
        if (url && url.includes("surgery-management")) {
          this.$router.push({
            path: `${url}`,
            query: { ...this.$route.query, jobStatus: routeStatus }
          });
        } else if (url && !url.includes("surgery-management")) {
          this.$router.push({
            path: `${url}`,
            query: { ...this.$route.query, status: routeStatus }
          });
        } else if (url === null) {
          this.close(id, type, notification.notification_type);
        }
        setTimeout(() => {
          if (url && url.includes("surgery-management")) {
            this.$router.push({
              path: `${url}/${id}`,
              query: { ...this.$route.query, jobStatus: routeStatus }
            });
          } else if (url && !url.includes("surgery-management")) {
            this.$router.push({
              path: `${url}/${id}`,
              query: { ...this.$route.query, status: routeStatus }
            });
          } else if (url === null) {
            this.close(id, type, notification.notification_type);
          }
        }, 500);
      } else if (type === "Billings") {
        let routeStatus = "";

        switch (status) {
          case "Draft":
            routeStatus = "to-be-invoiced";
            break;
          case "Issued":
          case "Paid":
            routeStatus = "issued";
            break;
          default:
            routeStatus = status;
        }
        // console.log(notification, id, url, status, routeStatus);
        // return;
        if (id !== this.$route.params.id) {
          this.$router.push({
            path: `${url}`,
            query: { ...this.$route.query, status: routeStatus }
          });
        }
        setTimeout(() => {
          this.$router.push({
            path: `${url}/${id}/edit`,
            query: { ...this.$route.query, status: routeStatus }
          });
        }, 500);
      }
      this.close(id, type, notification.notification_type);
    },
    close(id, type, notificationType) {
      if (type === "Jobs") {
        if (
          [
            "Practice Notification Job Ongoing",
            "Practice Notification Job Cancelled",
            "Practice Notification Job Declined",
            "Locum Notification Job Ongoing",
            "Locum Notification Job Cancelled",
            "Locum Notification Job Declined"
          ].includes(notificationType)
        ) {
          switch (notificationType) {
            case "Practice Notification Job Ongoing":
              this.$store.commit(
                "jobs/REMOVE_PRACTICE_JOB_NOTIFICATION",
                this.$store.state.jobs.practice_job_notifications.find(notif =>
                  notif.job_parts.find(jobPart => jobPart.status === "Ongoing")
                ).id
              );
              break;
            case "Practice Notification Job Cancelled":
              this.$store.commit(
                "jobs/REMOVE_PRACTICE_JOB_NOTIFICATION",
                this.$store.state.jobs.practice_job_notifications.find(notif =>
                  notif.job_parts.find(
                    jobPart => jobPart.status === "Cancelled"
                  )
                ).id
              );
              break;
            case "Practice Notification Job Declined":
              this.$store.commit(
                "jobs/REMOVE_PRACTICE_JOB_NOTIFICATION",
                this.$store.state.jobs.practice_job_notifications.find(notif =>
                  notif.job_parts.find(jobPart => jobPart.status === "Declined")
                ).id
              );
              break;
            case "Locum Notification Job Ongoing":
              this.$store.commit(
                "jobs/REMOVE_LOCUM_JOB_NOTIFICATION",
                this.$store.state.jobs.locum_job_notifications.find(notif =>
                  notif.job_parts.find(jobPart => jobPart.status === "Ongoing")
                ).id
              );
              break;
            case "Locum Notification Job Cancelled":
              this.$store.commit(
                "jobs/REMOVE_LOCUM_JOB_NOTIFICATION",
                this.$store.state.jobs.locum_job_notifications.find(notif =>
                  notif.job_parts.find(
                    jobPart => jobPart.status === "Cancelled"
                  )
                ).id
              );
              break;
            case "Locum Notification Job Declined":
              this.$store.commit(
                "jobs/REMOVE_LOCUM_JOB_NOTIFICATION",
                this.$store.state.jobs.locum_job_notifications.find(notif =>
                  notif.job_parts.find(jobPart => jobPart.status === "Declined")
                ).id
              );
              break;
          }
        } else if (
          ![
            "Practice Notification Job Ongoing",
            "Practice Notification Job Cancelled",
            "Practice Notification Job Declined",
            "Locum Notification Job Ongoing",
            "Locum Notification Job Cancelled",
            "Locum Notification Job Declined"
          ].includes(notificationType)
        ) {
          this.$store.commit("jobs/REMOVE_PRACTICE_JOB_NOTIFICATION", id);
          this.$store.commit("jobs/REMOVE_LOCUM_JOB_NOTIFICATION", id);
        }
      }
      if (type === "Billings") {
        this.$store.commit("billing/REMOVE_PRACTICE_BILLING_NOTIFICATION", id);
        this.$store.commit("billing/REMOVE_LOCUM_BILLING_NOTIFICATION", id);
      }
    },
    status(status) {
      return status === "Matched" ? "AVAILABLE" : status.toUpperCase();
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
        case "Reminder":
          return "bg-gray-500";
          break;
        default:
          return "bg-red-500 text-white";
      }
    },
    clearNotifications() {
      this.$store.commit("billing/CLEAR_PRACTICE_BILLING_NOTIFICATION");
      this.$store.commit("billing/CLEAR_LOCUM_BILLING_NOTIFICATION");
      this.$store.commit("jobs/CLEAR_PRACTICE_JOB_NOTIFICATION");
      this.$store.commit("jobs/CLEAR_LOCUM_JOB_NOTIFICATION");
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
  opacity: 1;
}
.notifications::-webkit-scrollbar {
  display: none;
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
