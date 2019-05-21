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
                { field: key, message: 'Required' }
              )
            }
            if (lists && !lists.includes(key)) {
              this.formError.push(
                { field: key, message: 'Required' }
              )
            } 
          } 
        } else {
          if (!value) {
            if (!lists) {
              this.formError.push(
                { field: key, message: 'Required' }
              )
            }
            if (lists && !lists.includes(key)) {
              this.formError.push(
                { field: key, message: 'Required' }
              )
            } 
          } 
        }
      }
    },
    ValidateEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email && !re.test(String(email).toLowerCase())) {
        return { field: 'email', message: 'This is not a valid email'}
      }
    },
    ValidateSamePassword(password, password_confirmation) {
      if (password && password_confirmation && password !== password_confirmation) {
        return  { field: 'password_confirmation', message: 'The Password must be the same' }
      }
    },
    ValidateMobile(value, field) {
      // uk format
      let re = /((\+44(\s\(0\)\s|\s0\s|\s)?)|0)7\d{3}(\s)?\d{6}/g;
      if (value && !re.test(String(value).toLowerCase())) {
        return  { field: field, message: 'Your mobile number is invalid' }
      }
    },
    ValidateInput(e) {
      if (e.key >= 0 && e.key <= 9) {
        if (e.target.value.length === 1 && parseInt(e.key) === 0) {
          e.preventDefault()
        }
        if (e.target.value.length > 11) {
          e.preventDefault()
        }
      } else {
        e.preventDefault()
      }
    },
    // 
    ValidateText(value, field) {
      let index = this.formError.findIndex(item => item.field === field)
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      if (!value) {
        this.formError.push(
          { field: field, message: 'Required', validation: 'required'}
        )
      } 
    },
    ValidateArray(value, field) {
      console.log(value,field)
      let index = this.formError.findIndex(item => item.field === field)
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      if (value.length === 0) {
        this.formError.push(
          { field: field, message: 'Required', validation: 'required'}
        )
      }
    },
    ValidateDate(start, end) {
      if (this.$moment(end).format('YYYY-MM-DD') < this.$moment(start).format('YYYY-MM-DD')) {
        this.formError.push(
          { field: 'to', message: 'End Date must be later than Start Date', validation: 'invalid'}
        )
      }
    },
    ValidateAppointment(appointment, unavailable) {
      
    }
  }
})
