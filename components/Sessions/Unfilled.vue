<template>
  <section class="unfilled-section">
    <div class="overflow-x-auto">
      <div
        class="mt-10 w-full text-center"
        style="font-family: Nunito"
        v-if="jobs.length === 0"
      >You do not have any unfilled jobs</div>
      <div v-else class="overflow-x-auto overflow-y-hidden">
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
          <tbody :class="{'loading': loading}">
            <tr v-if="loading">
              <td colspan="6" class="text-center loader">
                <h5 class="loader-message">Loading</h5>
              </td>
            </tr>
            <template v-else v-for="(item, index) in jobs">
              <tr
                :key="item.id"
                class="job-card shadow-md cursor-pointer text-xs text-left"
                @click="show(item.id)"
              >
                <td>{{item.job_number}}</td>
                <td>{{item.platform_job.practice.surgery.name}}</td>
                <td>{{item.platform_job.title}}</td>
                <td>{{item.platform_job.date_start}}</td>
                <td>{{item.platform_job.date_end}}</td>
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
    <div class="absolute pin-b w-full" v-if="jobs.length > 0">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="currentPage"
        @pagechanged="pagechanged"
      />
    </div>
  </section>
</template>
<script>
import AppPagination from '@/components/Base/AppPagination'
export default {
  components: {
    AppPagination
  },
  data() {
    return {
      total: 0,
      totalPages: 0,
      currentPage: 0,
      perPage: 0,
      loading: false,
    }
  },
  watch: {
    $route(to, from) {
      this.currentPage = parseInt(to.query.current_page)
      this.getUnfilledSession()
    }
  },
  computed: {
    jobs() {
      return this.$store.state.session.unfilledJobs
    }
  },
  created() {
    const query = {
      ...this.$route.query,
      current_page: this.$route.query.current_page || 1
    }
    this.currentPage = parseInt(this.$route.query.current_page)
    this.$router.push({ query })
    this.$axios.$get(`/api/v1/practice/jobs/count?status=Unfilled`).then(res => {
      this.total = res.data.count
      this.perPage = 5
      this.totalPages = Math.ceil(this.total / this.perPage)
      this.getUnfilledSession()
    })
  },
  methods: {
    getUnfilledSession() {
      this.loading = true
      let offset = 0
      offset = this.perPage * (parseInt(this.$route.query.current_page) - 1)
      this.$axios.$get(`/api/v1/practice/jobs?status=Unfilled&limit=${this.perPage}&offset=${offset}`).then(res => {
        if (res.data.jobs.length === 0 && this.$route.query.current_page !== 1) {
          this.pagechanged(this.$route.query.current_page - 1)
        }
        this.$store.commit('session/SET_UNFILLED_JOBS', res.data.jobs)
        this.loading = false
      })
    },
    pagechanged(e) {
      const query = {
        ...this.$route.query,
        current_page: e || 1
      }
      this.$router.push({ query })
    },
    show(id) {
      const query = {
        ...this.$route.query
      }
      this.$router.push({ path: `/sessions/${id}`, query })
    }
  }
}
</script>
<style scoped>
.unfilled-section {
  position: relative;
  min-height: 500px;
}
.job-card:hover {
  background-color: #dee1e5;
  transition: background-color 0.5s ease-in-out;
}
.job-card {
  background-color: white;
  transition: background-color 0.5s ease-in-out;
}
a {
  text-decoration: none;
  color: black;
}
table {
  width: 920px;
}
table thead th {
  padding: 15px;
}
table tbody td {
  padding: 15px;
}
.loader {
  background-color: #edf2f7;
  opacity: 0.5;
}
.loader-message:after {
  content: " .";
  animation: dots 1s steps(5, end) infinite;
}

@keyframes dots {
  0%,
  20% {
    color: rgba(0, 0, 0, 0);
    text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  40% {
    color: white;
    text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  60% {
    text-shadow: 0.25em 0 0 white, 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  80%,
  100% {
    text-shadow: 0.25em 0 0 white, 0.5em 0 0 white;
  }
}
</style>