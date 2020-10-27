<template>
	<div class="modal-container shadow-lg" ref="modalContainer">
		<div class="p-4 md:p-8 max-w-3xl">
			<nuxt-link :to="'/availability'">
				<svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" />
			</nuxt-link>
			<div class="flex justify-start font-bold text-sm sm:text-xl mt-8 mb-2">Availability</div>
			<div class="mt-4">
				<div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8">
					<AppLoading :loading="loading" spinner />

					<div class="font-bold text-sm sm:text-md mt-4">I won't be available</div>
					<div class="flex flex-row flex-wrap justify-between">
						<div class="w-full p-0 sm:w-1/2 pr-2">
							<AppDate
								v-model="form.date_start"
								:name="'date_start'"
								:label="'From'"
								isAfter
								:error="formError.find(item => item.field === 'date_start')"
								@blur="CheckEmptyField(form.date_start,'date_start')"
								required
							/>
						</div>
						<div class="w-full p-0 sm:w-1/2 pl-2">
							<AppDate
								v-model="form.date_end"
								:name="'date_end'"
								:label="'To'"
								isAfter
								:error="formError.find(item => item.field === 'date_end')"
								@blur="CheckEmptyField(form.date_end,'date_end')"
								required
							/>
						</div>
					</div>
					<div class="flex flex-row flex-wrap items-center justify-between mt-4 relative">
						<div class="flex items-center">
							<div class="text-sm sm:text-md leading-loose mr-4">
								On theses shifts
								<span class="text-red-500">*</span>
							</div>
							<div
								class="text-red-500 text-xs text-white"
								v-if="formError.find(item => item.field === 'shift_id') && formError.find(item => item.field === 'shift_id').message"
							>{{formError.find(item => item.field === 'shift_id').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'shift_id').message.slice(1).replace(/_/g, " ")}}</div>
						</div>
						<div
							class="rounded-lg bg-gray-300 px-2 py-1 text-sm sm:text-md flex items-center"
						>Select all that apply.</div>
					</div>
					<div class="flex flex-row flex-wrap justify-around md:justify-between mt-4">
						<button
							class="relative border border-solid rounded-lg p-5 my-2 md:m-1 text-center text-xs sm:text-sm focus:outline-none w-full sm:w-1/3 md:w-1/6 transition-hover"
							:class="formError.find(item => item.field === 'shift_id') ? 'border-red-500 hover:bg-yellow-500 hover:border-yellow-500' : isSelected(item.id) ? 'bg-yellow-500' : 'hover:bg-yellow-500'"
							style="box-sizing:content-box;"
							v-for="item in shifts"
							:key="item.id"
							@click="select(item.id)"
							@blur="CheckEmptyField(form.shift_id, 'shift_id')"
						>{{item.name}}</button>
					</div>
				</div>
			</div>
			<div class="mt-4">
				<AppButton :label="'Add'" @click="add" :disabled="loading" />
			</div>
		</div>
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppFormError from "@/components/Base/AppFormError";
import AppLoading from "@/components/Base/AppLoading";
import moment from "moment";
export default {
	components: {
		AppInput,
		AppDate,
		AppButton,
		AppLoading,
		AppFormError
	},
	data() {
		return {
			loading: false,
			shifts: [],
			form: {
				id: null,
				date_start: null,
				date_end: null,
				shift_id: []
			},
			formError: []
		};
	},
	async asyncData({ app, params, error }) {
		const response = await app.$axios.$get(`/api/v1/shifts`);
		const shifts =
			response.data && response.data.shifts ? response.data.shifts : [];
		return {
			shifts
		};
	},
	watch: {
		"form.shift_id"(value) {
			if (value.length >= 1) {
				let index = this.formError.findIndex(item => item.field === "shift_id");
				if (index >= 0) {
					this.formError.splice(index, 1);
				}
			}
		}
	},
	methods: {
		select (id) {
			let index = this.form.shift_id.findIndex(item => item === id);
			if (index >= 0) {
				const amOrPmIndex = this.form.shift_id.findIndex(item => item === 1 || item === 2)
				if (id === 3) {
					// pag walang am or pm, saka iremove ang 3 
					if (amOrPmIndex < 0) {
						const wholeDayIndex = this.form.shift_id.findIndex(item => item === 3)
						this.form.shift_id.splice(wholeDayIndex, 1)
					}
				} else {
					this.form.shift_id.splice(index, 1);
				}
			} else {
				this.form.shift_id.push(id);
				const amOrPmIndex = this.form.shift_id.findIndex(item => item === 1 || item === 2)
				const wholeDayIndex = this.form.shift_id.findIndex(item => item === 3)
				if (amOrPmIndex >= 0 && wholeDayIndex < 0) {
					this.form.shift_id.push(3)
				}
			}
			console.log('id', id,'this.form.shift_id',this.form.shift_id)
		},
		add() {
			this.formError = [];
			this.Validate(this.form, ["id"]);
			if ((this.form.shift_id.includes(1)||this.form.shift_id.includes(2)) && !this.form.shift_id.includes(3)) {
				this.form.shift_id.push(3)
			}
			if (!this.formError.length) {
				this.loading = true;
				this.$axios
					.$post(`/api/v1/locum/unavailabilities`, this.form)
					.then(res => {
						this.$store.commit(
							"jobs/ADD_LOCUM_UNAVAILABILITIES",
							res.data.unavailabilities
						);
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: [`${res.message}`]
						});
						this.$router.push({
							path: "/availability"
						});
					})
					.catch(err => {
						err.response.data.error_messages.forEach(error => {
							this.formError.push(error);
						});
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "danger",
							text: this.formError.map(error => error.message)
						});
					})
					.finally(() => {
						this.loading = false;
					});
			} else {
				this.$nextTick(() => {
					this.$refs.modalContainer.scrollTop = 0;
				});
				// this.$store.commit("SET_NOTIFICATION", {
				// 	enabled: true,
				// 	status: "danger",
				// 	text: ["Please fill up all the forms"]
				// });
			}
		},
		isSelected(id) {
			return this.form.shift_id.includes(id);
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