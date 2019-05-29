<template>
  <section>
    <div class="px-10">
      <ProfileTabs/>
    </div>
    <div class="px-10 mt-5">
      <Practice v-if="$store.state.profile.profileTab === 'practice'"/>
      <Surgeries v-if="$store.state.profile.profileTab === 'surgeries'"/>
    </div>
  </section>
</template>
<script>
import ProfileTabs from '@/components/Profile/ProfileTabs'
import Practice from '@/components/Profile/Practice'
import Surgeries from '@/components/Profile/Surgeries'
export default {
  components: {
    ProfileTabs,
    Practice,
    Surgeries
  }
}
</script>

