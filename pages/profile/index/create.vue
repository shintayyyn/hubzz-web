<template>
  <div class="modal-container shadow-lg p-4">
    <nuxt-link :to="'/profile'" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </nuxt-link>
    <div class="mt-5">
      <div class="text-lg font-bold">Add Mandatory Training</div>
      <AppInput
        v-model="form.name"
        :type="'text'"
        :name="'name'"
        :label="'Name'"
        :error="formError.find(item => item.field === 'name')"
      />
      <AppButton :label="'Add'" :inStyle="'padding:5px 14px;'" @click="add" />
    </div>
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
        name: ""
      },
      formError: []
    };
  },
  async mounted() {
    let resCount = await this.$axios.$get(
      `/api/v1/practice/other-mandatory-training/count`
    );
    let res = await this.$axios.$get(
      `/api/v1/practice/other-mandatory-training`
    );
  },
  methods: {
    add() {
      this.formError = [];
      this.$axios
        .$post(`/api/v1/practice/other-mandatory-training`, this.form)
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          this.form.name = "";
          this.$emit(
            "addMandatory",
            res.data.practice_other_mandatory_training
          );
        })
        .catch(err => {
          this.formError = err.response.data.error_messages;
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