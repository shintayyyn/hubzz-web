<template>
  <section>
    <div class="flex flex-col w-full lg:w-2/3 p-0 lg:pr-4">
      <div class="rounded-lg shadow-lg flex flex-col p-8 mt-4">
        <div
          class="flex flex-row flex-no-wrap"
          v-for="(jobPart, index) in job_parts"
          :key="jobPart.id"
        >
          <div class="w-1/2 p-1 text-lg font-bold flex flex-col justify-center">
            <div>From: {{jobPart.date_start | localDate('dateOnly')}}</div>
            <div class="my-2"></div>
            <div>To: {{jobPart.date_end | localDate('dateOnly')}}</div>
          </div>
          <div class="w-1/2 p-1">
            <template v-if="jobPart.completed_at">
              <AppButton
                :disabled="Boolean(jobPart.completed_at) || isDisabled(index)"
                :label="`Already Mark this as Completed`"
              />
            </template>
            <template v-else>
              <AppButton
                :disabled="Boolean(jobPart.completed_at) || isDisabled(index)"
                :label="`Mark this week as Complete`"
                @click="markAsComplete(jobPart.id, index)"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
    <AppConfirmationModal
      :label="'Mark this week as Completed?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="confirmation_modal"
      @confirm="complete"
      @cancel="cancelMark"
    />
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  props: ["job_parts"],
  components: {
    AppButton,
    AppConfirmationModal
  },
  data() {
    return {
      selectedId: null,
      selectedIndex: null,
      confirmation_modal: false
    };
  },
  methods: {
    markAsComplete(id, index) {
      this.selectedId = id;
      this.selectedIndex = index;
      this.confirmation_modal = true;
    },
    cancelMark() {
      this.selectedId = null;
      this.selectedIndex = null;
      this.confirmation_modal = false;
    },
    complete() {
      this.$axios
        .$put(`/api/v1/practice/job-parts/${this.selectedId}/complete`)
        .then(res => {
          this.job_parts[this.selectedIndex].completed_at =
            res.data.job_part.completed_at;
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Job Part completed"]
          });
          if (
            this.job_parts.filter(jobPart => jobPart.completed_at === null)
              .length === 0
          ) {
            this.$emit("close");
          }
        });
    },
    isDisabled(index) {
      if (index == 0) {
        return false;
      } else {
        if (this.job_parts[index - 1].completed_at) {
          return false;
        }
      }
      return true;
    }
  }
};
</script>
