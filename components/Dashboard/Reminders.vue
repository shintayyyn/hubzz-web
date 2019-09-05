<template>
  <section>
    <div class="flex flex-row flex-wrap justify-start">
      <div
        class="pr-4 my-4 w-full sm:w-1/2 lg:w-1/4"
        v-for="(item, index) in reminders"
        :key="index"
      >
        <nuxt-link :to="item.route">
          <div class="reminder-card rounded-lg shadow-lg p-4">
            <span class="leading-tight">
              <svgicon name="alert" height="20" width="20" />
            </span>
            {{item.label}}
          </div>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      reminders: []
    };
  },
  created() {
    this.$axios.$get("/api/v1/me").then(res => {
      if (res.data.user.domain === "Locum") {
        if (res.data.user.status === "Deactivated") {
          this.reminders.push({
            label: "Your account has been Deactivated, Please contact HUBZZ",
            route: "/contact-us"
          });
        } else {
          // Email
          if (!res.data.user.is_email_verified) {
            this.reminders.push({
              label: "Please check your email for verification",
              route: "/account"
            });
          }
          // GMC / NMC
          if (
            res.data.user.locum_detail.gmc_or_nmc_number.status === "Pending"
          ) {
            this.reminders.push({
              label: "Please wait for HUBZZ to verify your GMC / NMC Number",
              route: "/compliance"
            });
          } else if (
            res.data.user.locum_detail.gmc_or_nmc_number.status === "Rejected"
          ) {
            this.reminders.push({
              label:
                "Your GMC / NMC Number is Rejected, Please insert another valid GMC / NMC Number",
              route: "/account/profile"
            });
          }
          // MPL / NPL
          if (
            res.data.user.locum_detail.mpl_or_npl_number.status === "Pending"
          ) {
            this.reminders.push({
              label: "Please wait for HUBZZ to verify MPL / NPL Number",
              route: "/compliance"
            });
          } else if (
            res.data.user.locum_detail.mpl_or_npl_number.status === "Rejected"
          ) {
            this.reminders.push({
              label:
                "Your MPL / NPL Number is Rejected, Please insert another valid MPL / NPL Number",
              route: "/account/profile"
            });
          }
          // Availability
          if (res.data.user.locum_detail.shifts.length === 0) {
            this.reminders.push({
              label: "Complete your Availability Credentials",
              route: "/availability"
            });
          }
          // Compliance
          if (!res.data.user.locum_detail.compliance_documents.length) {
            this.reminders.push({
              label:
                "Please complete the required Compliance Documents to be verified by HUBZZ",
              route: "/compliance"
            });
          }
          if (res.data.user.locum_detail.compliance_documents.length) {
            let passportDoc = res.data.user.locum_detail.compliance_documents.find(
              item => item.compliance_document.name === "Passport"
            );
            let medicalDoc = res.data.user.locum_detail.compliance_documents.find(
              item =>
                item.compliance_document.name ===
                "Medical Indemnity insurance certificate"
            );
            let supportDoc = res.data.user.locum_detail.compliance_documents.find(
              item =>
                item.compliance_document.name ===
                "Basic Life support certificate"
            );
            let dbsDoc = res.data.user.locum_detail.compliance_documents.find(
              item => item.compliance_document.name === "DBS Certificate"
            );
            if (!passportDoc || !medicalDoc || !supportDoc || !dbsDoc) {
              this.reminders.push({
                label:
                  "Please complete the required Compliance Documents to be verified by HUBZZ.",
                route: "/compliance"
              });
            }
            if (passportDoc && medicalDoc && supportDoc && dbsDoc) {
              if (
                [
                  passportDoc.status,
                  medicalDoc.status,
                  supportDoc.status,
                  dbsDoc.status
                ].includes("Rejected")
              ) {
                this.reminders.push({
                  label:
                    "Some of your Compliance Documents has been Rejected, Please update your Compliance Documents",
                  route: "/compliance"
                });
              } else if (
                [
                  passportDoc.status,
                  medicalDoc.status,
                  supportDoc.status,
                  dbsDoc.status
                ].includes("Pending")
              ) {
                this.reminders.push({
                  label:
                    "Please wait for HUBZZ to verify your Compliance documents",
                  route: "/compliance"
                });
              }
            }
          }
          // Billing
          if (res.data.user.locum_detail.bank_account) {
            let isBillingComplete = true;
            let bank_account = Object.entries(
              res.data.user.locum_detail.bank_account
            );
            let invoice_detail = Object.entries(
              res.data.user.locum_detail.invoice_detail
            );
            for (const [key, value] of bank_account) {
              if (!value) {
                isBillingComplete = false;
              }
            }
            for (const [key, value] of invoice_detail) {
              if (key === "ir35" && !value) {
                isBillingComplete = false;
              }
              if (key === "tax_year_end_date" && !value) {
                isBillingComplete = false;
              }
              if (key === "tax_year_end_month" && !value) {
                isBillingComplete = false;
              }
              if (key === "employment_type" && !value) {
                isBillingComplete = false;
              }
            }
          }
        }
      }

      if (res.data.user.domain === "Practice") {
        if (res.data.user.status !== "Active") {
          this.reminders.push({
            label:
              "Please complete the Practice Verification Steps in order to have a complete access in the platform",
            route: "/contact-us"
          });
        }
      }
    });
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
.reminder-card {
  min-height: 130px;
}
</style>


