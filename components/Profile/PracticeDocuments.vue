<template>
  <section>
    <div class="flex flex-col mt-4">
      <div class="flex flex-row px-4 flex-nowrap justify-between">
        <div class="text-xs sm:text-sm w-full px-1">Title</div>
        <div class="text-xs sm:text-sm w-full px-1">File Size</div>
        <div class="text-xs sm:text-sm w-full px-1">Last Upload Date</div>
      </div>
      <div class="rounded-lg shadow-lg p-4 mt-4" v-for="item in results" :key="item.id">
        <div class="flex flex-row flex-nowrap">
          <div class="text-xs sm:text-sm w-full px-1">{{item.practice_document_type.name}}</div>
          <div class="text-xs sm:text-sm w-full px-1">{{(item.file.size / 1048576).toFixed(2) + "Mb"}}</div>
          <div class="text-xs sm:text-sm w-full px-1">{{ $moment(item.created_at).format('MMM DD, YYYY | h:mm A')}}</div>
          
        </div>
      </div>
    </div>
    <div class="add-surgery-shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="add-surgery-modal shadow-lg" v-if="modal">
        <AddSurgeryModal @close="modal = false" @add="results.push($event)"/>
      </div>
    </transition>
  </section>
</template>
<script>

export default {
  components: {

  },
  data() {
    return {
      modal: false,
      results: []
    }
  },

//   async asyncData({app}){
//       try{
//            let response = this.$axios.$get(`/api/v1/practice/practice-documents`)
//            const results = response.data.data.practice_documents
//            console.log(results)
//             return{
//                 results
//             }
            
//       }catch(err){
//           console.log("index practices index _id index asyncData err", err);
//       }
//   },
  created() {
    this.results = []

    this.$axios.$get(`/api/v1/practice/practice-documents`).then(res => {
      res.data.practice_documents.forEach(item => {
        this.results.push(item)
      })
    })

    console.log(this.results)
    
  },
}
</script>
<style scoped>
.add-surgery-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.add-surgery-modal {
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
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .add-surgery-modal {
    width: 70%;
  }
}
</style>

