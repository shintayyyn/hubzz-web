<template>
  <div class="bg-white rounded-lg border p-4">
    <template>
      <div class="font-bold text-xs sm:text-sm">
        Practice
      </div>
      
      <div class="font-bold text-sm sm:text-md">
        {{ practiceName }}
      </div>
      
      <div class="flex items-center flex-wrap">
        <div v-for="practiceType in practiceTypes" :key="practiceType.id" class="mr-2 bg-sunglow px-3 py-1 my-1 rounded-lg text-sm sm:text-md">
          {{ practiceType.name }}
        </div>
      </div>
      
      <div class="text-sm sm:text-md">
        {{ practiceAddress }}
      </div>

      <div class="mt-4">
        <GmapMap
          :center="{lat: practiceCoordinateY, lng: practiceCoordinateX }"
          :zoom="15"
          map-type-id="terrain"
          style="width: 100%; height:300px"
        >
          <GmapMarker
            :position="google && new google.maps.LatLng(practiceCoordinateY, practiceCoordinateX)"
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
    practiceName: {
      type: String,
      default: null,
    },

    practiceTypes: {
      type: Array,
      default: () => [],
    },

    practiceAddress: {
      type: String,
      default: null,
    },

    practiceCoordinateX: {
      type: Number,
      default: 0,
    },

    practiceCoordinateY: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    google: gmapApi,
  },
}
</script>
