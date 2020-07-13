<template>
  <section class="dashboard-section">
    <div v-if="$auth.user.domain === 'Locum'" class="reminders-section">
      <Reminders />
    </div>

    <div v-if="userIsAuthorized" class="appointment-section">
      <div class="flex justify-between items-center lg:max-w-6xl">
        <div class="text-sm sm:text-base font-bold">
          Appointments
        </div>
        <div v-if="$auth.user.domain === 'Locum'" class="flex">
          <AppButton :label="'Create Appointment'" class="hidden md:block mr-2"
                     :inStyle="'padding-top: 6px; padding-bottom: 6px;'" @click="$router.push('/dashboard/create')"
          />
          <button class="block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer mr-2"
                  @click="$router.push('/dashboard/create')"
          >
            <svgicon name="create-job" color="#444 #555" width="21" height="21" />
          </button>
          <AppButton v-if="$auth.user.view_locum_jobs" :label="'Expenses'" class="hidden md:block"
                     :inStyle="'padding-top: 6px; padding-bottom: 6px;'" @click="expense_modal = true"
          />
          <button class="block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer"
                  @click="expense_modal = true"
          >
            <svgicon name="billing" color="#444 #555" width="22" height="22" />
          </button>
        </div>
      </div>
      <Calendar />
    </div>

    <div
      v-if="userIsAuthorized && ($auth.user.domain === 'Practice' || ($auth.user.domain === 'Locum' && $auth.user.view_locum_jobs))"
      class="statistics-section"
    >
      <div class="text-sm sm:text-base font-bold pt-4">
        Quick Statistics
      </div>
      <Statistics />
    </div>

    <div v-if="!userIsAuthorized && $auth.user.domain === 'Practice'">
      <div
        v-if="$auth.user.practice_detail.practice.status === 'Suspended'"
        class="text-sm sm:text-base font-bold"
      >
        Your account has been suspended by Hubzz. Please contact the administrator to activate it.
      </div>
      <div
        v-if="$auth.user.practice_detail.practice.status !== 'Suspended'"
        class="text-sm sm:text-base font-bold"
      >
        Hubzz is in the process of verifying your registration. You will
        receive a notification when this has been completed, with full access to the platform.
      </div>
      <!-- <div
				class="text-sm sm:text-base font-bold"
			>Please complete the Practice Verification Steps in order to have a complete access in the platform.</div>-->
    </div>

    <div v-if="!userIsAuthorized && $auth.user.domain === 'Locum'">
      <div v-if="$auth.user.locum_detail.compliance_documents.length === 0" class="text-sm sm:text-base font-bold">
        Please complete the required Locum Compliance Documents in order to have a complete access in the platform.
      </div>

      <div v-else-if="$auth.user.locum_detail.compliance_documents.length > 0" class="text-sm sm:text-base font-bold">
        Please wait for HUBZZ to verify your compliance requirements.
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <nuxt-link v-if="['dashboard-id','dashboard-create'].includes($route.name) || expense_modal" class="shield"
                 :to="'/dashboard'"
      />
    </transition>

    <transition name="slide" mode="out-in">
      <template v-if="expense_modal">
        <div class="expense-modal shadow-lg">
          <ExpenseReportsModal @close="expense_modal = false" />
        </div>
      </template>
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
import ExpenseReportsModal from "@/components/ExpenseReportsModal"

export default {
  components: {
    Calendar,
    Reminders,
    Statistics,
    AppButton,
    ExpenseReportsModal,
  },
  
  data () {
    return {
      expense_modal: false,
    }
  },

  computed: {
    userIsAuthorized () {
      if (this.$auth.loggedIn) {
        let domain = this.$auth.user.domain
        let accountStatus = this.$auth.user.status
        if (domain === "Locum") {
          if (accountStatus === "Active" || accountStatus === "Dormant") {
            return true
          }
          return false
        }
        if (domain === "Practice") {
          let practiceStatus = this.$auth.user.practice_detail.practice.status
          if (accountStatus === "Active" && (practiceStatus === "Active" || practiceStatus === "Dormant")) {
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
  .shield {
    z-index: 509;
  }

  .dashboard-section {
    height: auto;
    width: 100%;
  }

  .expense-modal {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    border-left: solid 4px #ccc;
    transition: all 0.3s ease-in-out;
    background-color: white;
    scroll-behavior: smooth;
    z-index: 601;
  }

  @media (min-width: 1200px) {
    .expense-modal {
      width: 80%;
      /* height: 80%; */
    }
  }
</style>
