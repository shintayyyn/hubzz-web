<template>
	<div class="shadow-lg max-w-xl p-4 md:p-8 my-4 md:my-8 rounded-lg">
		<div class="flex justify-between md:justify-start items-center pb-4">
			<div
				class="font-bold leading-none text-md sm:text-lg mr-2"
			>{{ practice_surgery.child_practice.surgery.name }}</div>
			<div
				class="text-sm sm:text-sm text-gray-700 font-bold md:mr-2"
			>{{ practice_surgery.child_practice.surgery.code }}</div>
			<div
				class="justify-center text-black text-sm font-semibold py-2 p-3 rounded-lg"
				:class="statusStyle(checkStatus(practice_surgery))"
			>{{checkStatus(practice_surgery)}}</div>
		</div>
		<div class="flex flex-col">
			<!--------------PAY FOR SURGERY-------------->
			<div class="flex items-center">
				<div class="text-lg text-black font-semibold mr-4">Permissions</div>
				<div
					@click="togglePermissions()"
					class="text-sm font-semibold text-black px-4 py-2 rounded-lg cursor-pointer"
					:class="`${editPayForSurgery == false ? 'text-black bg-yellow-500 hover:bg-yellow-400' : 'text-white bg-red-500 hover:bg-red-600'}`"
				>{{ editPayForSurgery == false ? "Edit" : "Cancel Editing" }}</div>
			</div>
			<div v-if="editPayForSurgery === false" class>
				<div class="m-2 my-4">
					<div class="flex items-center py-1">
						<span class="mr-3 md:mx-2">
							<svgicon
								:name="practice_surgery.allow_surgery_create_sessions === true ? 'success-checkmark' : 'times-solid'"
								class="fill-current w-5 h-5"
								:class="practice_surgery.allow_surgery_create_sessions ? 'text-green-500' : 'text-red-500 border-2 border-red-500 rounded-full p-1'"
							/>
						</span>
						<div class="font-semibold">Is this Spoke allowed to Create Jobs?</div>
					</div>
					<div
						class="bg-gray-300 p-2 rounded-lg mb-2"
						v-if="practice_surgery.allow_surgery_create_sessions === true"
					>
						<p
							class="font-semibold pb-2 leading-tight px-4 py-2"
						>Rate Limits(Only effective when allowed to create jobs)</p>
						<div class="text-sm md:mx-4">
							<div class="flex flex-col md:flex-row">
								<p class="font-semibold md:w-2/3">Maximum Hourly Rate Limit</p>
								<p
									class="text-sm mx-2 md:mx-0"
								>{{practice_surgery.max_hourly_rate_limit ?'£ '+ practice_surgery.max_hourly_rate_limit : 'N/A'}}</p>
							</div>

							<div class="flex flex-col md:flex-row">
								<p class="font-semibold md:w-2/3">Maximum Half Day Rate Limit</p>
								<p
									class="text-sm mx-2 md:mx-0"
								>{{practice_surgery.max_halfday_rate_limit ?'£ '+ practice_surgery.max_halfday_rate_limit : 'N/A'}}</p>
							</div>

							<div class="flex flex-col md:flex-row">
								<p class="font-semibold md:w-2/3">Maximum Whole Day Rate Limit</p>
								<p
									class="text-sm mx-2 md:mx-0"
								>{{practice_surgery.max_wholeday_rate_limit ?'£ '+ practice_surgery.max_wholeday_rate_limit : 'N/A'}}</p>
							</div>

							<div class="flex flex-col md:flex-row">
								<p class="font-semibold md:w-2/3">Maximum Out-of-Hours Rate Limit</p>
								<p
									class="text-sm mx-2 md:mx-0"
								>{{practice_surgery.max_ooh_rate_limit ?'£ '+ practice_surgery.max_ooh_rate_limit : 'N/A'}}</p>
							</div>

							<div class="flex flex-col md:flex-row">
								<p class="font-semibold md:w-2/3">Maximum Excess Hours</p>
								<p
									class="text-sm mx-2 md:mx-0"
								>{{practice_surgery.max_excess_hours ?'£ '+ practice_surgery.max_excess_hours : 'N/A'}}</p>
							</div>
						</div>
					</div>

					<div class="flex items-center py-1">
						<span class="mr-3 md:mx-2">
							<svgicon
								:name="practice_surgery.allow_surgery_bill_locum === true ? 'success-checkmark' : 'times-solid'"
								class="fill-current w-5 h-5"
								:class="practice_surgery.allow_surgery_bill_locum ? 'text-green-500' : 'text-red-500 border-2 border-red-500 rounded-full p-1'"
							/>
						</span>
						<p class="font-semibold">Is this Spoke allowed to bill of Locums?</p>
					</div>

					<div class="flex items-center py-1">
						<span class="mr-3 md:mx-2">
							<svgicon
								:name="practice_surgery.allow_surgery_bill_hubzz === true ? 'success-checkmark' : 'times-solid'"
								class="fill-current w-5 h-5"
								:class="practice_surgery.allow_surgery_bill_hubzz ? 'text-green-500' : 'text-red-500 border-2 border-red-500 rounded-full p-1'"
							/>
						</span>
						<p class="font-semibold">Is this Spoke allowed to bill of HUBZZ?</p>
					</div>

					<div class="flex items-center py-1">
						<span class="mr-3 md:mx-2">
							<svgicon
								:name="practice_surgery.share_banks_to_other_surgeries === true ? 'success-checkmark' : 'times-solid'"
								class="fill-current w-5 h-5"
								:class="practice_surgery.share_banks_to_other_surgeries ? 'text-green-500' : 'text-red-500 border-2 border-red-500 rounded-full p-1'"
							/>
						</span>
						<p class="font-semibold">Is this Spoke's Banks shared to other Spokes?</p>
					</div>
				</div>
			</div>
			<!--------------EDIT PERMISSIONS------------------>
			<div v-if="editPayForSurgery === true" class="mb-2">
				<div class="flex flex-col flex-wrap justify-between">
					<div class="w-full p-1">
						<AppInput
							v-model="form.allow_surgery_create_sessions"
							:type="'select'"
							:name="'allow_surgery_create_sessions'"
							:label="'Allow Spoke to Create Jobs/Sessions?'"
							:error="formError.find(item => item.field === 'allow_surgery_create_sessions')"
							:items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
						/>
					</div>
					<!-- SET MAX RATES ;  NOT REQUIRED -->
					<div
						class="p-2 mx-2 bg-gray-300 rounded-lg"
						v-if="surgeryCreateSessions == true || surgeryCreateSessions == 'true'"
					>
						<div class="w-full p-1">
							<AppInput
								v-model="form.max_hourly_rate_limit"
								:type="'number'"
								:name="'max_hourly_rate_limit'"
								:label="'Set max hourly rate limit for Spoke'"
								:error="formError.find(item => item.field === 'max_hourly_rate_limit')"
								:inStyle="'text-align:right'"
							/>
						</div>
						<div class="w-full p-1">
							<AppInput
								v-model="form.max_halfday_rate_limit"
								:type="'number'"
								:name="'max_halfday_rate_limit'"
								:label="'Set max half day rate limit for Spoke'"
								:error="formError.find(item => item.field === 'max_halfday_rate_limit')"
								:inStyle="'text-align:right'"
							/>
						</div>
						<div class="w-full p-1">
							<AppInput
								v-model="form.max_wholeday_rate_limit"
								:type="'number'"
								:name="'max_wholeday_rate_limit'"
								:label="'Set max whole day rate limit for Spoke'"
								:error="formError.find(item => item.field === 'max_wholeday_rate_limit')"
								:inStyle="'text-align:right'"
							/>
						</div>
						<div class="w-full p-1">
							<AppInput
								v-model="form.max_ooh_rate_limit"
								:type="'number'"
								:name="'max_ooh_rate_limit'"
								:label="'Set max out-of-hours rate limit for Spoke'"
								:error="formError.find(item => item.field === 'max_ooh_rate_limit')"
								:inStyle="'text-align:right'"
							/>
						</div>
						<div class="w-full p-1">
							<AppInput
								v-model="form.max_excess_hours"
								:type="'number'"
								:name="'max_excess_hours'"
								:label="'Set max excess hours rate limit for Spoke'"
								:error="formError.find(item => item.field === 'max_excess_hours')"
								:inStyle="'text-align:right'"
							/>
						</div>
					</div>
					<!-- SET MAX RATES END HERE -->
					<div class="w-full p-1">
						<AppInput
							v-model="form.allow_surgery_bill_locum"
							:type="'select'"
							:name="'allow_surgery_bill_locum'"
							:label="'Allow Spoke to handle its own billing for Locum?'"
							:error="formError.find(item => item.field === 'allow_surgery_bill_locum')"
							:items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
						/>
					</div>
					<div class="w-full p-1">
						<AppInput
							v-model="form.allow_surgery_bill_hubzz"
							:type="'select'"
							:name="'allow_surgery_bill_hubzz'"
							:label="'Allow Spoke to handle its own billing for HUBZZ?'"
							:error="formError.find(item => item.field === 'allow_surgery_bill_hubzz')"
							:items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
						/>
					</div>
					<div class="w-full p-1">
						<AppInput
							v-model="form.share_banks_to_other_surgeries"
							:type="'select'"
							:name="'share_banks_to_other_surgeries'"
							:label="'Share Banks to Other Surgeries'"
							:error="formError.find(item => item.field === 'share_banks_to_other_surgeries')"
							:items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
						/>
					</div>
				</div>
				<div class="flex flex-row justify-start">
					<AppButton :label="'Save'" @click="save" :inStyle="'padding:5px 16px'" />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
export default {
	transition: {
		name: "fade",
		mode: "out-in"
	},
	components: {
		AppButton,
		AppInput
	},
	data() {
		return {
			practice_id: "",
			editPayForSurgery: false,
			editSessionPolicies: false,
			editBillingPolicies: false,
			surgeryCreateSessions: false,
			form: {
				allow_surgery_create_sessions: false,
				max_hourly_rate_limit: "",
				max_halfday_rate_limit: "",
				max_wholeday_rate_limit: "",
				max_ooh_rate_limit: "",
				max_excess_hours: "",
				allow_surgery_bill_locum: "",
				allow_surgery_bill_hubzz: "",
				share_banks_to_other_surgeries: ""
			},
			formError: []
		};
	},
	// computed: {
	// 	surgeryCreateSessions: function() {
	// 		return this.form.allow_surgery_create_sessions;
	// 	}
	// },
	async asyncData({ app, route, store, params, error }) {
		try {
			const practice_id = params.id;
			const response = await app.$axios.$get(
				`/api/v1/practice/me/practice-surgeries/${params.id}`
			);
			const practice_surgery =
				response.data && response.data.practice_surgery
					? response.data.practice_surgery
					: null;
			return {
				practice_surgery,
				practice_id
			};
		} catch (err) {
			throw err;
		}
	},
	created() {
		this.form.allow_surgery_create_sessions = this.practice_surgery.allow_surgery_create_sessions;
		this.form.max_hourly_rate_limit = this.practice_surgery.max_hourly_rate_limit;
		this.form.max_halfday_rate_limit = this.practice_surgery.max_halfday_rate_limit;
		this.form.max_wholeday_rate_limit = this.practice_surgery.max_wholeday_rate_limit;
		this.form.max_ooh_rate_limit = this.practice_surgery.max_ooh_rate_limit;
		this.form.max_excess_hours = this.practice_surgery.max_excess_hours;
		this.form.allow_surgery_bill_locum = this.practice_surgery.allow_surgery_bill_locum;
		this.form.allow_surgery_bill_hubzz = this.practice_surgery.allow_surgery_bill_hubzz;
		this.form.share_banks_to_other_surgeries = this.practice_surgery.share_banks_to_other_surgeries;
		this.surgeryCreateSessions = this.practice_surgery.allow_surgery_create_sessions;
	},
	watch: {
		"form.allow_surgery_create_sessions"(value) {
			this.surgeryCreateSessions = value;
			console.log(
				"allow_surgery_create_sessions?",
				this.surgeryCreateSessions,
				value
			);
		},
		editPayForSurgery(value) {
			console.log(
				"allow_surgery_create_sessions?",
				this.practice_surgery.allow_surgery_create_sessions
			);
		}
	},
	methods: {
		togglePermissions() {
			this.editPayForSurgery = !this.editPayForSurgery;
			if (this.editPayForSurgery) {
				this.form.allow_surgery_create_sessions = this.practice_surgery.allow_surgery_create_sessions;
			}
		},
		save() {
			this.$axios
				.$put(
					`/api/v1/practice/me/practice-surgeries/${this.$route.params.id}`,
					this.form
				)
				.then(res => {
					this.$emit("updateSurgery", res.data.practice_surgery);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: ["Surgery Update Success"]
					});
					this.$router.push("/surgery-management/practice-spokes");
				});
		},
		statusStyle(status) {
			switch (status) {
				case "Active":
					return "bg-green-500 text-white";
					break;
				case "Rejected":
					return "bg-gray-500 text-gray-700";
					break;
				case "Termination Requested":
					return "bg-orange-500 text-white";
					break;
				case "Terminated":
					return "bg-red-800 text-red-400";
					break;
				default:
					return "bg-yellow-400 text-black";
			}
		},
		checkStatus(invitation) {
			let result = "Invited";
			if (invitation.invitation_accepted_at) {
				result = "Active";
			}

			if (invitation.invitation_rejected_at) {
				result = "Rejected";
			}

			if (invitation.termination_requested_at) {
				if (invitation.invitation_accepted_at) {
					result = "Termination Requested";
				} else {
					result = "Cancellation Requested";
				}
			}

			if (invitation.terminated_at) {
				result = "Terminated";
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
		width: 70%;
	}
}
</style>
