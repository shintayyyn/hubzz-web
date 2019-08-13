<template>
  <div class="p-8 max-w-5xl">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex flex-row p-2 flex-no-wrap justify-start mt-8">
      <span class="font-bold text-md sm:text-lg">{{practice.surgery.name}}</span>
      <span
        class="font-bold text-md sm:text-lg mx-4 -mt-2"
        :class="practice.practice_parent ? 'bg-blue-500light p-2 rounded' : 'bg-red-400 p-2 rounded'"
      >{{practice.practice_parent ? 'SPOKE': 'HUB'}}</span>
    </div>

    <div class="flex flex-row flex-wrap justify-start overflow-hidden">
      <div class="my-1 w-full lg:w-1/3 px-1 overflow-hidden">
        <div class="m-4 shadow-lg p-2 rounded-lg">
          <div>
            <div class="font-bold my-4 text-sm sm:text-lg">Contact Number</div>
            <span class="m-4 text-sm">{{practice.phone_number}}</span>

            <div class="font-bold my-4 text-sm sm:text-lg">Practice Code</div>
            <span class="m-4 text-sm">{{practice.surgery.code}}</span>

            <div class="font-bold my-4 text-sm sm:text-lg">Practice Types</div>
            <div v-if="practice.practice_types">
              <p
                class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
                v-for="item in practice.practice_types"
                :key="item.id"
              >{{item ? item.name:null}}</p>
            </div>

            <div class="font-bold my-4 text-sm sm:text-lg">Clinical Commissioning Group</div>
            <span class="m-4 text-sm">{{practice.surgery.clinical_commissioning_group.name}}</span>

            <div class="font-bold my-4 text-sm sm:text-lg">Address</div>
            <div class="m-1 text-sm">{{practice.surgery.address.line_1}}</div>
            <div class="m-1 text-sm">{{practice.surgery.address.line_2}}</div>
            <div class="m-1 text-sm">{{practice.surgery.address.line_3}}</div>
          </div>
        </div>
      </div>
      <div class="my-1 w-full lg:w-2/3 px-1 overflow-hidden">
        <div class="m-4 p-4 shadow-lg rounded-lg">
          <div>
            <span class="font-bold text-md sm:text-lg">Location</span>
          </div>
          <div class="mt-4">
            <!-- google map -->
            <GmapMap
              :center="{lat:latLang.y,lng:latLang.x}"
              :zoom="15"
              map-type-id="terrain"
              style="width: 100%; height:500px"
            >
              <GmapMarker :position="google && new google.maps.LatLng(latLang.y, latLang.x)" />
            </GmapMap>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
export default {
  props: ['practice'],
  computed: {
    google: gmapApi,
    latLang() {
      return this.practice.surgery.address.coordinates
    },
  },

  methods: {
  }
}
</script>
