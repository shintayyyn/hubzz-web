<template>
  <div class="modal-container shadow-lg">
    <div class="p-8 w-full">
      <div @click="$router.push('/profile/branches-surgeries')" class="mb-2 cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex overflow-x-auto">
          <nuxt-link
              :to="`/profile/branches-surgeries/${practice_id}`"
              class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
              :class="$route.name === 'profile-branches-surgeries-id-index' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >Profile</nuxt-link>
          <nuxt-link
              :to="`/profile/branches-surgeries/${practice_id}/surgery-sessions`"
              class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
              :class="$route.name.includes('profile-branches-surgeries-id-index-surgery-sessions') || $route.name === 'profile-branches-surgeries-create'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >Surgery Sessions</nuxt-link>
          <nuxt-link
              :to="`/profile/branches-surgeries/${practice_id}/surgery-billings`"
              class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
              :class="$route.name.includes('profile-branches-surgeries-id-index-surgery-billings')  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >Surgery Billing</nuxt-link>
      </div>
      <nuxt-child/>
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
      practice_id: '',
      editPayForSurgery: false,
      editSessionPolicies: false,
      editBillingPolicies: false,
      form: {
        pay_for_surgery: "",
        verify_job_creation: ""
      },
      form2:{
        create_sessions: "",
        allocate_locums: "",
        amend_sessions: "",
        cancel_sessions: "",
        approve_hours_for_invoice: "",
        complete_sessions: ""
      },
      form3:{
        own_billing_locum_invoice: "",
        own_billing_hubzz_billing: "",
      },
      formError: []
    };
  },
  async asyncData({ app, route, store, params, error }) {
    try {
      const practice_id = params.id
      const response = await app.$axios.$get(
        `/api/v1/practice/me/practice-surgeries/${params.id}`
      );
      const practice_surgery =
        response.data && response.data.practice_surgery
          ? response.data.practice_surgery
          : null;
      return {
        practice_surgery,
        practice_id
      };
    } catch (err) {
      throw err;
    }
  },
  created() {
    console.log('route',this.$route.name)
    this.form.pay_for_surgery = this.practice_surgery.pay_for_surgery;
    this.form.verify_job_creation = this.practice_surgery.verify_job_creation;
  },
  methods: {
    save() {
      this.$axios
        .$put(
          `/api/v1/practice/me/practice-surgeries/${this.$route.params.id}`,
          this.form
        )
        .then(res => {
          this.$store.commit(
            "profile/UPDATE_SURGERY",
            res.data.practice_surgery
          );
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Surgery Update Success"]
          });
          //this.$router.push("/profile/branches-surgeries");
        });
    }
  }
};
</script>

<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>