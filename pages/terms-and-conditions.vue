<template>
  <section>
    <div class="px-10">
      <TermsAndConditionsTabs />
    </div>
    <div class="px-10 mt-5">
      <transition name="fade" mode="out-in">
        <component :is="activeComponent" />
      </transition>
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
  },
  computed: {
    activeComponent() {
      return this.$route.query.active_tab
    },
  },
  created() {
    const query = {
      ...this.$route.query,
      active_tab: this.$route.query.active_tab || 'termsAndConditions'
    }
    this.$router.push({ query })
  },
}
</script>
