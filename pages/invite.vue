<template>
  <section>
    <div class="px-10" v-if="$route.query.invite === 'success'">
      <InviteSuccess />
    </div>
    <div class="px-10" v-else>
      <InviteTabs />
      <div class="mt-5">
        <Invite />
      </div>
    </div>
  </section>
</template>
<script>
import InviteTabs from '@/components/Invite/InviteTabs'
import Invite from '@/components/Invite/Invite'
import InviteSuccess from '@/components/Invite/InviteSuccess'
export default {
  components: {
    InviteTabs,
    Invite,
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
