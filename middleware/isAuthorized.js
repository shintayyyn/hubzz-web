export default function ({ store, route, redirect }) {
  let practiceRoute = ['/profile', '/my-banks', '/sessions']
  let locumRoute = ['/compliance', '/availability', '/jobs']
  let practiceHubType1Routes = ['/my-banks', '/sessions', '/practice-billing']

  let spokeRoutes = ['/dashboard/create', '/practice-billing/invoices-from-hubzz/', '/practice-billing', 'invoices-from-hubzz']

  if (store.$auth.user && store.$auth.user.domain === 'Locum' && practiceRoute.includes(route.path)) {
    return redirect('/')
  }
  if (store.$auth.user && store.$auth.user.domain === 'Practice' && locumRoute.includes(route.path)) {
    return redirect('/')
  }
  if (store.$auth.user &&
    store.$auth.user.domain === 'Practice' &&
    store.$auth.user.practice_detail.practice.type === 'Hub' &&
    store.$auth.user.practice_detail.practice.hub_type === 'Type 2' &&
    practiceHubType1Routes.includes(route.path)) {
    return redirect('/')
  }

  if (store.$auth.user &&
    store.$auth.user.domain === 'Practice' &&
    store.$auth.user.practice_detail.practice.type === 'Spoke' && store.$auth.user.practice_detail.practice.parent_practice_id) {

    if (store.$auth.user.practice_detail.practice.allow_surgery_create_sessions === false) {
      if (route.path.includes('/dashboard/create')) {
        return redirect('/')
      }
    }

    // if (store.$auth.user.practice_detail.practice.allow_surgery_bill_hubzz === false) {
    //   if (route.path.includes('/practice-billing/invoices-from-hubzz')) {
    //     return redirect('/')
    //   }
    // }

    if (store.$auth.user.practice_detail.practice.share_banks_to_other_surgeries === false) {
      if (route.path.includes('/surgery-management/practice-hub/spoke-siblings')) {
        return redirect('/')
      }
    }
  }
}
