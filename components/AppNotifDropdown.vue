<template>
  <div>
    <AppButton
      icon="notification"
      :label="'Notification'"
      class="notif-btn"
      :customTheme="'border-2'"
      :badge="unseenNotificationIds.length"
      @click="showNotificationsDropdown = !showNotificationsDropdown"
    />
    <!-- <button
      class="relative button rounded-lg p-2 focus:outline-none cursor-pointer"
      @click="showNotificationsDropdown = !showNotificationsDropdown"
    >
      <svgicon name="bell" width="21" height="21" />
      
      <p
        v-if="unseenNotificationIds.length > 0"
        class="-m-2 absolute bg-red-600 text-white border bottom-0 right-0 flex h-6 w-6 font-bold text-xs p-1 items-center justify-center rounded-full"
      >
        {{ unseenNotificationIds.length }}
      </p>
    </button> -->

    <transition name="drop-down">
      <div
        v-if="showNotificationsDropdown"
        v-on-clickaway="close"
        class="absolute bg-white border shadow container transition-hover flex flex-col"
        :class="[
          largeView === true
            ? 'modal top-0 right-0'
            : 'dropdown right-0 mt-2',

          notificationCount !== notifications.length
            ? !loading
              ? 'justify-between'
              : ''
            : ''
        ]"
      >
        <div class="border-b px-2 py-1 flex justify-between" :class="largeView ? '' : 'text-sm'">
          <p class="font-bold">
            <span>Notifications</span>
          </p>

          <div
            v-if="notifications.length > 0"
            class="flex items-center"
            :class="largeView ? 'text-sm' : 'text-xs'"
          >
            <p class="cursor-pointer hover:text-gray-700" @click="seenAllNotifications">
              <span>Mark all as read</span>
            </p>
            <span v-if="largeView" class="px-1 font-bold">·</span>
            <span v-if="largeView" class="cursor-pointer" @click="showNotificationsDropdown = false">Close</span>
          </div>
        </div>

        <p v-if="!loading && notifications.length === 0" class="text-center text-sm py-2">
          <span>You don't have notifications at the moment.</span>
        </p>

        <span
          v-if="loading || (largeView && notifications.length === 0 && loading)"
          class="flex justify-center items-center py-1 h-full"
        >
          <svgicon name="loader" :width="largeView ? '55' : '30'" :height="largeView ? '55' : '30'" />
        </span>

        <div v-if="!loading" class="h-full wrapper" @scroll="scrollHandler">
          <transition-group name="fade" mode="in-out">
            <div
              v-for="notification in sortedNotifications"
              :key="notification.id"
              class="p-2 border-b leading-tight cursor-pointer transition-hover flex items-center"
              :class="notification.seen ? 'hover:bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'"
              @click="goTo(notification)"
            >
              <div class="w-full">
                <p class="font-bold block truncate">
                  <span>{{ getNotificationTitle(notification) }}&nbsp;</span>
                </p>
                <p class="text-sm py-1">
                  <span>{{ getNotificationMessage(notification) }}&nbsp;</span>
                </p>
                <div class="leading-tight text-xs text-gray-600">
                  <span>{{ notification.created_at_in_gb_formatted }}&nbsp;</span>
                </div>
              </div>
              <span v-if="!notification.seen" class="bg-sunglow w-2 h-2 p-1 rounded-full mr-1 mt-1" />
            </div>
          </transition-group>
        </div>

        <!-- <p
            v-if="notificationCount !== notifications.length"
            class="cursor-pointer text-sm text-center py-1 w-full bg-gray-100 border-t"
            @click="loadMore"
        >Load More</p>-->

        <div v-if="!loading">
          <transition name="fade">
            <span v-if="loadingLoadMore" class="flex justify-center py-1">
              <svgicon name="loader" width="30" height="30" />
            </span>
          </transition>

          <p
            v-if="!largeView && notifications.length > 0"
            class="cursor-pointer text-sm text-center py-1"
            @click="largeView = true"
          >
            <span>See All</span>
          </p>
        </div>
      </div>
    </transition>

    <transition name="slide">
      <div v-if="true || popUpNotifications.length > 0" class="job-notification">
        <!-- <div
          class="my-2 mt-1 flex items-center"
          :class="showPopUpNotification ? 'justify-between' : 'justify-end'"
        >
          <button
            v-if="showPopUpNotification"
            class="bg-yellow-500 px-4 py-1 rounded-lg hover:bg-yellow-400 transition-hover text-xs focus:outline-none"
            @click="clearPopUpNotifications"
          >Mark all as read</button>
          <svgicon
            name="job-notification"
            class="w-8 h-8 cursor-pointer"
            color="#A5DDFF #DFF3FF #FE6663 #000"
            :class="showPopUpNotification ? 'opacity-100' : 'opacity-50 hover:opacity-100 transition-hover'"
            @click="showPopUpNotification = !showPopUpNotification"
          />
        </div>-->
        <transition name="slide">
          <template v-if="showPopUpNotification">
            <div class="notifications overflow-y-auto">
              <PopUpNotification
                v-if="false"
                :notification="{
                  id: 1000,
                  title: 'qweqwe',
                  description: 'asdasd',
                  created_at: '2020-04-23 14:30:00.000',
                  timeoutInSeconds: 30,
                  maxTimeoutInSeconds: 30,
                }"
              />
              <transition-group name="drop" mode="out-in">
                <PopUpNotification
                  v-for="popUpNotification in popUpNotifications"
                  :key="popUpNotification.id"
                  :notification="popUpNotification"
                  @goTo="goTo"
                  @removePopUpNotification="removePopUpNotification"
                />
              </transition-group>
            </div>
          </template>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { mixin as clickaway, } from "vue-clickaway"
import PopUpNotification from "@/components/Notifications/PopUpNotification"
import AppButton from "@/components/Base/AppButton"

export default {
  components: {
    PopUpNotification,
    AppButton,
  },
  
  mixins: [clickaway,],

  data () {
    return {
      showNotificationsDropdown: false,
      largeView: false,
      unseenNotificationIds: [],
      notificationCount: 0,
      notifications: [],
      limit: 20,
      loading: false,
      loadingLoadMore: false,
      notificationTypeNames: [
        "Locum Notification Incomplete Compliance",

        "Locum Notification Compliance Approved",
        "Locum Notification Compliance Pending",
        "Locum Notification Compliance Rejected",
        "Locum Notification Compliance Expired",
        "Locum Notification Compliance Expiring",

        "Locum Notification Permanent Job Matched",
        "Locum Notification Permanent Job Invited",
        "Locum Notification Permanent Job Rejected",
        "Locum Notification Permanent Job Hired",

        "Locum Notification Job Allocated",
        "Locum Notification Job Amended",
        "Locum Notification Job Application Cancelled",
        "Locum Notification Job Applied",
        "Locum Notification Job Auto Withdrawn",
        "Locum Notification Job Available",
        "Locum Notification Job Cancelled",
        "Locum Notification Job Conflict",
        "Locum Notification Job Matched",
        "Locum Notification Job Ongoing",
        "Locum Notification Job Reminder",
        "Locum Notification Job Unavailable",
        "Locum Notification Job Unqualified",
        "Locum Notification Job Unsuccessful",
        "Locum Notification Job Withdrawn",

        "Locum Notification Job Part Completed",
        "Locum Notification Job Part Approved",
        "Locum Notification Job Part To Be Invoiced",

        "Locum Notification Locum Invoice Issued",
        "Locum Notification Locum Invoice Disputed",
        "Locum Notification Locum Invoice Approved",
        "Locum Notification Locum Invoice Paid",

        "Locum Notification Locum Form A Paid",
        "Locum Notification Locum Form A Paid By Practice",
        "Locum Notification Locum Form A Sent To Practice",
        "Locum Notification Locum Form A Locum E-signed",
        "Locum Notification Locum Form A Practice E-signed",

        "Locum Notification Locum Solo Form",
        "Locum Notification Locum Solo Form Locum E-signed",
        "Locum Notification Locum Solo Form Practice E-signed",

        "Locum Notification Locum Payment Details Updated",
        "Locum Notification Locum Status Updated",

        "Practice Notification Practice Actived",
        "Practice Notification Practice Reactivated",
        "Practice Notification Practice Suspended",

        "Practice Notification Locum Compliance Expired",
        "Practice Notification Locum Compliance Expiring",

        "Practice Notification Locum Compliance Status Changed",

        "Practice Notification Permanent Job Applied",
        "Practice Notification Approve Permanent Job Spoke",
        "Practice Notification Reject Permanent Job Spoke",
        "Practice Notification Hub Created Permanent Job for Spoke",
        "Practice Notification Spoke Created Pending Permanent Job",
        "Practice Notification Locum Accept Permanent Job Invitation",
        "Practice Notification Locum Reject Permanent Job Invitation",

        "Practice Notification Job Allocated",
        "Practice Notification Job Amended",
        "Practice Notification Job Application",
        "Practice Notification Job Application Cancelled",
        "Practice Notification Job Applied",
        "Practice Notification Job Auto Withdrawn",
        "Practice Notification Job Cancelled",
        "Practice Notification Job Live",
        "Practice Notification Job Ongoing",
        "Practice Notification Job Pending",
        "Practice Notification Job Rejected",
        "Practice Notification Job Reminder",
        "Practice Notification Job Selection Date",
        "Practice Notification Job Unfilled",
        "Practice Notification Job Unfilled Warning",
        "Practice Notification Job Withdrawn",

        "Practice Notification Job Part Completed",
        "Practice Notification Job Part Approved",

        "Practice Notification Locum Invoice Issued",
        "Practice Notification Locum Invoice Disputed",
        "Practice Notification Locum Invoice Approved",
        "Practice Notification Locum Invoice Paid",

        "Practice Notification Locum Form A Paid",
        "Practice Notification Locum Form A Sent To Practice",
        "Practice Notification Locum Form A Locum E-signed",
        "Practice Notification Locum Form A Practice E-signed",

        "Practice Notification Locum Solo Form Locum E-signed",
        "Practice Notification Locum Solo Form Practice E-signed",

        "Practice Notification Locum Payment Details Updated",

        "Practice Notification Practice Invoice Issued",
        "Practice Notification Practice Invoice Paid",
        "Practice Notification Practice Invoice Past Due",
        "Practice Notification Practice Invoice Unpaid",

        "Practice Notification Practice Surgery Created",
        "Practice Notification Practice Surgery Deleted",
        "Practice Notification Practice Surgery Updated",
        "Practice Notification Practice Surgery Rejected",
        "Practice Notification Practice Surgery Termination Requested",

        "Practice Notification Practice Hub Created",
        "Practice Notification Practice Hub Deleted",
        "Practice Notification Practice Hub Accepted",
        "Practice Notification Practice Hub Rejected",
      ],
      popUpNotifications: [],
      showPopUpNotification: true,
    }
  },

  computed: {
    domain () {
      return this.$auth.user.domain.toLowerCase()
    },

    getNotificationDisplay () {
      return notification => {
        const {
          notification_type: notificationType,
          type,
          payload,
          title,
          message,
          description,
        } = notification

        const { name: notificationTypeName, } = notificationType

        if (this.notificationTypeNames.includes(notificationTypeName)) {
          return {
            title,
            message: description,
          }
        } else {
          return {
            title: payload.title
              ? payload.title
              : type
                ? `Untitled ${type}`
                : title,
            message: message || description,
          }
        }
      }
    },

    getNotificationTitle () {
      return notification => {
        const { title, } = this.getNotificationDisplay(notification)

        return title
      }
    },

    getNotificationMessage () {
      return notification => {
        const { message, } = this.getNotificationDisplay(notification)

        return message
      }
    },

    url () {
      return this.$auth.user.domain === "Practice" ? "/sessions" : "/jobs"
    },

    sortedNotifications () {
      let billing_types = [
        "Locum Notification Locum Invoice Created",
        "Locum Notification Locum Invoice Updated",
        "Locum Notification Locum Invoice Paid",
        "Practice Notification Locum Invoice Created",
        "Practice Notification Locum Invoice Updated",
        "Practice Notification Locum Invoice Paid",
      ]

      return this.notifications
        .map(notification => {
          let message = ""

          if (this.domain === "locum") {
            switch (notification.notification_type.name) {
            case "Locum Notification Job Approved":
              message = "This part of your job has been approved"
              break
            case "Locum Notification Job Disputed":
              message = "This part of your job has been disputed"
              break
            default:
              message = ""
            }
          } else if (this.domain === "practice") {
            switch (notification.notification_type.name) {
            case "Practice Notification Job Approved":
              message = "This part of your job has been approved"
              break
            case "Practice Notification Job Disputed":
              message = "This part of your job has been disputed"
              break
            }
          }

          return {
            ...notification,
            message: message,
            type: billing_types.includes(notification.notification_type.name)
              ? "Billing"
              : "Job",
          }
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
  },

  watch: {
    showNotificationsDropdown () {
      if (this.showNotificationsDropdown) {
        this.popUpNotifications = []
      } else {
        this.largeView = false
      }
    },
  },

  mounted () {
    setInterval(() => {
      this.popUpNotifications.forEach(
        popUpNotification => (popUpNotification.timeoutInSeconds -= 0.5)
      )

      this.popUpNotifications = this.popUpNotifications.filter(
        popUpNotification => popUpNotification.timeoutInSeconds > 0
      )
    }, 1000 * 0.5)

    this.loading = true
    Promise.all([
      this.$axios
        .get(`/api/v1/${this.domain}/notifications`, {
          params: {
            seen: false,
            id_only: true,
          },
        })
        .then(response => {
          const unseenNotificationIds = response.data.data.notifications

          this.unseenNotificationIds = unseenNotificationIds
        }),

      this.$axios
        .get(`/api/v1/${this.domain}/notifications/count`)
        .then(response => {
          const count = response.data.data.count

          this.notificationCount = count
        }),

      this.$axios
        .get(`/api/v1/${this.domain}/notifications`, {
          params: {
            order_by: "created_at:desc",
            limit: this.limit,
          },
        })
        .then(response => {
          const notifications = response.data.data.notifications

          this.notifications = notifications
        }),
    ]).finally(() => {
      this.loading = false
    })

    this.setSocketNotificationListener()
  },

  destroyed () {
    this.removeSocketNotificationListener()
  },

  methods: {
    clearPopUpNotifications () {
      console.log("clearPopUpNotifications")
    },

    removePopUpNotification (notificationId) {
      const index = this.popUpNotifications.findIndex(
        notification => notification.id === notificationId
      )

      if (index > -1) {
        this.popUpNotifications.splice(index, 1)
      }
    },

    setSocketNotificationListener () {
      this.notificationTypeNames.forEach(notificationTypeName => {
        this.$socket.on(notificationTypeName, this.newNotificationHandler)
      })
    },

    removeSocketNotificationListener () {
      this.notificationTypeNames.forEach(notificationTypeName => {
        this.$socket.removeListener(
          notificationTypeName,
          this.newNotificationHandler
        )
      })
    },

    newNotificationHandler (payload) {
      const { notification, } = payload

      if (notification) {
        if (!notification.seen) {
          this.unseenNotificationIds.push(notification.id)
        }

        const index = this.popUpNotifications.findIndex(
          ({ id, }) => id === notification.id
        )

        if (index > -1) {
          this.popUpNotifications.splice(index, 1, {
            ...notification,
            timeoutInSeconds: 60,
            maxTimeoutInSeconds: 60,
          })
        } else {
          this.popUpNotifications.push({
            ...notification,
            timeoutInSeconds: 60,
            maxTimeoutInSeconds: 60,
          })
        }

        const notificationIndex = this.notifications.findIndex(
          ({ id, }) => id === notification.id
        )

        if (notificationIndex > -1) {
          this.notifications.splice(notificationIndex, 1, notification)
        } else {
          this.notifications.push(notification)
        }
      }
    },

    updateNotificationSeen (notification) {
      if (!notification.seen) {
        const notificationId = notification.id

        const popUpNotificationIndex = this.popUpNotifications.findIndex(
          ({ id, }) => id === notificationId
        )

        if (popUpNotificationIndex > -1) {
          this.popUpNotifications.splice(popUpNotificationIndex, 1)
        }

        this.$axios
          .put(`/api/v1/${this.domain}/notifications/${notificationId}/seen`)
          .then(response => {
            const index = this.unseenNotificationIds.findIndex(
              unseenNotificationId => unseenNotificationId === notificationId
            )

            if (index > -1) {
              this.unseenNotificationIds.splice(index, 1)
            }

            const updatedNotification = response.data.data.notification

            const notificationIndex = this.notifications.findIndex(
              ({ id, }) => id === notificationId
            )

            if (notificationIndex > -1) {
              this.notifications.splice(
                notificationIndex,
                1,
                updatedNotification
              )
            }
          })
      }
    },

    seenAllNotifications () {
      if (this.unseenNotificationIds.length > 0) {
        this.$axios
          .put(`/api/v1/${this.domain}/notifications/seen-all`)
          .then(() => {
            this.notifications
              .filter(notification => !notification.seen)
              .forEach(notification => (notification.seen = true))

            this.unseenNotificationIds = []
          })
      }
    },

    goTo (notification) {
      const {
        notification_type: notificationType,
        payload,
        url: notificationUrl,
      } = notification

      const { name: notificationTypeName, } = notificationType

      const validNotificationUrl = [
        "Locum Notification Locum Form A Paid",
        "Locum Notification Locum Form A Paid By Practice",
        "Locum Notification Locum Form A Sent To Practice",
        "Locum Notification Locum Form A Locum E-signed",
        "Locum Notification Locum Form A Practice E-signed",
        "Locum Notification Locum Solo Form",
        "Locum Notification Locum Solo Form Locum E-signed",
        "Locum Notification Locum Solo Form Practice E-signed",
        
        "Practice Notification Locum Form A Paid",
        "Practice Notification Locum Form A Sent To Practice",
        "Practice Notification Locum Form A Locum E-signed",
        "Practice Notification Locum Form A Practice E-signed",
        "Practice Notification Locum Solo Form Locum E-signed",
        "Practice Notification Locum Solo Form Practice E-signed",
        "Practice Notification Locum Payment Details Updated",
        
        "Practice Notification Locum Compliance Status Changed",
      ]

      if (validNotificationUrl.includes(notificationTypeName)) {
        this.$router.push({
          path: notificationUrl,
        })

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)

        console.log('notification.payload_type', notification.payload_type)

        if ([
          "Locum Notification Locum Form A Paid",
          "Locum Notification Locum Form A Paid By Practice",
          "Locum Notification Locum Form A Sent To Practice",
          "Locum Notification Locum Form A Locum E-signed",
          "Locum Notification Locum Form A Practice E-signed",
          "Practice Notification Locum Form A Paid",
          "Practice Notification Locum Form A Sent To Practice",
          "Practice Notification Locum Form A Locum E-signed",
          "Practice Notification Locum Form A Practice E-signed",
        ].includes(notificationTypeName) && notification.payload_type === 'locum_form_a') {
          window.open(`${process.env.API_URL}/api/v1/locum-form-a/${payload.id}/pdf`)
        }

        if ([
          "Locum Notification Locum Solo Form",
          "Locum Notification Locum Solo Form Locum E-signed",
          "Locum Notification Locum Solo Form Practice E-signed",
          "Practice Notification Locum Solo Form Locum E-signed",
          "Practice Notification Locum Solo Form Practice E-signed",
        ].includes(notificationTypeName) && notification.payload_type === 'solo_form') {
          window.open(`${process.env.API_URL}/api/v1/locum-solo-form/${payload.id}/pdf`)
        }

        return
      }

      const locumComplianceDocumentNotifications = [
        "Locum Notification Compliance Approved",
        "Locum Notification Compliance Pending",
        "Locum Notification Compliance Rejected",
        "Locum Notification Compliance Expired",
        "Locum Notification Compliance Expiring",
      ]

      const locumPermanentJobNotifications = [
        "Locum Notification Permanent Job Matched",
        "Locum Notification Permanent Job Invited",
        "Locum Notification Permanent Job Rejected",
        "Locum Notification Permanent Job Hired",
      ]

      const locumJobNotifications = [
        "Locum Notification Job Allocated",
        "Locum Notification Job Amended",
        "Locum Notification Job Application Cancelled",
        "Locum Notification Job Applied",
        "Locum Notification Job Auto Withdrawn",
        "Locum Notification Job Cancelled",
        "Locum Notification Job Conflict",
        "Locum Notification Job Available",
        "Locum Notification Job Matched",
        "Locum Notification Job Ongoing",
        "Locum Notification Job Reminder",
        "Locum Notification Job Unavailable",
        "Locum Notification Job Unqualified",
        "Locum Notification Job Unsuccessful",
        "Locum Notification Job Withdrawn",
      ]

      const locumJobPartNotifications = [
        "Locum Notification Job Part Completed",
        "Locum Notification Job Part Approved",
      ]

      const locumLocumInvoiceNotifications = [
        "Locum Notification Locum Invoice Issued",
        "Locum Notification Locum Invoice Disputed",
        "Locum Notification Locum Invoice Approved",
        "Locum Notification Locum Invoice Paid",
      ]

      const practiceNotifications = [
        "Practice Notification Practice Actived",
        "Practice Notification Practice Reactivated",
        "Practice Notification Practice Suspended",
      ]

      const practiceComplianceDocumentNotifications = [
        "Practice Notification Locum Compliance Expired",
        "Practice Notification Locum Compliance Expiring",
      ]

      const practicePermanentJobNotifications = [
        "Practice Notification Permanent Job Applied",
        "Practice Notification Approve Permanent Job Spoke",
        "Practice Notification Reject Permanent Job Spoke",
        "Practice Notification Hub Created Permanent Job for Spoke",
        "Practice Notification Spoke Created Pending Permanent Job",
        "Practice Notification Locum Accept Permanent Job Invitation",
        "Practice Notification Locum Reject Permanent Job Invitation",
      ]

      const practiceJobNotifications = [
        "Practice Notification Job Allocated",
        "Practice Notification Job Amended",
        "Practice Notification Job Applied",
        "Practice Notification Job Auto Withdrawn",
        "Practice Notification Job Cancelled",
        "Practice Notification Job Live",
        "Practice Notification Job Ongoing",
        "Practice Notification Job Pending",
        "Practice Notification Job Rejected",
        "Practice Notification Job Reminder",
        "Practice Notification Job Selection Date",
        "Practice Notification Job Unfilled",
        "Practice Notification Job Unfilled Warning",
        "Practice Notification Job Withdrawn",
      ]

      const practiceJobPartNotifications = [
        "Practice Notification Job Part Completed",
        "Practice Notification Job Part Approved",
      ]

      const jobApplicationNotifications = [
        "Practice Notification Job Application",
        "Practice Notification Job Application Auto Cancelled",
        "Practice Notification Job Application Cancelled",
      ]

      const practiceLocumInvoiceNotifications = [
        "Practice Notification Locum Invoice Issued",
        "Practice Notification Locum Invoice Disputed",
        "Practice Notification Locum Invoice Approved",
        "Practice Notification Locum Invoice Paid",
      ]

      const practiceInvoiceNotifications = [
        "Practice Notification Practice Invoice Issued",
        "Practice Notification Practice Invoice Paid",
        "Practice Notification Practice Invoice Past Due",
        "Practice Notification Practice Invoice Unpaid",
      ]

      const practicePracticeSurgeryNotifications = [
        "Practice Notification Practice Surgery Created",
        "Practice Notification Practice Surgery Deleted",
        "Practice Notification Practice Surgery Updated",
        "Practice Notification Practice Surgery Rejected",
        "Practice Notification Practice Surgery Termination Requested",
      ]

      const practicePracticeHubNotifications = [
        "Practice Notification Practice Hub Created",
        "Practice Notification Practice Hub Deleted",
        "Practice Notification Practice Hub Accepted",
        "Practice Notification Practice Hub Rejected",
      ]

      if (notificationTypeName === "Locum Notification Incomplete Compliance") {
        this.$router.push({
          name: "compliance",
        })

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (locumComplianceDocumentNotifications.includes(notificationTypeName)) {
        const locumComplianceDocument = payload

        const {
          id: locumComplianceDocumentId,
          compliance_document: complianceDocument,
        } = locumComplianceDocument

        const {
          compliance_document_type: complianceDocumentType,
        } = complianceDocument

        const { name: complianceDocumentTypeName, } = complianceDocumentType

        if (complianceDocumentTypeName === "Reference") {
          this.$router.push({
            name: "compliance",
          })
        } else {
          if (this.$route.name === "compliance") {
            this.$router.push({
              name: "compliance-id",
              params: {
                id: locumComplianceDocumentId,
              },
            })
          } else {
            this.$router.push({
              name: "compliance",
            })

            setTimeout(() => {
              this.$router.push({
                name: "compliance-id",
                params: {
                  id: locumComplianceDocumentId,
                },
              })
            }, 500)
          }
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if(locumPermanentJobNotifications.includes(notificationTypeName)) {
        const permanentJob = payload

        const {
          id: permanentJobId,
        } = payload

        if (
          notificationTypeName
            === "Locum Notification Permanent Job Matched"
          && permanentJob
        ) {
          this.$router.push({
            name: "permanent-jobs-index-id",
            params: {
              id: permanentJobId,
            },
          })
        }

        if (
          notificationTypeName
            === "Locum Notification Permanent Job Invited"
          && permanentJob
        ) {
          this.$router.push({
            name: "permanent-jobs-index-id",
            params: {
              id: permanentJobId,
            },
          })
        }

        if (
          notificationTypeName
            === "Locum Notification Permanent Job Rejected"
          && permanentJob
        ) {
          this.$router.push({
            name: "permanent-jobs-index-id",
            params: {
              id: permanentJobId,
            },
          })
        }

        if (
          notificationTypeName
            === "Locum Notification Permanent Job Hired"
          && permanentJob
        ) {
          this.$router.push({
            name: "permanent-jobs-index-id",
            params: {
              id: permanentJobId,
            },
          })
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (locumJobNotifications.includes(notificationTypeName)) {
        const job = payload

        const {
          type: jobType,
          id: jobId,
          old_job_id: oldJobId,
          job_parts: jobParts,
          locum_status: locumStatus,
        } = job

        let routeParamId = jobId
        let routeParamJobPartId = null

        if (notificationTypeName === "Locum Notification Job Unqualified" && oldJobId) {
          routeParamId = oldJobId
        }

        if (notificationTypeName === "Locum Notification Job Unavailable" && oldJobId) {
          routeParamId = oldJobId
        }

        if (
          (notificationTypeName === "Locum Notification Job Auto Withdrawn"
            || notificationTypeName === "Locum Notification Job Withdrawn")
          && jobParts
        ) {
          const jobPart = jobParts.find(jobPart => jobPart.status === "Withdrawn")

          if (jobPart) {
            routeParamJobPartId = jobPart.id
          }
        }

        if (notificationTypeName === "Locum Notification Job Cancelled" && jobParts) {
          const jobPart = jobParts.find(jobPart => jobPart.status === "Cancelled")
          
          if (jobPart) {
            routeParamJobPartId = jobPart.id
          }
        }

        if (
          notificationTypeName === "Locum Notification Job Conflict"
          && jobParts
          && jobParts.length > 0
        ) {
          const jobPart = jobParts[0]

          if (jobPart.status === 'Allocated' || jobPart.status === 'Ongoing') {
            routeParamJobPartId = jobPart.id
          }
        }

        if (
          jobType === "Platform"
          && notificationTypeName === "Locum Notification Job Ongoing"
          && jobParts
        ) {
          const jobPart = jobParts.find(jobPart => jobPart.status === "Ongoing")

          if (jobPart) {
            routeParamJobPartId = jobPart.id
          }
        }

        if (this.$route.name === "locum-job-parts-index") {
          if (routeParamJobPartId) {
            this.$router.push({
              name: "locum-job-parts-index-jobPartId",
              params: {
                jobPartId: routeParamJobPartId,
              },
              query: {
                ...this.$route.query,
              },
            })
          } else {
            this.$router.push({
              name: "jobs-index-id",
              params: {
                id: routeParamId,
              },
              query: {
                ...this.$route.query,
                status: locumStatus === 'Matched' ? 'Available' : locumStatus,
              },
            })
          }
        } else if (this.$route.name === "jobs-index") {
          if (routeParamJobPartId) {
            this.$router.push({
              name: "jobs-index-id-job-parts-jobPartId",
              params: {
                id: routeParamId,
                jobPartId: routeParamJobPartId,
              },
              query: {
                ...this.$route.query,
              },
            })
          } else {
            this.$router.push({
              name: "jobs-index-id",
              params: {
                id: routeParamId,
              },
              query: {
                ...this.$route.query,
              },
            })
          }
        } else {
          if (routeParamJobPartId) {
            this.$router.push({
              name: "locum-job-parts-index-jobPartId",
              params: {
                jobPartId: routeParamJobPartId,
              },
            })
          } else {
            this.$router.push({
              name: "jobs-index-id",
              params: {
                id: routeParamId,
              },
            })
          }
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (locumJobPartNotifications.includes(notificationTypeName)) {
        const jobPart = payload

        const { id: jobPartId, job_id: jobId, } = jobPart

        if (this.$route.name === "locum-job-parts-index") {
          this.$router.push({
            name: "locum-job-parts-index-jobPartId",
            params: {
              jobPartId,
            },
            query: {
              ...this.$route.query,
            },
          })
        } else if (this.$route.name === "jobs-index") {
          this.$router.push({
            name: "jobs-index-id-job-parts-jobPartId",
            params: {
              id: jobId,
              jobPartId,
            },
            query: {
              ...this.$route.query,
            },
          })
        } else {
          this.$router.push({
            name: "locum-job-parts-index-jobPartId",
            params: {
              jobPartId,
            },
          })
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (notificationTypeName === "Locum Notification Job Part To Be Invoiced") {
        const jobPart = payload

        const { id: jobPartId, } = jobPart

        this.$router.push({
          name: "locum-billing-invoices",
        })

        setTimeout(() => {
          this.$router.push({
            name: "locum-billing-invoices-id-create",
            params: {
              id: jobPartId,
            },
          })
        }, 500)

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (locumLocumInvoiceNotifications.includes(notificationTypeName)) {
        const locumInvoice = payload

        const { id: locumInvoiceId, status, } = locumInvoice

        if (this.$route.name === "locum-billing-invoices") {
          this.$router.push({
            name: "locum-billing-invoices-id",
            params: {
              id: locumInvoiceId,
            },
            query: {
              ...this.$route.query,
              status: status === "Paid" ? "approved" : status.toLowerCase(),
            },
          })
        } else {
          this.$router.push({
            name: "locum-billing-invoices",
          })

          setTimeout(() => {
            this.$router.push({
              name: "locum-billing-invoices-id",
              params: {
                id: locumInvoiceId,
              },
              query: {
                status: status === "Paid" ? "approved" : status.toLowerCase(),
              },
            })
          }, 500)
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (practiceNotifications.includes(notificationTypeName)) {
        this.$router.push({
          name: "dashboard",
        })

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (practiceComplianceDocumentNotifications.includes(notificationTypeName)) {
        const locumComplianceDocument = payload

        const { locum_user: locumUser, } = locumComplianceDocument

        const { id: locumUserId, } = locumUser

        if (this.$route.name === "my-banks-index") {
          this.$router.push({
            name: "my-banks-index-locumId-index",
            params: {
              locumId: locumUserId,
            },
            query: {
              ...this.$route.query,
            },
          })
        } else {
          this.$router.push({
            name: "my-banks-index",
            query: {
              status: "Appointed",
            },
          })

          setTimeout(() => {
            this.$router.push({
              name: "my-banks-index-locumId-index",
              params: {
                locumId: locumUserId,
              },
              query: {
                ...this.$route.query,
              },
            })
          }, 500)
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (practicePermanentJobNotifications.includes(notificationTypeName)) {
        const permanentJob = payload
        const {
          id: permanentJobId,
        } = permanentJob

        if (
          notificationTypeName
            === "Practice Notification Permanent Job Applied"
          && permanentJob
        ) {
          this.$router.push({
            name: "permanent-jobs-index-id",
            params: {
              id: permanentJobId,
            },
          })
        }

        if (
          notificationTypeName
            === "Practice Notification Locum Accept Permanent Job Invitation"
          && permanentJob
        ) {
          this.$router.push({
            name: "permanent-jobs-index-id",
            params: {
              id: permanentJobId,
            },
          })
        }

        if (
          notificationTypeName
            === "Practice Notification Locum Reject Permanent Job Invitation"
          && permanentJob
        ) {
          this.$router.push({
            name: "permanent-jobs-index-id",
            params: {
              id: permanentJobId,
            },
          })
        }

        if (
          notificationTypeName
            === "Practice Notification Approve Permanent Job Spoke"
          && permanentJob
        ) {
          this.$router.push({
            name: "permanent-jobs-index-id",
            params: {
              id: permanentJobId,
            },
          })
        }
        if (
          notificationTypeName
            === "Practice Notification Reject Permanent Job Spoke"
          && permanentJob
        ) {
          this.$router.push({
            name: "permanent-jobs-index-id",
            params: {
              id: permanentJobId,
            },
          })
        }
        if (
          notificationTypeName
            === "Practice Notification Hub Created Permanent Job for Spoke"
          && permanentJob
        ) {
          this.$router.push({
            name: "permanent-jobs-index-id",
            params: {
              id: permanentJobId,
            },
          })
        }
        if (
          notificationTypeName
            === "Practice Notification Spoke Created Pending Permanent Job"
          && permanentJob
        ) {
          this.$router.push({
            name:
              "hub-surgery-management-id-surgery-permanent-jobs-index-permJobId",
            params: {
              id: permanentJob.spoke_surgery_id
                ? permanentJob.spoke_surgery_id
                : null,
              permJobId: permanentJobId,
            },
          })
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (practiceJobNotifications.includes(notificationTypeName)) {
        const job = payload

        const {
          id: jobId,
          practice_id: jobPracticeId,
          practice_surgery_id: practiceSurgeryId,
          job_parts: jobParts,
          status,
        } = job

        let routeParamId = jobId
        let routeParamJobPartId = null

        if (
          (notificationTypeName
            === "Practice Notification Job Auto Withdrawn"
            || notificationTypeName === "Practice Notification Job Withdrawn")
          && jobParts
        ) {
          const jobPart = jobParts.find(jobPart => jobPart.status === "Withdrawn")

          if (jobPart) {
            routeParamJobPartId = jobPart.id
          }
        }

        if (notificationTypeName === "Practice Notification Job Cancelled" && jobParts) {
          const jobPart = jobParts.find(jobPart => jobPart.status === "Cancelled")

          if (jobPart) {
            routeParamJobPartId = jobPart.id
          }
        }

        if (notificationTypeName === "Practice Notification Job Ongoing" && jobParts) {
          const jobPart = jobParts.find(jobPart => jobPart.status === "Ongoing")

          if (jobPart) {
            routeParamJobPartId = jobPart.id
          }
        }

        if (jobPracticeId !== this.$auth.user.practice_id && practiceSurgeryId) {
          this.$router.push({
            name: "hub-surgery-management-id-surgery-sessions-index",
            params: {
              id: practiceSurgeryId,
            },
          })

          setTimeout(() => {
            if (routeParamJobPartId) {
              this.$router.push({
                name:
                  "hub-surgery-management-id-surgery-sessions-index-sessionId-job-parts-jobPartId",
                params: {
                  id: practiceSurgeryId,
                  sessionId: routeParamId,
                  jobPartId: routeParamJobPartId,
                },
              })
            } else {
              this.$router.push({
                name:
                  "hub-surgery-management-id-surgery-sessions-index-sessionId",
                params: {
                  id: practiceSurgeryId,
                  sessionId: routeParamId,
                },
              })
            }
          }, 500)
        } else {
          if (this.$route.name === "job-parts-index") {
            if (routeParamJobPartId) {
              this.$router.push({
                name: "job-parts-index-jobPartId",
                params: {
                  jobPartId: routeParamJobPartId,
                },
                query: {
                  ...this.$route.query,
                },
              })
            } else {
              this.$router.push({
                name: "sessions-index-id",
                params: {
                  id: routeParamId,
                },
                query: {
                  ...this.$route.query,
                  status,
                },
              })
            }
          } else if (this.$route.name === "sessions-index") {
            if (routeParamJobPartId) {
              this.$router.push({
                name: "sessions-index-id-job-parts-jobPartId",
                params: {
                  id: routeParamId,
                  jobPartId: routeParamJobPartId,
                },
                query: {
                  ...this.$route.query,
                },
              })
            } else {
              this.$router.push({
                name: "sessions-index-id",
                params: {
                  id: routeParamId,
                },
                query: {
                  ...this.$route.query,
                },
              })
            }
          } else {
            if (routeParamJobPartId) {
              this.$router.push({
                name: "job-parts-index-jobPartId",
                params: {
                  jobPartId: routeParamJobPartId,
                },
              })
            } else {
              this.$router.push({
                name: "sessions-index-id",
                params: {
                  id: routeParamId,
                },
              })
            }
          }
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (practiceJobPartNotifications.includes(notificationTypeName)) {
        const jobPart = payload

        const {
          id: jobPartId,
          job_id: jobId,
          practice_id: jobPracticeId,
          practice_surgery_id: practiceSurgeryId,
        } = jobPart

        if (jobPracticeId !== this.$auth.user.practice_id && practiceSurgeryId) {
          this.$router.push({
            name: "hub-surgery-management-id-surgery-sessions-index",
            params: {
              id: practiceSurgeryId,
            },
          })

          setTimeout(() => {
            this.$router.push({
              name:
                "hub-surgery-management-id-surgery-sessions-index-sessionId-job-parts-jobPartId",
              params: {
                id: practiceSurgeryId,
                sessionId: jobId,
                jobPartId,
              },
            })
          }, 500)
        } else {
          if (this.$route.name === "job-parts-index") {
            this.$router.push({
              name: "job-parts-index-jobPartId",
              params: {
                jobPartId,
              },
              query: {
                ...this.$route.query,
              },
            })
          } else if (this.$route.name === "sessions-index") {
            this.$router.push({
              name: "sessions-index-id-job-parts-jobPartId",
              params: {
                id: jobId,
                jobPartId,
              },
              query: {
                ...this.$route.query,
              },
            })
          } else {
            this.$router.push({
              name: "job-parts-index-jobPartId",
              params: {
                jobPartId,
              },
            })
          }
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (jobApplicationNotifications.includes(notificationTypeName)) {
        const { job, } = payload

        const {
          id: jobId,
          practice_id: jobPracticeId,
          practice_surgery_id: practiceSurgeryId,
        } = job

        let routeParamId = jobId

        if (
          jobPracticeId !== this.$auth.user.practice_id
          && practiceSurgeryId
        ) {
          this.$router.push({
            name: "hub-surgery-management-id-surgery-sessions-index",
            params: {
              id: practiceSurgeryId,
            },
          })

          setTimeout(() => {
            this.$router.push({
              name:
                "hub-surgery-management-id-surgery-sessions-index-sessionId",
              params: {
                id: practiceSurgeryId,
                sessionId: routeParamId,
              },
            })
          }, 500)
        } else {
          if (this.$route.name === "sessions-index") {
            this.$router.push({
              name: "sessions-index-id",
              params: {
                id: routeParamId,
              },
              query: {
                ...this.$route.query,
              },
            })
          } else {
            this.$router.push({
              name: "sessions-index",
            })

            setTimeout(() => {
              this.$router.push({
                name: "sessions-index-id",
                params: {
                  id: routeParamId,
                },
              })
            }, 500)
          }
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (practiceLocumInvoiceNotifications.includes(notificationTypeName)) {
        const locumInvoice = payload

        const {
          id: locumInvoiceId,
          practice_id: locumInvoicePracticeId,
          practice_surgery_id: practiceSurgeryId,
          status,
        } = locumInvoice

        if (
          locumInvoicePracticeId !== this.$auth.user.practice_id
          && practiceSurgeryId
        ) {
          this.$router.push({
            name:
              "hub-surgery-management-id-surgery-billings-invoices-from-locums",
            params: {
              id: practiceSurgeryId,
            },
          })

          setTimeout(() => {
            this.$router.push({
              name:
                "hub-surgery-management-id-surgery-billings-invoices-from-locums-invoiceId",
              params: {
                id: practiceSurgeryId,
                invoiceId: locumInvoiceId,
              },
            })
          }, 500)
        } else {
          if (this.$route.name === "practice-billing-invoices-from-locums") {
            this.$router.push({
              name: "practice-billing-invoices-from-locums-id",
              params: {
                id: locumInvoiceId,
              },
              query: {
                ...this.$route.query,
                status: status === "Paid" ? "approved" : status.toLowerCase(),
              },
            })
          } else {
            this.$router.push({
              name: "practice-billing-invoices-from-locums",
            })

            setTimeout(() => {
              this.$router.push({
                name: "practice-billing-invoices-from-locums-id",
                params: {
                  id: locumInvoiceId,
                },
                query: {
                  status: status === "Paid" ? "approved" : status.toLowerCase(),
                },
              })
            }, 500)
          }
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (practiceInvoiceNotifications.includes(notificationTypeName)) {
        const practiceInvoice = payload

        const { id: practiceInvoiceId, } = practiceInvoice

        if (this.$route.name === "practice-billing-invoices-from-hubzz") {
          this.$router.push({
            name: "practice-billing-invoices-from-hubzz-id",
            params: {
              id: practiceInvoiceId,
            },
            query: {
              ...this.$route.query,
            },
          })
        } else {
          this.$router.push({
            name: "practice-billing-invoices-from-hubzz",
          })

          setTimeout(() => {
            this.$router.push({
              name: "practice-billing-invoices-from-hubzz-id",
              params: {
                id: practiceInvoiceId,
              },
            })
          }, 500)
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (practicePracticeSurgeryNotifications.includes(notificationTypeName)) {
        const practiceSurgery = payload

        const {
          id: practiceSurgeryId,
          practice_id: practiceId,
          child_practice_id: childPracticeId,
          invitation_accepted: invitationAccepted,
        } = practiceSurgery

        if (practiceId === this.$auth.user.practice_id) {
          if (practiceSurgery.isDeleted) {
            this.$router.push({
              name: "hub-surgery-management-invitations-hub",
            })
          } else {
            if (!invitationAccepted) {
              if (
                this.$route.name === "hub-surgery-management-invitations-hub"
              ) {
                this.$router.push({
                  name: "hub-surgery-management-invitations-hub-invitationId",
                  params: {
                    invitationId: practiceSurgeryId,
                  },
                })
              } else {
                this.$router.push({
                  name: "hub-surgery-management-invitations-hub",
                })

                setTimeout(() => {
                  this.$router.push({
                    name: "hub-surgery-management-invitations-hub-invitationId",
                    params: {
                      invitationId: practiceSurgeryId,
                    },
                  })
                }, 500)
              }
            } else {
              if (this.$route.name === "hub-surgery-management-index") {
                this.$router.push({
                  name: "hub-surgery-management-id",
                  params: {
                    id: practiceSurgeryId,
                  },
                })
              } else {
                this.$router.push({
                  name: "hub-surgery-management-index",
                })

                setTimeout(() => {
                  this.$router.push({
                    name: "hub-surgery-management-id",
                    params: {
                      id: practiceSurgeryId,
                    },
                  })
                }, 500)
              }
            }
          }
        }

        if (childPracticeId === this.$auth.user.practice_id) {
          if (practiceSurgery.isDeleted) {
            this.$router.push({
              name: "spoke-surgery-management-invitations-hub",
            })
          } else {
            if (!invitationAccepted) {
              if (
                this.$route.name === "spoke-surgery-management-invitations-hub"
              ) {
                this.$router.push({
                  name: "spoke-surgery-management-invitations-hub-invitationId",
                  params: {
                    invitationId: practiceSurgeryId,
                  },
                })
              } else {
                this.$router.push({
                  name: "spoke-surgery-management-invitations-hub",
                })

                setTimeout(() => {
                  this.$router.push({
                    name:
                      "spoke-surgery-management-invitations-hub-invitationId",
                    params: {
                      invitationId: practiceSurgeryId,
                    },
                  })
                }, 500)
              }
            } else {
              this.$router.push({
                name: "spoke-surgery-management-index",
              })
            }
          }
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      if (practicePracticeHubNotifications.includes(notificationTypeName)) {
        if (
          [
            "Practice Notification Practice Hub Created",
            "Practice Notification Practice Hub Deleted",
            "Practice Notification Practice Hub Rejected",
          ].includes(notificationTypeName)
        ) {
          const practice = payload

          const {
            id: practiceId,
            hub_practice,
            isDeleted,
            isRejected,
            isAccepted,
          } = practice

          const {
            id: hubPracticeId,
          } = hub_practice

          if (practiceId === this.$auth.user.practice_id) {
            if (isAccepted) {
              this.$router.push({
                name: "spoke-surgery-management-index",
              })
            } else {
              this.$router.push({
                name: "spoke-surgery-management-invitations-spoke",
              })
            }
          }

          if (hubPracticeId === this.$auth.user.practice_id) {
            if (isAccepted) {
              this.$router.push({
                name: "hub-surgery-management-index",
              })
            } else {
              if (
                this.$route.name
                  === "hub-surgery-management-invitations-spoke"
                && (!isDeleted || !isRejected)
              ) {
                this.$router.push({
                  name: "hub-surgery-management-invitations-spoke-invitationId",
                  params: {
                    invitationId: practiceId,
                  },
                })
              } else {
                this.$router.push({
                  name: "hub-surgery-management-invitations-spoke",
                })

                if (!isDeleted) {
                  setTimeout(() => {
                    this.$router.push({
                      name:
                        "hub-surgery-management-invitations-spoke-invitationId",
                      params: {
                        invitationId: practiceId,
                      },
                    })
                  }, 500)
                }
              }
            }
          }
        }

        if (
          ["Practice Notification Practice Hub Accepted",].includes(
            notificationTypeName
          )
        ) {
          const practice_surgery = payload

          const { id, practice_id, child_practice_id, } = practice_surgery

          if (child_practice_id === this.$auth.user.practice_id) {
            this.$router.push({
              name: "spoke-surgery-management-index",
            })
          }

          if (practice_id === this.$auth.user.practice_id) {
            if (this.$route.name === "hub-surgery-management-index") {
              this.$router.push({
                name: "hub-surgery-management-id",
                params: {
                  id: id,
                },
              })
            } else {
              this.$router.push({
                name: "hub-surgery-management-index",
              })

              setTimeout(() => {
                this.$router.push({
                  name: "hub-surgery-management-id",
                  params: {
                    id: id,
                  },
                })
              }, 500)
            }
          }
        }

        this.showNotificationsDropdown = false
        this.updateNotificationSeen(notification)
        return
      }

      this.oldGoTo(notification)
    },

    oldGoTo (notification) {
      let job = notification.payload.job
        ? notification.payload.job
        : notification.payload

      let type = notification.type

      let id = job.id

      let status
        = this.$auth.user.domain === "Practice" ? job.status : job.locum_status

      let dateStart = job.date_start

      let url = ""

      if (type === "Job") {
        if (this.$auth.user.domain === "Locum") {
          url = "/jobs"
        }

        if (this.$auth.user.domain === "Practice") {
          if (job.practice_id === this.$auth.user.practice_id) {
            if (this.$route.name.includes("dashboard")) {
              url = this.$route.path
            } else {
              url = "/sessions"
            }
          } else {
            url = `/hub-surgery-management/${job.practice_surgery_id}/surgery-sessions`
          }
        }
      } else if (type === "Billing") {
        url
          = this.$auth.user.domain === "Practice"
          && notification.practice_id === this.$auth.user.practice_id
            ? `/practice-billing/invoices-from-locums`
            : this.$auth.user.domain === "Practice"
              && job.practice_id !== this.$auth.user.practice_id
              ? `/hub-surgery-management/${notification.practice_surgery_id}/surgery-billings/invoices-from-locums`
              : this.$auth.user.domain === "Locum"
              && notification.notification_billing_type === "Platform"
                ? `/locum-billing/invoices`
                : this.$auth.user.domain === "Locum"
              && notification.notification_billing_type === "Private"
                  ? `/locum-billing/private-invoices`
                  : null
      } else if (type === "Permanent Jobs") {
        url = `/permanent-jobs`
      }

      if (type === "Job") {
        // for dashboard viewing, moves the date according to the job
        if (url && url.includes("/dashboard")) {
          let selectedMonth
            = this.$moment()
              .month(dateStart)
              .format("M") - 1

          let selectedYear = this.$moment()
            .month(dateStart)
            .format("YYYY")

          this.$store.commit(
            "calendar/SELECT_DATE",
            this.$moment(dateStart, "YYYY-MM-DD")
              .set("month", selectedMonth)
              .set("year", selectedYear)
              .format("YYYY-MM-DD")
          )
        }
      }

      // query
      if (type === "Job") {
        let routeStatus = ""

        switch (status) {
        case "Declined":
          routeStatus = "Withdrawn"
          break
        case "Matched":
          routeStatus = "Available"
          break
        case "Available":
          routeStatus = "Public"
          break
        case "Terminated":
          routeStatus = "Completed"
          break
        case "Updated":
          routeStatus = null
          break
        default:
          routeStatus = status
        }

        if (url) {
          this.$router.push({
            path: `${url}`,
            query: {
              ...this.$route.query,
              jobStatus: url.includes("surgery-management")
                ? routeStatus
                : null,
              status: !url.includes("surgery-management") ? routeStatus : null,
            },
          })
        } else {
          if (!notification.seen) {
            this.seenNotification(notification.id)
          }
        }

        setTimeout(() => {
          if (url) {
            this.$router.push({
              path: `${url}/${id}`,
              query: {
                ...this.$route.query,
                jobStatus: url.includes("surgery-management")
                  ? routeStatus
                  : null,
                status: !url.includes("surgery-management") ? routeStatus : null,
              },
            })
          } else {
            this.seenNotification(notification.id)
          }
        }, 500)
      } else if (type === "Billing") {
        let routeStatus = ""

        switch (status) {
        case "Draft":
          routeStatus = "to-be-invoiced"
          break
        case "Issued":
          routeStatus = "issued"
          break
        case "Paid":
          routeStatus = "approved"
          break
        default:
          routeStatus = status
        }

        // return

        if (id !== this.$route.params.id) {
          this.$router.push({
            path: url,
            query: {
              ...this.$route.query,
              status: routeStatus,
            },
          })
        }

        setTimeout(() => {
          this.$router.push({
            path: `${url}/${id}/edit`,
            query: { ...this.$route.query, status: routeStatus, },
          })
        }, 500)
      } else if (type === "Permanent Jobs") {
        this.$router.push({
          path: `${url}/${id}`,
          query: { ...this.$route.query, },
        })
      }

      if (!notification.seen) {
        this.seenNotification(notification.id)
      }
    },

    seenNotification (notificationId) {
      this.$axios
        .put(`/api/v1/${this.domain}/notifications/${notificationId}/seen`)
        .then(() => {
          const notification = this.notifications.find(
            ({ id, }) => id === notificationId
          )

          if (notification) {
            notification.seen = true
          }

          const index = this.unseenNotificationIds.findIndex(
            unseenNotificationId => unseenNotificationId === notificationId
          )

          if (index > -1) {
            this.unseenNotificationIds.splice(index, 1)
          }
        })
    },

    loadMore () {
      this.loadingLoadMore = true
      this.$axios
        .get(`/api/v1/${this.domain}/notifications`, {
          params: {
            order_by: "created_at:desc",
            limit: this.limit,
            offset: this.notifications.length,
          },
        })
        .then(response => {
          const notifications = response.data.data.notifications

          notifications.forEach(notification => {
            const index = this.notifications.findIndex(
              ({ id, }) => id === notification.id
            )

            if (index > -1) {
              this.notifications.splice(index, 1, notification)
            } else {
              this.notifications.push(notification)
            }
          })
        })
        .finally(() => {
          this.loadingLoadMore = false
        })
    },

    close () {
      this.showNotificationsDropdown = false
    },

    scrollHandler ({ target: { scrollTop, offsetHeight, scrollHeight, }, }) {
      if (this.notificationCount !== this.notifications.length) {
        let scroll = Math.round(offsetHeight + scrollTop)
        if (scroll === scrollHeight) {
          this.loadMore()
        }
      }
    },
  },
}
</script>

<style scoped>
  .wrapper {
    overflow: hidden auto;
  }

  .dropdown {
    width: 94%;
    margin-left: 3%;
    margin-right: 3%;
    max-height: 80vh;
  }

  .modal {
    height: 100vh;
  }

  @media screen and (min-width: 640px) {
    .container {
      min-width: 350px;
      max-width: 350px;
    }

    .dropdown {
      width: auto;
      max-height: 500px;
      /* margin-right: 2rem; */
    }
  }

  @media (min-width: 720px) {
    .dropdown {
      margin-left: 1%;
      margin-right: 1%;
    }
  }

  .job-notification {
    position: fixed;
    bottom: 0;
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

  .truncate-info {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.3s linear;
  }
  @media (min-width: 768px) {
	.notif-btn {
		min-width: 150px;
	}
}
</style>
