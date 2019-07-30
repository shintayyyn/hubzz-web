<template>
    <div>
        <div class="overflow-x-auto overflow-y-hidden">
        <div v-if="!jobs">
          <div
          class="mt-10 w-full text-center"
          style="font-family: Nunito"
          >This locum had no transaction with your practice</div>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in appliedJobs">
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
                  <td>{{item.locum_status}}</td>
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
    props:['jobs'],
    components:{

    },
    data(){
        return{

        }
    },
    created(){

    },
    computed:{
      appliedJobs:function(){
        return this.jobs.filter(function(job) {
          return job.locum_status === "Applied"
        })
      }
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
