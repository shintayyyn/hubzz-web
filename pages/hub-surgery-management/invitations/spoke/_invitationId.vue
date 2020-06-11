<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8 w-full">
      <svgicon
        name="left-arrow"
        height="32"
        width="32"
        class="mb-2 cursor-pointer"
        @click="$router.push('/hub-surgery-management/invitations/spoke')"
      />
      <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Accept Spoke</div>

      <div class="m-2 text-sm font-semibold">
        <div>Surgery: {{spoke.surgery.name}}</div>
      </div>

      <div class="rounded-lg shadow-lg p-2">
        <div class="flex flex-col flex-wrap justify-between">
          <div class="w-full p-1">
            <AppInput
              v-model="form.allow_surgery_create_sessions"
              :type="'select'"
              :name="'allow_surgery_create_sessions'"
              :label="'Allow Spoke to Create Jobs/Sessions?'"
              :error="formError.find(item => item.field === 'allow_surgery_create_sessions')"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
            />
          </div>
          <div
            class="p-2 mx-2 bg-gray-300 rounded-lg"
            v-if="[true, 'true'].includes(surgeryCreateSessions)"
          >
            <div class="w-full p-1">
              <AppInput
                v-model="form.max_hourly_rate_limit"
                :type="'number'"
                :name="'max_hourly_rate_limit'"
                :label="'Set max hourly rate limit for Spoke'"
                :error="formError.find(item => item.field === 'max_hourly_rate_limit')"
                :inStyle="'text-align:right'"
              />
            </div>
            <div class="w-full p-1">
              <AppInput
                v-model="form.max_halfday_rate_limit"
                :type="'number'"
                :name="'max_halfday_rate_limit'"
                :label="'Set max half day rate limit for Spoke'"
                :error="formError.find(item => item.field === 'max_halfday_rate_limit')"
                :inStyle="'text-align:right'"
              />
            </div>
            <div class="w-full p-1">
              <AppInput
                v-model="form.max_wholeday_rate_limit"
                :type="'number'"
                :name="'max_wholeday_rate_limit'"
                :label="'Set max whole day rate limit for Spoke'"
                :error="formError.find(item => item.field === 'max_wholeday_rate_limit')"
                :inStyle="'text-align:right'"
              />
            </div>
            <div class="w-full p-1">
              <AppInput
                v-model="form.max_ooh_rate_limit"
                :type="'number'"
                :name="'max_ooh_rate_limit'"
                :label="'Set max out-of-hours rate limit for Spoke'"
                :error="formError.find(item => item.field === 'max_ooh_rate_limit')"
                :inStyle="'text-align:right'"
              />
            </div>
            <div class="w-full p-1">
              <AppInput
                v-model="form.max_excess_hours"
                :type="'number'"
                :name="'max_excess_hours'"
                :label="'Set max excess hours rate limit for Spoke'"
                :error="formError.find(item => item.field === 'max_excess_hours')"
                :inStyle="'text-align:right'"
              />
            </div>
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.allow_surgery_create_permanent_jobs"
              :type="'select'"
              :name="'allow_surgery_create_permanent_jobs'"
              :label="'Allow Surgery to Create Permanent Jobs'"
              :error="formError.find(item => item.field === 'allow_surgery_create_permanent_jobs')"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.allow_surgery_bill_locum"
              :type="'select'"
              :name="'allow_surgery_bill_locum'"
              :label="'Allow Spoke to handle its own billing for Locum?'"
              :error="formError.find(item => item.field === 'allow_surgery_bill_locum')"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.allow_surgery_bill_hubzz"
              :type="'select'"
              :name="'allow_surgery_bill_hubzz'"
              :label="'Allow Spoke to handle its own billing for HUBZZ?'"
              :error="formError.find(item => item.field === 'allow_surgery_bill_hubzz')"
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
              v-model="form.share_my_banks"
              :type="'select'"
              :name="'share_my_banks'"
              :label="'Allow Spoke to see My Banks'"
              :error="formError.find(item => item.field === 'share_my_banks')"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
            />
          </div>
        </div>
        <div class="flex flex-row justify-start">
          <AppButton :label="'Save'" @click="publish" :inStyle="'padding:5px 16px;'" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  components: {
    AppButton,
    AppInput,
    AppConfirmationModal
  },
  data() {
    return {
      spoke: null,
      form: {
        child_practice_id: null,
        allow_surgery_create_sessions: "",
        max_hourly_rate_limit: "",
        max_halfday_rate_limit: "",
        max_wholeday_rate_limit: "",
        max_ooh_rate_limit: "",
        max_excess_hours: "",
        allow_surgery_create_permanent_jobs: "",
        allow_surgery_bill_locum: "",
        allow_surgery_bill_hubzz: "",
        share_banks_to_other_surgeries: "",
        share_my_banks: ""
      },
      formError: []
    };
  },
  computed: {
    surgeryCreateSessions: function() {
      return this.form.allow_surgery_create_sessions;
    }
  },
  async asyncData({ app, params, error }) {
    const resAll = await app.$axios.$get(
      `/api/v1/practice/me/practice-surgeries/spoke-invitations`
    );

    let invitationIds =
      resAll.data &&
      resAll.data.invitations &&
      resAll.data.invitations.length > 0
        ? resAll.data.invitations.map(item => item.id)
        : [];

    if (!invitationIds.includes(parseInt(params.invitationId))) {
      return error({ status: 404, message: "Page Not Found" });
    }

    const res = await app.$axios.$get(
      `/api/v1/practice/practice-spokes/${params.invitationId}`
    );
    let spoke = res.data && res.data.practices ? res.data.practices : null;
    return {
      spoke
    };
  },
  mounted() {
    this.form.child_practice_id = this.spoke.id;
  },
  methods: {
    publish() {
      this.formError = [];
      let notRequired = [
        "max_hourly_rate_limit",
        "max_halfday_rate_limit",
        "max_wholeday_rate_limit",
        "max_ooh_rate_limit",
        "max_excess_hours"
      ];
      this.Validate(this.form, notRequired);
      if (!this.formError.length) {
        this.invite();
      }
    },
    async invite() {
      await this.$axios
        .post(`/api/v1/practice/practice-spokes`, {
          child_practice_id: this.form.child_practice_id,
          allow_surgery_create_sessions: this.form
            .allow_surgery_create_sessions,
          max_hourly_rate_limit: this.form.max_hourly_rate_limit,
          max_halfday_rate_limit: this.form.max_halfday_rate_limit,
          max_wholeday_rate_limit: this.form.max_wholeday_rate_limit,
          max_ooh_rate_limit: this.form.max_ooh_rate_limit,
          max_excess_hours: this.form.max_excess_hours,
          allow_surgery_create_permanent_jobs: this.form
            .allow_surgery_create_permanent_jobs,
          allow_surgery_bill_locum: this.form.allow_surgery_bill_locum,
          allow_surgery_bill_hubzz: this.form.allow_surgery_bill_hubzz,
          share_banks_to_other_surgeries: this.form
            .share_banks_to_other_surgeries,
          share_my_banks: this.form.share_my_banks
        })
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`Invitation accepted successfully`]
          });
          this.$router.push("/hub-surgery-management/invitations/spoke");
        })
        .catch(err => {
          console.log("err", err.response.data.error_messages);
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [err.response.data.error_messages[0].message]
          });
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