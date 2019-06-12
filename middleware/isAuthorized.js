export default function ({store, route, redirect}) {
    let practiceRoute = ['/profile', '/my-banks', '/sessions']
    let locumRoute = ['/compliance', '/availability', '/jobs']
    if (store.$auth.user && store.$auth.user.domain === 'Locum' && practiceRoute.includes(route.path)) {
        return redirect('/')
    }
    if (store.$auth.user && store.$auth.user.domain === 'Practice' && locumRoute.includes(route.path)) {
        return redirect('/')
    }
}
