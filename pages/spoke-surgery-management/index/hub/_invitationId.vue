<template>
	<div class="modal-container shadow-lg p-4 md:p-8">
		<nuxt-link :to="`/spoke-surgery-management`" class="mb-2 cursor-pointer">
			<svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" />
		</nuxt-link>
		<AppConfirmationModal
			:label="'Are you sure you want to accept this invitation?'"
			:confirmLabel="'Yes'"
			:cancelLabel="'Cancel'"
			:modal="confirmAccept"
			@confirm="acceptInvitation()"
			@cancel="confirmAccept = false"
		/>

		<AppConfirmationModal
			:label="'Are you sure you want to reject this invitation?'"
			:confirmLabel="'Yes'"
			:cancelLabel="'Cancel'"
			:modal="confirmReject"
			@confirm="rejectInvitation()"
			@cancel="confirmReject = false"
		/>

		<div class="my-2">
			<div class="text-lg font-semibold">{{ specificPracticeHub.name }}</div>
		</div>

		<div class="flex flex-col md:flex-row">
			<!-- Practice Hub -->
			<div class="w-full md:w-1/2 shadow-lg rounded-lg md:mr-4">
				<div class="p-4">
					<div class="font-semibold mt-2">Contact Number</div>
					<div>
						{{
						specificPracticeHub.phone_number
						? specificPracticeHub.phone_number
						: "N/A"
						}}
					</div>

					<div class="font-semibold mt-2">E-Mail Address</div>
					<div>{{ specificPracticeHub.email ? specificPracticeHub.email : "N/A" }}</div>

					<div class="font-semibold mt-2">Report To</div>
					<div>
						{{
						specificPracticeHub.report_to
						? specificPracticeHub.report_to
						: "N/A"
						}}
					</div>

					<div class="font-semibold mt-2">Address</div>
					<div>
						{{
						specificPracticeHub.address_line_1
						? specificPracticeHub.address_line_1
						: "N/A"
						}}
					</div>
					<div>
						{{
						specificPracticeHub.address_line_2
						? specificPracticeHub.address_line_2
						: "N/A"
						}}
					</div>
					<div>
						{{
						specificPracticeHub.address_line_3
						? specificPracticeHub.address_line_3
						: "N/A"
						}}
					</div>
					<div>
						{{
						specificPracticeHub.postcode
						? specificPracticeHub.postcode
						: "N/A"
						}}
					</div>
				</div>
			</div>

			<!-- Permissions -->
			<div class="w-full md:w-1/2 shadow-lg rounded-lg">
				<div class="p-4">
					<div class="m-2 text-lg font-semibold">Permissions</div>
					<div class="m-2 my-4">
						<div class="font-semibold mt-2">Does Hub allow you to create jobs?</div>
						<div
							class="text-sm mx-6"
						>{{specificInvitation.allow_surgery_create_sessions === true ? 'Yes' : 'No'}}</div>
						<div
							class="bg-gray-300 p-2 rounded-lg mt-1 mb-2"
							v-if="specificInvitation.allow_surgery_create_sessions === true"
						>
							<p class="font-semibold">Rate Limits(Only effective when allowed to create jobs)</p>
							<div class="m-4">
								<p class="font-semibold">Maximum Hourly Rate Limit</p>
								<p
									class="text-sm mx-6"
								>{{specificInvitation.max_hourly_rate_limit ?'£ '+ specificInvitation.max_hourly_rate_limit : 'N/A'}}</p>
								<p class="font-semibold">Maximum Half Day Rate Limit</p>
								<p
									class="text-sm mx-6"
								>{{specificInvitation.max_halfday_rate_limit ?'£ '+ specificInvitation.max_halfday_rate_limit : 'N/A'}}</p>
								<p class="font-semibold">Maximum Whole Day Rate Limit</p>
								<p
									class="text-sm mx-6"
								>{{specificInvitation.max_wholeday_rate_limit ?'£ '+ specificInvitation.max_wholeday_rate_limit : 'N/A'}}</p>
								<p class="font-semibold">Maximum Out-of-Hours Rate Limit</p>
								<p
									class="text-sm mx-6"
								>{{specificInvitation.max_ooh_rate_limit ?'£ '+ specificInvitation.max_ooh_rate_limit : 'N/A'}}</p>
								<p class="font-semibold">Maximum Excess Hours</p>
								<p
									class="text-sm mx-6"
								>{{specificInvitation.max_ooh_rate_limit ?'£ '+ specificInvitation.max_ooh_rate_limit : 'N/A'}}</p>
							</div>
						</div>
						<p class="font-semibold">Does Hub permit billing of Locums?</p>
						<p class="text-sm mx-6">{{specificInvitation.allow_surgery_bill_locum === true ? 'Yes':'No'}}</p>
						<p class="font-semibold">Does Hub permit billing for Hubzz?</p>
						<p class="text-sm mx-6">{{specificInvitation.allow_surgery_bill_hubzz === true ? 'Yes':'No'}}</p>
						<p class="font-semibold">Can other Spokes see your Banks?</p>
						<p
							class="text-sm mx-6"
						>{{specificInvitation.share_banks_to_other_surgeries === true ? 'Yes':'No'}}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Buttons -->
		<div
			v-if="!specificInvitation.invitation_accepted_at && !specificInvitation.invitation_rejected_at"
			class="flex my-6"
		>
			<AppButton
				:label="'Accept'"
				@click="confirmAccept = true"
				:customTheme="'bg-green-500 hover:bg-green-600 text-white font-bold mx-1'"
			/>
			<AppButton
				:label="'Reject'"
				@click="confirmReject = true"
				:customTheme="'bg-red-500 hover:bg-red-600 text-white font-bold mx-1'"
			/>
			<!-- <div
        @click="acceptInvitation()"
        class="flex mr-2 p-4 px-8 cursor-pointer rounded-lg bg-green-500 hover:bg-green-600"
      >
        <div class="text-white font-semibold">Accept</div>
      </div>
      <div
        @click="rejectInvitation()"
        class="flex p-4 px-8 cursor-pointer rounded-lg bg-red-500 hover:bg-red-600"
      >
        <div class="text-white font-semibold">Reject</div>
			</div>-->
		</div>
	</div>
</template>

<script>
import AppButton from "@/components/Base/AppButton";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
	components: {
		AppButton,
		AppConfirmationModal
	},
	validate({ params }) {
		return params.invitationId !== `spoke-siblings`;
	},
	data() {
		return {
			confirmAccept: false,
			confirmReject: false,
			specificInvitation: "",
			specificPracticeHub: ""
		};
	},
	created() {
		console.log("specific invitation", this.specificInvitation);
		console.log("specific hub", this.specificPracticeHub);
	},
	async asyncData({ app, route, store }) {
		let response = await app.$axios.$get(
			`/api/v1/practice/me/parent-surgery/invitations/${route.params.invitationId}`
		);
		const specificInvitation = response.data.practice_surgery;
		const specificPracticeHub = response.data.practice_surgery.practice;
		return {
			specificInvitation,
			specificPracticeHub
		};
	},
	methods: {
		async acceptInvitation() {
			await this.$axios
				.post(`/api/v1/practice/me/parent-surgery/accept`, {
					practice_surgery_id: this.specificInvitation.id
				})
				.then(res => {
					// this.$emit("updateSurgery", res.data.practice_surgery);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: ["Successfully Accepted Practice Spoke Invitation"]
					});
					this.$router.push(`/spoke-surgery-management`);
				})
				.catch(err => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "warning",
						text: "Something went wrong!"
					});
					console.log("error", err);
				});
		},
		async rejectInvitation() {
			await this.$axios
				.put(`/api/v1/practice/me/parent-surgery/reject`, {
					practice_surgery_id: this.specificInvitation.id
				})
				.then(res => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: ["Successfully Rejected Practice Spoke Invitation"]
					});
					this.$router.push(`/spoke-surgery-management`);
				})
				.catch(err => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "warning",
						text: "Something went wrong!"
					});
					console.log("error", err);
				});
		}
	}
};
</script>

<style>
.modal-container {
	z-index: 510;
}
@media screen and (min-width: 1200px) {
	.modal-container {
		width: 70%;
	}
}
</style>
