<template>
  <div class="relative flex flex-col w-full my-5">
    <div v-if="loading" class="relative flex w-full" style="min-height:80vh">
      <AppLoading :loading="loading" spinner :message="'Loading Job'"/>
    </div>

      <AppBreadcrumbs :links="links"/>

      <SessionDetailModalTerminateModal
        v-if="job_part"
        :job_part="job_part"
        :modal="false"
        @terminated="$router.push(`/job-parts/${job_part.id}`)"
      />
  </div>
</template>

<script>
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"
import AppLoading from "@/components/Base/AppLoading"
import SessionDetailModalCompleteModal from "@/components/Sessions/SessionDetailModalCompleteModal"
import SessionDetailModalTerminateModal from "@/components/Sessions/SessionDetailModalTerminateModal"
export default {
  components: {
    AppBreadcrumbs,
    AppLoading,
    SessionDetailModalCompleteModal,
    SessionDetailModalTerminateModal,
  },

  data () {
    return {
      loading: false,
      parts: [],
      job_part: null,
      links: [],
      
      params: {
        job_id: null,
        limit: 5,
        offset: 0,
      },
    }
  },

  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },
  },

  created() {
    this.loading = true
    this.$axios.$get(`/api/v1/practice/job-parts/${this.$route.params.jobPartId}`).then(res =>{
      console.log("res", res)
      this.job_part = res.data.job_part
      this.params.job_id = res.data.job_id
      this.links = [
        {
          title: 'Sessions',
          url: `/job-parts/?status=${res.data.job_part.status}`
        },
        {
          title: res.data.job_part.title,
          url: `/job-parts/${res.data.job_part.id}`
        },
        {
          title: 'Terminate Job'
        }
      ]
      this.loading = false
    }).catch(err => {
      console.log("error", err)
      this.loading = false
    })
  },

  methods: {
    getJobParts (params) {
      this.loading = true
      this.$axios.$get(`/api/v1/practice/job-parts`, { params, }).then(res => {
        console.log("res", res)
        this.loading = false
        let parts = res.data.job_parts
        parts = parts.map(part => {
          return {
            ...part,
            date_start: this.$moment(part.date_start, "YYYY-MM-DD").format(
              "DD-MM-YYYY"
            ),
            date_end: this.$moment(part.date_end, "YYYY-MM-DD").format(
              "DD-MM-YYYY"
            ),
          }
        })
        this.parts = parts
      })
    },
  },
}
</script>
