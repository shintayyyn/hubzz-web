<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8">
      <div>
        <svgicon
          name="left-arrow"
          height="32"
          width="32"
          @click="$router.push('/spoke-surgery-management')"
          class="cursor-pointer"
        />
      </div>
      <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Invite Hub</div>
      <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8 mt-4 max-w-5xl">
        <AppInput
          v-model="search_text"
          :type="'text'"
          :name="'search'"
          :placeholder="'Surgery Name, Surgery Code, or keywords'"
          @submit="search"
          :error="formError.find(item => item.field === 'surgery_id')"
        />
        <AppButton :label="'Search'" @click="search" :inStyle="'padding:5px 14px;'" />
      </div>
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    AppInput,
    AppButton,
    AppConfirmationModal
  },
  data() {
    return {
      search_text: "",
      showResult: false,
      formError: []
    };
  },
  methods: {
    search() {
      this.filteredPracticeSpokes = [];
      this.practiceSpokesResult = [];
      if (this.search_text) {
        this.$axios
          .$get(
            `/api/v1/practice/practice-spokes?search=${this.search_text}&limit=10`
          )
          .then(res => {
            console.log(res);
            // if (res.data && res.data.practices) {
            //   res.data.practices.forEach(item => {
            //     let checkSpoke = this.practiceSpokesResult.find(
            //       spoke => spoke.id == item.id
            //     );
            //     if (!checkSpoke) {
            //       this.practiceSpokesResult.push(item);
            //     } else {
            //       if (
            //         checkSpoke.surgery.name ===
            //           this.search_text.toUpperCase() ||
            //         checkSpoke.surgery.code === this.search_text.toUpperCase()
            //       ) {
            //         this.resultNotice = "This practice is already your spoke.";
            //       }
            //     }
            //   });
            // }

            // let invited = "";
            // const loggedInPracticeId = this.$auth.user.practice_detail.practice
            //   .id;

            // this.practiceSpokesResult.forEach(spoke => {
            //   invited = this.practiceSpokeInvitations.find(
            //     invitation => invitation.child_practice_id === spoke.id
            //   );
            //   if (invited) {
            //     this.filteredPracticeSpokes.push({
            //       ...spoke,
            //       invited: true
            //     });
            //   } else {
            //     this.filteredPracticeSpokes.push({
            //       ...spoke,
            //       invited: false
            //     });
            //   }
            // });
            // this.showResult = true;
          })
          .catch(err => {
            console.log(err);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: ["Something went wrong!"]
            });
          });
      }
    }
  }
};
</script>
<style scoped>
.modal-container {
  z-index: 510;
}

@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>