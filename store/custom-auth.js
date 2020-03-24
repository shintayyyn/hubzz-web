export const state = () => ({
})

export const getters = {
}

export const mutations = {
  loggedIn () {
    console.log('loggedIn')
    if (!this.$auth.loggedIn) {
      console.log('fetchUser')
      this.$auth.fetchUser().then(() => {
        this.$router.push('/dashboard')
      }).catch((err) => {
        console.log('err', err)
      }).finally(() => {
        console.log('finally')
      })
    }
  },
  loggedOut () {
    console.log('loggedOut')
    if (this.$auth.loggedIn) {
      this.$auth.logout().then(() => {
        this.$router.push('/')
      }).catch((err) => {
        console.log('err', err)
      })
    }
  },
}

export const actions = {

}
