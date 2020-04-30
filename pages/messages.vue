<template>
	<section class="messages-section fixed left-0 md:relative border">
		<MessagesLeftPanel v-if="showLeftPanel" />
		<nuxt-child />
	</section>
</template>
<script>
import MessagesLeftPanel from "@/components/Messages/LeftPanel/MessagesLeftPanel";
import * as chatApi from "@/api/chat";
export default {
	components: {
		MessagesLeftPanel
	},
	data() {
		return {
			showLeftPanel: true
		};
	},
	computed: {
		socketId() {
			return this.$store.state.socket_id;
		},
		conversations() {
			return this.$store.getters["chat/getConversations"];
		},
		activeConversationId() {
			return this.$store.state.chat.activeConversationId;
		},
		unreadMessages() {
			return this.$store.getters["chat/getUnreadMessages"];
		},
		isMobile() {
			return this.$store.state.mobile;
		}
	},
	watch: {
		$route(to, from) {
			if (window.innerWidth > 768) {
				if (this.conversations.length === 0) {
					this.$router.push(`/messages/create`);
				} else {
					this.$store.commit("IS_MOBILE", false);
					this.showLeftPanel = true;
					if (to.path === "/messages") {
						this.goToFirstConversation();
					}
				}
			}
			if (to.name === "messages-slug") {
				if (to.path === "/messages") {
					this.showLeftPanel = true;
					this.$store.commit("IS_MOBILE", true);
					if (this.$store.state.chat.activeConversationId) {
						this.$store.commit("chat/DELETE_ACTIVE_CONVERSATION");
					}
				} else {
					this.showLeftPanel = true;
					this.$store.dispatch("chat/setActiveConversation", to.params.slug);
				}
			}
			if (
				this.unreadMessages.find(item => {
					item.conversation_id.toString() === to.params.slug;
				})
			) {
				this.$store.commit("chat/DELETE_UNREAD_MESSAGE", to.params.slug);
			}
		},
		socketId(value) {
			this.$store.dispatch("joinRoom", {
				socket_id: value,
				room_name: "messageroom"
			});
		}
	},
	async asyncData({ app, store, route, params, redirect }) {
		const response = await chatApi.fetchConversations(app.$axios, 0, 10);
		const responseCount = await chatApi.fetchConversations(
			app.$axios,
			0,
			10,
			true
		);
		const conversations = response.data.conversations;
		store.commit("chat/SET_CONVERSATIONS", conversations);
		store.commit(
			"chat/SET_TOTAL_CONVERSATIONS_COUNT",
			responseCount.data.count
		);
	},
	beforeDestroy() {
		this.$store.dispatch("leaveRoom", {
			socket_id: this.$socket.id,
			room_name: "messageroom"
		});
		this.$store.commit("chat/DELETE_ACTIVE_CONVERSATION");
	},
	created() {
		// if (this.isMobile === true && this.$route.params.slug) {
		//   this.showLeftPanel = false;
		// }
		// this.$store.dispatch("chat/setActiveConversation", this.$route.params.slug);
	},
	mounted() {
		if (this.socketId) {
			this.$store.dispatch("joinRoom", {
				socket_id: this.socketId,
				room_name: "messageroom"
			});
		}
		if (!this.$auth.loggedIn) {
			return this.$router.push("/");
		}
		if (window.innerWidth > 768) {
			if (this.conversations.length === 0) {
				this.$router.push(`/messages/create`);
			} else {
				this.$store.commit("IS_MOBILE", false);
				this.$store.commit(
					"chat/DELETE_UNREAD_MESSAGE",
					this.$route.params.slug
				);
				this.showLeftPanel = true;
			}
		} else {
			if (this.$route.path === "/messages") {
				this.$store.commit("IS_MOBILE", true);
			}
			this.$store.commit("chat/DELETE_ACTIVE_CONVERSATION");
		}
	},
	methods: {
		goToFirstConversation() {
			let conversation = this.conversations.find(
				(conversation, index) => index === 0
			);
			if (this.$route.params.slug != conversation.id.toString()) {
				this.$router.push(`/messages/${conversation.id}`);
			}
		}
	}
};
</script>
<style scoped>
.messages-section {
	overflow: hidden;
	display: flex;
	min-height: 100%;
	max-height: 100%;
	width: 100%;
}

@media screen and (min-width: 768px) {
	.messages-section {
		min-height: 80vh;
		max-height: 80vh;
	}
}

@media screen and (min-width: 1620px) {
	.messages-section {
		width: 80%;
	}
}
</style>

