<template>
	<section>
		<div class="flex flex-col">
			<div>
				<nuxt-link
					to="/surgery-management/practice-spokes/create"
					class="inline-flex no-underline py-2 px-4 bg-yellow-500 text-sm font-semibold text-black hover:text-white rounded-lg shadow float-left"
					>Invite Spoke</nuxt-link
				>
			</div>
		</div>

		<AppTable
			v-if="surgeries.length > 0"
			:total="totalSurgeries"
			:items="surgeries"
			:loading="loading"
			:currentPage="current_page"
			:perPage="params.limit"
			:columns="columns"
			:orderBy="params.order_by"
			:routerLink="'/surgery-management/practice-spokes'"
			:statusClass="surgeryStatus()"
			:status="getStatus()"
			@pagechanged="pagechanged"
			@limitchanged="limitchanged"
			@sorted="sorted"
		>
			<!-- <template v-slot:actions="slotProps">
        <td class="flex justify-center">
          <div
            class="font-semibold text-xs sm:text-sm text-center px-2"
            @click.stop.prevent="
              toggleRemoveConfirmationModal(slotProps.item.id)
            "
          >
            X
          </div>
        </td>
      </template> -->
		</AppTable>
		<div v-else class="flex justify-center py-4 text-gray-500">
			No Branches / Surgeries
		</div>
		<transition name="fade" mode="out-in">
			<div
				class="shield"
				v-if="
					[
						'surgery-management-practice-spokes-create',
						'surgery-management-practice-spokes-id',
						'surgery-management-practice-spokes-id-surgery-sessions-index',
						'surgery-management-practice-spokes-id-surgery-sessions-index-sessionId',
            'surgery-management-practice-spokes-id-surgery-billings',
            'surgery-management-practice-spokes-id-surgery-banks',
						'surgery-management-practice-spokes-id-request-for-termination',
						'surgery-management-practice-spokes-edit'
					].includes($route.name)
				"
				@click="$router.push('/surgery-management/practice-spokes')"
			></div>
		</transition>
		<nuxt-child
			@addSurgery="surgeries.push($event)"
			@updateSurgery="updateSurgery"
		/>
		<RemoveSurgeryConfirmationModal
			:label="'Are you sure you want to delete this surgery?'"
			:confirmLabel="'Yes'"
			:cancelLabel="'Cancel'"
			:modal="modal"
			:terminationReason="''"
			@setReason="setExpulsionReason"
			@confirm="remove"
			@cancel="modal = false"
		/>
	</section>
</template>
<script>
import AddSurgeryModal from "@/components/Profile/AddSurgeryModal";
import RemoveSurgeryConfirmationModal from "@/components/Profile/RemoveSurgeryConfirmationModal";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppTable from "@/components/Base/AppTable";

export default {
	transition: {
		name: "fade",
		mode: "out-in"
	},
	components: {
		AddSurgeryModal,
		RemoveSurgeryConfirmationModal,
		AppConfirmationModal,
		AppTable
	},

	data() {
		return {
			modal: false,
			selectedSurgeryId: null,
			//
			current_page: 1,
			surgeries: [],
			terminationReason: "",
			totalSurgeries: 0,
			loading: false,
			// app table filter
			sampleFilter: [],
			// app table params
			params: {
				offset: 0,
				limit: 5,
				order_by: []
			},
			// for app table component
			columns: [
				{
					name: "Surgery",
					dataIndex: "surgery.name",
					class: "text-left",
					sortable: true
				},
				{
					name: "Practice Code",
					dataIndex: "surgery.code",
					class: "text-center"
				},
				// {
				//   name: "Pay for surgery",
				//   dataIndex: "pay_for_surgery",
				//   class: "text-center"
				// },
				{
					name: "Status",
					dataIndex: "",
					class: "status text-center"
				}
			]
		};
	},
	computed: {
		authPermissions() {
			return this.$store.getters["auth/permissions"];
		}
	},
	mounted() {
		this.$socket.on("Practice Notification Create Surgery", surgery => {
			this.getSurgeriesCount(this.params);
		});
		this.$socket.on("Practice Notification Update Surgery", surgery => {
			let index = this.surgeries.findIndex(item => item.id == surgery.id);
			if (index >= 0) {
				this.surgeries.splice(index, 1, surgery);
			}
		});
		this.$socket.on("Practice Notification Delete Surgery", surgeryId => {
			this.getSurgeriesCount(this.params);
		});
	},
	async asyncData({ app, store, error }) {
		try {
			const responsePracticeType = await app.$axios.$get(
				`/api/v1/practice/me/practice-type`
			);
			let practice =
				responsePracticeType.data && responsePracticeType.data.practice
					? responsePracticeType.data.practice
					: null;

			let surgeries = [];
			let parent_surgery = null;
			let totalSurgeries = 0;

			if (practice.type === "Hub") {
				const responseCount = await app.$axios.$get(
					`/api/v1/practice/me/practice-surgeries/count`
				);

				totalSurgeries =
					responseCount.data && responseCount.data.count
						? responseCount.data.count
						: 0;

				const response = await app.$axios.$get(
					`/api/v1/practice/me/practice-surgeries?limit=5`
				);
				if (response.data && response.data.practice_surgeries) {
					response.data.practice_surgeries.forEach(surgery => {
						surgeries.push(surgery);
						// surgeries.push({ ...surgery, removable: true });
					});
				}
			} else if (practice.type === "Spoke") {
				if (practice.parent_surgery) {
					let surgery = {
						id: practice.parent_surgery.id,
						pay_for_surgery: practice.pay_for_surgery,
						verify_job_creation: practice.verify_job_creation,
						surgery: practice.parent_surgery
					};
					surgeries.push(surgery);
				}
			}
			return {
				practice,
				surgeries,
				totalSurgeries
			};
		} catch (err) {
			if (err.response && err.response.status === 401) {
				error(err.response.data);
				return;
			}
			throw err;
		}
	},

	methods: {
		getSurgeriesCount(params) {
			this.$axios
				.$get(`/api/v1/practice/me/practice-surgeries/count`, { params })
				.then(res => {
					this.totalSurgeries = res.data.count;
					this.getSurgeries(this.params);
				});
		},
		getSurgeries(params) {
			this.loading = true;
			this.$axios
				.$get(`/api/v1/practice/me/practice-surgeries`, { params })
				.then(res => {
					this.loading = false;
					this.surgeries = [];
					res.data.practice_surgeries.forEach(surgery => {
						this.surgeries.push(surgery);
						// this.surgeries.push({ ...surgery, removable: true });
					});
				})
				.catch(err => {
					console.log(err);
        });
      console.log('surgeries',this.surgeries)
		},
		sorted(order_by) {
			this.current_page = 1;
			this.params.offset = 0;
			this.params.order_by = order_by;
			this.getSurgeries(this.params);
		},
		pagechanged(page) {
			this.current_page = page;
			this.params.offset = this.params.limit * (page - 1);
			this.getSurgeries(this.params);
		},
		limitchanged(limit) {
			this.current_page = 1;
			this.params.offset = 0;
			this.params.limit = limit;
			this.getSurgeries(this.params);
		},
		addSurgery(payload) {
			if (!this.surgeries.map(item => item.id).includes(payload.id)) {
				this.surgeries.push(payload);
			}
		},
		updateSurgery(payload) {
			let index = this.surgeries.findIndex(
				surgery => surgery.id === payload.id
			);
			if (index >= 0) {
				this.surgeries.splice(index, 1, payload);
			}
		},
		toggleRemoveConfirmationModal(id) {
			this.selectedSurgeryId = id;
			this.modal = true;
		},
		async remove() {
			this.loading = true;
			if (!this.authPermissions.includes("Delete Profile Surgeries")) {
				return;
			}
			if (this.practice.type === "Hub") {
				await this.$axios.$delete(
					`/api/v1/practice/me/practice-surgeries/${this.selectedSurgeryId}`
				);
			} else if (this.practice.type === "Spoke") {
				await this.$axios.$delete(`/api/v1/practice/me/parent-surgery`);
			}
			this.loading = false;
			this.surgeries = this.surgeries.filter(
				surgery => surgery.id !== this.selectedSurgeryId
			);
			this.modal = false;
			this.$store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "success",
				text: ["Practice Surgery Deleted Successfully"]
			});
		},
		show(item) {
			if (this.authPermissions.includes("Show Profile Surgeries")) {
				if (this.practice.type === "Hub") {
					this.$router.push(`/profile/practice-spokes/${item.id}`);
				} else if (this.practice.type === "Spoke") {
					this.$router.push(`/profile/practice-spokes/edit`);
				}
			}
		},
		setExpulsionReason(terminationReason) {
			this.terminationReason = terminationReason;
		},
		getStatus() {
			let status = "Invited";
			this.surgeries.map(item => {
				if (this.practice.type === "Hub") {
					if (item.invitation_accepted_at) {
						status = "Active";
					}
					if (item.invitation_rejected_at) {
						status = "Rejected";
					}
					if (item.termination_requested_at) {
						status = "Request for Temination";
					}
					if (item.terminated_at) {
						status = "Terminated";
          }
        } else {
					item.surgery.practice.practice_surgeries.map(item => {
						if (item.invitation_accepted_at) {
							status = "Active";
						}
						if (item.invitation_rejected_at) {
							status = "Rejected";
						}
						if (item.termination_requested_at) {
							status = "Request for Temination";
						}
						if (item.terminated_at) {
							status = "Terminated";
						}
					});
				}
			});
			return status;
		},
		surgeryStatus() {
			this.getStatus();
			switch (this.getStatus()) {
				case "Active":
					return "bg-green-500 text-white";
					break;
				case "Rejected":
					return "bg-red-600 text-white";
					break;
				case "Request for Temination":
					return "bg-orange-500 text-white";
					break;
				case "Terminated":
					return "bg-red-700 text-white";
					break;
				default:
					return "bg-yellow-400 text-black";
			}
		}
	}
};
</script>
<style scoped>
.shield {
	z-index: 509;
}
.list-section {
	position: relative;
	min-height: 600px;
}
</style>
