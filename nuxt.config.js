import dotenv from 'dotenv'
import path from 'path'
dotenv.config()

import pkg from './package'

export default {
  mode: 'universal',

  env: {
    API_URL: process.env.API_URL,
    ONE_SIGNAL_APP_ID: process.env.ONE_SIGNAL_APP_ID,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },

  /*
  ** Headers of the page
  */
  head: {
    title: 'Hubzz',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Nunito' }
    ],
    script: [
      { src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCqkvPPMK1lBnOF1NpxUggGFzkfcoaHV24&libraries=places' }
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '@/plugins/socket-io.js',
      ssr: false
    },

    {
      src: '@/plugins/one-signal.js',
      ssr: false
    },
    {
      src: '@/plugins/vue-svgicon.js',
      ssr: true
    },
    {
      src: '@/plugins/moment.js',
      ssr: true
    },
    {
      src: '@/plugins/mixin.js',
      ssr: true
    },
    {
      src: '@/plugins/filters.js',
      ssr: true
    },
    {
      src: '@/plugins/vue2-google-maps.js',
    },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    '@nuxtjs/auth',
    '@nuxtjs/onesignal',
    '@nuxtjs/pwa',
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.API_URL
  },

  router: {
    middleware: 'isAuthorized'
  },

  auth: {
    cookie: {
      options: {
        expires: 1825,
      },
    },
    strategies: {
      local: {
        endpoints: {
          logout: null,
          user: {
            url: '/api/v1/me',
            method: 'get',
            propertyName: 'data.user'
          }
        }
      }
    }
  },

  oneSignal: {
    init: {
      appId: process.env.ONE_SIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
          disable: true
      }
    }
  },

  vue: {
    config: {
     productionTip: false,
     devtools: true,
    }
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: [/^vue2-google-maps($|\/)/],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    },
    postcss: {
      plugins: {
        tailwindcss: path.resolve(__dirname, './tailwind.config.js'),
        autoprefixer: {}
      }
    },
    
  }
}
