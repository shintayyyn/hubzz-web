<template>
  <div class="m-2">
    <AppInput
      v-model="form.note"
      :type="'textarea'"
      :name="'note'"
      :label="'Note'"
      :placeholder="'Please Input reasons why you want to terminate the Spoke'"
      :resize="false"
    />
    <AppButton :label="'Send'" @click="toSendTerminationRequest()" :inStyle="'padding:5px 14px;'" />
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
export default {
  components: {
    AppInput,
    AppButton
  },
  data() {
    return {
      form: {
        note: ""
      }
    };
  },
  methods: {
    toSendTerminationRequest() {
      this.$axios
        .$post(`/api/v1/practice/me/practice-surgeries/${this.$route.params.id}/request-for-termination`, {
          note: this.form.note
        })
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Termination Request Successfully Sent"]
          });
        });
      this.$router.push('/surgery-management/practice-spokes')
    }
  }
};
</script>
<style></style>
