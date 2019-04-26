<template>
  <div class="border-solid rounded-lg shadow-md p-5 mb-5">
    <div class="flex flex-row flex-wrap justify-start">
      <div class="text-sm px-1" style="width:10%">{{title}}</div>
      <div class="text-sm px-1" style="width:15%">{{form.date | localDate}}</div>
      <div class="text-sm px-1" style="width:55%"></div>
      <div class="text-sm px-1" style="width:10%">{{form.fileName | StringMaxLength(10)}}</div>
      <div class="text-sm px-1 text-right" style="width:10%">
        <input
          type="file"
          :name="`${title}_file`"
          :id="`${title}_file`"
          class="inputfile hidden"
          @input="onFileInput($event, '')"
        >
        <label :for="`${title}_file`" class="cursor-pointer">Upload</label>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['title'],
  data() {
    return {
      form: {
        date: null,
        fileName: '',
        file: ''
      }
    }
  },
  methods: {
    onFileInput(e, data) {
      let name = e.target.files[0].name
      // if (e.target.files[0].type !== 'application/pdf') {
      //   return
      // }
      // Send file to API
      this.form.file = e.target.files[0]
      // Get response
      this.form.date = new Date
      this.form.fileName = name
    }
  }
}
</script>

