<template>
  <div class="p-8 max-w-5xl">
    <div @click="close" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex flex-row justify-start mt-8">
      <div class="leading-loose font-bold text-md sm:text-lg">{{job.title}}</div>
      <div
        class="mx-2 text-sm sm:text-sm p-2"
        :class="bgStatus(job.locum_status)"
      >{{status(job.locum_status)}}</div>
    </div>
    <div class="text-xs sm:text-sm">Posted {{$moment(job.date_created).format('DD/MM/YYYY')}}</div>
    <div class="flex flex-col mt-4"></div>

    <div class="flex flex-row flex-wrap justify-start mt-4">
      <div class="p-0 md:pr-4 w-full md:w-1/2">
        <JobDetailModalForm :job="job" />
      </div>
      <div class="p-0 md:pl-4 mt-8 md:m-0 w-full md:w-1/2">
        <div class="flex flex-col">
          <JobDetailModalMap :job="job" />
          <JobDetailModalUnassignForm
            :job="job"
            v-if="job.locum_status === 'Current'"
            @close="close"
          />
          <JobDetailModalApplyForm
            :job="job"
            v-if="job.locum_status === 'Available' || job.locum_status === 'Matched'"
            :compliances="job.platform_job.compliance_documents.map(item => item.id)"
            @close="close"
          />
          <JobDetailModalCancelForm
            :job="job"
            v-if="job.locum_status === 'Applied'"
            @close="close"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import JobDetailModalForm from '@/components/Jobs/JobDetailModalForm'
import JobDetailModalMap from '@/components/Jobs/JobDetailModalMap'
import JobDetailModalUnassignForm from '@/components/Jobs/JobDetailModalUnassignForm'
import JobDetailModalApplyForm from '@/components/Jobs/JobDetailModalApplyForm'
import JobDetailModalCancelForm from '@/components/Jobs/JobDetailModalCancelForm'
export default {
  props: ['job'],
  components: {
    JobDetailModalForm,
    JobDetailModalMap,
    JobDetailModalUnassignForm,
    JobDetailModalApplyForm,
    JobDetailModalCancelForm,
  },
  methods: {
    close() {
      if (this.$route.fullPath === '/dashboard') {
        this.$emit('close')
        return
      } else {
        const query = {
          ...this.$route.query
        }
        this.$router.push({ path: `/jobs`, query })
      }
    },
    status(status) {
      if (status === 'Available') {
        return 'LIVE'
      }
      if (status === 'Current') {
        return 'ALLOCATED'
      }
      return status.toUpperCase()
    },
    bgStatus(status) {
      switch (status) {
        case 'Available':
          return 'bg-yellow-500';
          break;
        case 'Applied':
          return 'bg-orange-400 text-white';
          break;
        case 'Completed':
          return 'bg-green-400';
          break;
        case 'Current':
          return 'bg-green-400';
          break;
        default:
          return 'bg-red-500 text-white'
      }
    }
  }
}
</script>

