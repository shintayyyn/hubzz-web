<template>
  <div class="shadow-lg">
    <div class="max-w-xl">
      <div class="m-8">
        <div class="flex flex-row justify-start">
          <div class="leading-loose font-bold text-md sm:text-lg">{{practice_surgery.surgery.name}}</div>
          <div
            class="mx-2 text-sm sm:text-sm p-2 text-gray-700 font-bold"
          >{{practice_surgery.surgery.code}}</div>
        </div>

        <div class="flex flex-col">
          <!--------------PAY FOR SURGERY-------------->
          <div class="flex flex-row">
            <div
              class="text-lg text-black font-semibold m-2 mt-6"
            >Permissions</div>
            <div
              @click="editPayForSurgery = !editPayForSurgery"
              class="text-sm font-semibold text-black bg-yellow-500 p-2 mt-5 rounded-lg cursor-pointer"
              :class="`${editPayForSurgery == false ? 'text-black bg-yellow-500' : 'text-white bg-green-500'}`"
            >{{editPayForSurgery == false ? 'Edit' : 'Done'}}</div>
          </div>
          <div v-if="editPayForSurgery === false" class="m-2 mt-6">
            <div class="text-black font-semibold text-sm">Pay for Surgery</div>
            <div class="text-black m-2">{{practice_surgery.pay_for_surgery}}</div>
            <div class="text-black font-semibold text-sm">Verify job creation</div>
            <div class="text-black m-2">{{practice_surgery.verify_job_creation}}</div>
            <div class="text-black font-semibold text-sm">Share Banks to Other Surgeries</div>
            <div class="text-black m-2">{{practice_surgery.share_banks_to_other_surgeries}}</div>
            <div class="text-black font-semibold text-sm">Create Job Rates Limit</div>
            <div class="text-black m-2">{{practice_surgery.create_job_rate_limit}}</div>
          </div>
          <!--------------EDIT PERMISSIONS----------------->
          <div v-if="editPayForSurgery === true" class="rounded-lg shadow-lg p-2">
            <div class="flex flex-col flex-wrap justify-between">
              <div class="w-full p-1">
                <AppInput
                  v-model="form.pay_for_surgery"
                  :type="'select'"
                  :name="'pay_for_surgery'"
                  :label="'Pay for surgery'"
                  :error="formError.find(item => item.field === 'pay_for_surgery')"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.verify_job_creation"
                  :type="'select'"
                  :name="'verify_job_creation'"
                  :label="'Verify job creation'"
                  :error="formError.find(item => item.field === 'verify_job_creation')"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form.share_banks_to_other_surgeries"
                  :type="'select'"
                  :name="'share_banks_to_other_surgeries'"
                  :label="'Share Banks to Other Surgeries'"
                  :error="formError.find(item => item.field === 'share_banks_to_other_surgeries')"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                    v-model="form.create_job_rate_limit"
                    :type="'number'"
                    :name="'create_job_rate_limit'"
                    :label="'Job Rates Limit £'"
                    :error="formError.find(item => item.field === 'create_job_rate_limit')"
                    @blur="CheckEmptyField(form.create_job_rate_limit,'create_job_rate_limit')"
                    :inStyle="'text-align:right'"
                  />
              </div>
            </div>
            <div class="flex flex-row justify-start">
              <AppButton :label="'Save'" @click="save" :inStyle="'padding:5px'" />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppButton,
    AppInput
  },
  data() {
    return {
      practice_id: "",
      editPayForSurgery: false,
      editSessionPolicies: false,
      editBillingPolicies: false,
      form: {
        pay_for_surgery: "",
        verify_job_creation: "",
        share_banks_to_other_surgeries: "",
        create_job_rate_limit: "",
      },
      // form2:{
      //   allow_surgery_create_sessions: "",
      //   allow_surgery_appoint_locums: "",
      //   allow_surgery_amend_sessions: "",
      //   allow_surgery_cancel_sessions: "",
      //   allow_surgery_approve_hours: "",
      //   allow_surgery_complete_sessions: ""
      // },
      // form3:{
      //   let_surgery_bill_locum: "",
      //   let_surgery_bill_hubzz: "",
      // },
      formError: []
    };
  },
  async asyncData({ app, route, store, params, error }) {
    try {
      const practice_id = params.id;
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
    console.log("route", this.$route.name);
    this.form.pay_for_surgery = this.practice_surgery.pay_for_surgery;
    this.form.verify_job_creation = this.practice_surgery.verify_job_creation;
    this.form.share_banks_to_other_surgeries = this.practice_surgery.share_banks_to_other_surgeries;
    this.form.create_job_rate_limit = this.practice_surgery.create_job_rate_limit;
  },
  methods: {
    save() {
      this.$axios
        .$put(
          `/api/v1/practice/me/practice-surgeries/${this.$route.params.id}`,
          this.form
        )
        .then(res => {
          this.$emit("updateSurgery", res.data.practice_surgery);
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Surgery Update Success"]
          });
          //this.$router.push("/profile/practice-spokes");
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
    width: 70%;
  }
}
</style>