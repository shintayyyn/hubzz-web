<template>
  <div class="modal-container shadow-lg">
    <div class="p-8 max-w-xl" v-if="notFound">
      <div @click="close" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" />
      </div>
      <div>Not Found</div>
    </div>
    <div class="p-8 max-w-xl" v-else>
      <div @click="close" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" />
      </div>
      <div class="ml-8 hover:text-black hover:bg-yellow-dark rounded-lg inline-flex p-2">
        <a
          @click.prevent="downloadItem(practiceDocument.file.url,practiceDocument.file.filename)"
          class="text-black no-underline"
        >
          <svgicon
            name="cloud-download"
            width="21"
            height="21"
            color="black"
            hover="transparent black"
          ></svgicon>
          <span>Download</span>
        </a>
      </div>
      <div class="flex flex-row justify-start">
        <div class="flex-col shadow-lg rounded-lg bg-grey-light mx-6 mt-10">
          <div class="inline-flex text-sm m-4">
            <div class="m-2 mr-20">
              <p class="mr-20 font-semibold">Title</p>
              <p
                class="mt-2 text-base"
              >{{practiceDocument.practice_document_type ? practiceDocument.practice_document_type.name: null}}</p>
              <p class="mt-5 mr-20 font-semibold">Practice</p>
              <p
                class="mt-2 text-base"
              >{{practiceDocument.practice ? practiceDocument.practice.surgery.name: null}}</p>
              <p class="mt-5 mr-20 font-semibold">File last uploaded</p>
              <p
                class="mt-2 text-base"
              >{{practiceDocument.file ? $moment(practiceDocument.file.created_at).format('MM/DD/YYYY HH:mm:ss') : null}}</p>
              <p class="mt-5 mr-20 font-semibold">Uploaded By</p>
              <p class="mt-2 text-base">{{practiceDocument.created_by_user.personal_detail.name}}</p>
            </div>
            <div class="flex m-2">
              <embed
                width="800px"
                height="600px"
                :src="practiceDocument.file ? practiceDocument.file.url:null"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      practiceDocument: {
        file: {},
        practice_document_type: {},
        practice: {
          surgery: {}
        },
        created_by_user: {
          personal_detail: {}
        }
      },
      notFound: false
    }
  },
  beforeDestroy() {
    this.$store.commit('profile/TOGGLE_SHIELD', false)
  },
  created() {
    this.$store.commit('profile/TOGGLE_SHIELD', true)
    this.$axios.get(`/api/v1/practice/practice-documents/${this.$route.params.id}`).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err.response)
      this.notFound = true
    })
  },
  methods: {
    close() {
      if (this.$route.fullPath === '/dashboard') {
        this.$emit('close')
      } else {
        const query = {
          ...this.$route.query
        }
        this.$router.push({ path: '/profile', query })
      }
    },
    downloadItem(fileUrl, fileFilename) {
      const axios = require('axios');
      axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'blob', // important
      }).then(response => {
        console.log(response)
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileFilename);
        document.body.appendChild(link);
        link.click();
        console.log(fileUrl)
      });
    },
  },
} 
</script>
<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>
