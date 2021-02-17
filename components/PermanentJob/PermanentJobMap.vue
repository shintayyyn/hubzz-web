<template>
  <div class="bg-white rounded-lg border p-4">
    <div class="relative flex w-full" v-if="!coordinates && loading" style="min-height:80px">
      <AppLoading :loading="loading" spinner />
    </div>
    <div class="flex flex-col" v-if="coordinates && !loading">
      <div class="font-bold text-xs sm:text-sm">Practice</div>
      <div
        class="font-bold text-sm sm:text-md"
      >{{permanent_job ? permanent_job.practice_name : 'Static Surgery Name'}}</div>
      <div
        v-if="permanent_job"
        class="text-sm sm:text-md"
      >{{permanent_job.address_line_1}} {{permanent_job.address_line_2}} {{permanent_job.address_line_3}} {{permanent_job.postcode}}</div>
      <div class="mt-4">
        <GmapMap
          :center="{lat:latLang.coordinate_y, lng:latLang.coordinate_x}"
          :zoom="15"
          map-type-id="terrain"
          style="width: 100%; height:300px"
        >
          <GmapMarker
            :position="google && new google.maps.LatLng(latLang.coordinate_y, latLang.coordinate_x)"
          />
        </GmapMap>
      </div>
    </div>
  </div>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading"
import { gmapApi } from "vue2-google-maps"
export default {
	components: {
		AppLoading
	},
	props: {
		permanent_job: {
      type: Object,
      default: () => null,
		}
	},
	data () {
		return {
			loading: false,
			coordinates: null
		}
	},
	computed: {
		google: gmapApi,
		latLang () {
			return this.coordinates
		}
	},
	mounted () {
		this.$axios
			.$get(
				`/api/v1/postcode-coordinates?postcode=${this.permanent_job.practice_postcode}`
			)
			.then(res => {
				this.coordinates =
					res.data.postcode_coordinates &&
					res.data.postcode_coordinates.length > 0
						? res.data.postcode_coordinates[0]
						: null
			})
			.catch(err => {
				console.log("err", err.response || err)
				throw err
			})
			.finally(() => {
				this.loading = false
			})
	}
}
</script>