<template>
  <div class="">
    <div class="rounded-lg shadow-lg p-5">
      <div class="flex flex-col md:flex-row flex-wrap justify-between mb-4">
        <div class="w-full md:w-1/2">
          <div class="text-sm my-2">Email address</div>
          <div class="text-sm font-bold">{{user.email}}</div>
        </div>
        <div class="w-full md:w-1/2">
          <div class="text-sm my-2">Role</div>
          <div class="text-sm font-bold">{{role}}</div>
        </div>
        <div class="w-full md:w-1/2">
          <div class="text-sm my-2">Sender</div>
          <div class="text-sm font-bold">{{fullname}}</div>
        </div>
      </div>
      <AppInput
        v-model="form.message"
        :type="'textarea'"
        :name="'message'"
        :label="'Your message'"
        :placeholder="'Enter your message here'"
        :resize="false"
        :error="formError.find(item => item.field === 'message')"
      />
      <AppButton :label="'Send'" @click="send" />
    </div>
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
export default {
  components: {
    AppButton,
    AppInput
  },
  data() {
    return {
      form: {
        message: ""
      },
      formError: []
    };
  },
  computed: {
    fullname() {
      return `${
        this.user.personal_detail.title ? this.user.personal_detail.title : ""
      } ${this.user.personal_detail.first_name} ${
        this.user.personal_detail.last_name
      }`;
    },
    role() {
      if (this.user.domain === "Locum") {
        return `${this.user.locum_detail.profession.name}`;
      } else if (this.user.domain === "Practice") {
        return `${this.user.practice_detail.practice_role}`;
      }
    }
  },
  async asyncData({ app, error }) {
    const response = await app.$axios.$get(`/api/v1/me`);
    const user =
      response.data && response.data.user ? response.data.user : null;

    return {
      user
    };
  },
  methods: {
    send() {
      this.formError = [];
      this.Validate(this.form);
      if (!this.formError.length) {
        this.$axios.$post(`/api/v1/contact-us`, this.form).then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          this.form.message = "";
          this.formError = [];
        });
      }
    }
  }
};
</script>
<style scoped>
button:active {
  transform: translate(2px, 2px);
}
</style>

