<template>
	<section class="flex flex-col items-start">
    <div class="flex overflow-x-auto">
      <nuxt-link
        to="/permanent-jobs"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          !$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'available')
            ? 'border rounded-lg border-yellow-500 bg-yellow-500'
            : 'text-gray-600'
        "
        >Available
      </nuxt-link>
      <nuxt-link
        to="/permanent-jobs?status=Closed"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          ($route.query.status && $route.query.status.toLowerCase() === 'closed')
            ? 'border rounded-lg border-yellow-500 bg-yellow-500'
            : 'text-gray-600'
        "
        >Closed
      </nuxt-link>
    </div>
    <AppButton
			v-if="$auth.user.domain === 'Practice'"
			:label="'Create Permanent Job'"
			class="ml-auto"
			@click="$router.push('/permanent-jobs/create')"
		/>
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
		AppButton,
  },
	data() {
    return{
      
    }
  },
  created(){
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
  },
};
</script>
