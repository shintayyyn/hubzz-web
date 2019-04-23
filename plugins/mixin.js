import Vue from 'vue'
Vue.mixin({
  methods: {
    Validate(form, lists) {
      let items = Object.entries(form)
      for (const [key, value] of items) {
        // check if value is array
        if (Array.isArray(value)) {
          if (value.length === 0) {
            this.formError.push(
              { field: key, message: 'Required', validation: 'required'}
            )
          }
        } else {
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
      }
      if (this.formError.length > 0) {
        this.loading = false;
      }
    },
    ValidatePassword(password, repeat_password) {
      if (password !== repeat_password) {
        this.formError.push(
          { field: 'repeat_password', message: 'The Password must be the same', validation: 'required'}
        )
      }
    }
  }
})
