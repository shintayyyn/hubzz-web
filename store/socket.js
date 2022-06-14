export const state = () => ({

})

export const getters = {
}

export const mutations = {
}

export const actions = {
  async init () {
    console.log('Socket Initialize')

    this.$socket.on('connect', () => {
      console.log('Socket Connected', this.$socket.id, this.$auth.loggedIn)

      let token = this.$auth.$storage.getUniversal('_token.local')

      console.log('Socket Connected', token)

      if (token) {
        token = token.replace('Bearer ', '')

        this.$axios.post('/api/v1/socket/login', {
          socket_id: this.$socket.id,
        }).then(() => {
          console.log('Socket Logged In')
        })
      }
    })
  },
}
