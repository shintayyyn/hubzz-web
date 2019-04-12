<template>
  <section>
    <div class="px-10">
      <TermsAndConditionsTabs />
    </div>
    <div class="px-10 mt-5" >
      <TermsAndConditions v-if="$store.state.termsAndConditions.activeTab === 'terms_and_conditions'" />
      <PrivacyPolicy v-if="$store.state.termsAndConditions.activeTab === 'privacy_policy'" />
    </div>
  </section>
</template>
<script>
import TermsAndConditionsTabs from '@/components/TermsAndConditions/TermsAndConditionsTabs'
import TermsAndConditions from '@/components/TermsAndConditions/TermsAndConditions'
import PrivacyPolicy from '@/components/TermsAndConditions/PrivacyPolicy'
export default {
  components: {
    TermsAndConditionsTabs,
    TermsAndConditions,
    PrivacyPolicy
  }
}
</script>
