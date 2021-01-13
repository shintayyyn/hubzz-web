<template>
  <section class="h-full w-full">
    <div class="flex items-center justify-between px-12 md:px-32">
      <nuxt-link
        :to="'/'"
        class=""
      >
        Logo
      </nuxt-link>
      <div class="flex relative">
        <div class="py-5 px-8">
          <p 
            class="flex items-center text-md uppercase font-bold" 
            :class="activeTab === 'Login' ? 'text-black' : 'text-gray-500'"
            @mouseover="activeTab='Login'"
          >
            Log In 
          <svgicon
              name="caret-down"
              width="8"
              height="8"
              class="fill-current ml-2"
            /></p>
        </div>
        <div class="py-5 px-8">
          <p
            class="flex items-center text-md uppercase font-bold" 
            :class="activeTab === 'SignUp' ? 'text-black' : 'text-gray-500'"
            @mouseover="activeTab='SignUp'"
            >
            Be A Partner
          <svgicon
              name="caret-down"
              width="8"
              height="8"
              class="fill-current ml-2"
            /></p>
        </div>
        <div class="py-5 pl-8">
          <p 
            class="flex items-center text-md uppercase font-bold" 
            :class="activeTab === 'About' ? 'text-black' : 'text-gray-500'"
            @mouseover="activeTab='About'"
          >
            About Us 
          <svgicon
              name="caret-down"
              width="8"
              height="8"
              class="fill-current ml-2"
            /></p>
        </div>
        <transition name="drop-down">
          <div 
          v-if="activeTab" 
          class="dropdown absolute bottom-0 w-full border-t" 
          v-on-clickaway="onClickaway"
          >
            <div class="bg-white rounded-b-lg">
              <!-- LOGIN -->
                <div v-if="activeTab === 'Login'" class="w-2/3 mx-auto p-4">
                  <div class="w-full flex flex-col">
                    <AppInput
                      v-model="email"
                      type="text"
                      name="email"
                      label=""
                      placeholder="Email or Username"
                      :error="formErrors.find(formError => formError.field === 'email')"
                      @submit="login"
                    />

                    <div class="flex flex-col">
                      <!-- <label class="text-xs md:text-sm">Password</label> -->
                      <div class="w-full relative">
                        <input
                          v-model="password"
                          :type="passwordInputType"
                          placeholder="Password"
                          class="bg-gray-200 rounded-lg w-full text-xs sm:text-sm focus:border transition-fade outline-none py-2 px-4"
                          :class="formErrors.find(formError => formError.field === 'password') ? 'border-red-500' : ''"
                          @submit="login"
                          @keyup.enter="login"
                        >
                        <button v-if="password" tabindex="-1" class="absolute top-0 right-0 mx-2 h-full focus:outline-none"
                                @click="passwordInputType === 'password' ? passwordInputType = 'text' : passwordInputType = 'password'"
                        >
                          <svgicon v-if="passwordInputType === 'password'" name="eye" height="20" width="20"
                                  class="fill-current text-gray-500 hover:text-gray-600"
                          />
                          <svgicon v-else name="hide-eye" height="20" width="20"
                                  class="fill-current text-gray-500 hover:text-gray-600"
                          />
                        </button>
                      </div>
                      <transition name="drop-down">
                        <div
                          v-if="formErrors.find(formError => formError.field === 'password')"
                          class="text-red-500 py-1 text-xs text-white"
                        >
                          {{ formErrors.find(formError => formError.field === 'password').message }}
                        </div>
                      </transition>
                    </div>
                  </div>


                  <div class="flex justify-center">
                    <AppButton label="Log In" class="w-full my-4" :disabled="loggingIn" @click="login" />
                  </div>

                  <div class="text-center my-2">
                    <nuxt-link to="/forgot-password">
                      <span class="underline text-gray-500 cursor-pointer">Having trouble logging in?</span>
                    </nuxt-link>
                    <!-- <nuxt-link to="/forgot-password">
                      <span class="hover:underline text-sm cursor-pointer">Forgot password?</span>
                    </nuxt-link>
                    <nuxt-link to="/change-email-request">
                      <span class="hover:underline text-sm cursor-pointer">Forgot email?</span>
                    </nuxt-link> -->
                  </div>

                </div>

              <!-- SIGNUP -->
                <div v-if="activeTab === 'SignUp'" class="flex flex-col uppercase">
                  <nuxt-link
                    :to="'/sign-up/locum'"
                    class="text-center font-bold py-6 text-lg text-gray-700 cursor-pointer focus:outline-none border-b"
                  >
                    Locum
                  </nuxt-link>
                  <nuxt-link
                    :to="'/sign-up/practice'"
                    class="text-center font-bold py-6 text-lg text-gray-700 cursor-pointer focus:outline-none border-b"
                  >
                    Practice
                  </nuxt-link>
                  <nuxt-link
                    :to="'/sign-up'"
                    class="text-center font-bold py-6 text-lg text-gray-700 cursor-pointer focus:outline-none"
                  >
                    Employment
                  </nuxt-link>
                </div>

              <!-- ABOUT -->
                <div v-if="activeTab === 'About'" class="p-4">
                  Working in progress...
                </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="h-full relative">
     <nuxt-child />
    </div>
  </section>
  <!-- <section class="sign-in-card">
    <div class="flex flex-col">
      <div class="flex flex-row flex-no-wrap justify-center md:mb-16">
        <nuxt-link
          :to="'/'"
          :event="$route.name === 'index' ? '' : 'click'"
          class="px-8 md:px-12 py-5 font-bold text-sm cursor-pointer focus:outline-none"
          :class="$route.name === 'index' ? 'rounded-full bg-yellow-500 text-black' : 'text-gray-600'"
        >
          Sign In
        </nuxt-link>

        <nuxt-link
          :to="'/sign-up'"
          :event="$route.name === 'index-sign-up' ? '' : 'click'"
          class="px-8 md:px-12 py-5 font-bold text-sm cursor-pointer focus:outline-none"
          :class="$route.name === 'index-sign-up' ? 'rounded-full bg-yellow-500 text-black' : 'text-gray-600'"
        >
          Sign Up
        </nuxt-link>
      </div>

      <div class="px-5 mt-5">
        <nuxt-child />
      </div>
    </div>
  </section> -->
</template>

<script>
import { mixin as clickaway, } from "vue-clickaway"
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
  import debounce from "lodash.debounce"
export default {
  layout: "auth",
  components: {
    AppInput,
    AppButton
  },
  mixins: [clickaway,],
  data() {
    return {
        activeTab: '',
        email: '',
        password: '',
        passwordInputType: 'password',
        formErrors: [],
        loggingIn: false,
    }
  },

  watch: {
    email () {
      const index = this.formErrors.findIndex((formError) => formError.field === 'email')

      if (this.email) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
      } else {
        if (index === -1) {
          this.formErrors.push({
            field: 'email',
            message: 'Email is required.',
            validation: 'required',
          })
        }
      }
    },

    password () {
      const index = this.formErrors.findIndex((formError) => formError.field === 'password')

      if (this.password) {
        if (index > -1) {
          this.formErrors.splice(index, 1)
        }
      } else {
        if (index === -1) {
          this.formErrors.push({
            field: 'password',
            message: 'Password is required.',
            validation: 'required',
          })
        }
      }
    },
  },
  mounted () {
    this.$loggedInBroadcastChannel.addEventListener('message', this.loggedInHandler)
  },

  destroyed () {
    this.$loggedInBroadcastChannel.removeEventListener('message', this.loggedInHandler)
  },
  methods: {
    onClickaway() {
      this.activeTab=""
      console.log(this.$route.name)
    },
    login: debounce(async function () {
      try {
        if (this.loggingIn || this.$auth.loggedIn) {
          return
        }

        const data = {
          email: this.email,
          password: this.password,
        }

        this.formErrors = await this.$validator(data, {
          email: 'required|string',
          password: 'required|string',
        }, {
          'email.required': 'Email is required.',
          'email.string': 'Invalid email.',
          'password.required': 'Password is required.',
          'password.string': 'Invalid password.',
        }).then(() => []).catch((errors) => errors)

        if (this.formErrors.length) {
          return
        }

        this.loggingIn = true

        const response = await this.$axios.post('/api/v1/login', data)

        const token = response.data.data.token.token

        await this.loggedInHandler(token)

        await this.$loggedInBroadcastChannel.postMessage(token)

        this.loggingIn = false
      } catch (err) {
        console.log('err', err.response || err)

        let message = null

        if (err.response) {
          if (err.response.status === 400 && err.response.data.error_messages) {
            this.formErrors = err.response.data.error_messages
          } else {
            message = err.response.data.message
          }
        } else if (err.request) {
          message = 'Something went wrong!'
        } else {
          message = err.message
        }

        if (message) {
          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'danger',
            text: [`${message}`],
          })
        }

        this.loggingIn = false
      }
    }, 10),

    async loggedInHandler (token) {
      try {
        this.$axios.setToken(token, 'Bearer')

        this.$auth.$storage.setUniversal('_token.local', 'Bearer ' + token)

        await this.$auth.fetchUser()

        this.$router.push('/dashboard')

        if (this.$socket.connected) {
          await this.$axios.post('/api/v1/socket/login', {
            socket_id: this.$socket.id
          })

          console.log('Socket Logged In')
        }

        await this.$store.dispatch('one-signal/setOneSignalUser')
      } catch (err) {
        console.log('err', err)
      }
    },
  }
}
</script>

<style scoped>
  .dropdown {
    /* margin-top: 50px; */
    z-index: 1;
    top: 64px;
  }

  .message {
    top: 50%;
    transform: translate(0, -50%);
    right: 0;
    width: 500px;
    background-color: rgba(0, 0, 0, .5);
  }
  .sign-in-card {
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    max-width: 600px;
    max-height: 700px;
    padding: 20px 1px;
  }

  @media screen and (max-width: 1200px) {
    .sign-in-card {
      position: relative;
    }
  }
</style>

