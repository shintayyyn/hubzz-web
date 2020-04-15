<template>
	<div
		v-on-clickaway="close"
		class="absolute bg-white border shadow container transition-hover flex flex-col"
		:class="[showAll === true ? 'modal top-0 right-0' : 'dropdown right-0 mt-2', notifications_count !== this.notifications.length ? !loading ? 'justify-between' : '' : '']"
	>
		<div class="border-b px-2 py-1 flex justify-between" :class="showAll ? '' : 'text-sm'">
			<p class="font-bold">Notifications</p>
			<div
				class="flex items-center"
				:class="showAll ? 'text-sm' : 'text-xs'"
				v-if="notifications.length > 0"
			>
				<p class="cursor-pointer hover:text-gray-700" @click="markAllAsRead">Mark all as read</p>
				<span v-if="showAll" class="px-1 font-bold">·</span>
				<span v-if="showAll" class="cursor-pointer" @click="close">Close</span>
			</div>
		</div>
		<p
			v-if="!loading && !notifications.length"
			class="text-center text-sm py-2"
		>You don't have notifications at the moment.</p>
		<span
			class="flex justify-center items-center py-1 h-full"
			v-if="loading || (showAll && !notifications.length && loading)"
		>
			<svgicon name="loader" :width="showAll ? '55' : '30'" :height="showAll ? '55' : '30'" />
		</span>
		<div v-if="!loading" class="h-full wrapper" @scroll="scrollHandler">
			<transition-group name="fade" mode="in-out">
				<div
					v-for="(item, index) in notifications"
					:key="index"
					class="p-2 border-b leading-tight cursor-pointer transition-hover"
					:class="item.seen ? 'hover:bg-gray-300' : 'bg-gray-200 hover:bg-gray-400'"
					@click="goTo(item)"
				>
					<p
						class="font-bold block truncate"
					>{{ item.payload.title ? item.payload.title : `Untitled ${item.type}` }}</p>
					<p class="text-sm pt-1">{{ item.message }}</p>
					<div
						class="leading-tight text-xs pt-1 text-gray-600"
					>{{$moment(item.created_at).format("DD/MM/YYYY | HH:mm")}}</div>
				</div>
			</transition-group>
		</div>

		<!-- <p
				v-if="notifications_count !== notifications.length"
				class="cursor-pointer text-sm text-center py-1 w-full bg-gray-100 border-t"
				@click="loadMore"
		>Load More</p>-->
		<div v-if="!loading">
			<transition name="fade">
				<span class="flex justify-center py-1" v-if="loadMoreLoader">
					<svgicon name="loader" width="30" height="30" />
				</span>
			</transition>
			<p
				v-if="!showAll && notifications.length > 0"
				class="cursor-pointer text-sm text-center py-1"
				@click="seeAllNotifications"
			>See All</p>
		</div>
	</div>
</template>
<script>
import { mixin as clickaway } from "vue-clickaway";
export default {
	mixins: [clickaway],
	data() {
		return {
			showAll: false,
			// notifications: [],
			limit: 6,
			offset: 0
		};
	},
	computed: {
		url() {
			return this.$auth.user.domain === "Practice" ? "/sessions" : "/jobs";
		},
		notifications() {
			return this.$store.getters["jobs/getNotifications"];
		},
		notifications_count() {
			return this.$store.getters["jobs/getNotificationCount"];
		},
		loadMoreLoader() {
			return this.$store.state.jobs.load_more_loading;
		},
		loading() {
			return this.$store.state.jobs.notification_loading;
		}
	},
	watch: {
		showAll(value) {
			this.$emit("showAll");
		},
		notifications(value) {
			// value.forEach(item => {
			// 	item.notif_date = this.$moment()
			// 		.utc()
			// 		.format("DD/MM/YYYY, HH:mm:ss");
			// 	// if (!item.updated_at) {
			// 	//   item.updated_at = this.$moment()
			// 	//     .utc()
			// 	//     .format("MM-DD-YYYY h:mm a");
			// 	// } else if (item.updated_at) {
			// 	//   item.updated_at = this.$moment(
			// 	//     item.updated_at,
			// 	//     "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
			// 	//   )
			// 	//     .utc()
			// 	//     .format("MM-DD-YYYY h:mm a");
			// 	// }
			// });
			// value.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
		}
	},
	created() {
		this.clearNotifications();
		this.loading = true;
		this.$store.dispatch("jobs/fetchNotifications", { limit: 6 });
		this.loading = false;
	},
	methods: {
		getMessage(notificationType) {
			let message = "";
			switch (notificationType) {
				case "Locum Notification Job Reminder":
					if (days > 0) {
						message = `This Job will start in ${days} ${
							days === 1 ? "day" : "days"
						}.`;
					} else if (days <= 0 && hours > 0) {
						message = `This Job will start in ${hours} ${
							hours === 1 ? "hour" : "hours"
						}.`;
					} else if (hours <= 0 && minutes > 0) {
						message = `This Job will start in ${minutes} ${
							minutes === 1 ? "minute" : "minutes"
						}.`;
					} else {
						message = `This Job will start later.`;
					}
					break;
				case "Locum Notification Job Available":
					message = "There is a new available job for you.";
					break;
				case "Locum Notification Job Applied":
					message = "Successfully applied for this Job.";
					break;
				case "Locum Notification Job Matched":
					message = "There is a new job that matched your qualifications.";
					break;
				case "Locum Notification Job Unsuccessful":
					message = "Your application for this job is unsuccessful";
					break;
				case "Locum Notification Job Current":
					message = "You have been appointed to this job.";
					break;
				case "Locum Notification Job Ongoing":
					message = "Your Job has started.";
					break;
				case "Locum Notification Job Part Completed":
					message = "This part of your job has been completed";
					break;
				case "Locum Notification Job Completed":
					message = "This job has been completed";
					break;
				case "Locum Notification Job Approved":
					message = "This part of your job has been approved";
					break;
				case "Locum Notification Job Disputed":
					message = "This part of your job has been disputed";
					break;
				case "Locum Notification Job Cancelled":
					message = "Your job has been cancelled by your practice";
					break;
				case "Locum Notification Job Amended":
					message = "This job has been updated by your practice";
					break;
				case "Locum Notification Job Declined":
					message = "You successfully leave this job.";
					break;
				case "Locum Notification Job Terminated":
					message = "This Job has been terminated.";
					break;
				case "Locum Notification Job Unqualified":
					message = "You are not qualified anymore on this job.";
					break;
				case "Practice Notification Locum Invoice Created":
					message = "This invoice has been Created";
					break;
				case "Practice Notification Locum Invoice Updated":
					message = "This invoice has been Updated";
					break;
				case "Practice Notification Locum Invoice Paid":
					message = "This invoice has been Paid";
					break;
				default:
					message = "";
			}
			return message;
		},
		goTo(notification) {
			let type = notification.type;
			let id = notification.payload.id;
			let status =
				this.$auth.user.domain === "Practice"
					? notification.payload.status
					: notification.payload.locum_status;
			let dateStart = notification.payload.date_start;
			let url = "";

			if (type === "Job") {
				url = this.$route.name.includes("dashboard")
					? this.$route.path
					: !this.$route.name.includes("dashboard") &&
					  this.$auth.user.domain === "Practice" &&
					  notification.practice_id === this.$auth.user.practice_id
					? `/sessions`
					: !this.$route.name.includes("dashboard") &&
					  this.$auth.user.domain === "Practice" &&
					  notification.practice_id !== this.$auth.user.practice_id
					? `/hub-surgery-management/${notification.practice_surgery_id}/surgery-sessions`
					: !this.$route.name.includes("dashboard") &&
					  this.$auth.user.domain === "Locum"
					? `/jobs`
					: null;
			} else if (type === "Billing") {
				url =
					this.$auth.user.domain === "Practice" &&
					notification.practice_id === this.$auth.user.practice_id
						? `/practice-billing/invoices-from-locums`
						: this.$auth.user.domain === "Practice" &&
						  notification.practice_id !== this.$auth.user.practice_id
						? `/hub-surgery-management/${notification.practice_surgery_id}/surgery-billings/invoices-from-locums`
						: this.$auth.user.domain === "Locum" &&
						  notification.notification_billing_type === "Platform"
						? `/locum-billing/invoices`
						: this.$auth.user.domain === "Locum" &&
						  notification.notification_billing_type === "Private"
						? `/locum-billing/private-invoices`
						: null;
			} else if (type === "Permanent Jobs") {
				url = `/permanent-jobs`;
			}

			// for dashboard viewing, moves the date according to the job
			if (url && url.includes("/dashboard")) {
				let selectedMonth =
					this.$moment()
						.month(dateStart)
						.format("M") - 1;

				let selectedYear = this.$moment()
					.month(dateStart)
					.format("YYYY");

				this.$store.commit(
					"calendar/SELECT_DATE",
					this.$moment(dateStart, "YYYY-MM-DD")
						.set("month", selectedMonth)
						.set("year", selectedYear)
						.format("YYYY-MM-DD")
				);
			}
			// query
			if (type === "Job") {
				let routeStatus = "";

				switch (status) {
					case "Declined":
						routeStatus = "Withdrawn";
						break;
					case "Matched":
						routeStatus = "Available";
						break;
					case "Available":
						routeStatus = "Public";
						break;
					case "Terminated":
						routeStatus = "Completed";
						break;
					case "Updated":
						routeStatus = null;
						break;
					default:
						routeStatus = status;
				}

				if (url === null) {
					if (!notification.seen) this.seenNotification(notification.id);
				} else if (url) {
					this.$router.push({
						path: `${url}`,
						query: {
							...this.$route.query,
							jobStatus: url.includes("surgery-management")
								? routeStatus
								: null,
							status: !url.includes("surgery-management") ? routeStatus : null
						}
					});
				}
				setTimeout(() => {
					if (url === null) {
						this.seenNotification(notification.id);
					} else if (url) {
						this.$router.push({
							path: `${url}/${id}`,
							query: {
								...this.$route.query,
								jobStatus: url.includes("surgery-management")
									? routeStatus
									: null,
								status: !url.includes("surgery-management") ? routeStatus : null
							}
						});
					}
				}, 500);
			} else if (type === "Billings") {
				let routeStatus = "";

				switch (status) {
					case "Draft":
						routeStatus = "to-be-invoiced";
						break;
					case "Issued":
						routeStatus = "issued";
						break;
					case "Paid":
						routeStatus = "approved";
						break;
					default:
						routeStatus = status;
				}

				// return

				if (id !== this.$route.params.id) {
					this.$router.push({
						path: `${url}`,
						query: { ...this.$route.query, status: routeStatus }
					});
				}

				setTimeout(() => {
					this.$router.push({
						path: `${url}/${id}/edit`,
						query: { ...this.$route.query, status: routeStatus }
					});
				}, 500);
			} else if (type === "Permanent Jobs") {
				this.$router.push({
					path: `${url}/${id}`,
					query: { ...this.$route.query }
				});
			}

			if (!notification.seen) this.seenNotification(notification.id);
		},
		seenNotification(notification_id) {
			this.$store.dispatch("jobs/seenNotification", { id: notification_id });
		},
		markAllAsRead() {
			if (this.notifications.map(item => item.seen).includes(false))
				this.$store.dispatch("jobs/seenAllNotifications");
		},
		loadMore() {
			let params = {
				limit: 3,
				offset: this.notifications.length
			};
			this.$store.dispatch("jobs/fetchMoreNotifications", params);
		},
		seeAllNotifications() {
			this.clearNotifications();
			this.limit = 13;
			this.showAll = true;
			this.$store.dispatch("jobs/fetchNotifications", { limit: this.limit });
		},
		close() {
			this.showAll = false;
			this.$emit("viewNotif");
		},
		scrollHandler({ target: { scrollTop, offsetHeight, scrollHeight } }) {
			if (this.notifications_count !== this.notifications.length) {
				let scroll = Math.round(offsetHeight + scrollTop);
				if (scroll === scrollHeight) {
					this.loadMore();
				}
			}
		},
		clearNotifications() {
			this.$store.commit("billing/CLEAR_PRACTICE_BILLING_NOTIFICATION");
			this.$store.commit("billing/CLEAR_LOCUM_BILLING_NOTIFICATION");
			this.$store.commit("jobs/CLEAR_PRACTICE_JOB_NOTIFICATION");
			this.$store.commit("jobs/CLEAR_LOCUM_JOB_NOTIFICATION");
			this.$store.commit(
				"permanentjobs/CLEAR_PRACTICE_PERMANENT_JOB_NOTIFICATION"
			);
			this.$store.commit(
				"permanentjobs/CLEAR_LOCUM_PERMANENT_JOB_NOTIFICATION"
			);
		}
	}
};
</script>
<style scoped>
.wrapper {
	overflow: hidden auto;
}
.dropdown {
	width: 94%;
	margin-left: 3%;
	margin-right: 3%;
	max-height: 80vh;
}
.modal {
	height: 100vh;
}
@media screen and (min-width: 640px) {
	.container {
		min-width: 350px;
		max-width: 350px;
	}
	.dropdown {
		width: auto;
		max-height: 500px;
		/* margin-right: 2rem; */
	}
}
</style>