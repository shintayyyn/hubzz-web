<template>
	<div class="rounded-lg shadow-lg px-8 pb-8 pt-12">
		<div class="mt-5 flex flex-row justify-center">
			<div class="text-lg">New to hubzz? Get started here</div>
		</div>
		<div class="mt-5 flex justify-center">
			<nuxt-link
				class="w-full sm:w-3/4 flex justify-center rounded-lg border-4 border-yellow-500 bg-yellow-500 shadow-md py-8 no-underline text-black font-bold text-sm sm:text-xl focus:outline-none hover:text-white"
				to="/sign-up/locum"
			>I'm looking for work</nuxt-link>
		</div>
		<div class="mt-5 flex justify-center">
			<nuxt-link
				class="w-full sm:w-3/4 flex justify-center rounded-lg border-4 border-yellow-500 shadow-md py-8 no-underline text-black font-bold text-sm sm:text-xl focus:outline-none hover:text-white hover:bg-yellow-500"
				to="/sign-up/practice"
			>I'm looking for locums</nuxt-link>
		</div>
	</div>
</template>

<script>
export default {
	transition: {
		name: "fade",
		mode: "out-in"
	},
	layout: "auth",
	mounted() {
		// this.$store.commit("sign-up/SET_ACTIVE_COMPONENT", "LocumAccountDetails");
		this.$store.commit("sign-up/SET_ACTIVE_COMPONENT", "LocumStage1");
		this.$store.commit("sign-up/CLEAR_REGISTER_PRACTICE_FORM");
	}
};
</script>
<style scoped>
</style>

