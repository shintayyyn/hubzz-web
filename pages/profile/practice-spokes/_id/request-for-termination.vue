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
    <div @click="toSendTerminationRequest()" class="p-2 w-1/8 rounded-lg bg-yellow-500 font-semibold cursor-pointer">
      Send
    </div>
  </div>

</template>
<script>
import AppInput from "@/components/Base/AppInput"
export default {
  components:{
    AppInput
  },
  data() {
    return{
      form:{
        note: '',
      }
    }  
  },
  methods: {
    toSendTerminationRequest(){
      this.$axios.$post(`/api/v1/practice/me/practice-surgeries/${this.$route.params.id}/request-for-termination`,{
        note: this.form.note
      }).then(res => {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: ["Termination Request Successfully Sent"]
        });
      })
    }
  }
}
</script>
<style>

</style>