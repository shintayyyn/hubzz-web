<template>
	<div
		class="relative panel-top px-4 md:p-4 w-full flex items-center border-b leading-none"
		:class="$auth.user.domain === 'Locum' ? 'py-3' : 'pb-4 pt-6'"
	>
		<div class="pr-4 md:hidden">
			<button class="focus:outline-none" @click="goBack()">
				<svgicon name="left-arrow" height="20" width="20" />
			</button>
		</div>
		<div class="flex flex-col justify-center leading-tight" v-if="userDetail">
			<div class="font-bold md:text-lg">
				<span>{{ userDetail.name }}</span>
			</div>
			<div
				class="flex items-center text-xs md:text-sm text-gray-600"
				v-if="userDetail.profession && userDetail.status !== null"
			>
				<span class>{{ userDetail.profession }}</span>
				<span v-if="$route.name === 'messages-slug'" class="mx-1 text-lg">|</span>
				<div class="flex items-center">
					<span
						v-if="$route.name === 'messages-slug'"
						:class="userDetail.status ? 'bg-green-400' : 'bg-gray-300'"
						class="rounded-full mr-1"
						style="padding: 5px"
					></span>
					<p
						v-if="$route.name === 'messages-slug'"
						class="inline-block"
					>{{ userDetail.status ? 'Online' : 'Offline' }}</p>
				</div>
			</div>
		</div>
		<!-- <span class="font-mono absolute right-0 border-2 border-gray-400 text-gray-400 rounded-full w-6 h-6 mx-4 font-bold text-sm flex items-center justify-center cursor-pointer">i</span> -->
	</div>
</template>
<script>
import { parse } from "cookie";
export default {
	data() {
		return {
			messages: []
		};
	},
	computed: {
		activeConversationId() {
			return this.$store.state.chat.activeConversationId;
		},
		conversations() {
			return this.$store.getters["chat/getConversations"];
		},
		newUserMessage() {
			return this.$store.state.chat.newMessageUser;
		},
		userDetail() {
			let detail = null;
			if (this.activeConversationId) {
				let active_conversation = this.conversations.find(
					conversation => conversation.id == parseInt(this.activeConversationId)
				);
				if (active_conversation) {
					let user = active_conversation.conversation_member_users.find(
						member => member.id !== this.$auth.user.id
					);
					let detail = {
						name: `${user.first_name} ${user.last_name}`,
						profession: user.locum_detail_profession_name
							? user.locum_detail_profession_name
							: user.practice_detail_practice_role
							? user.practice_detail_practice_role
							: null,
						status: user.is_online
					};
					// if (user.email) {
					// 	detail = {
					// 		name: `${user.first_name} ${user.last_name}`,
					// 		profession: user.locum_detail_profession_name
					// 			? user.locum_detail_profession_name
					// 			: user.practice_detail_practice_role,
					// 		status: user.is_online
					// 	};
					// } else {
					// 	detail = {
					// 		name: "Hubzz User",
					// 		profession: null,
					// 		status: null
					// 	};
					// }
					return detail;
				}
			} else {
				let detail;
				if (this.newUserMessage.email) {
					detail = {
						name: `${this.newUserMessage.personal_detail.first_name} ${this.newUserMessage.personal_detail.last_name}`,
						profession: this.newUserMessage.locum_detail
							? this.newUserMessage.locum_detail.profession.name
							: this.newUserMessage.practice_detail.practice_role,
						status: user.is_online
					};
				} else {
					detail = {
						name: "Hubzz User",
						profession: null,
						status: null
					};
				}
				return detail;
			}
		}
	},
	methods: {
		goBack() {
			if (this.$route.path != "/messages") {
				this.$router.push(`/messages`);
			}
		}
	}
};
</script>
<style>
@media screen and (min-width: 768px) {
	.panel-top {
		min-height: 78px;
	}
}
</style>
