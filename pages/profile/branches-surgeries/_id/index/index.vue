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
            <div class="text-lg text-black font-semibold m-2 mt-6"> Pay for Surgery / Job Creation (OLD)</div>
            <div
              @click="editPayForSurgery = !editPayForSurgery" 
              class="text-sm font-semibold text-black bg-yellow-500 p-2 mt-5 rounded-lg cursor-pointer"
              :class="`${editPayForSurgery == false ? 'text-black bg-yellow-500' : 'text-white bg-green-500'}`">
              {{editPayForSurgery == false ? 'Edit' : 'Done'}}</div>
          </div>
          <div v-if="editPayForSurgery === false" class="m-2 mt-6">
            <div class="text-black font-semibold text-sm">Pay for Surgery</div>
            <div class="text-black m-2">{{practice_surgery.pay_for_surgery}}</div>
            <div class="text-black font-semibold text-sm">Verify job creation</div>
            <div class="text-black m-2">{{practice_surgery.verify_job_creation}}</div>
          </div>
          <!--------------EDIT PAY FOR SURGERY / VERIFY JOB CREATION------------------>
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
            </div>
            <div class="flex flex-row justify-start">
              <AppButton :label="'Save'" @click="save" :inStyle="'padding:5px'" />
            </div>
          </div>

          <!--------------SESSION POLICIES-------------->
          <div class="flex flex-row">
            <div class="text-lg text-black font-semibold m-2 mt-6">Session Policies</div>
            <div
              @click="editSessionPolicies = !editSessionPolicies" 
              class="text-sm font-semibold text-black bg-yellow-500 p-2 mt-5 rounded-lg cursor-pointer"
              :class="`${editSessionPolicies == false ? 'text-black bg-yellow-500' : 'text-white bg-green-500'}`">
              {{editSessionPolicies == false ? 'Edit' : 'Done'}}</div>
          </div>
          <div v-if="editSessionPolicies === false" class="m-2 mt-6">
            <div class="text-black font-semibold text-sm">Allow this surgery to create sessions?</div>
            <div class="text-black m-2">{{practice_surgery.pay_for_surgery}}</div>
            <div class="text-black font-semibold text-sm">Allow this surgery to allocate applicant locums to sessions?</div>
            <div class="text-black m-2">{{practice_surgery.verify_job_creation}}</div>
            <div class="text-black font-semibold text-sm">Allow this surgery to amend sessions?</div>
            <div class="text-black m-2">{{practice_surgery.pay_for_surgery}}</div>
            <div class="text-black font-semibold text-sm">Allow this surgery to cancel sessions?</div>
            <div class="text-black m-2">{{practice_surgery.verify_job_creation}}</div>
            <div class="text-black font-semibold text-sm">Allow this surgery to approve hours for invoicing?</div>
            <div class="text-black m-2">{{practice_surgery.pay_for_surgery}}</div>
            <div class="text-black font-semibold text-sm">Allow this surgery to complete sessions?</div>
            <div class="text-black m-2">{{practice_surgery.verify_job_creation}}</div>
          </div>
          <!-------------EDIT SESSION POLICIES-------------->
          <div v-if="editSessionPolicies === true" class="rounded-lg shadow-lg p-2">
            <div class="flex flex-col flex-wrap justify-between">
              <div class="w-full p-1">
                <AppInput
                  v-model="form2.create_sessions"
                  :type="'select'"
                  :name="'create_sessions'"
                  :label="'Allow this surgery to create sessions?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: 'Allow' },
                    { label: 'Require HUB`s Approval', value: 'Required' },
                    { label: 'Only HUB can operate', value: 'Hub Only' }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form2.allocate_locums"
                  :type="'select'"
                  :name="'allocate_locums'"
                  :label="'Allow this surgery to allocate applicant locums to sessions?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: 'Allow' },
                    { label: 'Require HUB`s Approval', value: 'Required' },
                    { label: 'Only HUB can operate', value: 'Hub Only' }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form2.amend_sessions"
                  :type="'select'"
                  :name="'amend_sessions'"
                  :label="'Allow this surgery to amend sessions?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: 'Allow' },
                    { label: 'Require HUB`s Approval', value: 'Required' },
                    { label: 'Only HUB can operate', value: 'Hub Only' }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form2.cancel_sessions"
                  :type="'select'"
                  :name="'cancel_sessions'"
                  :label="'Allow this surgery to cancel sessions?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: 'Allow' },
                    { label: 'Require HUB`s Approval', value: 'Required' },
                    { label: 'Only HUB can operate', value: 'Hub Only' }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form2.approve_hours_for_invoice"
                  :type="'select'"
                  :name="'approve_hours_for_invoice'"
                  :label="'Allow this surgery to approve hours for invoicing?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: 'Allow' },
                    { label: 'Require HUB`s Approval', value: 'Required' },
                    { label: 'Only HUB can operate', value: 'Hub Only' }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form2.complete_sessions"
                  :type="'select'"
                  :name="'complete_sessions'"
                  :label="'Allow this surgery to complete sessions?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: 'Allow' },
                    { label: 'Require HUB`s Approval', value: 'Required' },
                    { label: 'Only HUB can operate', value: 'Hub Only' }]"
                />
              </div>
            </div>
            <!-- <div class="flex flex-row justify-start">
              <AppButton :label="'Save'" @click="save" :inStyle="'padding:5px'" />
            </div> -->
          </div>
          
          <!--------------BLILLING POLICIES-------------->
          <div class="flex flex-row">
            <div class="text-lg text-black font-semibold m-2 mt-6">Billing Policies</div>
            <div
              @click="editBillingPolicies = !editBillingPolicies" 
              class="text-sm font-semibold text-black bg-yellow-500 p-2 mt-5 rounded-lg cursor-pointer"
              :class="`${editBillingPolicies == false ? 'text-black bg-yellow-500' : 'text-white bg-green-500'}`">
              {{editBillingPolicies == false ? 'Edit' : 'Done'}}</div>
          </div>
          <div v-if="editBillingPolicies === false" class="m-2 mt-6">
            <div class="text-black font-semibold text-sm">Let this surgery to handle its own billing for Locum Invoice?</div>
            <div class="text-black m-2">{{practice_surgery.pay_for_surgery}}</div>
            <div class="text-black font-semibold text-sm">Let this surgery to handle its own billing for HUBZZ? </div>
            <div class="text-black m-2">{{practice_surgery.verify_job_creation}}</div>
          </div>
          <!--------------EDIT BILLING POLICIES------------------>
          <div v-if="editBillingPolicies === true" class="rounded-lg shadow-lg p-2">
            <div class="flex flex-col flex-wrap justify-between">
              <div class="w-full p-1">
                <AppInput
                  v-model="form3.own_billing_locum_invoice"
                  :type="'select'"
                  :name="'own_billing_locum_invoice'"
                  :label="'Let this surgery to handle its own billing for Locum Invoice?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: 'Allow' },
                    { label: 'Require HUB`s Approval', value: 'Required' },
                    { label: 'Only HUB can operate', value: 'Hub Only' }]"
                />
              </div>
              <div class="w-full p-1">
                <AppInput
                  v-model="form3.own_billing_hubzz_billing"
                  :type="'select'"
                  :name="'own_billing_hubzz_billing'"
                  :label="'Let this surgery to handle its own billing for Hubzz?'"
                  :placeholder="'Select...'"
                  :items="[{ label: 'Allow to operate independently', value: 'Allow' },
                    { label: 'Require HUB`s Approval', value: 'Required' },
                    { label: 'Only HUB can operate', value: 'Hub Only' }]"
                />
              </div>
            </div>
            <!-- <div class="flex flex-row justify-start">
              <AppButton :label="'Save'" @click="save" :inStyle="'padding:5px'" />
            </div> -->
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
    width: 70%;
  }
}
</style>