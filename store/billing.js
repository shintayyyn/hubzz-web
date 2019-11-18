export const state = () => ({
  practice_billing_notifications: [],
  locum_billing_notifications: [],
})

export const mutations = {
  ADD_PRACTICE_BILLING_NOTIFICATION(state, payload) {
    let index = state.practice_billing_notifications.findIndex(billing => billing.id === payload.id)
    if (index >= 0) {
      state.practice_billing_notifications.splice(index, 1, payload)
    } else if (index < 0) {
      if (state.practice_billing_notifications.length >= 5) {
        state.practice_billing_notifications.pop()
        state.practice_billing_notifications.unshift(payload)
      } else if (state.practice_billing_notifications.length < 5) {
        state.practice_billing_notifications.unshift(payload)
      }
    }
  },
  REMOVE_PRACTICE_BILLING_NOTIFICATION(state, payload) {
    state.practice_billing_notifications = state.practice_billing_notifications.filter(job => job.id !== payload)
  },
  ADD_LOCUM_BILLING_NOTIFICATION(state, payload) {
    let index = state.locum_billing_notifications.findIndex(billing => billing.id === payload.id)
    if (index >= 0) {
      state.locum_billing_notifications.splice(index, 1, payload)
    } else if (index < 0) {
      if (state.locum_billing_notifications.length >= 5) {
        state.locum_billing_notifications.pop()
        state.locum_billing_notifications.unshift(payload)
      } else if (state.locum_billing_notifications.length < 5) {
        state.locum_billing_notifications.unshift(payload)
      }
    }
  },
  REMOVE_LOCUM_BILLING_NOTIFICATION(state, payload) {
    state.locum_billing_notifications = state.locum_billing_notifications.filter(job => job.id !== payload)
  },
}
export const actions = {
  async initializeBillingListener({ commit }) {
    // PRACTICE
    this.$socket.on('Practice Notification Locum Invoice Paid', async ({ id }) => {
      const response = await this.$axios.$get(`/api/v1/practice/locum-invoices/${id}`)
      if (response.data && response.data.locum_invoice) {
        commit('ADD_PRACTICE_BILLING_NOTIFICATION', { ...response.data.locum_invoice, notificationType: 'Practice Notification Locum Invoice Paid' })
      }
    })
    this.$socket.on('Practice Notification Locum Invoice Updated', async ({ id }) => {
      const response = await this.$axios.$get(`/api/v1/practice/locum-invoices/${id}`)
      if (response.data && response.data.locum_invoice) {
        commit('ADD_PRACTICE_BILLING_NOTIFICATION', { ...response.data.locum_invoice, notificationType: 'Practice Notification Locum Invoice Updated' })
      }
    })
    // LOCUM
    this.$socket.on('Locum Notification Locum Invoice Paid', async ({ id }) => {
      const response = await this.$axios.$get(`/api/v1/locum/locum-invoices/${id}`)
      if (response.data && response.data.locum_invoice) {
        commit('ADD_LOCUM_BILLING_NOTIFICATION', { ...response.data.locum_invoice, notificationType: 'Locum Notification Locum Invoice Paid' })
      }
    })
    this.$socket.on('Locum Notification Locum Invoice Updated', async ({ id }) => {
      const response = await this.$axios.$get(`/api/v1/locum/locum-invoices/${id}`)
      if (response.data && response.data.locum_invoice) {
        commit('ADD_LOCUM_BILLING_NOTIFICATION', { ...response.data.locum_invoice, notificationType: 'Locum Notification Locum Invoice Updated' })
      }
    })
  },
}
export const getters = {
  getPracticeBillingNotifications(state) {
    let notifications = []
    state.practice_billing_notifications.forEach(notif => {
      let message = ''
      let notifObj = {
        id: notif.id,
        invoice_number: notif.invoice_number,
        status: notif.status,
        date_start: notif.date_start,
        date_end: notif.date_end,
        issued_at: notif.issued_at,
        paid_at: notif.paid_at,
        locum_user: notif.locum_user.name,
        notification_type: notif.notificationType,
        url: `/practice-billing/invoices-from-locums/${notif.id}`,
      }
      switch (notif.notificationType) {
        case 'Practice Notification Locum Invoice Updated':
          message = 'This invoice has been Updated'
          notifObj = {
            ...notifObj,
            message
          }
          break;
        case 'Practice Notification Locum Invoice Paid':
          message = 'This invoice has been Paid'
          notifObj = {
            ...notifObj,
            message
          }
          break;
      }
      notifications.push(notifObj)
    })
    return notifications
  },
  getLocumBillingNotifications(state) {
    let notifications = []
    state.locum_billing_notifications.forEach(notif => {
      let message = ''
      let notifObj = {
        id: notif.id,
        invoice_number: notif.invoice_number,
        status: notif.status,
        date_start: notif.date_start,
        date_end: notif.date_end,
        issued_at: notif.issued_at,
        paid_at: notif.paid_at,
        practice: notif.surgery.name,
        notification_type: notif.notificationType,
        url: `/locum-billing/invoices/${notif.id}`,
      }
      switch (notif.notificationType) {
        case 'Locum Notification Locum Invoice Updated':
          message = 'This invoice has been Updated'
          notifObj = {
            ...notifObj,
            message
          }
          break;
        case 'Locum Notification Locum Invoice Paid':
          message = 'This invoice has been Paid'
          notifObj = {
            ...notifObj,
            message
          }
          break;
      }
      notifications.push(notifObj)
    })
    return notifications
  },
}
