<template>
    <div>
      <div class="overflow-x-auto overflow-y-hidden">
        <div v-if="cancelledJobs.length === 0">
          <div
          class="mt-10 w-full text-center"
          style="font-family: Nunito"
          >This locum had no case of cancelled job yet.</div>
        </div>
        <div v-else>
           <table>
            <thead>
              <tr class="text-xs sm:text-sm text-left">
                <th>Job number</th>
                <th>Practice / Surgery</th>
                <th>Title</th>
                <th>From</th>
                <th>To</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in cancelledJobs">
                <tr
                  :key="item.id"
                  class="__job-card shadow-md cursor-pointer text-xs text-left"
                  @click="show(item.id)"
                >
                  <td>{{item.job_number}}</td>
                  <td>{{item.platform_job.practice.surgery.name}}</td>
                  <td>{{item.title}}</td>
                  <td>{{item.date_start}}</td>
                  <td>{{item.date_end}}</td>
                  <td>{{item.platform_job.date_created}}</td>
                </tr>
                <tr :key="`${item.id}-${index}`">
                  <td></td>
                </tr>
              </template>
            </tbody>
          </table>
        </div> 
      </div>
    </div>
</template>
</<script>
export default {
    props:['user'],
    components:{

    },
    data(){
        return{
          cancelledJobs:[]
        }
    },
    created(){
         Promise.all([
        console.log(this.user),
        this.$axios.$get(`/api/v1/practice/jobs?locum_detail_id=${this.user.locum_detail.id}&locum_status=Cancelled`).then(res=>{
          this.cancelledJobs = res.data.jobs
        })
      ]).then(() => {
        console.log(this.cancelledJobs)
      })
    },
    computed:{ 
      // cancelledJobs:function(){
      //   return this.jobs.filter(function(job) {
      //     return job.locum_status === "Cancelled"
      //   })
      // }
    },
    methods:{
        show(id) {
            const query = {
            ...this.$route.query
            }
        this.$router.push({ path: `/sessions/${id}`, query })
        }
        
    }
}
</script>
