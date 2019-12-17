import Vue from "vue";
Vue.mixin({
  methods: {
    async CheckUserVerification() {
      if (this.$auth.user.domain === 'Locum') {
        let oldStatus = this.$auth.user.status
        const response = await this.$axios.$get(`/api/v1/me`)
        let newStatus = response.data.user.status
        if (newStatus !== oldStatus) {
          this.$store.commit('SET_USER_VERIFICATION_MODAL', { modal: true, status: newStatus === 'Active' ? 'verified' : 'not verified' })
        }
      } else if (this.$auth.user.domain === 'Practice') {
        let oldPracticeUserStatus = this.$auth.user.status
        let oldPracticeUserVerified = oldPracticeUserStatus === 'Disabled' ? 'false' : 'true'
        let oldPracticeStatus = this.$auth.user.practice_detail.practice.status
        let oldPracticeVerified = ['Inactive', 'Suspended', 'Deactivated'].includes(oldPracticeStatus) ? 'false' : 'true'
        let oldVerified = [oldPracticeUserStatus, oldPracticeUserVerified, oldPracticeStatus, oldPracticeVerified].includes('false') ? 'false' : 'true'

        const response = await this.$axios.$get(`/api/v1/me`)

        let newPracticeUserStatus = response.data.user.status
        let newPracticeUserVerified = newPracticeUserStatus === 'Disabled' ? 'false' : 'true'
        let newPracticeStatus = response.data.user.practice_detail.practice.status
        let newPracticeVerified = ['Inactive', 'Suspended', 'Deactivated'].includes(newPracticeStatus) ? 'false' : 'true'
        let newVerified = [newPracticeUserStatus, newPracticeUserVerified, newPracticeStatus, newPracticeVerified].includes('false') ? 'false' : 'true'

        if (oldVerified !== newVerified) {
          this.$store.commit('SET_USER_VERIFICATION_MODAL', { modal: true, status: newVerified === 'true' ? 'verified' : 'not verified' })
        }
      }
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    getDateArray(start, end) {
      let arr = new Array();
      let dt = new Date(start);
      while (dt <= new Date(end)) {
        arr.push(this.$moment(new Date(dt)).format("YYYY-MM-DD"));
        dt.setDate(dt.getDate() + 1);
      }
      return arr;
    },
    CheckEmptyField(inputField, fieldName) {
      if (!this.formError) {
        return
      }

      let index = this.formError.findIndex(item => item.field === fieldName);

      if (index >= 0) {
        this.formError.splice(index, 1);
      }

      if (!(inputField instanceof Array) && !inputField) {
        this.formError.push({
          field: fieldName,
          message: "Required"
        });
      }
      if (inputField instanceof Array && !inputField.length) {
        this.formError.push({
          field: fieldName,
          message: "Required"
        });
      }
      if (typeof inputField === "boolean" && inputField === false) {
        this.formError.push({
          field: fieldName,
          message: "Required"
        });
      }
      if (inputField) {
        if (fieldName === 'email') {
          let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!re.test(String(inputField).toLowerCase())) {
            this.formError.push({
              field: fieldName,
              message: "This is not a valid email"
            });
          }
        }

        // if (fieldName.includes('password')) {
        //   if (inputField.length < 6) {
        //     this.formError.push({
        //       field: fieldName,
        //       message: "Password Must Be Atleast 6 Characters"
        //     });
        //   }
        // }
      }
    },
    Validate(form, lists) {
      let items = Object.entries(form);
      for (const [key, value] of items) {
        // check if value is array
        if (Array.isArray(value)) {
          if (value.length === 0) {
            if (!lists) {
              this.formError.push({
                field: key,
                message: `${key} is Required`
              });
            }
            if (lists && !lists.includes(key)) {
              this.formError.push({
                field: key,
                message: `${key} is Required`
              });
            }
          }
        } else {
          if (!value || value.toString().trim().length === 0) {
            if (!lists) {
              this.formError.push({
                field: key,
                message: `${key} is Required`
              });
            }
            if (lists && !lists.includes(key)) {
              this.formError.push({
                field: key,
                message: `${key} is required`
              });
            }
          }
        }
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
        case "profile-users-id":
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
        case "sessions-index":
          if (!permissions.includes("View Sessions Job")) {
            hasPermission = false;
          }
          break;
        case "sessions-index-id":
          if (!permissions.includes("Show Sessions Job")) {
            hasPermission = false;
          }
          break;
      }
      return {
        hasPermission
      };
    }
  }
});
