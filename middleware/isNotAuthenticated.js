export default function ({ app, store, redirect }) {
   app.$auth.fetchUser()
   console.log('test', app.$auth.loggedIn, store.$auth.$state.loggedIn)
   if (!store.$auth.$state.loggedIn) {
      redirect('/')
   }
}
