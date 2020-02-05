<template>
	<div class="bg-white rounded-lg shadow-lg p-4 md:p-8">
		<div class="relative flex w-full" v-if="!coordinates && loading" style="min-height:80px">
			<AppLoading :loading="loading" spinner />
		</div>
		<div class="flex flex-col" v-if="coordinates && !loading">
			<div class="font-bold text-xs sm:text-sm">Practice</div>
			<div
				class="font-bold text-sm sm:text-md"
			>{{permanent_job ? permanent_job.practice.name : 'Static Surgery Name'}}</div>
			<div
				v-if="permanent_job"
				class="text-sm sm:text-md"
			>{{permanent_job.practice.address_line_1}} {{permanent_job.practice.address_line_2}} {{permanent_job.practice.address_line_3}} {{permanent_job.practice.postcode}}</div>
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
import AppLoading from "@/components/Base/AppLoading";
import { gmapApi } from "vue2-google-maps";
export default {
	props: ["permanent_job"],
	components: {
		AppLoading
	},
	data() {
		return {
			loading: false,
			coordinates: null
		};
	},
	mounted() {
		this.$axios
			.$get(
				`/api/v1/postcode-coordinates?postcode=${this.permanent_job.practice.postcode}`
			)
			.then(res => {
				this.coordinates =
					res.data.postcode_coordinates &&
					res.data.postcode_coordinates.length > 0
						? res.data.postcode_coordinates[0]
						: null;
			})
			.catch(err => {
				console.log("err", err.response || err);
				throw err;
			})
			.finally(() => {
				this.loading = false;
			});
	},
	computed: {
		google: gmapApi,
		latLang() {
			return this.coordinates;
		}
	}
};
</script>