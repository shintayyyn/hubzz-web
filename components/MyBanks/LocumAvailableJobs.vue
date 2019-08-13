<template>
  <div>
    <div class="overflow-x-auto overflow-y-hidden">
      <div v-if="availableJobs.length == 0">
        <div
          class="mt-10 w-full text-center"
          style="font-family: Nunito"
        >This locum has no available jobs.</div>
      </div>
      <div v-else>
        <table>
          <thead>
            <tr class="text-xs sm:text-sm text-left">
              <th @click="getAvailableJobs('id:desc')">
                Job number
                <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
              </th>
              <th>Practice / Surgery</th>
              <th @click="getAvailableJobs('title:desc')">
                Title
                <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
              </th>
              <th @click="getAvailableJobs('date_start:desc')">
                From
                <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
              </th>
              <th @click="getAvailableJobs('date_end:desc')">
                To
                <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
              </th>
              <th @click="getAvailableJobs('date_created:desc')">
                Created
                <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in availableJobs">
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
                <td>{{item.date_created}}</td>
              </tr>
              <tr :key="`${item.id}-${index}`">
                <td></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="!availableJobs.length == 0" class="m-10 xl:-ml-32">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="currentPage"
        @pagechanged="pagechanged"
      />
    </div>
  </div>
</template>
<script>
import AppPagination from '@/components/Base/AppPagination'
export default {
  props: ['user'],
  components: {
    AppPagination,
  },
  data() {
    return {
      availableJobs: [],
      total: 0,
      totalPages: 0,
      currentPage: 0,
      perPage: 0,
      ascendDescend: 0
    }
  },
  beforeDestroy() {
    let query = Object.assign({}, this.$route.query)
    delete query.available_job_page
    this.$router.push({ query })
  },
  watch: {
    $route(to, from) {
      this.currentPage = parseInt(to.query.available_job_page)
      this.getAvailableJobs('date_created:desc')
    },
  },
  created() {
    const query = {
      ...this.$route.query,
      available_job_page: this.$route.query.available_job_page || 1
    }
    Promise.all([
      console.log(this.user),
      this.$axios.$get(`/api/v1/practice/jobs/count?locum_detail_id=${this.user.locum_detail.id}&locum_status=Available`).then(res => {
        this.total = res.data.count
        this.perPage = 5
        this.totalPages = Math.ceil(this.total / this.perPage)
      })
    ]).then(() => {
      this.getAvailableJobs('date_created:desc'),
        console.log(this.availableJobs)
    })
  },
  computed: {
    // availableJobs:function(){
    //   return this.jobs.filter(function(job) {
    //     return job.locum_status === "Available"
    //   })
    // }
  },
  methods: {
    getAvailableJobs(orderBy) {

      let offset = 0
      if (this.ascendDescend == 0) {
        orderBy = orderBy.replace('desc', 'asc')
        this.ascendDescend = 1
        console.log('true', this.ascendDescend)
      } else if (this.ascendDescend == 1) {
        orderBy = orderBy.replace('asc', 'desc')
        this.ascendDescend = 0
      }

      offset = parseInt(this.perPage) * (parseInt(this.$route.query.available_job_page) - 1)
      this.$axios.$get(`/api/v1/practice/jobs?locum_detail_id=${this.user.locum_detail.id}&locum_status=Available&order_by=${orderBy}&order_by=id%3Adesc&limit=${this.perPage}&offset=${offset}`).then(res => {
        this.availableJobs = res.data.jobs
      })

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
        available_job_page: e || 1
      }
      this.$router.push({ query })
    }
  }
}
</script>
