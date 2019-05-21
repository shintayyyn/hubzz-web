<template>
  <section>
    <div class="px-10">
      <ProfileTabs/>
    </div>
    <div class="px-10 mt-5">
      <PracticeForm v-if="$store.state.profile.profileTab === 'practice'"/>
      <BranchesForm v-if="$store.state.profile.profileTab === 'branches'"/>
    </div>
  </section>
</template>
<script>
import ProfileTabs from '@/components/Profile/ProfileTabs'
import PracticeForm from '@/components/Profile/PracticeForm'
import BranchesForm from '@/components/Profile/BranchesForm'
export default {
  components: {
    ProfileTabs,
    PracticeForm,
    BranchesForm
  }
}
</script>

