<template>
	<section class="flex flex-col items-start">
		<div class="flex flex-row justify-start overflow-x-auto py-3">
			<div class="relative">
				<nuxt-link
					to="/permanent-jobs?status=Live"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
					:class="
          !$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'live')
            ? 'border rounded-lg border-yellow-500 bg-yellow-500'
            : 'text-gray-600'
        "
				>Live</nuxt-link>
			</div>

			<div class="relative">
				<nuxt-link
					to="/permanent-jobs?status=Filled"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
					:class="
          $route.query.status && $route.query.status.toLowerCase() === 'filled'
            ? 'border rounded-lg border-yellow-500 bg-yellow-500'
            : 'text-gray-600'
        "
				>Filled</nuxt-link>
			</div>

			<div class="relative">
				<nuxt-link
					to="/permanent-jobs?status=Unfilled"
					class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
					:class="
          $route.query.status && $route.query.status.toLowerCase() === 'unfilled'
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
export default {
	data() {
		return {};
	},
	created() {},

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
