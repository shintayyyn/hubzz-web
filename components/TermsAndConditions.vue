<template>
  <div>
    <div>
      <TermsAndConditionsTabs
        :activeComponent="activeComponent"
        @goTo="activeComponent = $event"
      />
    </div>
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <TermsAndConditions
          v-if="activeComponent === 'termsAndConditions' && terms"
          :terms="terms"
        />
        <PrivacyPolicy
          v-if="activeComponent === 'privacyPolicy' && terms"
          :terms="terms"
        />
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
  //re-fetch new data
  async fetch() {
    const res = await this.$axios.$get(`/api/v1/terms-and-conditions`, {
      cache: true
    });
    this.terms = res.data.terms;
  },
  activated() {
    this.activeComponent = "termsAndConditions";
    this.$fetch();
  }
};
//end
</script>
