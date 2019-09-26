import Vue from 'vue'
Vue.mixin({
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    getDateArray(start, end) {
      let arr = new Array();
      let dt = new Date(start);
      while (dt <= new Date(end)) {
        arr.push(this.$moment(new Date(dt)).format('YYYY-MM-DD'));
        dt.setDate(dt.getDate() + 1);
      }
      return arr;
    },
    CheckEmptyField(inputField, fieldName) {
      let index = this.formError.findIndex(item => item.field === fieldName)
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      if (!(inputField instanceof Array) && !inputField) {
        this.formError.push({ field: fieldName, message: 'Required' })
      }
      if (inputField instanceof Array && !inputField.length) {
        this.formError.push({ field: fieldName, message: 'Required' })
      }
      if (typeof inputField === 'boolean' && inputField === false) {
        this.formError.push({ field: fieldName, message: 'Required' })
      }
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
                { field: key, message: `${key} Is required` }
              )
            }
          }
        }
      }
    },
    ValidateEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email && !re.test(String(email).toLowerCase())) {
        return { field: 'email', message: 'This is not a valid email' }
      }
    },
    CheckPermissions(permissions) {
      let hasPermission = true;
      switch (this.$route.name) {
        case "profile-practice":
          if (!permissions.includes("View Profile Practice")) {
            hasPermission = false;
          }
          break;
        case "profile-branches-surgeries":
          if (!permissions.includes("View Profile Surgeries")) {
            hasPermission = false;
          }
          break;
        case "profile-branches-surgeries-id":
          if (!permissions.includes("Show Profile Surgeries")) {
            hasPermission = false;
          }
          break;
        case "profile-branches-surgeries-create":
          if (!permissions.includes("Create Profile Surgeries")) {
            hasPermission = false;
          }
          break;
        case "profile-users":
          if (!permissions.includes("View Profile Users")) {
            hasPermission = false;
          }
          break;
        case "profile-users-id-general":
          if (!permissions.includes("Show Profile Users")) {
            hasPermission = false;
          }
          break;
        case "profile-users-create":
          if (!permissions.includes("Create Profile Users")) {
            hasPermission = false;
          }
          break;
        case "profile-practice-documents":
          if (!permissions.includes("View Profile Practice Document")) {
            hasPermission = false;
          }
          break;
        case "profile-practice-documents-id":
          if (!permissions.includes("Show Profile Practice Document")) {
            hasPermission = false;
          }
          break;
        case "sessions-live":
        case "sessions-applied":
        case "sessions-allocated":
        case "sessions-completed":
        case "sessions-unfilled":
        case "sessions-cancelled":
        case "sessions-declined":
          if (!permissions.includes("View Sessions Job")) {
            hasPermission = false
          }
          break;
        case "sessions-live-id":
        case "sessions-applied-id":
        case "sessions-allocated-id":
        case "sessions-completed-id":
        case "sessions-unfilled-id":
        case "sessions-cancelled-id":
        case "sessions-declined-id":
          if (!permissions.includes("Show Sessions Job")) {
            hasPermission = false
          }
          break;
      }
      return {
        hasPermission
      };
    },
  }
})
