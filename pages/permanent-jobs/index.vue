<template>
	<section class="flex flex-col items-start">
    <div class="flex overflow-x-auto">
      <nuxt-link
        :to="`/permanent-jobs`"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name === 'permanent-jobs-index'
            ? 'border rounded-lg border-yellow-500 bg-yellow-500'
            : 'text-gray-600'
        "
        >Permanent Jobs
      </nuxt-link>
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
