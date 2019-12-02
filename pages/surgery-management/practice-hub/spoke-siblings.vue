<template>
  <div class="p-4">
    <div 
      v-if="totalSiblings < 1"
      class="flex justify-center"> 
      You have no siblings.
    </div>
    <AppTable
			v-if="practiceSiblings.length > 0"
			:total="totalSiblings"
			:items="practiceSiblings"
			:loading="loading"
			:currentPage="current_page"
			:perPage="params.limit"
			:columns="columns"
			:orderBy="params.order_by"
			:routerLink="'/surgery-management/practice-hub/spoke-siblings'"
      :customWidth="550"
			@pagechanged="pagechanged"
			@limitchanged="limitchanged"
			@sorted="sorted"
		></AppTable>

    <!-- :routerLink="'/surgery-management/practice-spokes'"
			@pagechanged="pagechanged"
			@limitchanged="limitchanged"
			@sorted="sorted"
		></AppTable>--> 

      <!-- <template v-slot:actions="slotProps">
				<div class="flex items-center justify-center">
          <div class="rounded-full px-6 py-1" :class="surgeryStatus()">{{ getStatus() }}</div>
        </div>
			</template> -->
    <nuxt-child/>
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
      practiceSiblings: '',

      loading: false,

      // App Table
      current_page: 1,
      params:{
        offset: 0,
        limit: 5,
        order_by: []
      },
      columns: [
        {
          name: "Practice Surgery",
          dataIndex: "surgery.name",
          class:"text-left"
        },
        {
          name: "Practice Code",
          dataIndex: "surgery.address.post_code",
          class:"text-center md:text-left"
        }
      ]
    }
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  created(){
    console.log()
  },
  async asyncData({app, route, store}) {
    try{
      let response = await app.$axios.$get(`/api/v1/practice/me/parent-surgery/practice-siblings`)
      const practiceSiblings = response.data.practice_siblings
      console.log('siblings', practiceSiblings)
      response = await app.$axios.$get(`/api/v1/practice/me/parent-surgery/practice-siblings/count`)
      const totalSiblings = response.data.count
      console.log('count', totalSiblings)
      return{
        practiceSiblings,
        totalSiblings,
      }
    }catch(err){
      console.log('get locum error!', err)
    }
    
  },  
  methods:{
    getPracticeSiblings(params) {
			this.loading = true;
			this.$axios
				.$get(`/api/v1/practice/me/parent-surgery/practice-siblings`, { params })
				.then(res => {
					this.loading = false;
					this.practiceSiblings = [];
					res.data.practice_siblings.forEach(surgery => {
						this.practiceSiblings.push(surgery);
					});
				})
				.catch(err => {
					console.log(err);
        });
      console.log('siblings',this.practiceSiblings)
		},
    
    sorted(order_by) {
			this.current_page = 1;
			this.params.offset = 0;
			this.params.order_by = order_by;
			this.getPracticeSiblings(this.params);
		},
		pagechanged(page) {
			this.current_page = page;
			this.params.offset = this.params.limit * (page - 1);
			this.getPracticeSiblings(this.params);
		},
		limitchanged(limit) {
			this.current_page = 1;
			this.params.offset = 0;
			this.params.limit = limit;
			this.getPracticeSiblings(this.params);
		},
  }
}
</script>

<style>

</style>