<template>
	<div class="shadow-lg max-w-xl p-4 md:p-8 my-4 md:my-8 rounded-lg">
		<div class="flex justify-between md:justify-start items-center pb-4">
			<div class="flex flex-col md:flex-row">
				<div class="font-bold leading-none text-md sm:text-lg mr-2">
					{{ practice_surgery.surgery.name }}
				</div>
				<div class="text-sm sm:text-sm text-gray-700 font-bold md:mr-2">
					{{ practice_surgery.surgery.code }}
				</div>
			</div>
			<div
				class="justify-center text-black text-sm font-semibold py-2 p-3 rounded-lg"
				:class="statusStyle(checkStatus(practice_surgery))"
			>
				{{ checkStatus(practice_surgery) }}
			</div>
		</div>
		<div class="flex flex-col">
			<!--------------PAY FOR SURGERY-------------->
			<div class="flex items-center">
				<div class="text-lg text-black font-semibold mr-4">Permissions</div>
				<div
					@click="editPayForSurgery = !editPayForSurgery"
					class="text-sm font-semibold text-black bg-yellow-500 px-4 py-2 rounded-lg cursor-pointer"
					:class="
						`${
							editPayForSurgery == false
								? 'text-black bg-yellow-500'
								: 'text-white bg-green-500'
						}`
					"
				>
					{{ editPayForSurgery == false ? "Edit" : "Done" }}
				</div>
			</div>
			<div v-if="editPayForSurgery === false" class="">
				<div class="text-black font-semibold text-sm">Pay for Surgery</div>
				<div class="text-black m-2">
					{{ practice_surgery.pay_for_surgery === true ? "Yes" : "No" }}
				</div>
				<div class="text-black font-semibold text-sm">Verify job creation</div>
				<div class="text-black m-2">
					{{ practice_surgery.verify_job_creation === true ? "Yes" : "No" }}
				</div>
				<div class="text-black font-semibold text-sm">
					Share Banks to Other Surgeries
				</div>
				<div class="text-black m-2">
					{{
						practice_surgery.share_banks_to_other_surgeries === true
							? "Yes"
							: "No"
					}}
				</div>
				<div class="text-black font-semibold text-sm">
					Create Job Rates Limit
				</div>
				<div class="text-black m-2">
					{{ practice_surgery.create_job_rate_limit }}
				</div>
			</div>
			<!--------------EDIT PAY FOR SURGERY / VERIFY JOB CREATION------------------>
			<div v-if="editPayForSurgery === true" class="mb-2">
				<div class="flex flex-col flex-wrap justify-between">
					<!-- <div class="w-full p-1">
            <AppInput
              v-model="form.pay_for_surgery"
              :type="'select'"
              :name="'pay_for_surgery'"
              :label="'Pay for surgery'"
              :error="formError.find(item => item.field === 'pay_for_surgery')"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
            />
          </div>
          <div class="w-full p-1">
            <AppInput
              v-model="form.verify_job_creation"
              :type="'select'"
              :name="'verify_job_creation'"
              :label="'Verify job creation'"
              :error="formError.find(item => item.field === 'verify_job_creation')"
              :placeholder="'Select...'"
              :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
            />
          </div> -->
					<!--------------EDIT PERMISSIONS----------------->
					<div v-if="editPayForSurgery === true">
						<div class="flex flex-col flex-wrap justify-between">
							<div class="w-full p-1">
								<AppInput
									v-model="form.pay_for_surgery"
									:type="'select'"
									:name="'pay_for_surgery'"
									:label="'Pay for surgery'"
									:error="
										formError.find(item => item.field === 'pay_for_surgery')
									"
									:placeholder="'Select...'"
									:items="[
										{ label: 'Yes', value: true },
										{ label: 'No', value: false }
									]"
								/>
							</div>
							<div class="w-full p-1">
								<AppInput
									v-model="form.verify_job_creation"
									:type="'select'"
									:name="'verify_job_creation'"
									:label="'Verify job creation'"
									:error="
										formError.find(item => item.field === 'verify_job_creation')
									"
									:placeholder="'Select...'"
									:items="[
										{ label: 'Yes', value: true },
										{ label: 'No', value: false }
									]"
								/>
							</div>
							<div class="w-full p-1">
								<AppInput
									v-model="form.share_banks_to_other_surgeries"
									:type="'select'"
									:name="'share_banks_to_other_surgeries'"
									:label="'Share Banks to Other Surgeries'"
									:error="
										formError.find(
											item => item.field === 'share_banks_to_other_surgeries'
										)
									"
									:placeholder="'Select...'"
									:items="[
										{ label: 'Yes', value: true },
										{ label: 'No', value: false }
									]"
								/>
							</div>
							<div class="w-full p-1">
								<AppInput
									v-model="form.create_job_rate_limit"
									:type="'number'"
									:name="'create_job_rate_limit'"
									:label="'Job Rates Limit £'"
									:error="
										formError.find(
											item => item.field === 'create_job_rate_limit'
										)
									"
									@blur="
										CheckEmptyField(
											form.create_job_rate_limit,
											'create_job_rate_limit'
										)
									"
									:inStyle="'text-align:right'"
								/>
							</div>
						</div>
						<div class="flex flex-row justify-start">
							<AppButton
								:label="'Save'"
								@click="save"
								:inStyle="'padding:5px 16px'"
							/>
						</div>
					</div>
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
			form: {
				pay_for_surgery: "",
				verify_job_creation: "",
				share_banks_to_other_surgeries: "",
				create_job_rate_limit: ""
			},
			// form2:{
			//   allow_surgery_create_sessions: "",
			//   allow_surgery_appoint_locums: "",
			//   allow_surgery_amend_sessions: "",
			//   allow_surgery_cancel_sessions: "",
			//   allow_surgery_approve_hours: "",
			//   allow_surgery_complete_sessions: ""
			// },
			// form3:{
			//   let_surgery_bill_locum: "",
			//   let_surgery_bill_hubzz: "",
			// },
			formError: []
		};
	},
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
		console.log("route", this.$route.name);
		this.form.pay_for_surgery = this.practice_surgery.pay_for_surgery;
		this.form.verify_job_creation = this.practice_surgery.verify_job_creation;
		this.form.share_banks_to_other_surgeries = this.practice_surgery.share_banks_to_other_surgeries;
		this.form.create_job_rate_limit = this.practice_surgery.create_job_rate_limit;
	},
	methods: {
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
					//this.$router.push("/profile/practice-spokes");
				});
		},
		statusStyle(status) {
			console.log("status", status);
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
			console.log("invitation", invitation);
			if (invitation.invitation_accepted_at) {
				result = "Active";
			}

			if (invitation.invitation_rejected_at) {
				result = "Rejected";
			}

			if (invitation.termination_requested_at) {
				result = "Termination Requested";
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
