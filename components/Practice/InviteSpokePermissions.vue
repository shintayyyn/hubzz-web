<template>
  <div class="py-4 px-4 md:px-8">
    <!-- HEADER -->
    <div class="flex justify-between text-sm text-white">
      <div @click="$emit('close')" class="cursor-pointer px-2 py-3">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
    </div>
    <!-- HEADER -->
    <AppConfirmationModal
      :label="'Proceed to invite this surgery?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      @confirm="invite"
      @cancel="modal = false"
    />

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
        <!-- SET MAX RATES ;  NOT REQUIRED -->
        <div class="p-2 mx-2 bg-gray-300 rounded-lg" v-if="surgeryCreateSessions == 'true'">
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
        <!-- SET MAX RATES END HERE -->
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
      </div>
      <div class="flex flex-row justify-start">
        <AppButton :label="'Save'" @click="publish" :inStyle="'padding:5px 16px;'" />
      </div>
    </div>
  </div>
</template>

<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  props: ["spoke"],
  components: {
    AppButton,
    AppInput,
    AppConfirmationModal
  },
  data() {
    return {
      modal: false,
      form: {
        child_practice_id: this.spoke.id,
        allow_surgery_create_sessions: "",
        max_hourly_rate_limit: "",
        max_halfday_rate_limit: "",
        max_wholeday_rate_limit: "",
        max_ooh_rate_limit: "",
        max_excess_hours: "",
        allow_surgery_create_permanent_jobs: "",
        allow_surgery_bill_locum: "",
        allow_surgery_bill_hubzz: "",
        share_banks_to_other_surgeries: ""
      },
      formError: []
    };
  },
  computed: {
    surgeryCreateSessions: function() {
      return this.form.allow_surgery_create_sessions;
    }
  },

  methods: {
    save() {
      this.modal = true;
    },
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
        .post(`/api/v1/practice/me/practice-surgeries/invite`, {
          child_practice_id: this.form.child_practice_id,
          allow_surgery_create_sessions: this.form.allow_surgery_create_sessions,
          max_hourly_rate_limit: this.form.max_hourly_rate_limit,
          max_halfday_rate_limit: this.form.max_halfday_rate_limit,
          max_wholeday_rate_limit: this.form.max_wholeday_rate_limit,
          max_ooh_rate_limit: this.form.max_ooh_rate_limit,
          max_excess_hours: this.form.max_excess_hours,
          allow_surgery_create_permanent_jobs: this.form.allow_surgery_create_permanent_jobs,
          allow_surgery_bill_locum: this.form.allow_surgery_bill_locum,
          allow_surgery_bill_hubzz: this.form.allow_surgery_bill_hubzz,
          share_banks_to_other_surgeries: this.form.share_banks_to_other_surgeries
        })
        .then(res => {
          this.modal = false;
          this.$emit("close");
          // this.emit("addSurgery", res.data.practice_surgery)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.data.message}`]
          });
          this.$router.push("/hub-surgery-management");
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

<style>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 70%;
  }
}
.add-surgery-confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  z-index: 514;
}
</style>
