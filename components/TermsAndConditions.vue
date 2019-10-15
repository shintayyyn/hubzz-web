<template>
  <div>
    <div class="px-4 lg:px-10">
      <TermsAndConditionsTabs :activeComponent="activeComponent" @goTo="activeComponent = $event" />
    </div>
    <div class="px-4 lg:px-10 mt-5">
      <transition name="fade" mode="out-in">
        <TermsAndConditions
          v-if="activeComponent === 'termsAndConditions' && terms"
          :terms="terms"
        />
        <PrivacyPolicy v-if="activeComponent === 'privacyPolicy' && terms" :terms="terms" />
      </transition>
    </div>
  </div>
</template>
<script>
import TermsAndConditionsTabs from "@/components/TermsAndConditions/TermsAndConditionsTabs";
import TermsAndConditions from "@/components/TermsAndConditions/TermsAndConditions";
import PrivacyPolicy from "@/components/TermsAndConditions/PrivacyPolicy";
export default {
  components: {
    TermsAndConditionsTabs,
    TermsAndConditions,
    PrivacyPolicy
  },
  data() {
    return {
      terms: null,
      activeComponent: "termsAndConditions"
    };
  },
  created() {
    this.$axios.$get(`/api/v1/terms-and-conditions`).then(res => {
      this.terms = res.data.terms;
    });
  }
};
</script>