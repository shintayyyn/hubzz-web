<template>
	<transition name="fade">
		<div
			class="absolute bg-white right-0 border shadow container transition-hover"
			:class="showAll ? 'modal top-0' : 'dropdown mx-8 mt-2 left-0 mx-auto sm:left-auto sm:mx-0'"
		>
			<div class="border-b px-2 py-1 flex justify-between" :class="showAll ? '' : 'text-sm'">
				<p class="font-bold">Notifications</p>
				<div class="flex items-center" :class="showAll ? 'text-sm' : 'text-xs'">
					<p class="cursor-pointer">Mark all as read</p>
					<span v-if="showAll" class="px-1 font-bold">·</span>
					<span v-if="showAll" class="cursor-pointer" @click="showAll = false">Close</span>
				</div>
			</div>
			<div
				v-for="(item, index) in notifications"
				:key="index"
				class="p-2 border-b leading-tight"
				:class="item.seen ? '' : 'bg-gray-200'"
			>
				<p class="font-bold">{{ item.title }}</p>
				<p class="text-sm pt-1">{{ item.message }}</p>
				<div class="leading-tight text-xs pt-1 text-gray-600">{{item.notif_date}}</div>
			</div>
			<p
				v-if="!showAll"
				class="cursor-pointer text-sm text-center py-1"
				@click="showAll = !showAll"
			>Show All Notifications</p>
			<p
				class="cursor-pointer text-sm text-center py-1 absolute bottom-0 w-full bg-gray-100"
				v-if="showAll"
			>Load More</p>
		</div>
	</transition>
</template>
<script>
export default {
	data() {
		return {
			// notifications: [
			// 	{
			// 		title: "Sample title 1",
			// 		message: "This is the message",
			// 		seen: false,
			// 		date: "03/04/2020"
			// 	},
			// 	{
			// 		title: "Sample title 2",
			// 		message: "This is the message",
			// 		seen: true,
			// 		date: "03/04/2020"
			// 	}
			// ],
			showAll: false
		};
	},
	computed: {
		jobNotifications() {
			if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
				return this.$store.getters["jobs/getPracticeJobNotifications"];
			}
			return this.$store.getters["jobs/getLocumJobNotifications"];
		},
		billingNotifications() {
			if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
				return this.$store.getters["billing/getPracticeBillingNotifications"];
			}
			return this.$store.getters["billing/getLocumBillingNotifications"];
		},
		url() {
			return this.$auth.user.domain === "Practice" ? "/sessions" : "/jobs";
		},
		notifications() {
			return [...this.jobNotifications, ...this.billingNotifications].sort(
				(a, b) => new Date(b.updated_at) - new Date(a.updated_at)
			);
		}
	},
	watch: {
		showAll(value) {
			this.$emit("showAll");
		},
		billingNotifications() {
			this.notifications.sort(
				(a, b) => new Date(b.updated_at) - new Date(a.updated_at)
			);
		},
		jobNotifications() {
			this.notifications.sort(
				(a, b) => new Date(b.updated_at) - new Date(a.updated_at)
			);
		},
		notifications(value) {
			value.forEach(item => {
				item.notif_date = this.$moment()
					.utc()
					.format("DD/MM/YYYY, HH:mm:ss");
				// if (!item.updated_at) {
				//   item.updated_at = this.$moment()
				//     .utc()
				//     .format("MM-DD-YYYY h:mm a");
				// } else if (item.updated_at) {
				//   item.updated_at = this.$moment(
				//     item.updated_at,
				//     "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
				//   )
				//     .utc()
				//     .format("MM-DD-YYYY h:mm a");
				// }
			});
			this.notifications.sort(
				(a, b) => new Date(b.notif_date) - new Date(a.notif_date)
			);
		}
	}
};
</script>
<style scoped>
.container {
}
.dropdown {
	width: 94%;
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
	}
}
</style>