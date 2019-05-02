import Vue from 'vue'
Vue.mixin({
  methods: {
    Validate(form, lists) {
      let items = Object.entries(form)
      for (const [key, value] of items) {
        // check if value is array
        if (Array.isArray(value)) {
          if (value.length === 0) {
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
    ValidatePassword(password, password_confirmation) {
      if (password && password_confirmation && password !== password_confirmation) {
        this.formError.push(
          { field: 'password_confirmation', message: 'The Password must be the same', validation: 'required'}
        )
      }
    },
    ValidateEmail({email, field}) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email && !re.test(String(email).toLowerCase())) {
        this.formError.push(
          { field: field, message: 'This is not a valid email', validation: 'invalid'}
        )
      }
    },
    ValidateMobile(mobile) {
      let re = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/g;
      if (mobile && !re.test(String(mobile).toLowerCase())) {
        this.formError.push(
          { field: 'mobile_number', message: 'Your mobile number is invalid', validation: 'invalid'}
        )
      }
    }
  }
})
