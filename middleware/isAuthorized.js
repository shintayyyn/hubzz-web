export default function ({store, route, redirect}) {
    let practiceRoute = ['/profile', '/my-banks', '/sessions']
    let locumRoute = ['/compliance', '/availability', '/jobs']
    let normalPracticeRoute = ['/my-banks', '/sessions', '/practice-billing']

    if (store.$auth.user && store.$auth.user.domain === 'Locum' && practiceRoute.includes(route.path)) {
      return redirect('/')
    }
    if (store.$auth.user && store.$auth.user.domain === 'Practice' && locumRoute.includes(route.path)) {
      return redirect('/')
    }
    if (store.$auth.user && 
      store.$auth.user.domain === 'Practice'&&
      store.$auth.user.practice_detail.practice.type === 'Hub' && 
      store.$auth.user.practice_detail.practice.hub_type === 'Type 2' && 
      normalPracticeRoute.includes(route.path)){
        return redirect('/')
    }
}
