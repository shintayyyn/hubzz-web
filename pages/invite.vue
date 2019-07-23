<template>
  <section>
    <div class="px-10" v-if="$route.query.invite === 'success'">
      <InviteSuccess />
    </div>
    <div class="px-10" v-else>
      <InviteTabs />
      <div class="mt-5">
        <InviteLocums v-if="$route.query.invite_domain === 'locums'" />
        <InvitePractices v-if="$route.query.invite_domain === 'practices'" />
      </div>
    </div>
  </section>
</template>
<script>
import InviteTabs from '@/components/Invite/InviteTabs'
import InviteLocums from '@/components/Invite/InviteLocums'
import InvitePractices from '@/components/Invite/InvitePractices'
import InviteSuccess from '@/components/Invite/InviteSuccess'
export default {
  components: {
    InviteTabs,
    InviteLocums,
    InvitePractices,
    InviteSuccess
  },
  middleware: 'isVerified',
  created() {
    const query = {
      ...this.$route.query,
      invite_domain: this.$route.query.invite_domain || 'locums'
    }
    this.$router.push({ query })
  }
}
</script>
