export default function ({ app, store, redirect }) {
   app.$auth.fetchUser()
   if (!store.$auth.$state.loggedIn) {
      redirect('/')
   }
}
