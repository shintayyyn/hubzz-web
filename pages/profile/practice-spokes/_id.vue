<template>
	<div class="modal-container shadow-lg">
		<div class="p-4 md:p-8 w-full">
			<div
				@click="$router.push('/profile/practice-spokes')"
				class="mb-2 cursor-pointer"
			>
				<svgicon name="left-arrow" height="32" width="32" />
			</div>
			<div class="flex overflow-x-auto">
				<nuxt-link
					:to="`/profile/practice-spokes/${practice_id}`"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
					:class="
						$route.name === 'profile-practice-spokes-id'
							? 'border rounded-lg border-yellow-500 bg-yellow-500'
							: 'text-gray-600'
					"
					>Profile</nuxt-link
				>
				<nuxt-link
					v-if="relationshipIsActive == 'Active'"
					:to="`/profile/practice-spokes/${practice_id}/surgery-sessions`"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
					:class="
						$route.name.includes(
							'profile-practice-spokes-id-surgery-sessions'
						) || $route.name === 'profile-practice-spokes-create'
							? 'border rounded-lg border-yellow-500 bg-yellow-500'
							: 'text-gray-600'
					"
					>Surgery Sessions</nuxt-link
				>
				<nuxt-link
					v-if="relationshipIsActive == 'Active'"
					:to="`/profile/practice-spokes/${practice_id}/surgery-billings`"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
					:class="
						$route.name.includes('profile-practice-spokes-id-surgery-billings')
							? 'border rounded-lg border-yellow-500 bg-yellow-500'
							: 'text-gray-600'
					"
					>Surgery Billing</nuxt-link
				>
				<nuxt-link
					:to="
						`/profile/practice-spokes/${practice_id}/request-for-termination`
					"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
					:class="
						$route.name.includes(
							'profile-practice-spokes-id-request-for-termination'
						)
							? 'border rounded-lg border-yellow-500 bg-yellow-500'
							: 'text-gray-600'
					"
					>{{
						relationshipIsActive == "Active"
							? "Request for Termination"
							: "Cancel Invitation"
					}}</nuxt-link
				>
			</div>
			<nuxt-child />
		</div>
	</div>
</template>

<script>
import AppButton from "@/components/Base/AppButton";
export default {
	components: {
		AppButton
	},
	data() {
		return {
			practice_id: "",
			practice_surgery: ""
		};
	},
	async asyncData({ app, route, store, params, error }) {
		try {
			const practice_id = params.id;
			const response = await app.$axios.$get(
				`/api/v1/practice/me/practice-surgeries/${params.id}`
			);
			const practice_surgery = response.data.practice_surgery;
			return {
				practice_id,
				practice_surgery
			};
		} catch (err) {
			throw err;
		}
	},
	computed: {
		relationshipIsActive: function() {
			let result = "";
			if (this.practice_surgery.invitation_accepted_at) {
				result = "Active";
			}

			if (
				this.practice_surgery.invitation_rejected_at ||
				this.practice_surgery.termination_requested_at ||
				this.practice_surgery.terminated_at
			) {
				result = "Inactive";
			}
			return result;
		}
	},
	methods: {
		activeRelationship() {
			let result = "";
			console.log("isActive?", this.practice_surgery);
			if (this.practice_surgery.invitation_accepted_at) {
				result = "Active";
			}

			if (
				this.practice_surgery.invitation_rejected_at ||
				this.practice_surgery.termination_requested_at ||
				this.practice_surgery.terminated_at
			) {
				result = "Inactive";
			}
			return result;
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
