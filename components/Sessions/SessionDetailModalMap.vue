<template>
	<div class="bg-white rounded-lg shadow-lg p-4 md:p-8 mt-4">
		<div class="relative flex w-full" v-if="!coordinates && loading" style="min-height:80px">
			<AppLoading :loading="loading" spinner />
		</div>
		<div class="flex flex-col" v-if="coordinates && !loading">
			<div class="font-bold text-xs sm:text-sm">Practice</div>
			<div
				class="font-bold text-sm sm:text-md"
			>{{job.platform_job ? job.platform_job.practice.surgery.name :null}}</div>
			<div class="flex items-center flex-wrap">
				<div
					v-for="item in job.practice_types"
					:key="item.id"
					class="mr-2 bg-yellow-500 px-3 py-1 my-1 rounded-lg text-sm sm:text-md"
				>{{ item.name }}</div>
			</div>
			<div
				class="text-sm sm:text-md"
			>{{job.platform_job.practice.surgery.address.line_1}} {{job.platform_job.practice.surgery.address.line_2}} {{job.platform_job.practice.surgery.address.line_3}} {{job.platform_job.practice.surgery.address.post_code}}</div>
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
	props: ["job"],
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
		this.loading = true;
		this.$axios
			.$get(
				`/api/v1/postcode-coordinates?postcode=${this.job.platform_job.practice.postcode}`
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