<template>
  <section class="related-jobs-section">
    <LocumRelatedJobsTabs :locumType="'favourites'" />
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
import LocumRelatedJobsTabs from '@/components/MyBanks/LocumRelatedJobsTabs'
export default {
  transition: {
    name: 'fade',
    mode: 'out-in'
  },
  components: {
    LocumRelatedJobsTabs
  }
}
</script>
