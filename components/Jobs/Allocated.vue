<template>
  <section class="allocated-section overflow-x-auto">
    <div
      class="mt-10 w-full text-center"
      style="font-family: Nunito"
      v-if="jobs.length === 0"
    >You do not have any allocated jobs</div>
    <div v-else class="mt-4">
      <table>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th>Job number</th>
            <th>Practice</th>
            <th>Title</th>
            <th>From</th>
            <th>To</th>
            <th>Created</th>
            <th>Assigned</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in jobs">
            <tr
              :key="item.id"
              class="job-card shadow-md cursor-pointer text-xs sm:text-sm text-left"
              @click="show(item.id)"
            >
              <td>{{item.job_number}}</td>
              <td>{{item.type === 'Private' ? item.private_job.private_practice.surgery.name : item.platform_job.practice.surgery.name}}</td>
              <td>{{item.type === 'Private' ? 'Private appointment' : item.platform_job.title}}</td>
              <td>{{item.type === 'Private' ? item.private_job.date_start : item.platform_job.date_start}}</td>
              <td>{{item.type === 'Private' ? item.private_job.date_end : item.platform_job.date_end}}</td>
              <td>{{item.created_at | localDate }}</td>
              <td v-if="item.type === 'Private'">N/A</td>
              <td v-else>{{item.platform_job.appointed_at | localDate}}</td>
            </tr>
            <tr :key="`${item.id}-${index}`">
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <!-- <div class="edit-appointment-shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="edit-appointment-modal shadow-lg" v-if="modal">
        <LocumAppointmentModal @close="modal = false" :job="job" v-if="type === 'Private'"/>
        <LocumAllocatedDetailModal @close="modal = false" :job="job" v-else/>
      </div>
    </transition>-->
  </section>
</template>
<script>
import LocumAppointmentModal from '@/components/Jobs/LocumAppointmentModal'
import LocumAllocatedDetailModal from '@/components/Jobs/LocumAllocatedDetailModal'
export default {
  components: {
    LocumAppointmentModal,
    LocumAllocatedDetailModal
  },
  data() {
    return {
      jobs: [],
      job: null,
      modal: false,
      type: ''
    }
  },
  created() {
    this.$axios.$get(`/api/v1/locum/jobs?locum_status=Current`).then(res => {
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
      this.$router.push(`/jobs/${id}?job_status=allocated`)
      // this.type = type
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
.edit-appointment-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.edit-appointment-modal {
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
  .edit-appointment-modal {
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