<template>
  <section class="__jobs-section">
    <div class="flex flex-row flex-wrap">
      <div class="w-full sm:w-1/3 p-1">
        <AppSelect
          v-model="params.shift_id"
          :name="'shift'"
          :label="'Shift'"
          :placeholder="'Select...'"
          :error="formError.find(item => item.field === 'shift')"
          :items="shifts"
        />
      </div>
      <div class="w-full sm:w-1/3 p-1">
        <AppInput
          v-model="params.rate"
          :type="'text'"
          :name="'rate'"
          :label="'Rate'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'rate')"
        />
      </div>
      <div class="w-full sm:w-1/3 p-1">
        <AppSelect
          v-model="params.locum_detail_rate_type_id"
          :name="'locum_detail_rate_type_id'"
          :label="'per'"
          :placeholder="'Select...'"
          :error="formError.find(item => item.field === 'locum_detail_rate_type_id')"
          :items="rate_types"
        />
      </div>
      <div class="w-full sm:w-1/4 p-1">
        <AppPostCode
          v-model="params.near_post_code"
          :name="'near_post_code'"
          :label="'Post code'"
          @onSelect="onSelect"
          :inStyle="'background-color:#dae1e7;border-color:white'"
        />
      </div>
      <div class="w-full sm:w-1/4 p-1">
        <AppInput
          v-model="params.miles"
          :type="'text'"
          :name="'miles'"
          :label="'Miles'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'miles')"
          :inStyle="'text-align:right'"
        />
      </div>
      <div class="w-full sm:w-1/4 p-1">
        <AppAutoComplete
          v-model="params.surgery_name"
          :name="'surgery_name'"
          :label="'Surgery'"
          :url="'/api/v1/locum/surgeries'"
          :error="formError.find(item => item.field === 'surgery_name')"
        />
      </div>
      <div class="w-full sm:w-1/4">
        <AppButton :label="'Search'" @click="getJobs" :inStyle="'padding:5px'" />
      </div>
    </div>
    <div class="overflow-x-auto">
      <div
        class="mt-10 w-full text-center"
        style="font-family: Nunito"
        v-if="!loadingJobs && getLocumAvailableJobs.length === 0"
      >There are no available jobs nearby and suited for you at this time</div>
      <div v-else class="overflow-x-auto overflow-y-hidden">
        <table>
          <thead>
            <tr class="text-xs text-left">
              <th>Job number</th>
              <th>Practice</th>
              <th>Title</th>
              <th>From</th>
              <th>To</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in getLocumAvailableJobs">
              <tr
                :key="item.id"
                class="__job-card shadow-md cursor-pointer text-xs text-left"
                @click="show(item.id)"
              >
                <td>{{item.job_number}}</td>
                <td>{{item.platform_job.practice.surgery.name}}</td>
                <td>{{item.title}}</td>
                <!-- ! ask arvi Need to add timestamp -->
                <td>{{item.date_start}}</td>
                <td>{{item.date_end}}</td>
                <td>{{$moment(item.date_created).format('YYYY-MM-DD') }}</td>
              </tr>
              <tr :key="`${item.id}-${index}`">
                <td></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="absolute pin-b w-full" v-if="getLocumAvailableJobs.length > 0">
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
import AppInput from '@/components/Base/AppInput'
import AppSelect from '@/components/Base/AppSelect'
import AppPostCode from '@/components/Base/AppPostCode'
import AppButton from '@/components/Base/AppButton'
import AppAutoComplete from '@/components/Base/AppAutoComplete'
export default {
  components: {
    AppPagination,
    AppInput,
    AppSelect,
    AppPostCode,
    AppButton,
    AppAutoComplete,
  },
  data() {
    return {
      shifts: [],
      rate_types: [],
      params: {
        shift_id: '',
        rate: '',
        locum_detail_rate_type_id: '',
        near_post_code: '',
        miles: '',
        surgery_name: ''
      },
      formError: []
    }
  },
  computed: {
    getLocumAvailableJobs() {
      return this.$store.getters["jobs/getLocumAvailableJobs"];
    },
    perPage() {
      return 5;
    },
    total() {
      return this.$store.state.jobs.locum_available_jobs_count;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    currentPage() {
      return parseInt(this.$route.query.current_page);
    },
    loadingJobs() {
      return this.$store.state.jobs.loading_jobs;
    },
  },
  watch: {
    getLocumAvailableJobs(newValue, oldValue) {
      if (newValue.length !== 0 && (oldValue.length > newValue.length)) {
        this.getJobs()
      }
      if (newValue.length === 0 && this.$route.query.current_page !== 1) {
        this.pagechanged(this.totalPages)
      }
    },
    $route(to, from) {
      if (from.query.current_page !== to.query.current_page) {
        this.getJobs()
      }
    }
  },
  created() {
    const query = {
      ...this.$route.query,
      current_page: this.$route.query.current_page || 1
    };
    this.$router.push({ query });
    this.getJobsCount();
    this.getJobs();
    this.getShifts()
    this.getRateType()
  },
  methods: {
    onSelect(value) {
      let address_components = value.details.result.address_components;
      let postal_code = address_components.find(component =>
        component.types.includes("postal_code")
      );
      if (!postal_code) {
        this.params.near_post_code = ''

        return
      }
      this.params.near_post_code = postal_code.long_name

    },
    getShifts() {
      this.$axios.$get(`/api/v1/shifts`).then(res => {
        this.shifts = []
        res.data.shifts.forEach(item => {
          this.shifts.push({ label: item.name, value: item.id })
        })
      })
    },
    getRateType() {
      this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
        this.rate_types = []
        res.data.locum_detail_rate_types.forEach(item => {
          this.rate_types.push({ label: item.name, value: item.id })
        })
      })
    },
    getJobsCount() {
      this.$store.dispatch("jobs/fetchLocumJobs", {
        status: "Available",
        countOnly: true
      });
    },
    getJobs() {
      let offset = 0;
      offset = this.perPage * (parseInt(this.$route.query.current_page) - 1);
      this.$store.dispatch("jobs/fetchLocumJobs", {
        offset: offset,
        limit: this.perPage,
        status: "Available",
        shift_id: this.params.shift_id,
        rate: this.params.rate,
        locum_detail_rate_type_id: this.params.locum_detail_rate_type_id,
        near_post_code: this.params.near_post_code,
        miles: this.params.miles,
        surgery_name: this.params.surgery_name
      });
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
      this.$router.push({ path: `/jobs/${id}`, query })
    }
  }
}
</script>
