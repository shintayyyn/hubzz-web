export default {
  getLocumPermanentJobNotifications(state) {
    let notifications = []
    state.locum_permanent_job_notifications.forEach(notif => {
      let message = ''
      let notifObj = null

      switch (notif.notificationType) {
        case 'Locum Notification Permanent Job Applied':
          message = 'You have Applied to a Permanent Job'
          break
        case 'Locum Notification Permanent Job Invited':
          message = 'You have been invited for an Interview for a Permanent Job Position'
          break
        case 'Locum Notification Permanent Job Rejected':
          message = 'Your application for a Permanent Job position has been rejected'
          break
        case 'Locum Notification Permanent Job Unsuccessful':
          message = 'Your application for a Permanent Job position has been Unsuccessful'
          break
        default:
          message = ''
      }

      notifObj = {
        ...notif,
        id: notif.permanent_job.id,
        status: notif.permanent_job_application ? notif.permanent_job_application.application_status : notif.permanent_job.job_posting_status,
        permanent_job_status: notif.permanent_job.status,
        permanent_job_app_id: notif.permanent_job_application ? notif.permanent_job_application.id : null,
        notification_type: notif.notificationType,
        type: 'Permanent Jobs',
        message: `${message}. ${notif.locum_status === 'Pending' ? 'This Permanent Job is no longer available.' : ''}`
      }
      notifications.push(notifObj)
    })
    return notifications
  },

  getPracticePermanentJobNotifications(state) {
    let notifications = []
    state.practice_permanent_job_notifications.forEach(notif => {
      let message = ''
      let notifObj = null

      switch (notif.notificationType) {
        case 'Practice Notification Permanent Job Applied':
          message = 'A Locum has applied to a Permanent Job'
          break
        case 'Practice Notification Permanent Job Invited':
          message = 'You have invited a Locum for a Permanent Job Position'
          break
        case 'Practice Notification Permanent Job Approved':
          message = 'Your job posting has been approved by your Hub'
          break
        case 'Practice Notification Permanent Job Rejected':
          message =  'Your job posting has been rejected by your Hub'
          break
        default:
          message = ''
      }

      notifObj = {
        ...notif,
        id: notif.permanent_job.id,
        status: notif.permanent_job.job_posting_status,
        application_status: notif.permanent_job_application ? notif.permanent_job_application.application_status : null,
        permanent_job_app_id: notif.permanent_job_application ? notif.permanent_job_application.id : null,
        notification_type: notif.notificationType,
        type: 'Permanent Jobs',
        message,
      }
      notifications.push(notifObj)
    })
    return notifications
  },
}