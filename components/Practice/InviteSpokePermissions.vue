<template>
	<div class="py-4 px-4 md:px-8">
		<!-- HEADER -->
		<div class="flex justify-between text-sm text-white ">
			<div @click="$emit('close')" class="cursor-pointer px-2 py-3">
				<svgicon name="left-arrow" height="32" width="32" />
			</div>
		</div>
		<!-- HEADER -->
		<AppConfirmationModal
			:label="'Proceed to invite this surgery?'"
			:confirmLabel="'Yes'"
			:cancelLabel="'Cancel'"
			:modal="modal"
			@confirm="invite"
			@cancel="modal = false"
		/>
		<div class="m-2 text-sm font-semibold">
			<div>Surgery: {{ spoke.surgery.name }}</div>
		</div>
		<div class="rounded-lg shadow-lg p-2">
			<div class="flex flex-col flex-wrap justify-between">
				<div class="w-full p-1">
					<AppInput
						v-model="form.pay_for_surgery"
						:type="'select'"
						:name="'pay_for_surgery'"
						:label="'Pay for surgery'"
						:error="formError.find(item => item.field === 'pay_for_surgery')"
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
				<div class="w-full p-2">
					<AppInput
						v-model="form.create_job_rate_limit"
						:type="'number'"
						:name="'create_job_rate_limit'"
						:label="'Job Rates Limit £'"
						:error="
							formError.find(item => item.field === 'create_job_rate_limit')
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
					:inStyle="'padding:5px 16px;'"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
	props: ["spoke"],
	components: {
		AppButton,
		AppInput,
		AppConfirmationModal
	},
	data() {
		return {
			modal: false,
			form: {
				surgery_id: this.spoke.surgery.id,
				pay_for_surgery: "",
				verify_job_creation: "",
				share_banks_to_other_surgeries: "",
				create_job_rate_limit: ""
			},
			formError: []
		};
	},
	created() {
		console.log("spoke", this.spoke);
	},
	methods: {
		save() {
			this.modal = true;
		},
		async invite() {
			await this.$axios
				.post(`/api/v1/practice/me/practice-surgeries/invite`, {
					surgery_id: this.form.surgery_id,
					pay_for_surgery: this.form.surgery_id,
					verify_job_creation: this.form.verify_job_creation,
					share_banks_to_other_surgeries: this.form
						.share_banks_to_other_surgeries,
					create_job_rate_limit: this.form.create_job_rate_limit
				})
				.then(res => {
					console.log("res", res);
					this.modal = false;
					this.$emit("close");
					// this.emit("addSurgery", res.data.practice_surgery)
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: [`${res.data.message}`]
					});
					this.$router.push("/profile/practice-spokes");
					console.log("it worked", res);
				})
				.catch(err => {
					console.log("err", err);
					// this.formError = err.response.data.error_messages;
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
.add-surgery-confirmation-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: auto;
	z-index: 514;
}
</style>
