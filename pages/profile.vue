<template>
  <section>
    <div class="px-10">
      <ProfileTabs/>
    </div>
    <div class="px-10 mt-5">
      <PracticeForm v-if="$store.state.profile.profileTab === 'practice'"/>
      <SurgeriesForm v-if="$store.state.profile.profileTab === 'surgeries'"/>
    </div>
  </section>
</template>
<script>
import ProfileTabs from '@/components/Profile/ProfileTabs'
import PracticeForm from '@/components/Profile/PracticeForm'
import SurgeriesForm from '@/components/Profile/SurgeriesForm'
export default {
  components: {
    ProfileTabs,
    PracticeForm,
    SurgeriesForm
  }
}
</script>

