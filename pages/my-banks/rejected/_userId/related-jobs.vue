<template>
  <section class="related-jobs-section">
    <MyLocumRelatedJobsTabs :locumType="'rejected'" />
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
import MyLocumRelatedJobsTabs from "@/components/MyBanks/MyLocumRelatedJobsTabs";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    MyLocumRelatedJobsTabs
  }
};
</script>
