<template>
	<section class="flex flex-col items-start w-full">
		<div class="flex flex-wrap items-center justify-between w-full">
			<div class="my-1 flex overflow-x-auto items-center">
        <nuxt-link
					:to="`/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs?status=Pending`"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
					:class="
					($route.query.status && $route.query.status.toLowerCase() === 'pending')
					? 'border rounded-lg border-yellow-500 bg-yellow-500'
					: 'text-gray-600'
				"
				>Pending</nuxt-link>
				<nuxt-link
					:to="`/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs`"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
					:class="
					!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'available')
					? 'border rounded-lg border-yellow-500 bg-yellow-500'
					: 'text-gray-600'
				"
				>Available</nuxt-link>
				<nuxt-link
					:to="`/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs?status=Closed`"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
					:class="
					($route.query.status && $route.query.status.toLowerCase() === 'closed')
						? 'border rounded-lg border-yellow-500 bg-yellow-500'
						: 'text-gray-600'
					"
				>Closed</nuxt-link>
        <nuxt-link
          v-if="$auth.user.domain === 'Practice'"
					:to="`/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs?status=Unfilled`"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
					:class="
					($route.query.status && $route.query.status.toLowerCase() === 'unfilled')
						? 'border rounded-lg border-yellow-500 bg-yellow-500'
						: 'text-gray-600'
					"
				>Unfilled</nuxt-link>
			</div>
		</div>

		<div
			class="shield"
			v-if="['permanent-jobs-index-id','permanent-jobs-index-create'].includes($route.name)"
			@click="$router.go(-1)"
		></div>
		<nuxt-child />
	</section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
export default {
	components: {
	},
	data() {
		return {
      spokeIsNotAllowed: false,
    };
	},
	created() {
  },

	async asyncData({ app, route, store, auth }) {
		try {
		} catch (err) {
			if (err.response && err.response.status === 401) {
				error(err.response.data);
				return;
			}
			throw err;
		}
	}
};
</script>
