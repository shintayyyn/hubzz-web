import Vue from 'vue'
Vue.mixin({
  methods: {
    getDateArray(start, end) {
      let arr = new Array();
      let dt = new Date(start);
      while (dt <= new Date(end)) {
        arr.push(this.$moment(new Date(dt)).format('YYYY-MM-DD'));
        dt.setDate(dt.getDate() + 1);
      }
      return arr;
    },
    Validate(form, lists) {
      let items = Object.entries(form)
      for (const [key, value] of items) {
        // check if value is array
        if (Array.isArray(value)) {
          if (value.length === 0) {
            if (!lists) {
              this.formError.push(
                { field: key, message: `${key} Is Required` }
              )
            }
            if (lists && !lists.includes(key)) {
              this.formError.push(
                { field: key, message: `${key} Is Required` }
              )
            } 
          } 
        } else {
          if (!value) {
            if (!lists) {
              this.formError.push(
                { field: key, message: `${key} Is Required` }
              )
            }
            if (lists && !lists.includes(key)) {
              this.formError.push(
                { field: key, message: `${key} Is Required` }
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
    ValidateSamePassword(password, new_password_confirmation, field) {
      if (password && new_password_confirmation && password !== new_password_confirmation) {
        return  { field: field, message: 'The Password must be the same' }
      }
    },
    ValidateMobile(value, field) {
      // uk format
      // let re = /((\+44(\s\(0\)\s|\s0\s|\s)?)|0)7\d{3}(\s)?\d{6}/g;
      // if (value && !re.test(String(value).toLowerCase())) {
      //   return  { field: field, message: 'Your mobile number is invalid' }
      // }
    },
    ValidateArray(value, field) {
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
  }
})
