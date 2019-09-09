<template>
  <div>
    <div class="flex flex-row p-2 flex-no-wrap justify-start mt-8">
      <span class="font-bold text-md sm:text-lg">{{practice.surgery.name}}</span>
      <span
        class="font-bold text-md sm:text-lg mx-4 -mt-2"
        :class="practice.practice_parent ? 'bg-blue-500 p-2 rounded' : 'bg-red-400 p-2 rounded'"
      >{{practice.practice_parent ? 'SPOKE': 'HUB'}}</span>
    </div>

    <div class="flex flex-row flex-wrap justify-start overflow-hidden">
      <div class="my-1 w-full lg:w-1/3 px-1 overflow-hidden">
        <div class="flex flex-col p-2 shadow-lg rounded-lg">
          <div class="font-bold text-md md:text-lg">Contact Number</div>
          <div class="text-sm md:text-md m-4">{{practice.phone_number}}</div>
          <div class="font-bold text-md md:text-lg">Practice Code</div>
          <div class="text-sm md:text-md m-4">{{practice.surgery.code}}</div>
          <div class="font-bold text-md md:text-lg">Practice Types</div>
          <div v-if="practice.practice_types" class="flex flex-row flex-wrap justify-start m-4">
            <div
              class="rounded-lg text-sm md:text-md bg-yellow-500 m-1 p-2"
              v-for="item in practice.practice_types"
              :key="item.id"
            >{{item.name}}</div>
          </div>
          <div class="font-bold text-md md:text-lg">Clinical Commissioning Group</div>
          <div class="text-sm md:text-md m-4">{{practice.surgery.clinical_commissioning_group.name}}</div>
          <div class="font-bold text-md md:text-lg">Address</div>
          <div class="m-4">
            <div class="text-sm md:text-md">{{practice.surgery.address.line_1}}</div>
            <div class="text-sm md:text-md">{{practice.surgery.address.line_2}}</div>
            <div class="text-sm md:text-md">{{practice.surgery.address.line_3}}</div>
          </div>
          <div class="font-bold text-md md:text-lg">Distance from your coordinates</div>
          <div class="text-sm md:text-md m-4">{{practice.distance_in_miles_from_coordinates}} miles</div>
        </div>
      </div>
      <div class="my-1 w-full lg:w-2/3 px-1 overflow-hidden">
        <div class="flex flex-col p-2 shadow-lg rounded-lg">
          <div class="font-bold text-md md:text-lg mb-4">Location</div>
          <div class>
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
import { gmapApi } from "vue2-google-maps";
export default {
  props: ["practice"],
  computed: {
    google: gmapApi,
    latLang() {
      return this.practice.surgery.address.coordinates;
    }
  }
};
</script>