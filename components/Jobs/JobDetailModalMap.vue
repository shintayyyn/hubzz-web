<template>
  <div class="rounded-lg shadow-lg p-8">
    <div class="font-bold text-xs sm:text-sm">Practice</div>
    <div class="font-bold text-sm sm:text-md">{{job.platform_job.practice.surgery.name}}</div>
    <div
      class="text-sm sm:text-md"
    >{{job.platform_job.practice.surgery.address.line_1}} {{job.platform_job.practice.surgery.address.line_2}} {{job.platform_job.practice.surgery.address.line_3}} {{job.platform_job.practice.surgery.address.post_code}}</div>
    <div class="mt-4">
      <!-- google map -->
      <GmapMap
        :center="{lat:latLang.y, lng:latLang.x}"
        :zoom="15"
        map-type-id="terrain"
        style="width: 100%; height:300px"
      >
        <GmapMarker :position="google && new google.maps.LatLng(latLang.y, latLang.x)" />
      </GmapMap>
    </div>
  </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
export default {
  props: ['job'],
  computed: {
    google: gmapApi,
    latLang() {
      return this.job.platform_job.practice.surgery.address.coordinates
    },
  },
}
</script>

