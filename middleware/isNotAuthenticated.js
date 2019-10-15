export default function ({ store, redirect, error }) {
   if (!store.$auth.$state.loggedIn) {
      redirect('/')
      //  error({ statusCode: 401, message: "You're Not Authorized To View This Page"})
   }
}
