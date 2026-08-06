<template>
  <section>
    <div
      v-if="$auth.user.domain === 'Locum' || $auth.user.domain === 'Practice'"
      class="reminders-section mb-4"
    >
      <Reminders />
    </div>

    <div v-if="userIsAuthorized && $auth.user.domain === 'Locum'" class="mb-8">
      <div
        v-if="$auth.user.compliance_status === 'Expiring'"
        class="text-sm sm:text-base font-bold"
      >
        Some of your Compliance Documents are expiring. Please update your
        compliance documents
      </div>
    </div>
    <div
      v-if="$auth.user.status === 'Disabled'"
      class="text-sm sm:text-base font-bold"
    >
      This account has been disabled. Please contact the administrator for more
      information.
    </div>
    <div
      v-if="
        userIsAuthorized &&
          ($auth.user.domain === 'Practice' ||
          ($auth.user.domain === 'Locum' && $auth.user.view_locum_jobs))
      "
      class="statistics-section mb-6"
    >
      <div class="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1 mb-1">
        Quick View
      </div>

      <Statistics />
    </div>

    <div v-if="userIsAuthorized" class="appointment-section mt-6">
      <div
        class="flex justify-between items-center lg:min-w-6xl lg:max-w-6xl pr-6"
      >
        <div class="flex">
          <div class="mx-1 text-sm sm:text-base font-bold">
            Appointments
          </div>
          <span>
            <span
              class="mx-1 bg-gray-900 cursor-pointer hover:bg-gray-800 transition-hover px-3 py-1 rounded text-white text-xs font-semibold tracking-wide flex items-center gap-1"
              title="View colour key"
              @click="legendsModal = true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span class="hidden sm:inline">Calendar &amp; Appointment </span>Colour Key
            </span>
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
            <svgicon
              name="create-job"
              color="#444 #555"
              width="21"
              height="21"
            />
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
        v-if="
          $auth.user.practice_detail.practice.type === 'Spoke' &&
            $auth.user.practice_detail.practice.parent_practice_id === null
        "
        class="text-sm sm:text-base font-bold"
      >
        Your Practice is required to have a Hub in order to operate. Please go
        to Surgery Management Tab to invite a Hub.
      </div>
      <div
        v-if="
          $auth.user.practice_detail.practice.status === 'Account Suspension'
        "
        class="text-sm sm:text-base font-bold"
      >
        Your account has been suspended by Hubzz. Please contact the
        administrator to activate it.
      </div>

      <div
        v-if="$auth.user.practice_detail.practice.status === 'Inactive'"
        class="text-sm sm:text-base font-bold"
      >
        Hubzz is in the process of verifying your registration. You will receive
        a notification when this has been completed, with full access to the
        platform.
      </div>
    </div>

    <div v-if="!userIsAuthorized && $auth.user.domain === 'Locum'">
      <div v-if="false" class="text-sm sm:text-base font-bold">
        Please complete the required Locum Compliance Documents in order to have
        a complete access in the platform.
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
            <span>Calendar & Appointment Colour Key</span>

            <span
              class="cursor-pointer hover:text-gray-900 p-2 -mr-2 -mt-1"
              @click="legendsModal = false"
            >
              <svgicon
                name="cancel"
                width="16"
                height="16"
                class="fill-current"
              />
            </span>
          </p>

          <div class="mt-3 flex flex-col md:flex-row gap-4">
            <!-- Job Status -->
            <div class="md:w-3/5">
              <p
                class="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-2"
              >
                Job Status
              </p>

              <div class="flex items-center mb-2">
                <span class="bg-job-active flex-shrink-0 w-4 h-4 rounded" />
                <p class="ml-3 text-sm">
                  Allocated Jobs
                  <span class="text-gray-700 text-xs">— job confirmed &amp; assigned</span>
                </p>
              </div>

              <div class="flex items-center mb-2">
                <span class="bg-job-pending flex-shrink-0 w-4 h-4 rounded" />
                <p class="ml-3 text-sm">
                  Applied Jobs
                  <span class="text-gray-700 text-xs">— application submitted, awaiting response</span>
                </p>
              </div>

              <div
                v-if="$auth.user.domain === 'Practice'"
                class="flex items-center mb-2"
              >
                <span class="bg-job-unfilled flex-shrink-0 w-4 h-4 rounded" />
                <p class="ml-3 text-sm">
                  Unfilled / Withdrawn Jobs
                </p>
              </div>

              <div
                v-if="$auth.user.domain === 'Practice'"
                class="flex items-center mb-2"
              >
                <span class="bg-gray-500 flex-shrink-0 w-4 h-4 rounded" />
                <p class="ml-3 text-sm">
                  Live Jobs
                  <span class="text-gray-700 text-xs">— open and accepting applications</span>
                </p>
              </div>

              <div
                v-if="$auth.user.domain === 'Locum'"
                class="flex items-center mb-2"
              >
                <span class="bg-blue-500 flex-shrink-0 w-4 h-4 rounded" />
                <p class="ml-3 text-sm">
                  Ongoing Private Jobs
                </p>
              </div>

              <div
                v-if="$auth.user.domain === 'Locum'"
                class="flex items-center mb-2"
              >
                <span class="flex-shrink-0">
                  <svgicon
                    name="pushpin"
                    width="17"
                    height="17"
                    class="fill-current text-blue-500"
                  />
                </span>
                <p class="ml-3 text-sm">
                  Permanent Jobs
                  <span class="text-gray-700 text-xs">— interview stage</span>
                </p>
              </div>

              <div
                v-if="$auth.user.domain === 'Locum'"
                class="flex items-center mb-2"
              >
                <span class="bg-red-400 flex-shrink-0 w-4 h-4 rounded" />
                <p class="ml-3 text-sm">
                  Not Available
                </p>
              </div>
            </div>

            <!-- Shifts -->
            <div class="md:w-2/5">
              <p
                class="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-2"
              >
                Shift Types
              </p>

              <div class="flex items-center mb-2">
                <span
                  class="bg-shift-whole-day flex-shrink-0 w-12 h-4 rounded"
                />
                <p class="ml-3 text-sm">
                  Whole Day
                </p>
              </div>

              <div class="flex items-center mb-2">
                <span class="bg-shift-am flex-shrink-0 w-12 h-4 rounded" />
                <p class="ml-3 text-sm">
                  Morning (AM)
                </p>
              </div>

              <div class="flex items-center mb-2">
                <span class="bg-shift-pm flex-shrink-0 w-12 h-4 rounded" />
                <p class="ml-3 text-sm">
                  Afternoon (PM)
                </p>
              </div>

              <div class="flex items-center mb-2">
                <span class="bg-shift-ooh flex-shrink-0 w-12 h-4 rounded" />
                <p class="ml-3 text-sm">
                  Out of Hours (OOH)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- SHIELD -->
    <div v-if="legendsModal" class="shield" @click="legendsModal = false" />

    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="
          ['dashboard-id', 'dashboard-create', 'dashboard-expenses'].includes(
            $route.name
          )
        "
        class="shield"
        :to="'/dashboard'"
      />
    </transition>

    <div>
      <nuxt-child />
    </div>
  </section>
</template>

<script>
import Calendar from "@/components/Calendar";
import Reminders from "@/components/Dashboard/Reminders";
import Statistics from "@/components/Dashboard/Statistics";
import AppButton from "@/components/Base/AppButton";

export default {
  components: {
    Calendar,
    Reminders,
    Statistics,
    AppButton
  },

  data() {
    return {
      legendsModal: false
    };
  },

  computed: {
    userIsAuthorized() {
      if (this.$auth.loggedIn) {
        let domain = this.$auth.user.domain;

        let accountStatus = this.$auth.user.status;

        if (domain === "Locum") {
          if (accountStatus === "Active" || accountStatus === "Dormant") {
            return true;
          }

          return false;
        }

        if (domain === "Practice") {
          const practice = this.$auth.user.practice_detail.practice;
          let practiceStatus = this.$auth.user.practice_detail.practice.status;

          if (
            accountStatus === "Active" &&
            (practiceStatus === "Active" || practiceStatus === "Dormant") &&
            (["Hub", "Stand Alone"].includes(practice.type) ||
              (practice.type === "Spoke" &&
                practice.parent_practice_id !== null))
          ) {
            return true;
          }

          return false;
        }
      }

      return false;
    }
  },

  watch: {
    "$route.path"(value) {
      if (value !== "/dashboard") {
        document.body.style.overflow = "hidden";
      } else if (value === "/dashboard") {
        document.body.style.overflow = "auto";
      }
    }
  }
};
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
  width: min(90vw, 560px);
  max-height: 85vh;
  overflow-y: auto;
}

.dashboard-section {
  height: auto;
  width: 100%;
}
</style>
