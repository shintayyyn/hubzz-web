<template>
	<div
		class="absolute bg-white right-0 border shadow container"
		:class="showAll ? 'modal top-0' : 'dropdown mx-8 '"
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
			class="p-2 border-b"
			:class="item.seen ? 'bg-gray-200' : ''"
		>
			<p>{{ item.title }}</p>
			<p class="text-sm">{{ item.message }}</p>
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
</template>
<script>
export default {
	data() {
		return {
			notifications: [
				{
					title: "Sample title 1",
					message: "This is the message",
					seen: false,
					date: "03/04/2020"
				},
				{
					title: "Sample title 2",
					message: "This is the message",
					seen: true,
					date: "03/04/2020"
				}
			],
			showAll: false
		};
	}
};
</script>
<style scoped>
.container {
	min-width: 350px;
	max-width: 350px;
}
.dropdown {
}
.modal {
	height: 100vh;
}
</style>