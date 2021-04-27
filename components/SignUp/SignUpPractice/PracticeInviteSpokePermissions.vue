<template>
  <div class="modal-container py-4 px-4 md:px-8">
    <div class="flex justify-between text-sm text-white">
      <div class="cursor-pointer px-2 py-3" @click="$emit('close')">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
    </div>

    <div class="rounded-lg border p-4">
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
        <div
          v-if="[true,'true'].includes(surgeryCreateSessions)"
          class="p-2 mx-2 bg-gray-300 rounded-lg"
        >
          <div class="w-full p-1">
            <AppInput
              v-model="form.max_hourly_rate_limit"
              :type="'number'"
              :name="'max_hourly_rate_limit'"
              :label="'Set max hourly rate limit for Spoke'"
              :error="formError.find(item => item.field === 'max_hourly_rate_limit')"
              :inStyle="'text-align:left'"
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.max_halfday_rate_limit"
              :type="'number'"
              :name="'max_halfday_rate_limit'"
              :label="'Set max half day rate limit for Spoke'"
              :error="formError.find(item => item.field === 'max_halfday_rate_limit')"
              :inStyle="'text-align:left'"
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.max_wholeday_rate_limit"
              :type="'number'"
              :name="'max_wholeday_rate_limit'"
              :label="'Set max whole day rate limit for Spoke'"
              :error="formError.find(item => item.field === 'max_wholeday_rate_limit')"
              :inStyle="'text-align:left'"
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.max_ooh_rate_limit"
              :type="'number'"
              :name="'max_ooh_rate_limit'"
              :label="'Set max out-of-hours rate limit for Spoke'"
              :error="formError.find(item => item.field === 'max_ooh_rate_limit')"
              :inStyle="'text-align:left'"
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.max_excess_hours"
              :type="'number'"
              :name="'max_excess_hours'"
              :label="'Set max excess hours rate limit for Spoke'"
              :error="formError.find(item => item.field === 'max_excess_hours')"
              :inStyle="'text-align:left'"
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
        <AppButton :label="'Save'" :inStyle="'padding:5px 16px;'" @click="publish" />
      </div>
    </div>

    <AppConfirmationModal
      :label="'Proceed to invite this surgery?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      @confirm="invite"
      @cancel="modal = false"
    />
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton"
import AppInput from "@/components/Base/AppInput"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
export default {
  components: {
    AppButton,
    AppInput,
    AppConfirmationModal,
  },
  props: ["spoke",],
  data () {
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
        share_banks_to_other_surgeries: "",
        share_my_banks: "",
      },
      formError: [],
    }
  },
  computed: {
    surgeryCreateSessions () {
      return this.form.allow_surgery_create_sessions
    },
  },
  mounted () {
    if (this.spoke.child_practice_id) {
      this.form.max_hourly_rate_limit = this.spoke.max_hourly_rate_limit
      this.form.max_halfday_rate_limit = this.spoke.max_halfday_rate_limit
      this.form.max_wholeday_rate_limit = this.spoke.max_wholeday_rate_limit
      this.form.max_ooh_rate_limit = this.spoke.max_ooh_rate_limit
      this.form.max_excess_hours = this.spoke.max_excess_hours
      this.form.child_practice_id = this.spoke.child_practice_id
      this.form.allow_surgery_create_sessions = [false, "false",].includes(
        this.spoke.allow_surgery_create_sessions
      )
        ? false
        : true
      this.form.allow_surgery_create_permanent_jobs = [false, "false",].includes(
        this.spoke.allow_surgery_create_permanent_jobs
      )
        ? false
        : true
      this.form.allow_surgery_bill_locum = [false, "false",].includes(
        this.spoke.allow_surgery_bill_locum
      )
        ? false
        : true
      this.form.allow_surgery_bill_hubzz = [false, "false",].includes(
        this.spoke.allow_surgery_bill_hubzz
      )
        ? false
        : true
      this.form.share_banks_to_other_surgeries = [false, "false",].includes(
        this.spoke.share_banks_to_other_surgeries
      )
        ? false
        : true
      this.form.share_my_banks = [false, "false",].includes(
        this.spoke.share_my_banks
      )
        ? false
        : true
    }
  },
  methods: {
    publish () {
      this.formError = []
      let notRequired = [
        "max_hourly_rate_limit",
        "max_halfday_rate_limit",
        "max_wholeday_rate_limit",
        "max_ooh_rate_limit",
        "max_excess_hours",
      ]
      if (typeof this.form.allow_surgery_create_sessions === "boolean") {
        notRequired.push("allow_surgery_create_sessions")
      }
      if (typeof this.form.allow_surgery_create_permanent_jobs === "boolean") {
        notRequired.push("allow_surgery_create_permanent_jobs")
      }
      if (typeof this.form.allow_surgery_bill_locum === "boolean") {
        notRequired.push("allow_surgery_bill_locum")
      }
      if (typeof this.form.allow_surgery_bill_hubzz === "boolean") {
        notRequired.push("allow_surgery_bill_hubzz")
      }
      if (typeof this.form.share_banks_to_other_surgeries === "boolean") {
        notRequired.push("share_banks_to_other_surgeries")
      }
      if (typeof this.form.share_my_banks === "boolean") {
        notRequired.push("share_my_banks")
      }

      this.Validate(this.form, notRequired)
      if (!this.formError.length) {
        this.modal = true
      }
    },
    invite () {
      let objForm = {}
      if (this.spoke.child_practice_id) {
        objForm = {
          ...this.form,
          name: this.spoke.name,
          child_practice_id: this.spoke.child_practice_id,
          allow_surgery_create_sessions: [false, "false",].includes(
            this.form.allow_surgery_create_sessions
          )
            ? "false"
            : "true",
          allow_surgery_create_permanent_jobs: [false, "false",].includes(
            this.form.allow_surgery_create_permanent_jobs
          )
            ? "false"
            : "true",
          allow_surgery_bill_locum: [false, "false",].includes(
            this.form.allow_surgery_bill_locum
          )
            ? "false"
            : "true",
          allow_surgery_bill_hubzz: [false, "false",].includes(
            this.form.allow_surgery_bill_hubzz
          )
            ? "false"
            : "true",
          share_banks_to_other_surgeries: [false, "false",].includes(
            this.form.share_banks_to_other_surgeries
          )
            ? "false"
            : "true",
        }
      } else {
        objForm = {
          ...this.form,
          name: this.spoke.name,
        }
      }
      this.$emit("addSpoke", objForm)
      this.modal = false
    },
  },
}
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 50%;
  }
}
</style>
