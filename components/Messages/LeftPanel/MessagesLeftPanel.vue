<template>
	<div class="messages-left-panel md:border-r" :class="$store.state.mobile ? '' : 'hidden md:flex'">
		<div class="flex flex-col h-full w-full">
			<div
				class="flex w-full px-4 my-1 md:mt-0 pt-4"
				:class="$auth.user.domain === 'Locum' ? 'mt-10' : 'mt-12'"
			>
				<AppInput
					v-model="search_text"
					:type="'search'"
					:name="'search_text'"
					:placeholder="'Search Messages'"
					class="w-full"
					@keydown.enter="search"
				/>
				<span class="ml-4 pb-2 flex items-center">
					<svgicon
						name="create-message"
						class="fill-current text-gray-500 hover:text-gray-600 cursor-pointer"
						width="28"
						title="Create Message"
						@click="createMessage"
					/>
				</span>
			</div>
			<div class="relative flex flex-col justify-between h-full border-t">
				<div
					class="chat-list w-full h-full overflow-y-auto overflow-x-hidden"
					@scroll="scrollHandler"
					ref="chatlist"
				>
					<template v-if="showResult === false || $route.params.slug == '/messages'">
						<transition-group name="slide" tag="p">
							<div
								v-for="item in conversations"
								:key="item.id"
								class="relative flex w-full items-center px-2 py-4 cursor-pointer border-b"
								:class="parseInt($route.params.slug) === item.id ? 'bg-gray-300' : !item.latest_conversation_message.seen_by_receiver && item.latest_conversation_message.user_id !== $auth.user.id ? 'font-bold bg-gray-400' : 'hover:bg-gray-200'"
								@click.stop="goTo(item)"
							>
								<div>
									<AppAvatar
										v-if="$auth.user.domain === 'Practice'"
										:height="'50px'"
										:width="'50px'"
										:src="userAvatar(item)"
									/>
								</div>
								<div class="w-5/6 flex items-center justify-between">
									<div class="w-4/6 sm:w-5/6 md:w-4/6 lg:w-5/6 px-2 leading-tight">
										<p
											class="truncate"
											:class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''"
										>{{ userFullname(item) }}</p>
										<p
											class="text-sm truncate text-gray-700"
											:class="item.latest_conversation_message.deleted_by_receiver || item.latest_conversation_message.deleted_by_sender ? 'italic':''"
										>{{ item.latest_conversation_message.deleted_by_receiver || item.latest_conversation_message.deleted_by_sender ? `${senderFullname(item)} deleted a message.` : `${senderFullname(item)}: ${item.latest_conversation_message.message}` }}</p>
									</div>
									<span
										class="absolute w-10 h-full right-0 flex items-center text-right text-xs text-gray-600 leading-none mx-2"
										:class="parseInt($route.params.slug) === item.id ? 'bg-gray-300' : !item.latest_conversation_message.seen_by_receiver && item.latest_conversation_message.user_id !== $auth.user.id ? 'font-bold bg-gray-400' : 'hover:bg-gray-200'"
									>{{ $moment(item.latest_conversation_message.created_at).fromNow() }}</span>
								</div>
							</div>
						</transition-group>
					</template>

					<template v-if="showResult && messages.length > 0">
						<transition-group name="slide" tag="p">
							<div
								v-for="item in messages"
								:key="item.id"
								class="relative flex w-full items-center px-2 py-4 cursor-pointer border-b"
								:class="parseInt($route.params.slug) === item.id ? 'bg-gray-300' : !item.latest_conversation_message.sen_by_receiver && item.latest_conversation_message.user_id !== $auth.user.id ? 'font-bold bg-gray-400' : 'hover:bg-gray-200'"
								@click.stop="goTo(item)"
							>
								<div>
									<AppAvatar
										v-if="$auth.user.domain === 'Practice'"
										:height="'50px'"
										:width="'50px'"
										:src="userAvatar(item)"
									/>
								</div>

								<div class="w-5/6 flex items-center justify-between">
									<div class="w-4/6 sm:w-5/6 md:w-4/6 lg:w-5/6 px-2 leading-tight">
										<p
											class="truncate"
											:class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''"
										>{{ userFullname(item) }}</p>
										<p
											class="text-sm truncate text-gray-700"
											:class="item.latest_conversation_message.deleted_by_receiver || item.latest_conversation_message.deleted_by_sender ? 'italic':''"
										>{{ item.latest_conversation_message.deleted_by_receiver || item.latest_conversation_message.deleted_by_sender ? `${senderFullname(item)} deleted a message.` : `${senderFullname(item)}: ${item.latest_conversation_message.message}` }}</p>
									</div>
									<span
										class="absolute w-10 h-full flex items-center right-0 text-right text-xs text-gray-600 leading-none mx-2"
										:class="parseInt($route.params.slug) === item.id ? 'bg-gray-300' : !item.latest_conversation_message.sen_by_receiver && item.latest_conversation_message.user_id !== $auth.user.id ? 'font-bold bg-gray-400' : 'hover:bg-gray-200'"
									>{{ $moment(item.latest_conversation_message.created_at).fromNow() }}</span>
								</div>
							</div>
						</transition-group>
					</template>
					<template v-if="(messages.length === 0 && showResult === true) || conversations.length === 0">
						<div class="flex flex-col h-full items-center pt-20 font-bold text-gray-500">
							<span v-if="showResult === true" class="text-center break-words break-words px-4">
								No messages found for
								<br />
								"{{ search_text }}"
							</span>
							<span v-else>No messages</span>
						</div>
					</template>
					<transition name="fade">
						<div
							v-if="nothingToLoad"
							class="text-center py-1 w-full text-sm text-gray-700"
						>That's all we got for you</div>
					</transition>
				</div>
			</div>
			<!-- <button
        class="bg-yellow-500 border-yellow-500 text-sm p-4 md:text-lg focus:outline-none"
        @click="createMessage"
			>Create Message</button>-->
		</div>
	</div>
</template>
<script>
import AppInput from "~/components/Base/AppInput";
import AppAvatar from "~/components/Base/AppAvatar";
export default {
	components: {
		AppInput,
		AppAvatar
	},
	data() {
		return {
			search_text: "",
			messages: [],
			showResult: false,
			loadMore: false,
			unread: false,
			nothingToLoad: false
		};
	},
	computed: {
		conversations() {
			return this.$store.getters["chat/getConversations"];
		},
		conversationsCount() {
			return this.$store.state.chat.conversations_count;
		},
		activeConversationId() {
			return this.$store.state.chat.activeConversationId;
		},
		unreadMessages() {
			return this.$store.getters["chat/getUnreadMessages"];
		}
	},
	watch: {
		search_text(value) {
			this.nothingToLoad = false;
			if (!value) {
				this.showResult = false;
			} else {
				this.getResults(value);
			}
		},
		conversations(newValue) {}
	},
	methods: {
		goTo(message) {
			this.showResult = false;
			this.search_text = "";
			this.messages = [];
			this.$store.dispatch("chat/setActiveConversation", message.id);
			if (!this.conversations.find(item => item.id == message.id)) {
				this.loadMoreConversation();
			}
			if (window.innerWidth < 768) {
				this.$store.commit("IS_MOBILE", false);
			}
			if (this.$route.params.slug != message.id) {
				this.$router.push(`/messages/${message.id}`);
			}
			if (
				!message.latest_conversation_message.seen_by_receiver &&
				message.latest_conversation_message.user_id !== this.$auth.user.id
			) {
				// message.latest_conversation_message.seen_by_receiver = this.$moment().format();
				this.$store.commit("chat/SET_MESSAGE_SEEN", message);
				this.$store.commit("chat/REMOVE_TOTAL_UNREAD_MESSAGES");
			}

			// console.log("conversations", this.conversations);
		},
		getResults(value) {
			this.$axios.$get(`/api/v1/conversations?search=${value}`).then(res => {
				this.messages = res.data.conversations;
				this.showResult = true;
			});
		},
		senderFullname(item) {
			return item.latest_conversation_message.user.id === this.$auth.user.id
				? "You"
				: `${item.latest_conversation_message.user.personal_detail.first_name} ${item.latest_conversation_message.user.personal_detail.last_name}`;
		},
		userFullname(item) {
			let user = item.conversation_member_users.find(
				item => item.user.id != this.$auth.user.id
			);
			let fullName;
			if (user.user.email) {
				fullName = `${user.user.personal_detail.first_name} ${user.user.personal_detail.last_name}`;
			} else {
				fullName = "Hubzz User";
			}
			return fullName;
		},
		userAvatar(item) {
			let user_detail = item.conversation_member_users.find(
				item => item.user.id != this.$auth.user.id
			);
			return user_detail.user.avatar ? user_detail.user.avatar.file.url : "";
		},
		createMessage() {
			if (window.innerWidth < 768) {
				this.$store.commit("IS_MOBILE", false);
			}
			this.$router.push(`/messages/create`);
		},
		scrollHandler({ target: { scrollTop, offsetHeight, scrollHeight } }) {
			let scroll = Math.round(offsetHeight + scrollTop);
			if (scroll === scrollHeight) {
				if (this.conversations.length !== this.conversationsCount) {
					this.loadMoreConversation();
				} else {
					if (!this.showResult) {
						this.nothingToLoad = true;
						this.$nextTick(() => {
							this.$refs.chatlist.scrollTop = this.$refs.chatlist.scrollHeight;
						});
					}
				}
			}
		},
		loadMoreConversation() {
			this.$store.dispatch("chat/fetchMoreConversation", {
				offset: this.conversations.length
			});
		}
	}
};
</script>
<style scoped>
.messages-left-panel {
	min-width: 100%;
	max-width: 100%;
	float: left;
	min-height: 100%;
	max-height: 1000%;
}

.chat-list::-webkit-scrollbar {
	width: 8px;
}

.chat-list::-webkit-scrollbar-track {
	background: transparent;
}

.chat-list::-webkit-scrollbar-thumb {
	background: #ccc;
	border-radius: 50px;
}

@media screen and (min-width: 768px) {
	.messages-left-panel {
		min-width: 35%;
		max-width: 35%;
		min-height: 80vh;
		max-height: 80vh;
	}
}

@media screen and (min-width: 1200px) {
	.messages-left-panel {
		min-width: 25%;
		max-width: 25%;
		min-height: 80vh;
		max-height: 80vh;
	}
}
</style>