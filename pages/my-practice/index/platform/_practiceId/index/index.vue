<template>
  <section>
    <div class="flex flex-row p-2 flex-no-wrap justify-start items-center">
      <span class="font-bold text-md sm:text-lg">{{ practice.surgery.name }}</span>
      <span
        class="font-bold text-md sm:text-lg ml-4 mr-2 px-4 py-2 rounded"
        :class="typeStyle(practice.type)"
      >{{ practice.type }}</span>
      <span
        v-if="practice.type === 'Hub'"
        class="font-bold text-md sm:text-lg px-4 py-2 rounded"
        :class="hubTypeStyle(practice.hub_type)"
      >{{ practice.hub_type }}</span>
    </div>

    <div class="flex flex-row flex-wrap justify-start">
      <div class="w-full md:w-1/3 p-2">
        <div class="flex flex-col p-4 border rounded-lg">
          <div class="font-bold text-md md:text-lg">
            Contact Number
          </div>
          <div class="text-sm md:text-md m-2">
            {{ practice.phone_number }}
          </div>
          <div class="font-bold text-md md:text-lg">
            Practice Code
          </div>
          <div class="text-sm md:text-md m-2">
            {{ practice.surgery.code }}
          </div>
          <div class="font-bold text-md md:text-lg">
            Practice Types
          </div>
          <div v-if="practice.practice_types" class="flex flex-row flex-wrap justify-start my-2">
            <div
              v-for="item in practice.practice_types"
              :key="item.id"
              class="rounded-lg text-sm md:text-md bg-sunglow m-1 p-2"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="font-bold text-md md:text-lg">
            Clinical Commissioning Group
          </div>
          <div class="text-sm md:text-md m-2">
            {{ practice.surgery.clinical_commissioning_group.name }}
          </div>
          <div class="font-bold text-md md:text-lg">
            Address
          </div>
          <div class="m-2">
            <div class="text-sm md:text-md">
              {{ practice.surgery.address.line_1 }}
            </div>
            <div class="text-sm md:text-md">
              {{ practice.surgery.address.line_2 }}
            </div>
            <div class="text-sm md:text-md">
              {{ practice.surgery.address.line_3 }}
            </div>
          </div>
          <div class="font-bold text-md md:text-lg">
            Distance from your coordinates
          </div>
          <div class="text-sm md:text-md m-2">
            {{ practice.distance_in_miles_from_coordinates }} miles
          </div>
        </div>
      </div>
      <div class="w-full md:w-2/3 p-2">
        <div class="flex flex-col p-4 border rounded-lg">
          <div class="font-bold text-md md:text-lg mb-2">
            Location
          </div>
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
  </section>
</template>
<script>
import { gmapApi, } from "vue2-google-maps"
export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },
  props: ["practice",],
  computed: {
    google: gmapApi,
    latLang () {
      return { x: this.practice.coordinate_x, y: this.practice.coordinate_y, }
    },
  },
  methods : {
    typeStyle (type) {
      switch (type) {
      case "Hub":
        return "bg-red-500 text-white px-4 py-1"
      case "Spoke":
        return "bg-blue-500 text-white px-4 py-1"
      case "Stand Alone":
        return "bg-indigo-600 text-white px-6 md:px-5 py-1"
      default:
        return
      }
    },
    hubTypeStyle (hubType) {
      switch (hubType) {
      case "Type 1":
        return "bg-red-500 text-white px-4 py-1"
      case "Type 2":
        return "bg-purple-500 text-white px-4 py-1"
      default:
        return ""
      }
    },
  },
  // get coordinates based on postcode
}
</script>
