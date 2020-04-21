<template>
  <div>
    <button
      class="relative button rounded-lg p-2 focus:outline-none cursor-pointer"
      @click="showNotificationsDropdown = !showNotificationsDropdown"
    >
      <svgicon name="bell" width="21" height="21" />
      <p
        v-if="unseenNotificationCount > 0"
        class="-m-2 absolute bg-red-600 text-white border bottom-0 right-0 flex h-6 w-6 font-bold text-xs p-1 items-center justify-center rounded-full"
      >
        {{ unseenNotificationCount }}
      </p>
    </button>
    
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
            <p class="cursor-pointer hover:text-gray-700" @click="markAllAsRead">
              <span>Mark all as read</span>
            </p>
            <span v-if="largeView" class="px-1 font-bold">·</span>
            <span v-if="largeView" class="cursor-pointer" @click="close">Close</span>
          </div>
        </div>

        <p
          v-if="!loading && notifications.length === 0"
          class="text-center text-sm py-2"
        >
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
              v-for="(notification, index) in sortedNotifications"
              :key="index"
              class="p-2 border-b leading-tight cursor-pointer transition-hover"
              :class="notification.seen ? 'hover:bg-gray-300' : 'bg-gray-200 hover:bg-gray-400'"
              @click="goTo(notification)"
            >
              <p
                class="font-bold block truncate"
              >
                <span>{{ getNotificationTitle(notification) }}&nbsp;</span>
              </p>
              <p class="text-sm pt-1">
                <span>{{ getNotificationMessage(notification) }}&nbsp;</span>
              </p>
              <div
                class="leading-tight text-xs pt-1 text-gray-600"
              >
                <span>{{ $moment(notification.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY | HH:mm') }}&nbsp;</span>
              </div>
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
  </div>
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway'

  export default {
    mixins: [clickaway],

    data () {
      return {
        showNotificationsDropdown: false,
        largeView: false,
        unseenNotificationCount: 0,
        notificationCount: 0,
        notifications: [],
        limit: 20,
        loading: false,
        loadingLoadMore: false,
        notificationTypeNames: [
          'Locum Notification Compliance Approved',
          'Locum Notification Compliance Pending',
          'Locum Notification Compliance Rejected',
          'Locum Notification Job Allocated',
          'Locum Notification Job Amended',
          'Locum Notification Job Application Cancelled',
          'Locum Notification Job Applied',
          'Locum Notification Job Available',
          'Locum Notification Job Cancelled',
          'Locum Notification Job Matched',
          'Locum Notification Job Unavailable',
          'Locum Notification Job Unqualified',
          'Locum Notification Job Unsuccessful',

          'Practice Notification Job Allocated',
          'Practice Notification Job Amended',
          'Practice Notification Job Application',
          'Practice Notification Job Application Cancelled',
          'Practice Notification Job Applied',
          'Practice Notification Job Cancelled',
          'Practice Notification Job Live',
          'Practice Notification Job Pending',
        ],
      }
    },

    computed: {
      domain () {
        return this.$auth.user.domain.toLowerCase()
      },

      getNotificationDisplay () {
        return (notification) => {
          const {
            notification_type: notificationType,
            type,
            payload,
            title,
            message,
            description,
          } = notification

          const {
            name: notificationTypeName,
          } = notificationType

          const fixedNotifications = [
            'Locum Notification Compliance Approved',
            'Locum Notification Compliance Rejected',
            'Locum Notification Compliance Pending',

            'Locum Notification Job Available',
            'Locum Notification Job Matched',
            'Locum Notification Job Applied',
            'Locum Notification Job Application Cancelled',
            'Locum Notification Job Unqualified',
            'Locum Notification Job Unavailable',
            'Locum Notification Job Amended',

            'Practice Notification Job Live',
            'Practice Notification Job Pending',
            'Practice Notification Job Applied',
            'Practice Notification Job Cancelled',
            'Practice Notification Job Application',
            'Practice Notification Job Application Cancelled',
          ]

          if (fixedNotifications.includes(notificationTypeName)) {
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
        return (notification) => {
          const {
            title,
          } = this.getNotificationDisplay(notification)

          return title
        }
      },

      getNotificationMessage () {
        return (notification) => {
          const {
            message,
          } = this.getNotificationDisplay(notification)

          return message
        }
      },

      url () {
        return this.$auth.user.domain === 'Practice' ? '/sessions' : '/jobs'
      },

      sortedNotifications () {
        let billing_types = [
          'Locum Notification Locum Invoice Created',
          'Locum Notification Locum Invoice Updated',
          'Locum Notification Locum Invoice Paid',
          'Practice Notification Locum Invoice Created',
          'Practice Notification Locum Invoice Updated',
          'Practice Notification Locum Invoice Paid',
        ]

        return this.notifications
          .map((notification) => {
            let message = ""

            if (this.domain === "locum") {
              switch (notification.notification_type.name) {
                case 'Locum Notification Job Reminder':
                  message = `This Job will start later.`
                  break
                case 'Locum Notification Job Ongoing':
                  message = 'Your Job has started.'
                  break
                case 'Locum Notification Job Part Completed':
                  message = 'This part of your job has been completed'
                  break
                case 'Locum Notification Job Completed':
                  message = 'This job has been completed'
                  break
                case 'Locum Notification Job Approved':
                  message = 'This part of your job has been approved'
                  break
                case 'Locum Notification Job Disputed':
                  message = 'This part of your job has been disputed'
                  break
                case 'Locum Notification Job Declined':
                  message = 'You successfully leave this job.'
                  break
                case 'Locum Notification Job Terminated':
                  message = 'This Job has been terminated.'
                  break
                default:
                  message = ''
              }
            } else if (this.domain === 'practice') {
              switch (notification.notification_type.name) {
                case 'Practice Notification Job Reminder':
                  message = `This Job will start later.`
                  break
                case 'Practice Notification Job Ongoing':
                  message = 'This Job has started.'
                  break
                case 'Practice Notification Job Part Completed':
                  message = 'This part of your job has been completed'
                  break
                case 'Practice Notification Job Completed':
                  message = 'This job has been completed'
                  break
                case 'Practice Notification Job Approved':
                  message = 'This part of your job has been approved'
                  break
                case 'Practice Notification Job Disputed':
                  message = 'This part of your job has been disputed'
                  break
                case 'Practice Notification Job Declined':
                  message = 'The locum leave this job.'
                  break
                case 'Practice Notification Job Update Accept':
                  message = 'The locum accepted your changes on this job.'
                  break
                case 'Practice Notification Job Unfilled Warning':
                  message = `This Job will start later.`
                  break
                case 'Practice Notification Job Unfilled':
                  message = 'This job is unfilled.'
                  break
              }
            }

            return {
              ...notification,
              message: message,
              type: billing_types.includes(notification.notification_type.name)
                ? "Billing"
                : "Job"
            }
          })
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      },
    },

    watch: {
      showNotificationsDropdown () {
        if (this.showNotificationsDropdown) {
          this.clearNotifications()
        }
      }
    },

    mounted () {
      this.loading = true
      Promise.all([
        this.$axios.get(`/api/v1/${this.domain}/notifications/count`, {
          params: {
            seen: false,
          }
        }).then((response) => {
          const unseenNotificationCount = response.data.data.count
          this.unseenNotificationCount = unseenNotificationCount
        }),

        this.$axios.get(`/api/v1/${this.domain}/notifications/count`).then((response) => {
          const count = response.data.data.count
          this.notificationCount = count
        }),

        this.$axios.get(`/api/v1/${this.domain}/notifications`, {
          params: {
            order_by: 'created_at:desc',
            limit: this.limit,
          }
        }).then((response) => {
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
      setSocketNotificationListener () {
        this.notificationTypeNames.forEach((notificationTypeName) => {
          this.$socket.on(notificationTypeName, this.newNotificationHandler)
        })
      },

      removeSocketNotificationListener () {
        this.notificationTypeNames.forEach((notificationTypeName) => {
          this.$socket.removeListener(notificationTypeName, this.newNotificationHandler)
        })
      },

      newNotificationHandler (payload) {
        const {
          notification_id: notificationId,
        } = payload

        if (notificationId) {
          this.$axios.get(`/api/v1/${this.domain}/notifications/${notificationId}`).then((response) => {
            const notification = response.data.data.notification
            const index = this.notifications.findIndex(({ id }) => id === notification.id)
            if (index > -1) {
              this.notifications.splice(index, 1, notification)
            } else {
              this.notifications.push(notification)
            }
            if (!notification.seen) {
              this.unseenNotificationCount++
            }
          })
        }
      },

      goTo (notification) {
        const {
          id: notificationId,
          notification_type: notificationType,
          payload,
          seen,
        } = notification

        const {
          name: notificationTypeName,
        } = notificationType

        const locumComplianceDocumentNotifications = [
          'Locum Notification Compliance Approved',
          'Locum Notification Compliance Pending',
          'Locum Notification Compliance Rejected',
        ]

        const locumJobNotifications = [
          'Locum Notification Job Allocated',
          'Locum Notification Job Amended',
          'Locum Notification Job Application Cancelled',
          'Locum Notification Job Applied',
          'Locum Notification Job Cancelled',
          'Locum Notification Job Available',
          'Locum Notification Job Matched',
          'Locum Notification Job Unavailable',
          'Locum Notification Job Unqualified',
          'Locum Notification Job Unsuccessful',
        ]

        const practiceJobNotifications = [
          'Practice Notification Job Allocated',
          'Practice Notification Job Amended',
          'Practice Notification Job Applied',
          'Practice Notification Job Cancelled',
          'Practice Notification Job Live',
          'Practice Notification Job Pending',
        ]

        const jobApplicationNotifications = [
          'Practice Notification Job Application',
          'Practice Notification Job Application Cancelled',
        ]

        if (locumComplianceDocumentNotifications.includes(notificationTypeName)) {
          const locumComplianceDocument = payload

          const {
            id: locumComplianceDocumentId,
            compliance_document: complianceDocument,
          } = locumComplianceDocument

          const {
            compliance_document_type: complianceDocumentType,
          } = complianceDocument

          const {
            name: complianceDocumentTypeName,
          } = complianceDocumentType

          if (complianceDocumentTypeName === 'Reference') {
            this.$router.push('/compliance')
          } else {
            if (this.$route.name.includes('compliance')) {
              this.$router.push(`/compliance/${locumComplianceDocumentId}`)
            } else {
              this.$router.push('/compliance')

              setTimeout(() => {
                this.$router.push(`/compliance/${locumComplianceDocumentId}`)
              }, 500)
            }
          }

          this.close()

          if (!seen) {
            this.seenNotification(notificationId)
          }

          return
        }
        
        if (locumJobNotifications.includes(notificationTypeName)) {
          const job = payload

          const {
            id: jobId,
            original_job_id: originalJobId,
            job_parts: jobParts,
          } = job

          let routeParamId = jobId
          let routeParamJobPartId = null

          if (notificationTypeName === 'Locum Notification Job Unqualified' && originalJobId) {
            routeParamId = originalJobId
          }

          if (notificationTypeName === 'Locum Notification Job Unavailable' && originalJobId) {
            routeParamId = originalJobId
          }

          if (notificationTypeName === 'Locum Notification Job Cancelled' && jobParts) {
            const jobPart = jobParts.find(jobPart => jobPart.status === 'Cancelled')
            if (jobPart) {
              routeParamJobPartId = jobPart.id
            }
          }

          if (this.$route.name === 'jobs-index') {
            if (routeParamJobPartId) {
              this.$router.push({
                name: 'jobs-index-job-parts-jobPartId',
                params: {
                  jobPartId: routeParamJobPartId,
                },
              })
            } else {
              this.$router.push({
                name: 'jobs-index-id',
                params: {
                  id: routeParamId,
                },
              })
            }
          } else {
            this.$router.push({
              name: 'jobs-index',
            })

            setTimeout(() => {
              if (routeParamJobPartId) {
                this.$router.push({
                  name: 'jobs-index-job-parts-jobPartId',
                  params: {
                    jobPartId: routeParamJobPartId,
                  },
                })
              } else {
                this.$router.push({
                  name: 'jobs-index-id',
                  params: {
                    id: routeParamId,
                  },
                })
              }
            }, 500)
          }

          this.close()

          if (!seen) {
            this.seenNotification(notificationId)
          }

          return
        }
        
        if (practiceJobNotifications.includes(notificationTypeName)) {
          const job = payload

          const {
            id: jobId,
            practice_id: jobPracticeId,
            practice_surgery_id: practiceSurgeryId,
            job_parts: jobParts,
          } = job

          let routeParamId = jobId
          let routeParamJobPartId = null

          if (notificationTypeName === 'Practice Notification Job Cancelled' && jobParts) {
            const jobPart = jobParts.find(jobPart => jobPart.status === 'Cancelled')
            if (jobPart) {
              routeParamJobPartId = jobPart.id
            }
          }

          if (jobPracticeId !== this.$auth.user.practice_id && practiceSurgeryId) {
            this.$router.push({
              name: 'hub-surgery-management-id-surgery-sessions-index',
              params: {
                id: practiceSurgeryId,
              },
            })

            setTimeout(() => {
              if (routeParamJobPartId) {
                this.$router.push({
                  name: 'hub-surgery-management-id-surgery-sessions-index-job-parts-jobPartId',
                  params: {
                    id: practiceSurgeryId,
                    jobPartId: routeParamJobPartId,
                  },
                })
              } else {
                this.$router.push({
                  name: 'hub-surgery-management-id-surgery-sessions-index-sessionId',
                  params: {
                    id: practiceSurgeryId,
                    sessionId: routeParamId,
                  },
                })
              }
            }, 500)
          } else {
            if (this.$route.name === 'sessions-index') {
              if (routeParamJobPartId) {
                this.$router.push({
                  name: 'sessions-index-job-parts-jobPartId',
                  params: {
                    jobPartId: routeParamJobPartId,
                  },
                })
              } else {
                this.$router.push({
                  name: 'sessions-index-id',
                  params: {
                    id: routeParamId,
                  },
                })
              }
            } else {
              this.$router.push({
                name: 'sessions-index',
              })

              setTimeout(() => {
                if (routeParamJobPartId) {
                  this.$router.push({
                    name: 'sessions-index-job-parts-jobPartId',
                    params: {
                      jobPartId: routeParamJobPartId,
                    },
                  })
                } else {
                  this.$router.push({
                    name: 'sessions-index-id',
                    params: {
                      id: routeParamId,
                    },
                  })
                }
              }, 500)
            }
          }

          this.close()

          if (!seen) {
            this.seenNotification(notificationId)
          }

          return
        }        

        if (jobApplicationNotifications.includes(notificationTypeName)) {
          const {
            job,
          } = payload

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
            this.$router.push(`/hub-surgery-management/${practiceSurgeryId}/surgery-sessions`)

            setTimeout(() => {
              this.$router.push(`/hub-surgery-management/${practiceSurgeryId}/surgery-sessions/${routeParamId}`)
            }, 500)
          } else {
            if (this.$route.name === 'sessions-index') {
              this.$router.push(`/sessions/${routeParamId}`)
            } else {
              this.$router.push('/sessions')

              setTimeout(() => {
                this.$router.push(`/sessions/${routeParamId}`)
              }, 500)
            }
          }

          this.close()

          if (!seen) {
            this.seenNotification(notificationId)
          }

          return
        }

        this.oldGoTo(notification)
      },

      oldGoTo (notification) {
        console.log(notification)

        let job = notification.payload.job
          ? notification.payload.job
          : notification.payload

        let type = notification.type

        let id = job.id

        let status =
          this.$auth.user.domain === "Practice" ? job.status : job.locum_status

        let dateStart = job.date_start

        let url = ""

        if (type === "Job") {
          if (this.$auth.user.domain === "Locum") {
            url = '/jobs'
          }

          if (this.$auth.user.domain === "Practice") {
            if (job.practice_id === this.$auth.user.practice_id) {
              if (this.$route.name.includes("dashboard")) {
                url = this.$route.path
              } else {
                url = '/sessions'
              }
            } else {
              url = `/hub-surgery-management/${job.practice_surgery_id}/surgery-sessions`
            }
          }
        } else if (type === "Billing") {
          url =
            this.$auth.user.domain === "Practice" &&
            notification.practice_id === this.$auth.user.practice_id
              ? `/practice-billing/invoices-from-locums`
              : this.$auth.user.domain === "Practice" &&
                job.practice_id !== this.$auth.user.practice_id
              ? `/hub-surgery-management/${notification.practice_surgery_id}/surgery-billings/invoices-from-locums`
              : this.$auth.user.domain === "Locum" &&
                notification.notification_billing_type === "Platform"
              ? `/locum-billing/invoices`
              : this.$auth.user.domain === "Locum" &&
                notification.notification_billing_type === "Private"
              ? `/locum-billing/private-invoices`
              : null
        } else if (type === "Permanent Jobs") {
          url = `/permanent-jobs`
        }

        if (type === 'Job') {
          // for dashboard viewing, moves the date according to the job
          if (url && url.includes("/dashboard")) {
            let selectedMonth =
              this.$moment()
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
                status: !url.includes("surgery-management") ? routeStatus : null
              }
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
                  status: !url.includes("surgery-management") ? routeStatus : null
                }
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
              }
            })
          }

          setTimeout(() => {
            this.$router.push({
              path: `${url}/${id}/edit`,
              query: { ...this.$route.query, status: routeStatus }
            })
          }, 500)
        } else if (type === "Permanent Jobs") {
          this.$router.push({
            path: `${url}/${id}`,
            query: { ...this.$route.query }
          })
        }

        if (!notification.seen) {
          this.seenNotification(notification.id)
        }
      },
      
      seenNotification (notificationId) {
        this.$axios.put(`/api/v1/${this.domain}/notifications/${notificationId}/seen`).then(() => {
          const notification = this.notifications.find(({ id }) => id === notificationId)
          if (notification) {
            notification.seen = true
          }
          this.unseenNotificationCount--
        })
      },

      markAllAsRead () {
        if (this.unseenNotificationCount > 0) {
          this.$axios.put(`/api/v1/${this.domain}/notifications/seen-all`).then(() => {
            this.notifications
              .filter(notification => !notification.seen)
              .forEach(notification => notification.seen = true)
            this.unseenNotificationCount = 0
          })
        }
      },

      loadMore () {
        this.loadingLoadMore = true
        this.$axios.get(`/api/v1/${this.domain}/notifications`, {
          params: {
            order_by: 'created_at:desc',
            limit: this.limit,
            offset: this.notifications.length,
          }
        }).then((response) => {
          const notifications = response.data.data.notifications

          notifications.forEach((notification) => {
            const index = this.notifications.findIndex(({ id }) => id === notification.id)

            if (index > -1) {
              this.notifications.splice(index, 1, notification)
            } else {
              this.notifications.push(notification)
            }
          })
        }).finally(() => {
          this.loadingLoadMore = false
        })
      },

      close () {
        this.largeView = false
        this.showNotificationsDropdown = false
      },

      scrollHandler ({ target: { scrollTop, offsetHeight, scrollHeight } }) {
        if (this.notificationCount !== this.notifications.length) {
          let scroll = Math.round(offsetHeight + scrollTop)
          if (scroll === scrollHeight) {
            this.loadMore()
          }
        }
      },

      clearNotifications () {
        this.$store.commit("billing/CLEAR_PRACTICE_BILLING_NOTIFICATION")
        this.$store.commit("billing/CLEAR_LOCUM_BILLING_NOTIFICATION")
        this.$store.commit("jobs/CLEAR_PRACTICE_JOB_NOTIFICATION")
        this.$store.commit("jobs/CLEAR_LOCUM_JOB_NOTIFICATION")
        this.$store.commit(
          "permanentjobs/CLEAR_PRACTICE_PERMANENT_JOB_NOTIFICATION"
        )
        this.$store.commit(
          "permanentjobs/CLEAR_LOCUM_PERMANENT_JOB_NOTIFICATION"
        )
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
</style>
