<template>
  <section>
    <div class="px-10" v-if="$store.state.invite.activeTab === 'invite_success'">
      <InviteSuccess/>
    </div>
    <div class="px-10" v-else>
      <InviteTabs/>
      <div class="mt-5">
        <InviteLocums v-if="$store.state.invite.activeTab === 'invite_locums'"/>
        <InvitePractices v-if="$store.state.invite.activeTab === 'invite_practices'"/>
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
  }
}
</script>
