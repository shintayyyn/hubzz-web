<template>
  <section class="declined-section overflow-x-auto">
    <div
      class="mt-10 w-full text-center"
      style="font-family: Nunito"
      v-if="jobs.length === 0"
    >You have not yet declined a job</div>
    <div v-else class="mt-4">
      <table>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th>Job number</th>
            <th>Practice</th>
            <th>Title</th>
            <th>From</th>
            <th>To</th>
            <th>Declined</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in jobs">
            <tr
              :key="item.id"
              class="job-card rounded-lg shadow-md cursor-pointer text-xs lg:text-sm"
              @click="show(item.id)"
            >
              <td>{{item.job_number}}</td>
              <td>{{item.platform_job.practice.surgery.name}}</td>
              <td>{{item.platform_job.title}}</td>
              <td>{{item.platform_job.date_start}}</td>
              <td>{{item.platform_job.date_end}}</td>
              <td>{{item.platform_job.declined_at | localDate}}</td>
            </tr>
            <tr :key="`${item.id}-${index}`">
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <!-- <div class="declined-shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="declined-modal shadow-lg" v-if="modal">
        <LocumDeclinedDetailModal @close="modal = false" :job="job"/>
      </div>
    </transition>-->
  </section>
</template>
<script>
import LocumDeclinedDetailModal from '@/components/Jobs/LocumDeclinedDetailModal'
export default {
  components: {
    LocumDeclinedDetailModal
  },
  data() {
    return {
      jobs: [],
      job: null,
      modal: false
    }
  },
  created() {
    // get applied jobs
    this.$axios.$get(`/api/v1/locum/jobs?locum_status=Declined`).then(res => {
      this.jobs = res.data.jobs
    })
  },
  watch: {
    modal(value) {
      if (value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  },
  methods: {
    show(id) {
      this.$router.push(`/jobs/${id}?job_status=declined`)
      // this.$axios.$get(`/api/v1/locum/jobs/${id}`).then(res => {
      //   this.job = res.data.job
      //   this.modal = true
      // })
    }
  }
}
</script>
<style scoped>
.job-card:hover {
  background-color: #dee1e5;
  transition: background-color 0.5s ease-in-out;
}
.job-card {
  background-color: white;
  transition: background-color 0.5s ease-in-out;
}
.declined-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.declined-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .declined-modal {
    width: 80%;
  }
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
</style>