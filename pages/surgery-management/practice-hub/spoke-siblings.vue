<template>
  <div class="p-4">
    wip
    <!-- <AppTable
			v-if="surgeries.length > 0"
			:total="totalSurgeries"
			:items="surgeries"
			:loading="loading"
			:currentPage="current_page"
			:perPage="params.limit"
			:columns="columns"
			:orderBy="params.order_by"
			:routerLink="'/surgery-management/practice-spokes'"
			@pagechanged="pagechanged"
			@limitchanged="limitchanged"
			@sorted="sorted"
		></AppTable> 

      <template v-slot:actions="slotProps">
				<div class="flex items-center justify-center">
          <div class="rounded-full px-6 py-1" :class="surgeryStatus()">{{ getStatus() }}</div>
        </div>
			</template>
    -->
  </div>
</template>

<script>
import AppTable from '@/components/Base/AppTable'
export default {
  components:{
    AppTable
  },
  data(){
    return{
      locums:[],
      totalSiblings: 0,
      practiceSiblings: [],
      columns: [
        {
          name: "Practice Surgery",
          dataIndex: "practice_sibling.surgery.name",
          class:"text-left"
        },
        {
          name: "Practice Code",
          dataIndex: "practice_sibling.surgery.address.post_code",
          class:"text-left"
        }
      ]
    }
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  async asyncData({app, route, store}) {
    try{
      let response = await app.$axios.$get(`/api/v1/practice/locums`)
      const locums = response.data.users
      console.log(locums)
      return{
        locums
      }
    }catch(err){
      console.log('get locum error!', err)
    }
    
  },  
  methods:{
    
  }
}
</script>

<style>

</style>