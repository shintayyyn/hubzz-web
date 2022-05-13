<template>
  <div class="">
    <AppBreadcrumbs :links="links" />
    <div class="flex flex-col px-2">
      <!-- <nuxt-link
        :to="{ name: 'my-practice-private-practice', query: { ...$route.query }}"
        class="cursor-pointer"
      >
        <svgicon name="left-arrow" height="32" width="32" />
      </nuxt-link> -->

      <div class="flex flex-row p-2 flex-no-wrap justify-start items-center">
        <span class="font-bold text-md sm:text-lg">{{ practice.surgery.name }}</span>
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
              Clinical Commissioning Group
            </div>

            <div class="text-sm md:text-md m-2">
              {{ practice.clinical_commissioning_group_name }}
            </div>

            <div class="font-bold text-md md:text-lg">
              Address
            </div>

            <div class="m-2">
              <div class="text-sm md:text-md">
                {{ practice.address_line_1 }}
              </div>
              <div class="text-sm md:text-md">
                {{ practice.address_line_2 }}
              </div>
              <div class="text-sm md:text-md">
                {{ practice.address_line_3 }}
              </div>
              <div class="text-sm md:text-md">
                {{ practice.postcode }}
              </div>
            </div>
          </div>

          <div class="flex flex-col p-4 border rounded-lg mt-4">
            <AppInput
              v-model="email"
              type="text"
              label="Email Address"
              placeholder="Enter email address"
              info="For sending private invoice"
            />

            <div class="p-2 w-full flex justify-end">
              <AppButton
                label="Update email"
                :disabled="updatingEmail"
                @click="updateEmail"
              />
            </div>
          </div>

          <div v-if="practice.private_job_count === 0" class="flex justify-start mt-5 font-bold text-lg">
            <!-- <div
              class="bg-red-500 px-2 py-1 rounded-lg shadow-lg text-white fond-bold cursor-pointer hover:bg-red-600 mb-2"
              @click.stop.prevent="delete_modal = true"
            >
              Delete
            </div> -->
            
            <AppButton
              label="Delete"
              :disabled="deletingPrivatePractice"
              customTheme="button bg-red-500 hover:bg-red-600 text-white"
              @click="delete_modal = true"
            />
          </div>
        </div>

        <div class="w-full md:w-2/3 p-2">
          <div class="flex flex-col p-4 border rounded-lg">
            <div class="font-bold text-md md:text-lg mb-2">
              Location
            </div>
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
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs";
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";

export default {
  components: {
    AppConfirmationModal,
    AppBreadcrumbs,
    AppInput,
    AppButton,
  },

  data() {
    return {
      delete_modal: false,
      email: '',
      updatingEmail: false,
      deletingPrivatePractice: false,
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

      const links = [
        {
          title: 'My Practice',
          url: '/my-practice'
        },
        {
          title: 'Private Practice',
          url: '/my-practice/private-practice'
        },
        {
          title: practice.name,
          url: `/my-practice/private-practice/${practice.id}`
        }
      ]

      return {
        practice,
        links,
        email: practice?.email || ''
      };
    } catch (err) {
      throw err;
    }
  },

  methods: {
    updateEmail() {
      this.updatingEmail = true
      this.$axios
        .put(`/api/v1/locum/private-practices/${this.practice.id}`, {
          email: this.email,
        })
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.data.message}`]
          });
        })
        .catch(err => {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            if (err.response.status === 400 && err.response.data.error_messages && err.response.data.error_messages.length > 0) {
              message = err.response.data.error_messages.map(errorMessage => errorMessage.message).join(',')
            } else {
              message = err.response.data.message
            }
          } else if (err.request) {
            message = 'Something went wrong!'
          } else {
            message = err.message
          }
        
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${message}`,],
          })
        })
        .finally(() => {
          this.updatingEmail = false
        });
    },

    removePractice() {
      this.deletingPrivatePractice = true
      this.$axios
        .delete(`/api/v1/locum/private-practices/${this.practice.id}`)
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.data.message}`]
          });
          this.$emit("removePractice", this.practice.id);
          this.$router.push("/my-practice/private-practice");
        })
        .catch(err => {
          console.log('err', err.response || err)

          let message = null

          if (err.response) {
            if (err.response.status === 400 && err.response.data.error_messages && err.response.data.error_messages.length > 0) {
              message = err.response.data.error_messages.map(errorMessage => errorMessage.message).join(',')
            } else {
              message = err.response.data.message
            }
          } else if (err.request) {
            message = 'Something went wrong!'
          } else {
            message = err.message
          }
        
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${message}`,],
          })
        })
        .finally(() => {
          this.deletingPrivatePractice = false
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