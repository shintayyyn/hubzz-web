<template>
  <section>
    <div class="px-10">
      <TermsAndConditionsTabs />
    </div>
    <div class="px-10 mt-5">
      <transition name="fade" mode="out-in">
        <component :is="activeComponent" :terms="terms" />
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
  async asyncData({ app, error }) {
    try {
      const response = await app.$axios(`/api/v1/terms-and-conditions`)
      const terms = response.data && response.data.data && response.data.data.terms ? response.data.data.terms : null
      return {
        terms
      }
    } catch (err) {
      throw err
    }
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
