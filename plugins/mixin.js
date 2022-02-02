import Vue from "vue"

import isEmail from 'validator/lib/isEmail'

Vue.mixin({
  methods: {
    async CheckIfUserIsDeactivated () {
      if (this.$auth.loggedIn) {
        await this.$auth.fetchUser()
        if (this.$auth.user.status === 'Deactivated') {
          this.$store.commit('SET_USER_DEACTIVATED')
        }
      }
    },
    async CheckUserVerification () {
      if (this.$auth.user.domain === 'Locum') {
        let oldStatus = this.$auth.user.status
        const response = await this.$axios.$get(`/api/v1/me`)
        let newStatus = response.data.user.status
        if (newStatus !== oldStatus) {
          this.$store.commit('SET_USER_VERIFICATION_MODAL', { modal: true, status: newStatus === 'Active' || newStatus === 'Dormant' ? 'verified' : 'not verified', })
        }
      } else if (this.$auth.user.domain === 'Practice') {
        let oldPracticeUserStatus = this.$auth.user.status
        let oldPracticeUserVerified = oldPracticeUserStatus === 'Disabled' ? 'false' : 'true'
        let oldPracticeStatus = this.$auth.user.practice_detail.practice.status
        let oldPracticeVerified = ['Inactive', 'Account Suspension', 'Deactivated',].includes(oldPracticeStatus) ? 'false' : 'true'
        let oldVerified = [oldPracticeUserStatus, oldPracticeUserVerified, oldPracticeStatus, oldPracticeVerified,].includes('false') ? 'false' : 'true'

        const response = await this.$axios.$get(`/api/v1/me`)

        let newPracticeUserStatus = response.data.user.status
        let newPracticeUserVerified = newPracticeUserStatus === 'Disabled' ? 'false' : 'true'
        let newPracticeStatus = response.data.user.practice_detail.practice.status
        let newPracticeVerified = ['Inactive', 'Account Suspension', 'Deactivated',].includes(newPracticeStatus) ? 'false' : 'true'
        let newVerified = [newPracticeUserStatus, newPracticeUserVerified, newPracticeStatus, newPracticeVerified,].includes('false') ? 'false' : 'true'

        if (oldVerified !== newVerified) {
          this.$store.commit('SET_USER_VERIFICATION_MODAL', { modal: true, status: newVerified === 'true' ? 'verified' : 'not verified', })
        }
      }
    },
    scrollToTop () {
      window.scrollTo(0, 0)
    },
    getDateArray (start, end) {
      let arr = new Array()
      let dt = new Date(start)
      while (dt <= new Date(end)) {
        arr.push(this.$moment(new Date(dt)).format("YYYY-MM-DD"))
        dt.setDate(dt.getDate() + 1)
      }
      return arr
    },

    CheckEmptyField (inputField, fieldName, preferredDisplayName) {
      let trimmedFieldName = fieldName

      let displayFieldName = null

      if (!preferredDisplayName) {
        if (fieldName.includes('_id')) {
          trimmedFieldName = fieldName.replace(/_id/g, "")
        }

        if (fieldName.includes('_or_')) {
          trimmedFieldName = fieldName.replace(/_or_/g, "/")
        }

        displayFieldName = trimmedFieldName.charAt(0).toUpperCase() + trimmedFieldName.slice(1).replace(/_/g, " ")
      }

      let index = this.formError.findIndex(item => item.field === fieldName)

      if (index >= 0) {
        this.formError.splice(index, 1)
      }

      if (!this.formError || this.formError.find(err => err.field === fieldName)) {
        return
      }
      

      if (!(inputField instanceof Array) && !inputField) {
        this.formError.push({
          field: fieldName,
          message: `${preferredDisplayName ? preferredDisplayName : displayFieldName} is required `,
        })
      }

      if (inputField instanceof Array && !inputField.length) {
        this.formError.push({
          field: fieldName,
          message: `${preferredDisplayName ? preferredDisplayName : displayFieldName} is required `,
        })
      }

      if (typeof inputField === "boolean" && inputField === false) {
        this.formError.push({
          field: fieldName,
          message: `${preferredDisplayName ? preferredDisplayName : displayFieldName} is required `,
        })
      }

      if (inputField) {
        // if (fieldName === 'email') {
        //   let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //   if (!re.test(String(inputField).toLowerCase())) {
        //     this.formError.push({
        //       field: fieldName,
        //       message: "This is not a valid email"
        //     });
        //   }
        // }
      }
    },
    Validate (form, lists, preferredDisplayName) {
      let items = Object.entries(form)
      for (const [key, value,] of items) {
        let trimmedFieldName = key
        let displayFieldName = null

        if (key.includes('_id')) {
          trimmedFieldName = key.replace(/_id/g, "")
        }
        if (key.includes('_or_')) {
          trimmedFieldName = key.replace(/_or_/g, "/")
        }
        displayFieldName = trimmedFieldName.charAt(0).toUpperCase() + trimmedFieldName.slice(1).replace(/_/g, " ")

        if (preferredDisplayName) {
          let findField = preferredDisplayName.find(item => item.field === key)
          if (findField) {
            displayFieldName = findField.display
          }
        }
        // check if value is array
        if (Array.isArray(value)) {
          if (value.length === 0) {
            if (!lists) {
              this.formError.push({
                field: key,
                message: `${displayFieldName} is required`,
              })
            }
            if (lists && !lists.includes(key)) {
              this.formError.push({
                field: key,
                message: `${displayFieldName} is required`,
              })
            }
          }
        } else {
          if (!value || value.toString().trim().length === 0) {
            if (!lists) {
              this.formError.push({
                field: key,
                message: `${displayFieldName} is required`,
              })
            }
            if (lists && !lists.includes(key)) {
              this.formError.push({
                field: key,
                message: `${displayFieldName} is required`,
              })
            }
          }
        }
        if (value) {
          if (trimmedFieldName === 'email') {
            // let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            // if (!re.test(String(value).toLowerCase())) {
            // }
            if (!isEmail(value)) {
              this.formError.push({
                field: trimmedFieldName,
                message: "This is not a valid email",
              })
            }
          }
        }
      }
    },
    // Realtime Checking of user permissions. 
    CheckPermissions (permissions) {
      let hasPermission = true
      switch (this.$route.name) {
      case "profile-practice":
        if (!permissions.includes("View Profile Practice")) {
          hasPermission = false
        }
        break
      case "profile-branches-surgeries":
        if (!permissions.includes("View Surgery Management")) {
          hasPermission = false
        }
        break
      case "profile-branches-surgeries-id":
        if (!permissions.includes("View Surgery Management")) {
          hasPermission = false
        }
        break
      case "profile-branches-surgeries-create":
        if (!permissions.includes("View Surgery Management")) {
          hasPermission = false
        }
        break
      case "profile-users":
        if (!permissions.includes("View Profile Users")) {
          hasPermission = false
        }
        break
      case "profile-users-id":
        if (!permissions.includes("Show Profile Users")) {
          hasPermission = false
        }
        break
      case "profile-users-create":
        if (!permissions.includes("Create Profile Users")) {
          hasPermission = false
        }
        break
      case "profile-practice-documents":
        if (!permissions.includes("View Profile Practice Document")) {
          hasPermission = false
        }
        break
      case "profile-practice-documents-id":
        if (!permissions.includes("Show Profile Practice Document")) {
          hasPermission = false
        }
        break
      case "sessions-index":
        if (!permissions.includes("View Sessions Job")) {
          hasPermission = false
        }
        break
      case "sessions-index-id":
        if (!permissions.includes("Show Sessions Job")) {
          hasPermission = false
        }
        break
      case "permanent-jobs":
        if (!permissions.includes("View Permanent Jobs")) {
          hasPermission = false
        }
        break
      }
      return {
        hasPermission,
      }
    },
    changeDateFormat (form, dates, oldFormat, newFormat) {
      let submitForm = { ...form, }
      let items = Object.entries(form)
      for (const [key, value,] of items) {
        if (dates.includes(key)) {
          let newValueFormat = this.$moment(value, oldFormat).format(newFormat)
          submitForm[key] = newValueFormat
        }
      }
      return submitForm
    },

    isNumber (e) {
      let acceptedKeys = [
        "Backspace",
        "Tab",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Delete",
      ]
      // for input type number to avoid entering 'e'
      e = e ? e : window.event
      // let charCode = (e.which) ? e.which : e.keyCode
      // if (charCode === 101 || charCode === 43 || charCode === 45) {
      //   e.preventDefault()
      // } else {
      //   return true
      // }

      const {
        key,
        target,
      } = e

      const {
        value,
        selectionStart,
        selectionEnd,
      } = target

      console.log("key", key)

      if (key < 10) {
        if (value.includes('.')) {
          const decimal = value.split('.')[1]

          if (
            decimal.length === 2
            && selectionStart === selectionEnd
            && selectionStart > value.length - 3
          ) {
            e.preventDefault()
          }
        }

        return
      } else if (key === '.') {
        if (value.includes('.')) {
          e.preventDefault()
        }
      } else if (acceptedKeys.includes(key)) {
        return
      } else {
        e.preventDefault()
      }
    },

    isNumberDash (e) {
      var charCode = (e.which) ? e.which : e.keyCode
      // && charCode != 45 
      if (charCode != 46 && charCode > 33 && (charCode < 48 || charCode > 57)) {
        e.preventDefault()
      }
      return true
    },

    mixinNumber (e) {
      if (!(/^[0-9]+$/i.test(e.key) || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',].includes(e.key))) {
        e.preventDefault()
      }
    },

    mixinAplhanumberic (e) {
      if (!(/^[a-zA-Z0-9]+$/i.test(e.key) || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',].includes(e.key))) {
        e.preventDefault()
      }
    },

    mixinSortCode (e) {
      if (!(/^[0-9]+$/i.test(e.key) || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',].includes(e.key))) {
        e.preventDefault()
      }
    },

    mixinVatNumber (e) {
      if (!(/^[0-9]+$/i.test(e.key) || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',].includes(e.key))) {
        e.preventDefault()
      }
    },

    mixinPhoneNumber (e) {
      if (!(/^[0-9]+$/i.test(e.key) || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',].includes(e.key))) {
        e.preventDefault()
      }
    },

    mixinAccountNumber (e) {
      if (!(/^[0-9]+$/i.test(e.key) || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',].includes(e.key))) {
        e.preventDefault()
      }
    },

    mixinPcseEaCode (e) {
      if (!(/^[a-zA-Z0-9]+$/i.test(e.key) || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',].includes(e.key))) {
        e.preventDefault()
      }
    },

    mixinNhspsEaCode (e) {
      if (!(/^[a-zA-Z0-9]+$/i.test(e.key) || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',].includes(e.key))) {
        e.preventDefault()
      }
    },

    inputNumberOnly (e) {
      // numbers only [0-9]
      e = (e) ? e : window.event
      var charCode = (e.which) ? e.which : e.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105) && (charCode < 37 || charCode > 40) && (![46,].includes(charCode)))) {
        e.preventDefault()
      } else {
        return true
      }
    },
    alphaNumeric (e) {
      // numbers only [0-9, A-Z, a-z]
      e = (e) ? e : window.event
      var charCode = (e.which) ? e.which : e.keyCode
      let specialKeys = [8, 9, 46, 36, 35, 37, 38, 39, 40,]
      if (e.shiftKey) {
        if ((charCode => 48 || charCode <= 57) && (charCode < 65 || charCode > 122)) {
          e.preventDefault()
        } else {
          return true
        }
      } else {
        if ((charCode > 31) && (charCode < 65 || charCode > 122) && (charCode < 48 || charCode > 57) && (!specialKeys.includes(charCode)) && (![46,].includes(charCode))) {
          e.preventDefault()
        } else {
          return true
        }
      }

    },
    inputTelephone (e) {
      // [0-9,+,-,#]
      e = (e) ? e : window.event
      var charCode = (e.which) ? e.which : e.keyCode
      if (e.shiftKey) {
        if (charCode !== 187) {
          e.preventDefault()
        } else {
          return true
        }
      }
      if ((charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105) && (charCode < 37 || charCode > 40) && (![107, 46,].includes(charCode)))) {
        e.preventDefault()
      } else {
        return true
      }
    },

    limitInput (e, value, limit) {
      if (value.length >= limit) {
        // e.quill.emitter._events.preventDefault()
        // e.preventDefault();
      } else {
        return true
      }
    },

    datesToJobParts (dates) {
      const datesDays = dates
        .reduce((datesDays, date) => {
          datesDays[date] = this.$moment(date, 'YYYY-MM-DD').format('dddd')
          return datesDays
        }, {})

      const jobParts = []

      const dayOrder = {
        Monday: 0,
        Tuesday: 1,
        Wednesday: 2,
        Thursday: 3,
        Friday: 4,
        Saturday: 5,
        Sunday: 6,
      }

      dates.forEach((date) => {
        if (jobParts.length === 0) {
          jobParts.push({
            dates: [
              date,
            ],
          })
        } else {
          const lastJobPart = jobParts[jobParts.length - 1]

          const {
            dates: jobPartDates,
          } = lastJobPart

          const lastDate = jobPartDates[jobPartDates.length - 1]

          const lastDateDay = datesDays[lastDate]

          const lastDateDayOrder = dayOrder[lastDateDay]

          const dateDay = datesDays[date]

          const dateDayOrder = dayOrder[dateDay]

          const daysDifference = this.$moment(date, 'YYYY-MM-DD').diff(this.$moment(lastDate, 'YYYY-MM-DD'), 'days')

          const validDaysDifference = dayOrder.Sunday - lastDateDayOrder

          if (lastDateDayOrder <= dateDayOrder && validDaysDifference >= daysDifference) {
            lastJobPart.dates.push(date)
          } else {
            jobParts.push({
              dates: [
                date,
              ],
            })
          }
        }
      })

      return jobParts
    },
  },
})
