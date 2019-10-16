<template>
  <div class="relative flex flex-col w-full">
    <div class="text-xs sm:text-sm font-bold">Job Parts</div>
    <div
      class="_job-card rounded-lg shadow-lg m-0 my-4 py-3 px-5 cursor-pointer"
      v-for="job_part in parts"
      :key="job_part.id"
      @click="goTo(job_part)"
    >
      <div class="flex flex-row flex-no-wrap justify-between items-center">
        <div class="text-xs sm:text-sm font-bold leading-loose">{{job_part.job_part_number}}</div>
        <div class="flex">
          <svgicon name="arrow-right" height="20" width="20" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["parts"],
  methods: {
    goTo(jobPart) {
      let paramId = this.$route.params.id;
      if (paramId === jobPart.id.toString()) {
        return;
      }
      this.$router.push(`/jobs/${jobPart.id}?status=${jobPart.status}`);
    }
  }
};
</script>
<style scoped>
.shield {
  z-index: 511;
}
.modal-container {
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 70%;
  }
}
</style>
