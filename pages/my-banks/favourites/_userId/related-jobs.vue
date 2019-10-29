<template>
  <section>
    <MyLocumRelatedJobsTabs :locumType="'favourites'" />
    <div class="mt-4">
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
