import Vue from 'vue'
Vue.mixin({
  methods: {
    Validate(form, lists) {
      let items = Object.entries(form)
      for (const [key, value] of items) {
        if (!value) {
          if (!lists) {
            this.formError.push(
              { field: key, message: 'Required', validation: 'required' }
            )
          }
          if (lists && !lists.includes(key)) {
            this.formError.push(
              { field: key, message: 'Required', validation: 'required' }
            )
          } 
        }
      }
      if (this.formError.length > 0) {
        this.loading = false;
      }
    }
  }
})
