<template>
	<div class="relative w-full flex flex-col" v-if="$route.name === 'messages-slug'">
		<div
			class="hidden md:flex flex-col justify-center items-center h-full"
			v-if="$route.path === '/messages' || $route.path === '/messages/'"
		>
			<span class="font-bold text-lg">You don’t have a message selected.</span>
			<span>Choose one from your existing messages, or start a new one.</span>
			<button
				class="bg-yellow-500 hover:bg-yellow-400 border-yellow-500 text-sm px-6 py-2 my-2 md:text-lg rounded-full focus:outline-none"
				@click="createMessage"
			>Create Message</button>
		</div>
		<template v-if="show()">
			<MessagesCenterPanelTop v-if="$store.state.chat.activeConversationId" class="mt-10 md:mt-0" />
			<MessagesCenterPanelChat />
			<MessagesCenterPanelForm />
		</template>
	</div>
</template>
<script>
import MessagesCenterPanelChat from "@/components/Messages/CenterPanel/MessagesCenterPanelChat";
import MessagesCenterPanelForm from "@/components/Messages/CenterPanel/MessagesCenterPanelForm";
import MessagesCenterPanelTop from "@/components/Messages/CenterPanel/MessagesCenterPanelTop";
export default {
	components: {
		MessagesCenterPanelChat,
		MessagesCenterPanelForm,
		MessagesCenterPanelTop
	},
	created() {
		if (this.$route.path === "/messages/") {
			this.$router.push(`/messages`);
		}

		if (this.$route.params.slug) {
			this.$store.dispatch(
				"chat/setActiveConversation",
				this.$route.params.slug
			);
		}
	},
	methods: {
		createMessage() {
			if (window.innerWidth < 768) {
				this.$store.commit("IS_MOBILE", false);
			}
			if (this.$route.name === "messages-slug") {
				this.$router.push(`/messages/create`);
			}
		},
		show() {
			if (this.$route.path === "/messages") {
				return false;
			} else if (this.$route.path === "/messages/") {
				return false;
			} else {
				return true;
			}
		}
	}
};
</script>