<template>
  <div class="p-4 md:p-8">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>

    <div class="flex flex-row justify-start mt-4">
      <div class="leading-loose font-bold text-md sm:text-lg">{{ job.title }}</div>
      <div
        class="mx-2 py-2 px-4 rounded font-semibold"
        :class="bgStatus(job.locum_status)"
      >{{ job.locum_status }}</div>
    </div>

    <div class="text-xs sm:text-sm py-3">Posted {{ $moment(job.date_created).format("DD/MM/YYYY") }}</div>

    <template v-if="hasNewChanges">
      <div class="text-md">The Practice made changes on this Job, Accept these changes?</div>
      <div class="text-sm">{{updateAcceptedUntil}}</div>
      <div class="flex items-center justify-start mt-1">
        <div
          class="bg-red-600 text-white rounded-lg px-2 py-1 font-semibold focus:outline-none cursor-pointer"
          @click="decline"
        >Decline</div>
        <div class="mx-1"></div>
        <div
          class="bg-yellow-500 rounded-lg px-2 py-1 font-semibold focus:outline-none cursor-pointer"
          @click="accept"
        >Accept</div>
      </div>
    </template>

    <div class="flex flex-col mt-4">
      <div class="flex flex-wrap justify-start">
        <div class="p-0 lg:pr-4 w-full lg:w-1/2">
          <div class="flex flex-col">
            <JobDetailModalInfo :job="job" />
            <JobDetailModalUnassignForm
              :ref="'unassignForm'"
              :job="job"
              @unassign="$emit('close')"
              v-if="job.locum_status === 'Allocated'"
            />
            <JobDetailModalApplyForm
              :job="job"
              @applied="$emit('close')"
              v-if="
                job.locum_status === 'Available' || job.locum_status === 'Matched'
              "
            />
            <JobDetailModalCancelForm
              :job="job"
              @cancelled="$emit('close')"
              v-if="job.locum_status === 'Applied'"
            />
          </div>
        </div>
        <div class="p-0 md:pl-4 w-full md:w-1/2 order-first md:order-none">
          <div class="flex flex-col">
            <JobPartDetailModalParts :job_id="job.id" :disabledLink="true" />
            <JobDetailModalMap :job="job" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import JobDetailModalInfo from "@/components/Jobs/JobDetailModalInfo";
import JobPartDetailModalParts from "@/components/Jobs/JobPart/JobPartDetailModalParts";
import JobDetailModalMap from "@/components/Jobs/JobDetailModalMap";
import JobDetailModalUnassignForm from "@/components/Jobs/JobDetailModalUnassignForm";
import JobDetailModalApplyForm from "@/components/Jobs/JobDetailModalApplyForm";
import JobDetailModalCancelForm from "@/components/Jobs/JobDetailModalCancelForm";
import AppButton from "@/components/Base/AppButton";
export default {
  props: ["job"],
  components: {
    JobDetailModalInfo,
    JobPartDetailModalParts,
    JobDetailModalMap,
    JobDetailModalUnassignForm,
    JobDetailModalApplyForm,
    JobDetailModalCancelForm,
    AppButton
  },
  computed: {
    hasNewChanges() {
      return (
        this.job.locum_status === "Allocated" &&
        this.job.update_accepted === false &&
        this.job.original === false &&
        this.job.update_accepted_until
      );
    },
    updateAcceptedUntil() {
      let hours = this.$moment(
        this.job.update_accepted_until,
        "YYYY-MM-DDTHH:mm:ss:SSSZ"
      ).diff(this.$moment(), "hours");

      return `You need to confirm within ${hours} hours`;
    }
  },
  methods: {
    bgStatus(status) {
      switch (status) {
        case "Available":
        case "Matched":
          return "bg-yellow-500";
          break;
        case "Applied":
          return "bg-orange-500 text-white";
          break;
        case "Allocated":
          return "bg-green-600 text-white";
          break;
        default:
          return "bg-red-500 text-white";
      }
    },
    decline() {
      this.$store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: [`You can unassign yourself from this job`]
      });
      this.$refs["unassignForm"].$refs["unassignTextArea"].$refs[
        "textarea"
      ].scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "end"
      });
    },
    accept() {
      this.$axios
        .$post(`/api/v1/locum/jobs/${this.job.id}/update-accept`)
        .then(res => {
          this.$emit("close");
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          setTimeout(() => {
            this.$router.push({
              path: `/jobs/${res.data.job.id}`,
              query: { ...this.$route.query }
            });
          }, 500);
        });
    }
  }
};
</script>
