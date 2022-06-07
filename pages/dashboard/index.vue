<template>
  <section>
    <div v-if="$auth.user.domain === 'Locum' || $auth.user.domain === 'Practice'" class="reminders-section mb-4">
      <Reminders />
    </div>

    <div v-if="userIsAuthorized && $auth.user.domain === 'Locum'" class="mb-8">
      <div
        v-if="$auth.user.compliance_status === 'Expiring'"
        class="text-sm sm:text-base font-bold"
      >
        Some of your Compliance Documents are expiring. Please update your compliance documents
      </div>
    </div>

    <div
      v-if="userIsAuthorized && ($auth.user.domain === 'Practice' || ($auth.user.domain === 'Locum' && $auth.user.view_locum_jobs))"
      class="statistics-section "
    >
      <div class="text-sm sm:text-base font-bold">
        Quick Statistics
      </div>

      <Statistics />
    </div>

    <div v-if="userIsAuthorized" class="appointment-section">
      <div class="flex justify-between items-center lg:min-w-6xl lg:max-w-6xl pr-6">
        <div class="flex">
          <div class="mx-1 text-sm sm:text-base font-bold">
            Appointments
          </div>
          <span>
            <span class="mx-1 bg-gray-900 cursor-pointer hover:bg-gray-800 transition-hover px-3 rounded text-white" @click="legendsModal=true">i</span>
          </span>
        </div>
        

        <div v-if="$auth.user.domain === 'Locum'" class="flex">
          <AppButton
            :label="'Create Appointment'"
            class="hidden md:block mr-2"
            :inStyle="'padding-top: 6px; padding-bottom: 6px;'"
            @click="$router.push('/dashboard/create')"
          />

          <button
            class="block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer mr-2"
            @click="$router.push('/dashboard/create')"
          >
            <svgicon name="create-job" color="#444 #555" width="21" height="21" />
          </button>

          <AppButton
            v-if="$auth.user.view_locum_jobs"
            :label="'Expenses'"
            class="hidden md:block"
            :inStyle="'padding-top: 6px; padding-bottom: 6px;'"
            @click="$router.push('/dashboard/expenses')"
          />

          <button
            class="block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer"
            @click="$router.push('/dashboard/expenses')"
          >
            <svgicon name="billing" color="#444 #555" width="22" height="22" />
          </button>
        </div>
      </div>

      <Calendar />
    </div>

    <div v-if="!userIsAuthorized && $auth.user.domain === 'Practice'">
      <div
        v-if="$auth.user.practice_detail.practice.type === 'Spoke' 
          && $auth.user.practice_detail.practice.parent_practice_id === null"
        class="text-sm sm:text-base font-bold"
      >
        Your Practice is required to have a Hub in order to operate. Please go to Surgery Management Tab to invite a Hub.
      </div>
      <div
        v-if="$auth.user.practice_detail.practice.status === 'Account Suspension'"
        class="text-sm sm:text-base font-bold"
      >
        Your account has been suspended by Hubzz. Please contact the administrator to activate it.
      </div>

      <div
        v-if="$auth.user.practice_detail.practice.status === 'Inactive'"
        class="text-sm sm:text-base font-bold"
      >
        Hubzz is in the process of verifying your registration. You will
        receive a notification when this has been completed, with full access to the platform.
      </div>
    </div>

    <div v-if="!userIsAuthorized && $auth.user.domain === 'Locum'">
      <div
        v-if="false"
        class="text-sm sm:text-base font-bold"
      >
        Please complete the required Locum Compliance Documents in order to have a complete access in the platform.
      </div>

      <div
        v-if="$auth.user.locum_detail.compliance_documents.length > 0"
        class="text-sm sm:text-base font-bold"
      >
        Please wait for HUBZZ to verify your compliance requirements.
      </div>
    </div>

    <!-- LEGENDS MODAL -->
    <transition name="fade">
      <div v-if="legendsModal" class="message-modal z-50">
        <div class="w-full flex flex-col bg-white p-4 rounded-lg shadow-lg">
          <p class="flex items-center justify-between flex-no-wrap font-bold">
            <span>Legend</span>

            <span class="cursor-pointer hover:text-gray-600" @click="legendsModal=false">
              <svgicon name="cancel" width="12" height="12" class="fill-current" />
            </span>
          </p>

          <div class="mt-2 flex flex-col md:flex-row">
            <div class="md:w-3/5 md:mr-2">
              <p>Job Status</p>

              <div class="flex items-center">
                <span class="bg-job-active w-2 h-2 md:w-3 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  Allocated Jobs
                </p>
              </div>

              <div class="flex items-center">
                <span class="bg-job-pending w-2 h-2 md:w-3 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  Applied Jobs
                </p>
              </div>

              <div v-if="$auth.user.domain === 'Practice'" class="flex items-center">
                <span class="bg-job-unfilled w-2 h-2 md:w-3 md:h-3 rounded border border-white p-2" />

                <p class="ml-2 no-wrap-text">
                  Unfilled Jobs, Withdrawn Jobs
                </p>
              </div>

              <div v-if="$auth.user.domain === 'Practice'" class="flex items-center">
                <span class="bg-gray-500 w-2 h-2 md:w-3 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  Live Jobs
                </p>
              </div>

              <div v-if="$auth.user.domain === 'Locum'" class="flex items-center">
                <span class="bg-blue-500 w-2 h-2 md:w-3 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  Ongoing Private Jobs
                </p>
              </div>

              <div v-if="$auth.user.domain === 'Locum'" class="flex items-center">
                <span>
                  <svgicon name="pushpin" width="17" height="17" class="fill-current text-blue-500 -mt-3" />
                </span>

                <p class="ml-2">
                  For Interview Permanent Jobs
                </p>
              </div>

              <div v-if="$auth.user.domain === 'Locum'" class="flex items-center">
                <span class="bg-red-400 w-2 h-2 md:w-3 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  Not Availabile
                </p>
              </div>
            </div>

            <div class="md:w-2/5">
              <p>Shifts</p>

              <div class="flex items-center">
                <span class="bg-shift-whole-day w-12 h-2 md:w-20 md:h-3 rounded border border-white p-2" />

                <p class="ml-2 no-wrap-text text-sm">
                  Whole Day
                </p>
              </div>

              <div class="flex items-center">
                <span class="bg-shift-am w-12 h-2 md:w-20 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  AM
                </p>
              </div>

              <div class="flex items-center">
                <span class="bg-shift-pm w-12 h-2 md:w-20 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  PM
                </p>
              </div>

              <div class="flex items-center">
                <span class="bg-shift-ooh w-12 h-2 md:w-20 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  OOH
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- SHIELD -->
    <div v-if="legendsModal" class="shield" @click="legendsModal=false" />

    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="['dashboard-id','dashboard-create','dashboard-expenses'].includes($route.name)" class="shield"
        :to="'/dashboard'"
      />
    </transition>

    <div>
      <nuxt-child />
    </div>
  </section>
</template>

<script>
import Calendar from "@/components/Calendar"
import Reminders from "@/components/Dashboard/Reminders"
import Statistics from "@/components/Dashboard/Statistics"
import AppButton from "@/components/Base/AppButton"

export default {
  components: {
    Calendar,
    Reminders,
    Statistics,
    AppButton,
  },

  data () {
    return {
      legendsModal: false,
    }
  },

  computed: {
    userIsAuthorized () {
      if (this.$auth.loggedIn) {
        let domain = this.$auth.user.domain

        let accountStatus = this.$auth.user.status

        if (domain === 'Locum') {
          if (accountStatus === 'Active' || accountStatus === 'Dormant') {
            return true
          }

          return false
        }

        if (domain === 'Practice') {
          const practice = this.$auth.user.practice_detail.practice
          let practiceStatus = this.$auth.user.practice_detail.practice.status

          if (accountStatus === 'Active' 
              && (practiceStatus === 'Active' || practiceStatus === 'Dormant') 
              && (['Hub', 'Stand Alone',].includes(practice.type) || (practice.type === 'Spoke' && practice.parent_practice_id !== null))
          ) {
            return true
          }

          return false
        }
      }

      return false
    },
  },
  

  watch: {
    "$route.path" (value) {
      if (value !== "/dashboard") {
        document.body.style.overflow = "hidden"
      } else if (value === "/dashboard") {
        document.body.style.overflow = "auto"
      }
    },
  },

}
</script>

<style scoped>
  .no-wrap-text {
    white-space: nowrap;
  }

  .shield {
    z-index: 509;
  }

  .message-modal {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 510;
  }

  .dashboard-section {
    height: auto;
    width: 100%;
  }
</style>
