<template>
    <div>
        <div class="overflow-x-auto overflow-y-hidden">
        <div v-if="appliedJobs.length === 0">
          <div
          class="mt-10 w-full text-center"
          style="font-family: Nunito"
          >This locum has not applied to any jobs yet.</div>
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
         <div v-if="!appliedJobs.length == 0" class="m-10 xl:-ml-32">
          <AppPagination
            :total="total"
            :totalPages="totalPages"
            :currentPage="currentPage"
            @pagechanged="pagechanged"
          />
        </div>
       
      </div>
    </div>
</template>
<script>
import AppPagination from '@/components/Base/AppPagination'
export default {
    props:['user'],
    components:{
      AppPagination,
    },
    data(){
      return{ 
        appliedJobs:[],
        total:0,
        totalPages:0,
        currentPage:0,
        perPage:0,
      }
    },
    beforeDestroy() {
      let query = Object.assign({}, this.$route.query)
      delete query.applied_job_page
      this.$router.push({ query })
    },
    watch: {
      $route(to, from) {
        this.currentPage = parseInt(to.query.applied_job_page)
        this.getAppliedJobs()
      },

    },
    created(){
      const query = {
        ...this.$route.query,
        applied_job_page: this.$route.query.applied_job_page || 1
      }
      Promise.all([
        console.log(this.user),
        this.$axios.$get(`/api/v1/practice/jobs/count?locum_detail_id=${this.user.locum_detail.id}&locum_status=Applied`).then(res=>{
          this.total = res.data.count
          this.perPage = 5
          this.totalPages = Math.ceil(this.total / this.perPage)
        })
      ]).then(() => {
        this.getAppliedJobs()
        console.log(this.appliedJobs)
        
      })

    },
    computed:{
      // appliedJobs:function(){
      //   return this.jobs.filter(function(job) {
      //     return job.locum_status === "Applied"
      //   })
      // }
    },
    methods:{
      getAppliedJobs(){
        let offset = 0
        offset = this.perPage * (parseInt(this.$route.query.applied_job_page) - 1)
        this.$axios.$get(`/api/v1/practice/jobs?locum_detail_id=${this.user.locum_detail.id}&locum_status=Available&limit=${this.perPage}&offset=${offset}`).then(res=>{
          this.appliedJobs = res.data.jobs
        })
        console.log("applied",this.appliedJobs)
       
      },
      show(id) {
          const query = {
          ...this.$route.query
          }
      this.$router.push({ path: `/sessions/${id}`, query })
      },
      pagechanged(e) {
        const query = {
          ...this.$route.query,
          applied_job_page: e || 1
        }
        this.$router.push({ query })
      }
        
    }
}
</script>
