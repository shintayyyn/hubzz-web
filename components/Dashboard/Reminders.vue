<template>
  <section>
    <div class="flex flex-row flex-wrap justify-start mb-2 md:mb-0 lg:max-w-6xl">
      <div
        v-for="(item, index) in reminders"
        :key="index"
        class="md:px-2 my-2 md:my-4 w-full sm:w-1/2 lg:max-w-sm"
      >
        <nuxt-link :to="item.route">
          <div
            class="reminder-card h-full flex items-center justify-center rounded-lg shadow-lg bg-white hover:bg-gray-100 text-sm leading-none md:leading-tight"
          >
            <span class="h-full w-1/5 flex items-center justify-center bg-gray-200 rounded-l-lg">
              <svgicon name="alert" height="20" width="20" class="fill-current text-gray-800" />
            </span>
            <span
              class="h-full w-4/5 flex flex-col justify-center p-4 bg-gray-100 hover:bg-gray-200 transition-hover rounded-r-lg"
            >
              <p class="capitalize font-bold">{{ item.route.slice(1).replace(/_/g, " ") }}</p>
              <p>{{ item.label }}</p>
            </span>
          </div>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      reminders: [],
    }
  },

  created () {
    this.$axios.$get("/api/v1/me").then(res => {
      if (res.data.user.domain === "Locum") {
        if (res.data.user.account_completed) {
          this.reminders.push({
            label: "Please complete your profile account.",
            route: "/account",
          })
        }

        if (res.data.user.status === "Deactivated") {
          this.reminders.push({
            label: "Your account has been Deactivated, Please contact HUBZZ",
            route: "/contact-us",
          })
        } else {
          // Email
          if (!res.data.user.email_verified_at) {
            this.reminders.push({
              label: "Please check your email for verification",
              route: "/account",
            })
          }

          // Availability
          // if (res.data.user.locum_detail.shifts.length === 0) {
          // 	this.reminders.push({
          // 		label: "Complete your Availability Credentials",
          // 		route: "/availability"
          // 	});
          // }

          const {
            compliance_status: complianceStatus,
          } = res.data.user

          // Compliance
          if (complianceStatus === 'Incomplete') {
            this.reminders.push({
              label: 'Please complete the required Compliance Documents to be verified by HUBZZ',
              route: '/compliance',
            })
          } else if (complianceStatus === 'Rejected') {
            this.reminders.push({
              label: 'Some of your Compliance Documents has been Rejected, Please update your Compliance Documents',
              route: '/compliance',
            })
          } else if (complianceStatus === 'Expired') {
            this.reminders.push({
              label: 'Some of your Compliance Documents have Expired, Please update your Compliance Documents',
              route: '/compliance',
            })
          } else if (complianceStatus === 'Pending') {
            this.reminders.push({
              label: 'Please wait for HUBZZ to verify your Compliance documents',
              route: '/compliance',
            })
          } else if (complianceStatus === 'Expiring') {
            this.reminders.push({
              label: 'Some of your Compliance Documents are expiring. Please update your compliance documents',
              route: '/compliance',
            })
          }

          // Billing
          // if (res.data.user.locum_detail.bank_account) {
          //   let isBillingComplete = true
          //   let bank_account = Object.entries(
          //     res.data.user.locum_detail.bank_account
          //   )
          //   let invoice_detail = Object.entries(
          //     res.data.user.locum_detail.invoice_detail
          //   )
          //   for (const [key, value] of bank_account) {
          //     if (!value) {
          //       isBillingComplete = false
          //     }
          //   }
          //   for (const [key, value] of invoice_detail) {
          //     if (key === "ir35" && !value) {
          //       isBillingComplete = false
          //     }
          //     if (key === "tax_year_end_date" && !value) {
          //       isBillingComplete = false
          //     }
          //     if (key === "tax_year_end_month" && !value) {
          //       isBillingComplete = false
          //     }
          //     if (key === "employment_type" && !value) {
          //       isBillingComplete = false
          //     }
          //   }
          // }
        }
      }

      if (res.data.user.domain === "Practice") {
        // if (
        //   res.data.user.status !== "Active"
        //     || res.data.user.practice_detail.practice.status !== "Active"
        // ) {
        //   this.reminders.push({
        //     label:
        //         "Please complete the Practice Verification Steps in order to have a complete access in the platform",
        //     route: "/contact-us",
        //   })
        // }

        if (!res.data.user.email_verified_at) {
          this.reminders.push({
            label: "Please check your email for verification",
            route: "/account",
          })
        }
      }

    })

  },
}
</script>

<style scoped>
  a {
    text-decoration: none;
    color: black;
  }

  .reminder-card {
    min-height: 60px;
  }

  @media screen and (min-width: 768px) {
    .reminder-card {
      min-height: 80px;
    }
  }
</style>
