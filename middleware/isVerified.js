export default function ({ store, error, }) {
  if (store.$auth.user.domain === 'Locum') {
    if (store.$auth.user.status !== "Active" && store.$auth.user.status !== "Dormant") {
      return error({
        statusCode: 401,
        message: 'Your Locum is Not Authorized',
      })
    }
  }

  if (
    store.$auth.user.domain === 'Practice'
    && (
      store.$auth.user.status !== "Active"
      || (store.$auth.user.practice_detail.practice.status !== "Active" && store.$auth.user.practice_detail.practice.status !== "Dormant")
    )
  ) {
    return error({
      statusCode: 401,
      message: 'Your Practice is Not Authorized',
    })
  }
}
