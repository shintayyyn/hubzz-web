<template>
  <div></div>
</template>
<script>
import debounce from "lodash.debounce";
import AppTable from "@/components/Base/AppTable";
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppTime from "@/components/Base/AppTime";
import AppPostCode from "@/components/Base/AppPostCode";
import AppAutoComplete from "@/components/Base/AppAutoComplete";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
export default {
  props: ["shifts", "rates", "invoiceStatusList", "practiceTypeList"],
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppTable,
    AppInput,
    AppDate,
    AppTime,
    AppPostCode,
    AppAutoComplete,
    AppButton,
    AppLoading
  },
  created() {
    this.$router.push(
      `/my-practice/applied/${this.$route.params.practiceId}/related-jobs/allocated`
    );
  }
};
</script>
