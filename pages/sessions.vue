<template>
  <section>
    <div class="px-10">
      <SessionTabs/>
    </div>
    <div class="px-10 mt-5">
      <Live v-if="$store.state.session.activeTab === 'live'"/>
      <Applied v-if="$store.state.session.activeTab === 'applied'"/>
      <Allocated v-if="$store.state.session.activeTab === 'allocated'"/>
      <Completed v-if="$store.state.session.activeTab === 'completed'"/>
      <Unfilled v-if="$store.state.session.activeTab === 'unfilled'"/>
    </div>
  </section>
</template>
<script>
import SessionTabs from '@/components/Session/SessionTabs'
import Live from '@/components/Session/Live'
import Applied from '@/components/Session/Applied'
import Allocated from '@/components/Session/Allocated'
import Completed from '@/components/Session/Completed'
import Unfilled from '@/components/Session/Unfilled'
export default {
  components: {
    SessionTabs,
    Live,
    Applied,
    Allocated,
    Completed,
    Unfilled
  },
  created() {
    this.$store.commit('session/SET_ACTIVE_TAB', 'live')
  }
}
</script>
