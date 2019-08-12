<template>
  <div class="border-solid rounded-lg shadow-md p-5 mb-5">
    <div class="flex flex-row">
      <div class="text-xs xl:text-base px-1 w-1/3 sm:w-1/6">{{item.name}}</div>
      <div class="text-xs xl:text-base hidden sm:w-1/6 sm:block">{{form.uploaded_date | localDate}}</div>
      <div class="text-xs xl:text-base hidden sm:w-1/6 sm:block">{{form.expiry_date | localDate}}</div>
      <div class="text-xs xl:text-base w-1/3 sm:w-1/6 pr-2">
        <div
          class="text-xs xl:text-base text-center font-bold rounded-full p-2"
          :class="{ 'bg-orange-300 text-white' : form.status === 'Pending', 'border border-black bg-transparent' : form.status === 'Empty'}"
        >{{form.status}}</div>
      </div>
      <div class="text-xs xl:text-base hidden sm:w-1/6 sm:block">{{form.note}}</div>
      <div class="text-xs xl:text-base w-1/3 sm:w-1/6">
        <div v-if="imageUrl" class="flex flex justify-start items-center">
          <svgicon name="cloud-download" height="24" width="24" />
          <a
            class="no-underline text-black hover:underline px-2"
            :href="imageUrl"
            :download="form.fileName"
          >{{form.fileName | StringMaxLength(10)}}</a>
        </div>
        <div v-else class="flex flex justify-end items-center">
          <input
            type="file"
            :name="`${item.id}_file`"
            :id="`${item.id}_file`"
            class="inputfile hidden"
            @input="onFileInput($event)"
          />
          <svgicon name="cloud-upload" height="24" width="24" />
          <label :for="`${item.id}_file`" class="cursor-pointer hover:underline px-2">Upload</label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['item'],
  data() {
    return {
      form: {
        uploaded_date: null,
        expiry_date: null,
        status: '',
        note: '',
        fileName: '',
      },
      imageUrl: ''
    }
  },
  created() {
    // get request from API
    this.form.status = 'Empty'
  },
  methods: {
    onFileInput(e, data) {
      if (!e.target.files.length) {
        return
      }
      let file = e.target.files[0]
      if (file.type.split('/')[0] !== 'image') {
        return
      }
      // post request to API / send file 


      // response
      this.getBase64(file, (imageUrl) => {
        this.imageUrl = imageUrl
      })
      this.form.uploaded_date = new Date
      this.form.expiry_date = this.$moment(new Date).add(1, 'year')
      this.form.status = 'Pending'
      this.form.note = 'Verifying your uploaded document'
      this.form.fileName = e.target.files[0].name

      this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: ['Document uploaded!'] })
    },
    getBase64(img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },
  }
}
</script>
