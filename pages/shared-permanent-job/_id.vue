<template>
  <div class="mx-8 w-full">
    <div class="flex flex-row flex-no-wrap justify-start items-center mt-4 md:mt-8">
      <h4 class="text-lg md:text-xl font-bold flex items-center">
        <span>{{ sharedPermanentJob.title }}</span>
      </h4>
      <span
        class="px-4 py-1 rounded-lg w-32 text-center mx-2"
        :class="statusStyle(sharedPermanentJob.job_posting_status)"
      >{{ sharedPermanentJob.job_posting_status }}</span>

      <AppButton class="mx-2" :label="'Apply'" @click="goRegister" />
    </div>
    <div class="flex flex-col md:flex-row w-full">
      <div class="w-full pr-2">
        <div class="bg-white rounded-lg shadow-lg p-4">
          <p class="font-bold">
            Practice
          </p>
          <p class="pl-2 pb-3">
            {{ sharedPermanentJob ? sharedPermanentJob.practice_name : null }}
          </p>
          <p class="font-bold">
            Description
          </p>
          <!-- <div class="my-4">
            <span v-html="sharedPermanentJob ? sharedPermanentJob.description : null"></span>
					</div>-->
          <div v-if="sharedPermanentJob.description">
            <no-ssr>
              <quill-editor
                class="border-none"
                :options="options"
                :content="sharedPermanentJob.description"
                disabled
              />
            </no-ssr>
          </div>
          <div v-else-if="sharedPermanentJob.description_file" class="pl-2 pb-3">
            <div class="flex items-center">
              <a :href="sharedPermanentJob.description_file.url" target="_blank" class="text-blue-600 underline">
                <span>
                  <svgicon name="cloud-download" height="24" width="24" />
                </span>
              </a>
              <span
                class="text-sm leading-tight mx-2 px-2 py-1 border border-gray-400 rounded hover:bg-gray-100 cursor-pointer"
                @click="viewFile = { file: sharedPermanentJob.description_file }"
              >View</span>
              {{ sharedPermanentJob.description_file.filename }}
            </div>
          </div>
          <div v-if="viewFile" class="file-overlay" @click.self="viewFile = null">
            <FileModal :file="viewFile" @close="viewFile = null" />
          </div>
          <p v-else class="pl-2 pb-3">
            N/A
          </p>
          <p class="font-bold">
            Salary
          </p>
          <p
            v-if="sharedPermanentJob && sharedPermanentJob.salary_amount !== 0"
            class="pl-2 pb-3"
          >
            £ {{ sharedPermanentJob.salary_amount | currency }}
          </p>

          <p class="font-bold">
            Salary Description
          </p>
          <p
            class="pl-2 pb-3"
          >
            {{ sharedPermanentJob && sharedPermanentJob.salary_description_2 ? sharedPermanentJob.salary_description_2 : 'N/A' }}
          </p>

          <p class="font-bold">
            Posted
          </p>
          <p
            class="pl-2 pb-3"
          >
            {{ sharedPermanentJob ? $moment(sharedPermanentJob.date_posted).format('DD/MM/YYYY') : null }}
          </p>

          <p class="font-bold">
            Closes
          </p>
          <p
            class="pl-2 pb-3"
          >
            {{ sharedPermanentJob ? $moment(sharedPermanentJob.date_closing).format('DD/MM/YYYY') : null }}
          </p>

          <p class="font-bold">
            Report to
          </p>
          <p class="pl-2 pb-3">
            {{ sharedPermanentJob ? sharedPermanentJob.report_to : null }}
          </p>

          <p class="font-bold">
            Role
          </p>
          <p class="pl-2 pb-3">
            {{ sharedPermanentJob ? sharedPermanentJob.profession_name : null }}
          </p>

          <p class="font-bold">
            Job Type
          </p>
          <p class="pl-2 pb-3">
            {{ sharedPermanentJob ? sharedPermanentJob.work_hours : null }}
          </p>

          <p class="font-bold">
            Industry
          </p>
          <p class="pl-2 pb-3">
            {{ sharedPermanentJob ? sharedPermanentJob.industry_type : null }}
          </p>
        </div>
      </div>

      <div class="w-full md:pl-2">
        <PermanentJobMap v-if="sharedPermanentJob" :permanent_job="sharedPermanentJob" />
      </div>
    </div>
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton"
import PermanentJobMap from "@/components/PermanentJob/PermanentJobMap"
import FileModal from "@/components/FileModal"
export default {
  components: {
    AppButton,
    PermanentJobMap,
    FileModal,
  },
  data () {
    return {
      sharedPermanentJob: "",
      viewFile: null,
      options: {
        modules: {
          toolbar: null,
        },
      },
    }
  },
  async asyncData ({ app, route, }) {
    const response = await app.$axios.$get(
      `/api/v1/shared-permanent-job/${route.params.id}`
    )
    const sharedPermanentJob = response.data.permanent_job
    return {
      sharedPermanentJob,
    }
  },
  methods: {
    statusStyle (jobStatus) {
      switch (jobStatus) {
      case "Available":
        return "font-bold bg-green-500 text-white"
      case "Applied":
        return "font-bold bg-yellow-600 text-white"
      case "For Interview":
        return "font-bold bg-green-600 text-white"
      case "Accepted":
        return "font-bold bg-green-700 text-white"
      case "Rejected":
        return "font-bold bg-red-700 text-white"
      case "Closed":
        return "font-bold bg-gray-700 text-white"
      case "Unsuccessful":
        return "font-bold bg-gray-400"
      default:
        return "font-bold bg-yellow-400 text-black"
      }
    },
    goRegister () {
      if (this.$auth.user) {
        this.$router.push(`/permanent-jobs/${this.$route.params.id}`)
      } else {
        this.$router.push("/")
      }
    },
  },
}
</script>

<style>
.file-overlay {
  position: fixed;
  inset: 0;
  z-index: 600;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
</style>
