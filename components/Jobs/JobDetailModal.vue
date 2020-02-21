<template>
  <div class="p-4 md:p-8">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>

    <div class="flex flex-row justify-start items-center mt-4">
      <div class="leading-loose font-bold text-md sm:text-lg">{{ job.title }}</div>
      <div class="mx-2 py-2 px-4 rounded font-semibold" :class="bgStatus(job.locum_status)">
        {{ status(job.locum_status) }}</div>
      <template v-if="job.practice_is_favorite_of_locum">
        <svgicon name="on-star" height="25" width="25"
          class="cursor-pointer fill-current text-gray-700 hover:text-gray-800" @click="unfavorite()" />
      </template>
      <template v-else-if="!job.practice_is_favorite_of_locum">
        <svgicon name="off-star" height="25" width="25"
          class="cursor-pointer fill-current text-gray-700 hover:text-gray-800" @click="favorite()" />
      </template>
    </div>

    <div class="text-xs sm:text-sm py-3">Posted {{ $moment(job.date_created).format("DD/MM/YYYY") }}</div>

    <template v-if="hasNewChanges">
      <div class="text-md">The Practice made changes on this Job, Accept these changes?</div>
      <div class="text-sm" v-if="deadline.hours > 1">
        You need to confirm within {{ deadline.hours }} hour{{ deadline.hours > 1 ? 's' : ''}}
        <span v-if="deadline.minutes > 0">and {{ deadline.minutes }} minute{{ deadline.minutes > 1 ? 's' : ''}}</span>
      </div>
      <div class="flex items-center justify-start mt-1">
        <div class="bg-red-600 text-white rounded-lg px-2 py-1 font-semibold focus:outline-none cursor-pointer"
          @click="decline">Decline</div>
        <div class="mx-1"></div>
        <div class="bg-yellow-500 rounded-lg px-2 py-1 font-semibold focus:outline-none cursor-pointer" @click="accept">
          Accept</div>
      </div>
    </template>

    <div class="flex flex-col mt-4">
      <div class="flex flex-wrap justify-start">
        <div class="p-0 md:pr-4 w-full md:w-1/2">
          <div class="flex flex-col">
            <JobDetailModalInfo :job="job" />
            <JobDetailModalUnassignForm :ref="'unassignForm'" :job="job"
              @unassign="$emit('close'), $emit('unassign', $event)" v-if="job.locum_status === 'Allocated'" />
            <JobDetailModalApplyForm :job="job" @applied="$emit('close'), $emit('applied', $event)"
              v-if="job.locum_status === 'Available' || job.locum_status === 'Matched'" />
            <JobDetailModalCancelForm :job="job" @cancelled="$emit('close'), $emit('cancelled', $event)"
              v-if="job.locum_status === 'Applied'" />
          </div>
        </div>
        <div class="p-0 md:pl-4 w-full md:w-1/2 order-first md:order-none">
          <div class="flex flex-col">
            <JobPartDetailModalParts :job_id="job.id" :disabledLink="true" />
            <JobDetailModalMap :job="job" v-if="showMap" />
          </div>
        </div>
      </div>
    </div>

    <AppConfirmationModal :label="'Proceed to cancel your application to this Job?'" :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'" :modal="cancel_application_modal" @confirm="cancel"
      @cancel="cancel_application_modal = false" />

    <AppConfirmationModal :label="confirmation_text" :confirmLabel="'Yes'" :cancelLabel="'Cancel'"
      :modal="confirmation_modal" @confirm="confirm" @cancel="confirmation_modal = false" />
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
  import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
  export default {
    props: ["job"],
    components: {
      JobDetailModalInfo,
      JobPartDetailModalParts,
      JobDetailModalMap,
      JobDetailModalUnassignForm,
      JobDetailModalApplyForm,
      JobDetailModalCancelForm,
      AppButton,
      AppConfirmationModal
    },
    computed: {
      hasNewChanges() {
        return (
          ["Allocated", "Applied"].includes(this.job.locum_status) &&
          ((this.job.applied_update_accepted === false &&
            this.job.applied_update_accepted_until) ||
            (this.job.update_accepted === false &&
              this.job.update_accepted_until))
        );
      },
      updateAcceptedUntil() {
        // let hours = this.$moment(
        // 	this.job.update_accepted_until,
        // 	"YYYY-MM-DDTHH:mm:ss:SSSZ"
        // ).diff(this.$moment(), "hours");

        let deadline = this.$moment.duration(
          this.$moment(
            this.job.update_accepted_until,
            "YYYY-MM-DDTHH:mm:ss:SSSZ"
          ).diff(this.$moment())
        );

        let hours = deadline._data.hours;
        let minutes = deadline._data.minutes;

        if (minutes > 0) {
          return `You need to confirm within ${hours} hours and ${minutes} minutes`;
        }
        return `You need to confirm within ${hours} hours`;
      }
    },
    data() {
      return {
        showMap: false,
        deadline: {
          hours: 0,
          minutes: 0
        },
        cancel_application_modal: false,
        confirmation_text: "",
        confirmation_modal: false
      };
    },
    mounted() {
      setTimeout(() => {
        this.showMap = true;
      }, 1);
      let data = this.$moment.duration(
        this.$moment(
          this.job.update_accepted_until,
          "YYYY-MM-DDTHH:mm:ss:SSSZ"
        ).diff(this.$moment())
      );
      this.deadline.hours = data._data.hours;
      this.deadline.minutes = data._data.minutes;
    },
    methods: {
      favorite() {
        this.confirmation_text = "Add this Practice to Favorites?";
        this.confirmation_modal = true;
      },
      unfavorite() {
        this.confirmation_text = "Remove this Practice to Favorites?";
        this.confirmation_modal = true;
      },
      confirm() {
        if (!this.job.practice_is_favorite_of_locum) {
          this.$axios
            .$post(`/api/v1/locum/practices/${this.job.practice_id}/favorite`)
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: ["Added to favourites"]
              });
              this.job.practice_is_favorite_of_locum = true;
            })
            .catch(err => {
              console.log("err", err.response || err);
              throw err;
            })
            .finally(() => {
              this.confirmation_modal = false;
            });
        } else if (this.job.practice_is_favorite_of_locum) {
          this.$axios
            .$delete(`/api/v1/locum/practices/${this.job.practice_id}/favorite`)
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: ["Remove to favourites"]
              });
              this.job.practice_is_favorite_of_locum = false;
            })
            .catch(err => {
              console.log("err", err.response || err);
              throw err;
            })
            .finally(() => {
              this.confirmation_modal = false;
            });
        }
      },
      status(status) {
        // return jobStatus.toUpperCase();
        // return status.toUpperCase();
        let jobStatus =
          status === "Matched"
            ? "Available"
            : status === "Available"
              ? "Public"
              : status;

        return jobStatus.toUpperCase();
      },
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
        if (this.job.locum_status === "Allocated") {
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
        } else if (this.job.locum_status === "Applied") {
          this.cancel_application_modal = true;
        }
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
      },
      cancel() {
        this.$axios
          .$delete(`/api/v1/locum/jobs/${this.job.id}/apply`)
          .then(res => {
            this.$store.commit("jobs/REMOVE_LOCUM_APPLIED_JOB", res.data.job.id);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Cancelled"]
            });
            this.$emit("close");
          })
          .catch(err => {
            console.log("err", err.response || err);
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`]
              });
            }
          });
      }
    }
  };
</script>