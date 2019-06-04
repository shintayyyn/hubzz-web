<template>
  <div class="flex flex-col overflow-y-auto px-8 h-full info-card">
    <div class="relative rounded-lg py-3 px-5 my-1 bg-white cursor-pointer hover:bg-grey-lighter">
      <div class="absolute bg-orane pin-l pin-t rounded-l-lg p-2 h-full"></div>
      <div class="ml-2">
        <div class="text-grey-dark text-xs xl:text-sm">Job Number: {{job.job_number}}</div>
        <div class="my-3 font-bold text-sm sm:text-md">{{job.platform_job.title}}</div>
        <div class="my-3 text-sm sm:text-md">{{job.platform_job.practice.surgery.name}}</div>
        <div class="my-3 text-sm sm:text-md">{{job.platform_job.practice.surgery.code}}</div>
        <div
          class="text-grey-dark my-3 text-xs xl:text-sm"
        >From {{job.platform_job.date_start}} to {{job.platform_job.date_end}}</div>
        <div class="text-grey-dark my-3 text-xs xl:text-sm">Shift {{job.platform_job.shift.name}}</div>
        <div class="my-3 text-xs xl:text-sm">{{job.platform_job.description}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['job'],
}
</script>
<style>
.info-card {
  height: 200px;
}
@media screen and (min-width: 768px) {
  .info-card {
    height: 400px;
  }
}
</style>


