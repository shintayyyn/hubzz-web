<template>
  <div class="border-solid rounded-lg shadow-md p-5 mb-5">
    <div class="flex flex-row overflow-x-auto">
      <div class="text-sm px-1" style="width:10%">{{item.title}}</div>
      <div
        class="text-sm px-1 invisible lg:visible"
        style="width:15%"
      >{{item.dateUploaded | localDate }}</div>
      <div class="text-sm px-1 invisible lg:visible" style="width:15%"></div>
      <div style="width:10%">
        <div
          class="text-center text-sm font-boeld rounded-full px-1 py-2"
          :class="{ 'bg-orange text-white' : item.status === 'Pending', 'border border-black bg-white text-black' : item.status === 'Empty'}"
        >{{item.status}}</div>
      </div>
      <div class="text-sm px-1 invisible lg:visible" style="width:30%">{{item.note}}</div>
      <div class="text-sm px-1 invisible lg:visible" style="width:10%">
        <a
          class="no-underline text-black hover:underline"
          :href="item.imageUrl"
          :download="item.fileName"
        >{{item.fileName | StringMaxLength(10)}}</a>
      </div>
      <div class="text-sm px-1 text-right sm:w-1/2" style="width:10%">
        <input
          type="file"
          :name="`${item.title}_file`"
          :id="`${item.title}_file`"
          class="inputfile hidden"
          @input="onFileInput($event, `${item.title}`)"
        >
        <label :for="`${item.title}_file`" class="cursor-pointer">Upload</label>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['item'],
  methods: {
    onFileInput(e, data) {
      if (!e.target.files.length) {
        return
      }
      let imageUrl
      let fileName = e.target.files[0].name
      let file = e.target.files[0]
      if (file.type.split('/')[0] !== 'image') {
        return
      }

      this.getBase64(file, (imageUrl) => {
        imageUrl = imageUrl
        // set to store
        this.$store.commit('compliance/SET_DOCUMENTS',
          { title: data, dateUploaded: new Date, status: 'Pending', note: 'notes from HQ', fileName: fileName, file: file, imageUrl: imageUrl }
        )
      })
      this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Document uploaded!' })
    },
    getBase64(img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },
  }
}
</script>
