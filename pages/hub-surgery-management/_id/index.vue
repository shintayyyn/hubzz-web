<template>
	<div v-if="practice_surgery && practice_surgery.child_practice" class="w-full">
		<div class="flex flex-wrap items-center mt-2">
			<div class="flex items-center">
				<div
					class="font-bold leading-none text-md sm:text-lg mr-2"
				>{{ practice_surgery.child_practice_name }}</div>
				<div
					class="text-sm sm:text-sm text-gray-700 font-bold mr-2"
				>{{ practice_surgery.child_practice_code }}</div>
			</div>
			<div class="flex items-center">
				<div
					class="justify-center text-black text-sm font-semibold py-2 p-3 mr-2 rounded-lg"
					:class="typeStyle(practice_surgery.child_practice_type)"
				>{{ practice_surgery.child_practice_type }}</div>
				<div
					class="justify-center text-black text-sm font-semibold py-2 p-3 mr-2 rounded-lg"
					:class="statusStyle(checkStatus(practice_surgery))"
				>{{ checkStatus(practice_surgery) }}</div>
			</div>
		</div>
		<div class="flex flex-col md:flex-row justify-start items-start w-full">
			<div class="flex flex-col w-full md:w-1/2 shadow-lg p-4 md:p-8 my-2 md:my-0 md:mx-1 rounded-lg">
				<p class="font-semibold">CCG</p>
				<p class="mx-2 leading-tight mb-2">
					{{ practice_surgery && practice_surgery. child_practice_clinical_commissioning_group_name ?
					practice_surgery.child_practice_clinical_commissioning_group_name :
					'N/A' }}
				</p>
				<p class="font-semibold">Contact Number</p>
				<p
					class="mx-2 leading-tight mb-2"
				>{{ practice_surgery && practice_surgery.child_practice_phone_number ? practice_surgery.child_practice_phone_number : 'N/A' }}</p>
				<div class="font-semibold">Address</div>
				<div class="mx-2 leading-tight mb-2">
					<div>{{ practice_surgery.child_practice && practice_surgery.child_practice_address_line_1 ? practice_surgery.child_practice_address_line_1: null }}</div>
					<div>{{ practice_surgery.child_practice && practice_surgery.child_practice_address_line_2 ? practice_surgery.child_practice_address_line_2: null }}</div>
					<div>{{ practice_surgery.child_practice && practice_surgery.child_practice_address_line_3 ? practice_surgery.child_practice_address_line_3: null }}</div>
					<div>{{ practice_surgery.child_practice && practice_surgery.child_practice_address_line_4 ? practice_surgery.child_practice_address_line_4: null }}</div>
					<div>{{ practice_surgery.child_practice && practice_surgery.child_practice_address_line_5 ? practice_surgery.child_practice_address_line_5: null }}</div>
				</div>

				<p class="font-semibold">Report To</p>
				<p
					class="mx-2 leading-tight mb-2"
				>{{ practice_surgery.child_practice.report_to ? practice_surgery.child_practice.report_to : 'N/A' }}</p>

				<p class="font-semibold">Email Address</p>
				<p
					class="mx-2 leading-tight mb-2"
				>{{ practice_surgery.child_practice.email ? practice_surgery.child_practice.email : 'N/A' }}</p>

				<p class="font-semibold">Practice Types</p>
				<div class="flex flex-wrap">
					<template
						v-if="practice_surgery && practice_surgery.child_practice && practice_surgery.child_practice.practice_types && practice_surgery.child_practice.practice_types.length"
					>
						<p
							v-for="practiceType in practice_surgery.child_practice.practice_types"
							:key="practiceType.id + '-name'"
							class="m-1 rounded-lg text-sm text-black px-2 py-1 bg-yellow-500"
						>{{ practiceType ? practiceType.name: null }}</p>
					</template>
					<p v-else class="mx-2 leading-tight mb-2">Not set</p>
				</div>
			</div>
			<div class="flex flex-col w-full md:w-1/2 shadow-lg p-4 md:p-8 my-2 md:my-0 md:mx-1 rounded-lg">
				<!--------------PAY FOR SURGERY-------------->
				<div class="flex items-center">
					<div class="text-lg text-black font-semibold mr-4">Permissions</div>
					<div
						v-if="authPermissions.includes('Permission Processes Surgery Management')"
						class="text-sm font-semibold text-black px-4 py-2 rounded-lg cursor-pointer"
						:class="`${editPayForSurgery == false ? 'text-black bg-yellow-500 hover:bg-yellow-400' : 'text-white bg-red-500 hover:bg-red-600'}`"
						@click="togglePermissions()"
					>{{ editPayForSurgery == false ? "Edit" : "Cancel Editing" }}</div>
				</div>
				<template v-if="editPayForSurgery === false">
					<div class="flex items-center py-1">
						<span class="mr-3 md:mx-2">
							<svgicon
								:name="practice_surgery.allow_surgery_create_sessions === true ? 'success-checkmark' : 'times-solid'"
								class="fill-current w-5 h-5"
								:class="practice_surgery.allow_surgery_create_sessions === true ? 'text-green-500' : 'text-red-500 border-2 border-red-500 rounded-full p-1'"
							/>
						</span>
						<div class="font-semibold">Is this Spoke allowed to Create Jobs?</div>
					</div>
					<div
						v-if="practice_surgery.allow_surgery_create_sessions === true"
						class="bg-gray-300 p-2 rounded-lg mt-1"
					>
						<p
							class="font-semibold pb-2 leading-tight md:px-4 py-2"
						>Rate Limits(Only effective when allowed to create jobs)</p>
						<div class="text-sm md:mx-4">
							<div class="flex flex-col md:flex-row">
								<p class="font-semibold md:w-2/3">Maximum Hourly Rate Limit</p>
								<p
									class="text-sm mx-2 md:mx-0"
								>{{ practice_surgery.max_hourly_rate_limit ?'£ '+ practice_surgery.max_hourly_rate_limit : 'N/A' }}</p>
							</div>

							<div class="flex flex-col md:flex-row">
								<p class="font-semibold md:w-2/3">Maximum Half Day Rate Limit</p>
								<p
									class="text-sm mx-2 md:mx-0"
								>{{ practice_surgery.max_halfday_rate_limit ?'£ '+ practice_surgery.max_halfday_rate_limit : 'N/A' }}</p>
							</div>

							<div class="flex flex-col md:flex-row">
								<p class="font-semibold md:w-2/3">Maximum Whole Day Rate Limit</p>
								<p
									class="text-sm mx-2 md:mx-0"
								>{{ practice_surgery.max_wholeday_rate_limit ?'£ '+ practice_surgery.max_wholeday_rate_limit : 'N/A' }}</p>
							</div>

							<div class="flex flex-col md:flex-row">
								<p class="font-semibold md:w-2/3">Maximum Out-of-Hours Rate Limit</p>
								<p
									class="text-sm mx-2 md:mx-0"
								>{{ practice_surgery.max_ooh_rate_limit ?'£ '+ practice_surgery.max_ooh_rate_limit : 'N/A' }}</p>
							</div>

							<div class="flex flex-col md:flex-row">
								<p class="font-semibold md:w-2/3">Maximum Excess Hours</p>
								<p
									class="text-sm mx-2 md:mx-0"
								>{{ practice_surgery.max_excess_hours ? practice_surgery.max_excess_hours +' Hours' : 'N/A' }}</p>
							</div>
						</div>
					</div>

					<div class="flex items-center py-1">
						<span class="mr-3 md:mx-2">
							<svgicon
								:name="practice_surgery.allow_surgery_create_permanent_jobs === true ? 'success-checkmark' : 'times-solid'"
								class="fill-current w-5 h-5"
								:class="practice_surgery.allow_surgery_create_permanent_jobs ? 'text-green-500' : 'text-red-500 border-2 border-red-500 rounded-full p-1'"
							/>
						</span>
						<p class="font-semibold">Is this Spoke allowed to create permanent jobs?</p>
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
						<p class="font-semibold">Does Hub permit billing for Hubzz?</p>
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
					<div class="flex items-center py-1">
						<span class="mr-3 md:mx-2">
							<svgicon
								:name="practice_surgery.share_my_banks === true ? 'success-checkmark' : 'times-solid'"
								class="fill-current w-5 h-5"
								:class="practice_surgery.share_my_banks ? 'text-green-500' : 'text-red-500 border-2 border-red-500 rounded-full p-1'"
							/>
						</span>
						<p class="font-semibold">Is My Banks shared to this Surgery?</p>
					</div>
				</template>
				<!--------------EDIT PERMISSIONS------------------>
				<template v-if="editPayForSurgery === true">
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
							v-if="surgeryCreateSessions == true || surgeryCreateSessions == 'true'"
							class="p-2 mx-2 bg-gray-300 rounded-lg"
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
								v-model="form.allow_surgery_create_permanent_jobs"
								:type="'select'"
								:name="'allow_surgery_create_permanent_jobs'"
								:label="'Allow Spoke to Create Permanent Jobs?'"
								:error="formError.find(item => item.field === 'allow_surgery_create_permanent_jobs')"
								:items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
							/>
						</div>
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
						<div class="w-full p-1">
							<AppInput
								v-model="form.share_my_banks"
								:type="'select'"
								:name="'share_my_banks'"
								:label="'Share My Banks'"
								:error="formError.find(item => item.field === 'share_my_banks')"
								:items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
							/>
						</div>
					</div>
					<div class="flex flex-row justify-start">
						<AppButton :label="'Save'" :inStyle="'padding:5px 16px'" @click="save" />
					</div>
				</template>
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
				share_banks_to_other_surgeries: "",
				share_my_banks: ""
			},
			formError: [],
			practice_surgery: []
		};
	},

	computed: {
		authPermissions() {
			return this.$store.getters["permissions"];
		}
	},

	watch: {
		"form.allow_surgery_create_sessions"(value) {
			this.surgeryCreateSessions = value;
		}
	},

	created() {
		this.practice_id = this.$route.params.id;
		this.getSurgery();
		this.form.allow_surgery_create_sessions = this.practice_surgery.allow_surgery_create_sessions;
		this.form.max_hourly_rate_limit = this.practice_surgery.max_hourly_rate_limit;
		this.form.max_halfday_rate_limit = this.practice_surgery.max_halfday_rate_limit;
		this.form.max_wholeday_rate_limit = this.practice_surgery.max_wholeday_rate_limit;
		this.form.max_ooh_rate_limit = this.practice_surgery.max_ooh_rate_limit;
		this.form.max_excess_hours = this.practice_surgery.max_excess_hours;
		this.form.allow_surgery_create_permanent_jobs = this.practice_surgery.allow_surgery_create_permanent_jobs;
		this.form.allow_surgery_bill_locum = this.practice_surgery.allow_surgery_bill_locum;
		this.form.allow_surgery_bill_hubzz = this.practice_surgery.allow_surgery_bill_hubzz;
		this.form.share_banks_to_other_surgeries = this.practice_surgery.share_banks_to_other_surgeries;
		this.form.share_my_banks = this.practice_surgery.share_my_banks;
		this.surgeryCreateSessions = this.practice_surgery.allow_surgery_create_sessions;
	},

	methods: {
		togglePermissions() {
			this.editPayForSurgery = !this.editPayForSurgery;
			if (this.editPayForSurgery) {
				this.form.allow_surgery_create_sessions = this.practice_surgery.allow_surgery_create_sessions;
				this.form.max_hourly_rate_limit = this.practice_surgery.max_hourly_rate_limit;
				this.form.max_halfday_rate_limit = this.practice_surgery.max_halfday_rate_limit;
				this.form.max_wholeday_rate_limit = this.practice_surgery.max_wholeday_rate_limit;
				this.form.max_ooh_rate_limit = this.practice_surgery.max_ooh_rate_limit;
				this.form.max_excess_hours = this.practice_surgery.max_excess_hours;
				this.form.allow_surgery_create_permanent_jobs = this.practice_surgery.allow_surgery_create_permanent_jobs;
				this.form.allow_surgery_bill_locum = this.practice_surgery.allow_surgery_bill_locum;
				this.form.allow_surgery_bill_hubzz = this.practice_surgery.allow_surgery_bill_hubzz;
				this.form.share_banks_to_other_surgeries = this.practice_surgery.share_banks_to_other_surgeries;
				this.form.share_my_banks = this.practice_surgery.share_my_banks;
				this.surgeryCreateSessions = this.practice_surgery.allow_surgery_create_sessions;
			}
		},
		getSurgery() {
			this.$axios
				.get(`/api/v1/practice/me/practice-surgeries/${this.practice_id}`)
				.then(res => {
					this.practice_surgery = res.data.data.practice_surgery;
					console.log("practice_surgery", this.practice_surgery);
				});
		},
		save() {
			this.form.share_my_banks = [true, "true"].includes(
				this.form.share_my_banks
			)
				? true
				: false;
			this.$axios
				.$put(
					`/api/v1/practice/me/practice-surgeries/${this.$route.params.id}`,
					this.form
				)
				.then(res => {
					console.log(res);
					this.$emit("updateSurgery", res.data.practice_surgery);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: ["Surgery Update Success"]
					});
					//   this.$router.push(`/hub-surgery-management/${this.$route.params.id}`);
					this.getSurgery();
					this.editPayForSurgery = false;
				});
		},
		statusStyle(status) {
			switch (status) {
				case "Active":
					return "bg-green-500 text-white";
				case "Rejected":
					return "bg-gray-500 text-gray-700";
				case "Termination Requested":
					return "bg-orange-500 text-white";
				case "Terminated":
					return "bg-red-800 text-red-400";
				default:
					return "bg-yellow-400 text-black";
			}
		},
		typeStyle(type) {
			switch (type) {
				case "Spoke":
					return "bg-blue-500 text-white";
				case "Stand Alone":
					return "bg-indigo-600 text-white";
				case "Hub":
					return "bg-red-500 text-white";
				default:
					return "text-black";
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
