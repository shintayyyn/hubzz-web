<template>
  <section class="forgot-password-section">
    <div class="p-6 md:p-10">
      <nuxt-link to="/" class="focus:outline-none text-black">
        <svgicon name="left-arrow" height="32" width="32" />
      </nuxt-link>
      <div class="flex flex-col mt-4 md:mt-32">
        <div class="flex justify-center">
          <div class="font-bold text-3xl w-full md:w-2/3">Reset password</div>
        </div>
        <div class="flex justify-center">
          <div class="mt-5 rounded-lg shadow-md py-10 px-8 md:w-2/3">
            <template v-if="success">
              <div>
                Check your email inbox for further instructions
                <strong>should your email address match our records.</strong>
              </div>
            </template>
            <template v-else>
              <div>
                Please enter the email address of your account at Hubzz.
                If your email address matches our records, you'll receive an email with further instruction to proceed.
              </div>

              <form class="w-full">
                <div
                  class="relative flex flex-col mt-8 border-b-2 border-gray-200"
                  :class="[setFocus === 'email' ? 'border-yellow-300':'', formError.find(item => item.field === 'email') ? 'border-red-300':'']"
                >
                  <label for="email" class="text-lg mb-4">Email address</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    ref="email"
                    class="focus:outline-none font-bold"
                    style="height:40px"
                    @focus="setFocus = 'email'"
                    @blur="setFocus = ''"
                    v-model="form.email"
                    @keyup.enter="send"
                  />
                  <span
                    class="absolute right-0 bg-red-300 text-white p-1"
                    v-if="formError.find(item => item.field === 'email')"
                  >{{formError.find(item => item.field === 'email').message}}</span>
                </div>
              </form>

              <div class="mt-5 flex justify-start">
                <button
                  class="rounded-lg bg-yellow-400 shadow-md p-8 font-bold text-xl focus:outline-none hover:text-white"
                  @click="send"
                >Send</button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      form: {
        email: ""
      },
      formError: [],
      setFocus: "",
      // sample
      success: false
    };
  },
  watch: {
    "form.email"(value) {
      let index = this.formError.findIndex(item => item.field === "email");
      if (index >= 0) {
        this.formError.splice(index, 1);
      }

      if (!value) {
        this.formError.push({
          field: "email",
          message: "Email is Required"
        });
      }
    }
  },
  mounted() {
    this.success = false;
    this.$refs.email.focus();
  },
  methods: {
    async send() {
      try {
        this.formError = [];
        this.Validate(this.form);
        if (!this.formError.length) {
          this.$axios.$post(`/api/v1/forgot-password`, this.form).then(res => {
            this.success = true;
          });
        }
      } catch (e) { }
    }
  }
};
</script>
<style scoped>
button:active {
  transform: translate(5px, 5px);
}
</style>

