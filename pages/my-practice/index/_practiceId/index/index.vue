<template>
  <section>
    <div class="flex flex-row p-2 flex-no-wrap justify-start items-center mt-8">
      <span class="font-bold text-md sm:text-lg">{{practice.surgery.name}}</span>
      <span
        class="font-bold text-md sm:text-lg mx-4 px-4 py-2 rounded"
        :class="practice.practice_parent ? 'bg-blue-500' : 'bg-red-400'"
      >{{practice.practice_parent ? 'SPOKE': 'HUB'}}</span>
    </div>

    <div class="flex flex-row flex-wrap justify-start">
      <div class="w-full md:w-1/3 p-2">
        <div class="flex flex-col p-4 shadow-lg rounded-lg">
          <div class="font-bold text-md md:text-lg">Contact Number</div>
          <div class="text-sm md:text-md m-2">{{practice.phone_number}}</div>
          <div class="font-bold text-md md:text-lg">Practice Code</div>
          <div class="text-sm md:text-md m-2">{{practice.surgery.code}}</div>
          <div class="font-bold text-md md:text-lg">Practice Types</div>
          <div v-if="practice.practice_types" class="flex flex-row flex-wrap justify-start m-4">
            <div
              class="rounded-lg text-sm md:text-md bg-yellow-500 m-1 p-2"
              v-for="item in practice.practice_types"
              :key="item.id"
            >{{item.name}}</div>
          </div>
          <div class="font-bold text-md md:text-lg">Clinical Commissioning Group</div>
          <div class="text-sm md:text-md m-2">{{practice.surgery.clinical_commissioning_group.name}}</div>
          <div class="font-bold text-md md:text-lg">Address</div>
          <div class="m-2">
            <div class="text-sm md:text-md">{{practice.surgery.address.line_1}}</div>
            <div class="text-sm md:text-md">{{practice.surgery.address.line_2}}</div>
            <div class="text-sm md:text-md">{{practice.surgery.address.line_3}}</div>
          </div>
          <div class="font-bold text-md md:text-lg">Distance from your coordinates</div>
          <div class="text-sm md:text-md m-2">{{practice.distance_in_miles_from_coordinates}} miles</div>
        </div>
      </div>
      <div class="w-full md:w-2/3 p-2">
        <div class="flex flex-col p-4 shadow-lg rounded-lg">
          <div class="font-bold text-md md:text-lg mb-2">Location</div>
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
import { gmapApi } from "vue2-google-maps";
import MyPracticeProfile from "@/components/MyPractice/MyPracticeProfile";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  props: ["practice"],
  components: {
    MyPracticeProfile
  },
  computed: {
    google: gmapApi,
    latLang() {
      return this.practice.surgery.address.coordinates;
    }
  }
};
</script>