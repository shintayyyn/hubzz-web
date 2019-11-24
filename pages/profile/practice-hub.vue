<template>
	<div class="py-2">
		<div v-if="practiceHub" class="flex flex-col md:flex-row md:m-4 my-6">
			<div class="w-full md:w-1/2 pb-2 md:pb-0">
        <p class="text-lg font-semibold">Practice Hub</p>
        <div class="flex flex-col mx-4">
          <div class="flex flex-col md:flex-row w-full mt-2">
            <p class="md:w-1/2 font-semibold">Surgery Name</p>
            <p class="md:w-1/2 mx-4 md:mx-0">{{ practiceHub.name }}</p>
          </div>

          <div class="flex flex-col md:flex-row w-full mt-2">
            <p class="md:w-1/2 font-semibold">Contact Number</p>
            <p class="md:w-1/2 mx-4 md:mx-0">
              {{
                practiceHub.practice.phone_number
                  ? practiceHub.practice.phone_number
                  : "N/A"
              }}
            </p>
          </div>
          <p class="font-semibold mt-2">Report To</p>
          <p class="mx-4">{{practiceHub.practice.report_to ? practiceHub.practice.report_to : 'N/A'}}</p>
        </div>
        <p class="text-lg my-2 font-semibold">Permissions</p>
        <div class="mx-4 m-2">
          <p class="font-semibold">Does Hub allow creation of Jobs/Sessions?</p>
          <p class="text-sm mx-6">{{practiceSpoke.allow_surgery_create_sessions === true ? 'Yes':'No'}}</p>
          <div class="bg-gray-300 p-2 rounded-lg" v-if="practiceSpoke.allow_surgery_create_sessions === true">
            <p class="font-semibold">Rate Limits(Only effective when allowed to create jobs)</p>
            <p class="font-semibold">Maximum Hourly Rate Limit</p>
            <p class="text-sm mx-6">{{practiceSpoke.max_hourly_rate_limit ?'£ '+  practiceSpoke.max_hourly_rate_limit : 'N/A'}}</p>
            <p class="font-semibold">Maximum Half Day Rate Limit</p>
            <p class="text-sm mx-6">{{practiceSpoke.max_halfday_rate_limit ?'£ '+  practiceSpoke.max_halfday_rate_limit : 'N/A'}}</p>
            <p class="font-semibold">Maximum Whole Day Rate Limit</p>
            <p class="text-sm mx-6">{{practiceSpoke.max_wholeday_rate_limit ?'£ '+  practiceSpoke.max_wholeday_rate_limit : 'N/A'}}</p>
            <p class="font-semibold">Maximum Out-of-Hours Rate Limit</p>
            <p class="text-sm mx-6">{{practiceSpoke.max_ooh_rate_limit ?'£ '+  practiceSpoke.max_ooh_rate_limit : 'N/A'}}</p>
            <p class="font-semibold">Maximum Excess Hours</p>
            <p class="text-sm mx-6">{{practiceSpoke.max_ooh_rate_limit ?'£ '+ practiceSpoke.max_ooh_rate_limit : 'N/A'}}</p>
          </div>
          <p class="font-semibold">Does Hub permit billing of Locums?</p>
          <p class="text-sm mx-6">{{practiceSpoke.allow_surgery_bill_locum === true ? 'Yes':'No'}}</p>
          <p class="font-semibold">Does Hub permit billing for HUbzz?</p>
          <p class="text-sm mx-6">{{practiceSpoke.allow_surgery_bill_hubzz === true ? 'Yes':'No'}}</p>
          <p class="font-semibold">Can other Spokes see your Banks?</p>
          <p class="text-sm mx-6">{{practiceSpoke.share_banks_to_other_surgeries === true ? 'Yes':'No'}}</p>
        </div>
    </div>
		</div>

		<div v-if="!practiceHub">
			<AppTable
				v-if="totalInvitations > 0"
				:total="totalInvitations"
				:items="hubInvitations"
				:loading="loading"
				:currentPage="current_page"
				:perPage="params.limit"
				:columns="columns"
				:orderBy="params.order_by"
				:customWidth="700"
				:routerLink="'/profile/practice-hub'"
				@pagechanged="pagechanged"
				@limitchanged="limitchanged"
			/>
			<div v-else class="py-4 text-center text-gray-500">
				No Practice Hub at the moment
			</div>
		</div>

		<div
			class="shield"
			v-if="['profile-practice-hub-invitationId'].includes($route.name)"
			@click="$router.push('/profile/practice-hub')"
		></div>
		<nuxt-child />
	</div>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
export default {
	components: {
		AppTable
	},
	data() {
		return {
			practiceSpoke: "",
			practiceHub: "",
			totalInvitations: 0,
			hubInvitations: [],
			// app table params (no filter for this one)
			current_page: 1,
			loading: false,
			params: {
				offset: 0,
				limit: 5,
				order_by: []
			},
			columns: [
				{
					name: "Hub Surgery",
					dataIndex: "practice.surgery.name",
					class: "text-left",
					sortable: false
				},
				{
					name: "Phone Number",
					dataIndex: "practice.phone_number",
					class: "text-left"
				}
			]
		};
	},

	async asyncData({ app, route, store }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/practice/me/parent-surgery`
			);
			const practiceSpoke = response.data.practice;
			const practiceHub = response.data.practice.parent_surgery;

			console.log("practicehub", practiceHub);

			response = await app.$axios.$get(
				`/api/v1/practice/me/parent-surgery/invitations-count`
			);
			const totalInvitations = response.data.count;
			response = await app.$axios.$get(
				`/api/v1/practice/me/parent-surgery/invitations`
			);
			const hubInvitations = response.data.practice_surgeries;
			// let hubInvitations = []
			// if (response.data && response.data.practice_surgeries) {
			//   response.data.practice_surgeries.forEach(invitation => {
			//     hubInvitations.push(invitation)
			//   })
			// }
			console.log("invitations", hubInvitations);
			return {
				practiceSpoke,
				practiceHub,
				totalInvitations,
				hubInvitations
			};
		} catch (err) {
			throw err;
		}
	},
	methods: {
		// async getHub(){
		//   await this.$axios.$get(`/api/v1/practice/me/parent-surgery`).then(res => {
		//     this.practiceHub =
		//   })
		// },
		getHubInvitations(params) {
			this.loading = true;
			this.$axios
				.$get(`/api/v1/practice/me/parent-surgery/invitations`, { params })
				.then(res => {
					(this.loading = false), (this.hubInvitations = []);
					res.data.practice_surgeries.forEach(invitation => {
						this.hubInvitations.push(invitation);
					});
				})
				.catch(err => {
					console.log(err);
				});
		},
		limitchanged(limit) {
			this.current_page = 1;
			this.params.offset = 0;
			this.params.limit = limit;
			this.getHubInvitations(this.params);
		},
		pagechanged(page) {
			this.current_page = page;
			this.params.offset = this.params.limit * (page - 1);
			this.getHubInvitations(this.params);
		}
	}
};
</script>

<style>
/* .shield {
	z-index: 509;
} */
</style>
