<template>
  <div class="modal-container shadow-lg">
    <div class="flex flex-col p-4 md:p-8">
      <nuxt-link
        :to="{ name: 'my-practice-private-practice', query: { ...$route.query }}"
        class="cursor-pointer"
      >
        <svgicon name="left-arrow" height="32" width="32" />
      </nuxt-link>

      <div class="flex flex-row p-2 flex-no-wrap justify-start items-center">
        <span class="font-bold text-md sm:text-lg">{{practice.surgery.name}}</span>
      </div>

      <div class="flex flex-row flex-wrap justify-start">
        <div class="w-full md:w-1/3 p-2">
          <div class="flex flex-col p-4 shadow-lg rounded-lg">
            <div class="font-bold text-md md:text-lg">Contact Number</div>
            <div class="text-sm md:text-md m-2">{{practice.phone_number}}</div>
            <div class="font-bold text-md md:text-lg">Practice Code</div>
            <div class="text-sm md:text-md m-2">{{practice.surgery.code}}</div>
            <div class="font-bold text-md md:text-lg">Clinical Commissioning Group</div>
            <div class="text-sm md:text-md m-2">{{practice.clinical_commissioning_group_name}}</div>
            <div class="font-bold text-md md:text-lg">Address</div>
            <div class="m-2">
              <div class="text-sm md:text-md">{{practice.address_line_1}}</div>
              <div class="text-sm md:text-md">{{practice.address_line_2}}</div>
              <div class="text-sm md:text-md">{{practice.address_line_3}}</div>
            </div>
          </div>
          <div class="flex justify-start mt-5 font-bold text-lg" v-if="!practice.hasActiveJob">
            <div
              @click.stop.prevent="delete_modal = true"
              class="bg-red-500 px-2 py-1 rounded-lg shadow-lg text-white fond-bold cursor-pointer hover:bg-red-600 mb-2"
            >Delete</div>
          </div>
        </div>
        <div class="w-full md:w-2/3 p-2">
          <div class="flex flex-col p-4 shadow-lg rounded-lg">
            <div class="font-bold text-md md:text-lg mb-2">Location</div>
            <div>
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
    <AppConfirmationModal
      :label="'Proceed to delete this private practice?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="delete_modal"
      @confirm="removePractice"
      @cancel="delete_modal = false"
    />
  </div>
</template>
<script>
import { gmapApi } from "vue2-google-maps";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  components: {
    AppConfirmationModal
  },
  data() {
    return {
      delete_modal: false
    };
  },
  computed: {
    google: gmapApi,
    latLang() {
      return { x: this.practice.coordinate_x, y: this.practice.coordinate_y };
    }
  },
  async asyncData({ app, params, error }) {
    try {
      let response = await app.$axios.$get(
        `/api/v1/locum/private-practices/${params.practiceId}`
      );

      let practice =
        response.data && response.data.private_practice
          ? response.data.private_practice
          : null;

      response = await app.$axios.$get(`/api/v1/locum/jobs`, {
        params: {
          type: ["Private"],
          private_practice_id: [practice.id]
        }
      });

      if (response.data.jobs && response.data.jobs.length > 0) {
        practice = {
          ...practice,
          hasActiveJob: true
        };
      }

      return {
        practice
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    removePractice() {
      this.$axios
        .$delete(`/api/v1/locum/private-practices/${this.practice.id}`)
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          this.$emit("removePractice", this.practice.id);
          this.$router.push("/my-practice/private-practice");
        })
        .catch(err => {
          console.log("err", err.response || err);
        })
        .finally(() => {
          this.delete_modal = false;
        });
    }
  }
};
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>