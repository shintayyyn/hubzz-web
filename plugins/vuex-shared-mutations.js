import shareMutations from 'vuex-shared-mutations'

export default ({ store }) => {
  window.onNuxtReady(() => {
    shareMutations({
      predicate: ['custom-auth/loggedIn', 'custom-auth/loggedOut']
    })(store)
  })
}
