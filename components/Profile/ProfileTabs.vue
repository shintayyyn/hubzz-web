<template>
  <div>
    <div class="relative flex flex-nowrap">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('practice')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.profile_tab === 'practice' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >Practice</div>
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('surgeries')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.profile_tab === 'surgeries' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >Branches / Surgeries</div>
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('practiceDocuments')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.profile_tab === 'practiceDocuments' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >Practice Documents</div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        profile_tab: type
      }

      this.$router.push({ query })
    }
  }
}
</script>
