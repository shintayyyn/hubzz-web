<template>
  <div class="relative bg-white rounded-lg border p-4 mt-6">
    <div class="text-base font-bold mb-4">
      You can unassign from this job
    </div>
    <div
      class="text-sm text-gray-700"
    >
      Cancellation should be at least be 72 hours before the start of the job.
    </div>
    <AppInput
      :ref="'unassignTextArea'"
      v-model="form.declined_reason"
      :type="'textarea'"
      :name="'declined_reason'"
      :label="'Please state here your reason.'"
      :error="formError.find(item => item.field === 'declined_reason')"
      :limit="255"
      :resize="false"
      @blur="CheckEmptyField(form.declined_reason,'declined_reason')"
    />
    <AppButton :label="'Unassign from this job'" :disabled="loading" @click="unassign" />
    <AppLoading :loading="loading" spinner />
  </div>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading"
import AppButton from "@/components/Base/AppButton"
import AppInput from "@/components/Base/AppInput"
export default {
  components: {
    AppLoading,
    AppButton,
    AppInput,
  },

  props: {
    job: {
      type: Object,
      default: () => null,
    },
  },

  data () {
    return {
      loading: false,
      form: {
        declined_reason: "",
      },
      formError: [],
    }
  },
  methods: {
    trimmedMessage (value) {
      return value.replace(/^\s*/, "").replace(/\s*$/, "")
    },
    unassign () {
      this.form.declined_reason = this.trimmedMessage(
        this.form.declined_reason
      )
      this.formError = []
      this.Validate(this.form)
      if (!this.formError.length) {
        this.loading = true
        const jobId = this.job.id
        this.$axios
          .$post(`/api/v1/locum/jobs/${jobId}/decline`, this.form)
          .then(() => {
            this.$store.commit(
              "jobs/REMOVE_LOCUM_ALLOCATED_JOB",
              jobId
            )

            if (this.job.job_parts) {
              this.job.job_parts.forEach(({ id, }) => {
                this.$store.commit("jobs/REMOVE_LOCUM_ALLOCATED_JOB_PART", id)
              })

            }
            
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Withdrawn",],
            })
            
            this.$emit("unassign", jobId)
          })
          .catch(err => {
            console.log("err", err.response || err)
            
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`,],
              })
            }
            
            if (err.response.data.error_messages) {
              err.response.data.error_messages.forEach(error => {
                this.formError.push(error)
              })
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: ["Please fill up all the forms",],
        })
      }
    },
  },
}
</script>
