<template>
  <div class="p-8 max-w-xl" v-if="job">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>
    <div class="flex flex-row justify-start font-bold text-sm sm:text-xl mt-8">
      <div class="mx-2 leading-loose">GP</div>
      <div class="mx-2 rounded-lg bg-yellow-dark p-2 leading-tight">ASSIGNED</div>
    </div>
    <div class="flex flex-row flex-wrap justify-between mt-4">
      <div class="w-full p-0 md:w-1/2 md:pr-4 mb-4">
        <div
          class="text-xs sm:text-sm font-bold"
        >Posted {{$moment(job.created_at).format('DD/MM/YYYY')}}</div>
        <div class="rounded-lg shadow-lg px-8 py-4 mt-4 pt-8 pb-4">
          <div class="flex flex-col">
            <div class="flex flex-row flex-nowrap justify-between">
              <div class="flex flex-col">
                <div class="font-bold text-md sm:text-lg">Job number</div>
                <div class="text-xs sm:text-sm mb-4">job number here</div>
                <div class="font-bold text-md sm:text-lg">Rate</div>
                <div class="text-xs sm:text-sm mb-4">rate here</div>
                <div class="font-bold text-md sm:text-lg">Total hourse</div>
                <div class="text-xs sm:text-sm mb-4">total hours here</div>
                <div class="font-bold text-md sm:text-lg">Job description</div>
                <div class="text-xs sm:text-sm mb-4">description here</div>
                <div class="font-bold text-md sm:text-lg">Extra information</div>
                <div class="text-xs sm:text-sm mb-4">xtra info here</div>
              </div>
              <div class="flex flex-col">
                <div class="font-bold text-md sm:text-lg">Duration</div>
                <div class="text-xs sm:text-sm">From date from</div>
                <div class="text-xs sm:text-sm my-2">to date to</div>
                <div class="text-xs sm:text-sm mb-4">shift shift here</div>
              </div>
            </div>
            <div class="font-bold text-md sm:text-lg">Specialty</div>
            <div class="flex flex-row flex-wrap justify-start my-2">
              <div
                class="bg-yellow-dark rounded-lg px-2 py-3 font-bold text-xs sm:text-sm m-1"
              >Dermatology</div>
            </div>
            <div class="font-bold text-md sm:text-lg">Clinical systems</div>
            <div class="flex flex-row flex-wrap justify-start my-2">
              <div
                class="bg-yellow-dark rounded-lg px-2 py-3 font-bold text-xs sm:text-sm m-1"
              >SystemOne</div>
            </div>
            <div class="font-bold text-md sm:text-lg">Spoken languages</div>
            <div class="flex flex-row flex-wrap justify-start my-2">
              <div
                class="bg-yellow-dark rounded-lg px-2 py-3 font-bold text-xs sm:text-sm m-1"
              >English</div>
            </div>
            <div class="font-bold text-md sm:text-lg">Compliance documents</div>
            <div class="flex flex-col">
              <div class="flex flex-row flex-nowrap justify-start">
                <div class="cursor-pointer">
                  <svgicon name="cloud-download" height="24" width="24"/>
                </div>
                <div class="ml-2 leading-normal">Basic Life support certificate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full p-0 md:w-1/2 md:pl-4 mb-4">
        <div class="text-xs sm:text-sm font-bold">Locum</div>
        <div class="rounded-lg shadow-lg px-8 pt-4 mt-4 pt-8 pb-4">
          <div class="flex flex-col">
            <div class="flex flex-row justify-start"></div>
            <div class="font-bold text-md sm:text-lg">Headline</div>
            <div class="text-xs sm:text-sm mb-4">headline here</div>
            <div class="font-bold text-md sm:text-lg">Biography</div>
            <div class="text-xs sm:text-sm mb-4">biography here</div>
            <div class="font-bold text-md sm:text-lg">GMC / NMC Number</div>
            <div class="text-xs sm:text-sm mb-4">gmc nmc number here</div>
            <div class="font-bold text-md sm:text-lg">MPL / NPL Number</div>
            <div class="text-xs sm:text-sm mb-4">mpl npl number here</div>
            <div class="font-bold text-md sm:text-lg">Specialty</div>
            <div class="flex flex-row flex-wrap justify-start my-2">
              <div
                class="bg-yellow-dark rounded-lg px-2 py-3 font-bold text-xs sm:text-sm m-1"
              >Dermatology</div>
            </div>
            <div class="font-bold text-md sm:text-lg">Clinical systems</div>
            <div class="flex flex-row flex-wrap justify-start my-2">
              <div
                class="bg-yellow-dark rounded-lg px-2 py-3 font-bold text-xs sm:text-sm m-1"
              >SystemOne</div>
            </div>
            <div class="font-bold text-md sm:text-lg">Spoken languages</div>
            <div class="flex flex-row flex-wrap justify-start my-2">
              <div
                class="bg-yellow-dark rounded-lg px-2 py-3 font-bold text-xs sm:text-sm m-1"
              >English</div>
            </div>
            <div class="font-bold text-md sm:text-lg">Compliance documents</div>
            <div class="flex flex-col">
              <div class="flex flex-row flex-nowrap justify-start">
                <div class="cursor-pointer">
                  <svgicon name="cloud-download" height="24" width="24"/>
                </div>
                <div class="ml-2 leading-normal">Basic Life support certificate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    job() {
      return this.$store.state.session.job
    }
  },
  created() {
    console.log(this.job)
  }
}
</script>

