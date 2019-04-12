<template>
  <section>
    <div class="px-10">
      <InviteTabs />
    </div>
    <div class="px-10 mt-5" >
      <InviteLocums v-if="$store.state.invite.activeTab === 'invite_locums'" />
      <!-- <InvitePractices v-if="$store.state.Invite.activeTab === 'invite_practices'" /> -->
    </div>
  </section>
</template>
<script>
import InviteTabs from '@/components/Invite/InviteTabs'
import InviteLocums from '@/components/Invite/InviteLocums'
// import InvitePractices from '@/components/Invite/InvitePractices'
export default {
  components: {
    InviteTabs,
    InviteLocums,
    // InvitePractices
  }
}
</script>
