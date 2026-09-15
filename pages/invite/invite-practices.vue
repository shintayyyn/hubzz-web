<template>
  <section>
    <div v-if="success">
      <div class="rounded-lg border p-4 max-w-sm">
        <div class="flex flex-col text-center">
          <div class="flex justify-center">
            <svgicon name="success-checkmark" height="180" width="180" />
          </div>
          <div class="font-bold text-2xl mt-4">
            Thank you!
          </div>
          <div class="font-bold text-base mt-4">
            Your invitation email have been sent
          </div>
          <AppButton
            :label="'Confirm'"
            :inStyle="'padding:5px'"
            @click="success = false"
          />
        </div>
      </div>
    </div>

    <div v-else class="relative rounded-lg border p-4">
      <AppInput
        v-model="form.email"
        :type="'multiemail'"
        :name="'email'"
        :label="`Email addresses to practices`"
        :placeholder="''"
        :info="'Separate with commas'"
        :error="formError.find(error => error.field === 'email')"
      />
      <div class="flex justify-start mt-8">
        <div class="text-xs sm:text-sm">
          The message to be sent to practices
        </div>
      </div>
      <div class="block mt-5">
        <div class="text-xs sm:text-sm">
          <a href="https://hubzz.co.uk/" target="_blank" style="color: blue;" class="no-underline hover:underline">Hubzz.co.uk</a>
        </div>
        <div class="text-xs sm:text-sm">
          Primary Care Community Platform
        </div>
        <div class="text-xs sm:text-sm">
          Directly connecting Primary Care healthcare providers with healthcare professionals
        </div>
      </div>
      <div class="flex justify-start">
        <div class="text-xs" style="color: #4E484C">
          This new platform is a direct engagement hub designed to connect Primary Care Healthcare providers with locum
          clinicians quickly, transparently, and without the cost or complexity of recruitment agencies. It's completely
          free for locums to join, giving you direct access to work opportunities from practices that want to book
          clinicians without middlemen, mark-ups, or long chains of communication.
        </div>
      </div>
      <div class="flex mt-5">
        <div class="text-xs sm:text-sm">
          <div class="font-bold">
            What the platform offers:
          </div>
          <ol class="list-decimal list-inside space-y-4">
            <li>
              <span class="font-bold">Direct access to GP practices</span>
              <span>Locums receive job requests straight from practices / healthcare providers, with no agency
                involvement and no hidden fees.</span>
            </li>
            <li>
              <span class="font-bold">Clear, upfront session details</span>
              <span>Practices / Healthcare providers post real-time availability, session requirements, rates, and
                expectations so locums can make informed decisions instantly.</span>
            </li>
            <li>
              <span class="font-bold">Fair, transparent rates</span>
              <span>Because agencies are removed from the process, practices can offer better rates and locums keep 100%
                of what they earn.</span>
            </li>
            <li>
              <span class="font-bold">Simple onboarding</span>
              <span>Locums create a profile, upload compliance documents, set their availability, and start receiving
                direct offers.</span>
            </li>
            <li>
              <span class="font-bold">Fast, frictionless booking</span>
              <span>Practices / Healthcare providers can search, invite, and confirm locums in minutes — reducing admin
                and eliminating agency delays.</span>
            </li>
            <li>
              <span class="font-bold">Built for the NHS primary care environment</span>
              <span>Designed around the realities of Healthcare Providers and GP practice staffing: last-minute gaps,
                planned cover, extended access, home visits, and specialist clinics.</span>
            </li>
          </ol>
        </div>
      </div>
      <div class="block text-xs sm:text-sm">
        <div class="mt-5 font-bold">
          Why it matters:
        </div>
        <div class="text-xs w-3/4" style="color: #4E484C">
          This platform gives locums more control over their work, more transparency over rates, and more direct
          relationships with the practices they support. For Healthcare providers / GP practices, it reduces costs, cuts
          out agency dependency, and provides a reliable pool of clinicians they can book directly.
        </div>
      </div>
      <div class="flex justify-start mt-5">
        <span class="text-xs sm:text-sm font-bold">Join now at &nbsp;</span>
        <span class="text-xs sm:text-sm font-bold">
          <a href="http://hubzz.co.uk" target="_blank" class="no-underline hover:underline" style="color: blue;">hubzz.co.uk</a>
        </span>
      </div>
      <!-- <div class="bg-black p-5" style="min-height: 100px; height: auto; width: 200px;">
          <img src="../../assets/images/hubzz_logo.png" alt="Hubzz Logo">
      </div> -->
      <div class="flex justify-start mt-5">
        <AppButton :label="'Send'" @click="send" />
      </div>
      <AppLoading :loading="loading" spinner />
    </div>

    <div class="flex justify-start mt-5">
      <AppButton
        class="font-semibold"
        label="Share In Whatsapp For Practice"
        icon="whatsapp"
        icon-width="27" icon-height="27"
        style="background-color: #25D366; color:white;"
        @click="sharePracticeRegisterInWhatsApp"
      />
    </div>
  </section>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },

  components: {
    AppLoading,
    AppInput,
    AppButton
  },

  props: {
    referralCode: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      loading: false,
      form: {
        email: ""
      },
      formError: [],
      success: false
    };
  },

  watch: {
    "form.email"() {
      this.formError = this.formError.filter(error => error.field !== "email");
    }
  },

  methods: {
    sharePracticeRegisterInWhatsApp() {
      const message = `Have you heard the buzz about hubzz?\nJoin hubzz at ${window.location.origin}/sign-up/practice?referral_code=${this.referralCode}`;

      window.open(`https://wa.me/?text=${encodeURI(message)}`);
    },

    send() {
      this.formError = [];
      // this.Validate(this.form)
      //new logic
      const emails = this.form.email
        .split(",")
        .map(e => e.trim())
        .filter(e => e);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = emails.filter(email => !emailRegex.test(email));

      if (!emails.length) {
        this.formError.push({ field: "email", message: "Email is required" });
      } else if (invalidEmails.length) {
        this.formError.push({
          field: "email",
          message: `Invalid emails(s): ${invalidEmails.join(
            ", "
          )}`
        });
      }
      //end
      if (!this.formError.length) {
        this.loading = true;
        this.$axios
          .$post(`api/v1/invite`, {
            emails,
            domain: "Practice"
          })
          .then(() => {
            this.form.email = "";
            this.success = true;
          })
          .catch(err => {
            console.log("err", err.response || err);
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`]
              });
            }
            if (err.response.data.error_messages) {
              this.formError = err.response.data.error_messages;
            }
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: ["Please fill up all the forms"]
        });
      }
    }
  }
};
</script>
