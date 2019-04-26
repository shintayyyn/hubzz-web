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
    },
    ValidatePassword(password, repeat_password) {
      if (password !== repeat_password) {
        this.formError.push(
          { field: 'repeat_password', message: 'The Password must be the same', validation: 'required'}
        )
      }
    },
    ValidateEmail({email, field}) {
      if (email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email).toLowerCase())) {
          this.formError.push(
            { field: field, message: 'This is not a valid email', validation: 'invalid'}
          )
        }
      }
    },
    ValidateMobile(mobile) {
      let re = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/g;
      if (!re.test(String(mobile).toLowerCase())) {
        this.formError.push(
          { field: 'mobile', message: 'Mobile number should contain 10 or 11 numbers only', validation: 'invalid'}
        )
      }
    }
  }
})
