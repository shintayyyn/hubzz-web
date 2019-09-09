<template>
  <section class="related-jobs-section">
    <MyPracticeRelatedJobsTabs :practiceType="'completed'" />
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
import MyPracticeRelatedJobsTabs from "@/components/MyPractice/MyPracticeRelatedJobsTabs";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    MyPracticeRelatedJobsTabs
  }
};
</script>
