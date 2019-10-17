<template>
  <div class="relative flex flex-col w-full mb-3">
    <div class="text-xs sm:text-sm font-bold">Job Parts</div>
    <div
      v-for="job_part in parts"
      :key="job_part.id"
      @click.prevent="goTo(job_part)"
      class="wrapper rounded-lg shadow-lg my-2 py-3 px-5"
      :class="$route.params.id == job_part.id ? 'bg-gray-300':'bg-white hover:bg-gray-200 cursor-pointer'"
    >
      <div class="flex flex-row flex-no-wrap justify-between items-center">
        <div class="text-xs sm:text-sm leading-loose" :class="$route.params.id == job_part.id && 'font-bold'">{{job_part.job_part_number}}</div>
        <!-- <div class="flex">
          <svgicon name="arrow-right" height="20" width="20" />
        </div> -->
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
      if (paramId != jobPart.id) {
        this.$router.push(`/jobs/${jobPart.id}?status=${jobPart.status}`);
      }
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
.wrapper{
  transition: all .3s linear;
}
</style>
