<template>
  <div class="bg-white rounded-lg border p-4">
    <template v-if="job">
      <div class="font-bold text-xs sm:text-sm">
        Practice
      </div>
      
      <div class="font-bold text-sm sm:text-md">
        {{ job.practice_name }}
      </div>
      
      <div class="flex items-center flex-wrap">
        <div
          v-for="item in job.practice_types"
          :key="item.id"
          class="mr-2 bg-sunglow px-3 py-1 my-1 rounded-lg text-sm sm:text-md"
        >
          {{ item.name }}
        </div>
      </div>
      
      <div
        class="text-sm sm:text-md"
      >
        {{ job.practice_address_line_1 }} {{ job.practice_address_line_2 }} {{ job.practice_address_line_3 }} {{ job.practice_address_post_code }}
      </div>

      <div class="mt-4">
        <GmapMap
          :center="{lat: job.practice_coordinate_y, lng: job.practice_coordinate_x }"
          :zoom="15"
          map-type-id="terrain"
          style="width: 100%; height:300px"
        >
          <GmapMarker
            :position="google && new google.maps.LatLng(job.practice_coordinate_y, job.practice_coordinate_x)"
          />
        </GmapMap>
      </div>
    </template>
  </div>
</template>

<script>
import { gmapApi, } from "vue2-google-maps"

export default {
  props: {
    job: {
      type: Object,
      default: () => null,
    },
  },

  computed: {
    google: gmapApi,
  },
}
</script>
