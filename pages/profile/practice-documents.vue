<template>
  <section>
    <!-- <div class="practice-doc-detail-modal-shield" v-if="modal">
      HWLLO
    </div>-->
    <!-- <transition name="drop" mode="out-in">
      <div class="practice-doc-detail-modal flex justify-center" v-if="modal">
        <PracticeDocumentDetailModal/>
      </div>
    </transition>-->
    <div class="flex flex-col mt-4">
      <div class="flex flex-row px-4 flex-no-wrap justify-between">
        <div class="text-xs sm:text-sm w-full px-1">Title</div>
        <div class="text-xs sm:text-sm w-full px-1">File Size</div>
        <div class="text-xs sm:text-sm w-full px-1">Last Upload Date</div>
      </div>
      <div>
        <!-- :class="item.existingPracticeComplianceDocument ? 'bg-orange-300':'bg-blue-500' " -->
        <div
          class="rounded-lg shadow-lg p-4 mt-4"
          :class="{'practice-doc-card cursor-pointer' : item.existingPracticeComplianceDocument}"
          v-for="item in practiceComplianceDocuments"
          :key="item.practiceDocumentType.id"
          @click="item.existingPracticeComplianceDocument ? show(item.existingPracticeComplianceDocument.id) : ''"
        >
          <div class="flex flex-row flex-no-wrap">
            <div class="text-xs sm:text-sm w-full px-1">{{item.practiceDocumentType.name}}</div>
            <div
              class="text-xs sm:text-sm w-full px-1"
            >{{ item.existingPracticeComplianceDocument ? (item.existingPracticeComplianceDocument.file.size / 1048576).toFixed(2) + 'Mb' : "Please Wait for Admin's confirmation" }}</div>
            <div class="text-xs sm:text-sm w-full px-1">
              {{ item.existingPracticeComplianceDocument && item.existingPracticeComplianceDocument.file &&
              item.existingPracticeComplianceDocument.file.created_at ? $moment(item.existingPracticeComplianceDocument.file.created_at)
              .format('DD/MM/YYYY HH:mm:ss') : null }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div class="show-document-shield" v-if="$route.name === 'profile-practice-documents-id'"></div>
    </transition>
    <nuxt-child />
  </section>
</template>
<script>
import PracticeDocumentDetailModal from "@/components/Profile/PracticeDocumentDetailModal";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    PracticeDocumentDetailModal
  },
  data() {
    return {
      modal: false,
      practiceDocuments: [],
      practiceDocumentTypes: [],
      practiceComplianceDocuments: [],
      disabled: "true"
    };
  },

  created() {
    this.practiceDocuments = [];
    this.practiceDocumentTypes = [];
    this.practiceComplianceDocuments = [];

    Promise.all([
      //------------------EXISTING PRACTICE DOCUMENTS----------------------2
      this.$axios.$get(`/api/v1/practice/practice-documents`).then(res => {
        res.data.practice_documents.forEach(item => {
          this.practiceDocuments.push(item);
        });
      }),

      //---------------PRACTICE DOCUMENT TYPES-----------------
      this.$axios.$get(`/api/v1/practice-document-types`).then(res => {
        res.data.practice_document_types.forEach(item => {
          this.practiceDocumentTypes.push(item);
        });
      })
    ]).then(() => {
      this.practiceComplianceDocuments = this.practiceDocumentTypes.map(
        practiceDocumentType => {
          const existingPracticeComplianceDocument = this.practiceDocuments.find(
            existingPracticeDocument => {
              return (
                existingPracticeDocument.practice_document_type.id ===
                practiceDocumentType.id
              );
            }
          );
          return {
            practiceDocumentType,
            existingPracticeComplianceDocument
          };
        }
      );
    });
  },

  methods: {
    show(id) {
      this.$router.push(`/profile/practice-documents/${id}`);
    }
  }
};
</script>
<style scoped>
.practice-doc-card {
  transition: background-color 0.5s ease-in-out;
}
.show-document-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
/*  */
</style>

