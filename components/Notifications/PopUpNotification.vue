<template>
  <div
    :key="notification.id"
    class="cards relative mx-1 my-2 p-3 flex flex-wrap bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md text-xs md:text-sm opacity-100 md:opacity-75 hover:opacity-100 transition-hover cursor-pointer"
    @click="$emit('goTo', notification)"
  >
    <span
      class="absolute top-0 right-0 cursor-pointer py-2 px-4 rounded-full text-lg font-bold hover:text-gray-700"
      @click.prevent.stop="$emit('removePopUpNotification', notification.id)"
    >x</span>

    <div class="flex flex-wrap w-48 md:w-64">
      <div class="flex flex-col items-start my-1 w-full">
        <div class="flex flex-wrap">
          <div
            v-if="notification.payload_type === 'job' || notification.payload_type === 'job_part'"
            class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
            :class="payloadJobClass[notification.payload.status]"
          >
            {{ notification.payload.status }}
          </div>

          <div
            v-if="notification.payload_type === 'locum_job' || notification.payload_type === 'locum_job_part'"
            class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
            :class="payloadLocumJobClass[notification.payload.locum_status]"
          >
            {{ notification.payload.locum_status === 'Matched' ? 'Available' : notification.payload.locum_status }}
          </div>

          <div
            v-if="notification.payload_type === 'locum_compliance_document' && notification.payload.status"
            class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
            :class="payloadLocumComplianceDocumentStatusClass[notification.payload.status]"
          >
            {{ notification.payload.status }}
          </div>

          <div
            v-if="notification.payload_type === 'locum_invoice' && notification.payload.status"
            class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
            :class="payloadLocumInvoiceStatusClass[notification.payload.status]"
          >
            {{ notification.payload.status }}
          </div>

          <div
            v-if="notification.payload_type === 'practice_invoice' && notification.payload.status"
            class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
            :class="payloadPracticeInvoiceStatusClass[notification.payload.status]"
          >
            {{ notification.payload.status }}
          </div>

          <div
            v-if="notification.payload_type === 'job_locum_user' && notification.payload.job"
            class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
            :class="payloadJobClass[notification.payload.job.status]"
          >
            {{ notification.payload.job.status }}
          </div>

          <!-- <div
            class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase"
          >
            {{ notification.status_tag }}
          </div> -->
        </div>

        <!-- <div
          v-if="notification.type === 'Jobs' && notification.billingStatus"
          class="px-2 py-1 md:text-xs font-bold rounded-lg max-w-sm cursor-pointer uppercase mt-1"
          :class="bgStatus(notification.billingStatus)"
        >
          {{ notification.billingStatus }}
        </div> -->

        <div
          class="font-bold md:text-md leading-none mr-1 uppercase pt-4 truncate-title"
          style="-webkit-box-orient: vertical;"
        >
          {{ notification.title }}
        </div>
      </div>
      <div class="w-full">
        <div class="leading-tight pt-1">
          {{ notification.description }}
        </div>
        <!-- <div
          v-if="notification.type === 'Jobs' && (notification.platform_job && notification.platform_job.extra_information)"
          class="leading-tight mt-2"
        >
          <div class="font-bold">
            Extra Information:
          </div>
          <div
            class="mt-1 truncate-info"
          >
            {{ notification.platform_job.extra_information }}
          </div>
        </div> -->
        <div
          class="leading-tight text-xs pt-2 text-right text-gray-600"
        >
          {{ notification.created_at_in_gb_formatted }}
        </div>
      </div>
    </div>

    <TimeProgress
      class="absolute bottom-0 left-0 m-2"
      style="height: 12px; width: 12px;"
      :max="notification.maxTimeoutInSeconds"
      :value="notification.timeoutInSeconds"
      maxColor="#505561"
      minColor="#fff"
    />
  </div>
</template>

<script>
import TimeProgress from "@/components/Notifications/TimeProgress"

export default {

  components: {
    TimeProgress,
  },

  props: {
    notification: {
      type: Object,
      required: true,
    },
  },

  computed: {
    payloadLocumComplianceDocumentStatusClass () {
      return {
        Approved: 'bg-green-500 text-white',
        Pending: 'bg-orange-500 text-white',
        Rejected: 'bg-red-500 text-white',
        Verified: 'bg-green-500 text-white',
      }
    },

    payloadLocumJobClass () {
      return {
        Allocated: 'bg-green-300 text-white',
        Ongoing: 'bg-green-500 text-white',
        Available: 'bg-yellow-500 text-white',
        Matched: 'bg-yellow-500',
        Applied: 'bg-orange-400 text-white',
        Unsuccessful: 'bg-red-500 text-white',
        Unavailable: 'bg-red-500 text-white',
        Unqualified: 'bg-red-500 text-white',
        Withdrawn: 'bg-red-500 text-white',
        Cancelled: 'bg-red-500 text-white',
        Completed: 'bg-green-500 text-white',
        Approved: 'bg-green-500 text-white',
      }
    },

    payloadJobClass () {
      return {
        Pending: 'bg-red-500 text-white',
        Allocated: 'bg-green-300 text-white',
        Ongoing: 'bg-green-500 text-white',
        Live: 'bg-yellow-500',
        Applied: 'bg-orange-400 text-white',
        Unfilled: 'bg-red-500 text-white',
        Withdrawn: 'bg-red-500 text-white',
        Cancelled: 'bg-red-500 text-white',
        Completed: 'bg-green-500 text-white',
        Approved: 'bg-green-500 text-white',
        Rejected: 'bg-red-500 text-white',
      }
    },

    payloadLocumInvoiceStatusClass () {
      return {
        Issued: 'bg-green-500 text-white',
        Invoiced: 'bg-green-500 text-white',
        Disputed: 'bg-red-500 text-white',
        Approved: 'bg-green-500 text-white',
        Paid: 'bg-green-500 text-white',
      }
    },

    payloadPracticeInvoiceStatusClass () {
      return {
        Issued: 'bg-green-500 text-white',
        Paid: 'bg-green-500 text-white',
      }
    },
  },
    
}
</script>
