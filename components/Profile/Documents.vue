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
      <div class="flex flex-row px-4 flex-nowrap justify-between">
        <div class="text-xs sm:text-sm w-full px-1">Title</div>
        <div class="text-xs sm:text-sm w-full px-1">File Size</div>
        <div class="text-xs sm:text-sm w-full px-1">Last Upload Date</div>
      </div>
      <div v-if="!practiceDocuments == []">
         <div
          class="practice-doc-card rounded-lg shadow-lg p-4 mt-4"
          v-for="item in practiceDocuments"
          :key="item.id"
          @click="show(item.id)"
        >
          <div class="flex flex-row flex-nowrap">
            <div class="text-xs sm:text-sm w-full px-1">{{item.practice_document_type.name}}</div>

            <div
              class="text-xs sm:text-sm w-full px-1"
            >{{(item.file.size / 1048576).toFixed(2) + "Mb"}}</div>
            <div
              class="text-xs sm:text-sm w-full px-1"
            >{{ $moment(item.created_at).format('MMM DD, YYYY | h:mm A')}}</div>

          </div>
        </div>
      </div>

      <div v-if="practiceDocuments == []">
         <div
          class="practice-doc-card rounded-lg shadow-lg p-4 mt-4"
          v-for="item in practiceDocumentTypes"
          :key="item.id"
          @click="show(item.id)"
        >
          <div class="flex flex-row flex-nowrap">
            <div class="text-xs sm:text-sm w-full px-1">{{item.name}}</div>
          <!-- 
            <div
              class="text-xs sm:text-sm w-full px-1"
            >{{(item.file.size / 1048576).toFixed(2) + "Mb"}}</div>
            <div
              class="text-xs sm:text-sm w-full px-1"
            >{{ $moment(item.created_at).format('MMM DD, YYYY | h:mm A')}}</div> -->

          </div>
        </div>
      </div>
     
    </div>

    <div class="show-document-shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <!-- <div class="show-document-shield shadow-lg" v-if="modal">
        <PracticeDocumentDetailModal @close="modal = false"/>
      </div>-->
    </transition>
  </section>
</template>
<script>

import PracticeDocumentDetailModal from '@/components/Profile/PracticeDocumentDetailModal'
export default {
  components: {
    PracticeDocumentDetailModal
  },
  data() {
    return {
      modal: false,
      practiceDocuments: [],
      practiceDocumentTypes: [],
      practiceComplianceDocuments:[]
      // results
    }
  },

  created() {

    this.practiceDocuments = []
    this.practiceDocumentTypes = []
    this.practiceComplianceDocuments = [] 

    //------------------EXISTING PRACTICE DOCUMENTS----------------------2
    this.$axios.$get(`/api/v1/practice/practice-documents`).then(res => {
      res.data.practice_documents.forEach(item => {
        this.practiceDocuments.push(item)
      })
    })

    //---------------PRACTICE DOCUMENT TYPES-----------------
    this.$axios.$get(`/api/v1/practice-document-types`).then(res => {
      res.data.practice_document_types.forEach(item => {
        this.practiceDocumentTypes.push(item)
      })
    })

    console.log(this.practiceDocumentTypes)


    
    // this.practiceComplianceDocuments = this.practiceDocumentTypes.map((practiceDocumentType) => {
    //   const existingPracticeComplianceDocuments = this.practiceDocuments.find((existingPracticeDocument) =>{
    //     return existingPracticeDocument.practice_document_types.id === practiceDocumentType.id
    //   })
    //   return {
    //     practiceDocumentType,
    //     existingPracticeComplianceDocuments
    //   }
    // })

    // console.log(this.practiceComplianceDocuments)

  },

  methods: {
    show(id) {
      const query = {
        ...this.$route.query
      }
      this.$router.push({ path: `/profile/${id}`, query })
    },
  }
}
</script>
<style scoped>
.practice-doc-card:hover {
  background-color: #dee1e5;
  transition: background-color 0.5s ease-in-out;
}
.practice-doc-card {
  background-color: white;
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
  z-index: 511;
}
/*  */
</style>

