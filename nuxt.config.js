import dotenv from 'dotenv'

dotenv.config()

import path from 'path'

export default {
  mode: 'universal',

  env: {
    API_URL: process.env.API_URL,
    POSTCODES_IO_URL: process.env.POSTCODES_IO_URL,
    WEB_URL: process.env.WEB_URL,
    ONE_SIGNAL_APP_ID: process.env.ONE_SIGNAL_APP_ID,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },

  head: {
    title: 'Hubzz',
    meta: [
      { charset: 'utf-8', },
      { name: 'viewport', content: 'width=device-width, initial-scale=1', },
      { hid: 'description', name: 'description', content: 'Hubzz Web App', },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Nunito', },
    ],
    script: [
      // {
      //   src: 'https://cdn.onesignal.com/sdks/OneSignalSDK.js',
      //   defer: true,
      // },
      {
        src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCqkvPPMK1lBnOF1NpxUggGFzkfcoaHV24&libraries=places',
      },
    ],
  },

  loading: {
    color: '#F6E05E',
    throttle: 1000,
  },

  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/main.css',
    "quill/dist/quill.snow.css",
    "quill/dist/quill.bubble.css",
    "quill/dist/quill.core.css",
  ],

  plugins: [
    {
      src: '@/plugins/socket-io.js',
      mode: 'client',
    },

    // {
    //   src: '@/plugins/one-signal.js',
    //   mode: 'client',
    // },
    {
      src: '@/plugins/vue-svgicon.js',
      ssr: true,
    },
    {
      src: '@/plugins/moment.js',
      ssr: true,
    },
    {
      src: "~plugins/nuxt-quill-plugin.js",
      ssr: false,
    },
    {
      src: '@/plugins/mixin.js',
      ssr: true,
    },
    {
      src: '@/plugins/filters.js',
      ssr: true,
    },
    {
      src: '@/plugins/vue2-google-maps.js',
      mode: 'client',
    },
    // {
    //   src: '@/plugins/jspdf.js',
    //   mode: 'client',
    // },
    // {
    //   src: '@/plugins/html2canvas.js',
    //   mode: 'client',
    // },
    {
      src: '@/plugins/broadcast-channel.js',
      mode: 'client',
    },
    {
      src: '@/plugins/validator.js',
      mode: 'client',
    },
    {
      src: '@/plugins/axios.js',
    },
  ],

  modules: [
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    '@nuxtjs/auth',
  ],

  axios: {
    baseURL: process.env.API_URL,
  },

  router: {
    middleware: 'isAuthorized',
  },

  auth: {
    localStorage: {
      prefix: `hubzz.auth.`,
    },
    cookie: {
      prefix: `hubzz.auth.`,
      options: {
        path: '/',
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
            propertyName: 'data.user',
          },
        },
      },
    },
  },

  vue: {
    config: {
      productionTip: false,
      devtools: true,
    },
  },

  build: {
    transpile: [
      /^vue2-google-maps($|\/)/,
      '@nuxtjs/axios',
    ],

    extend () {
    },

    postcss: {
      plugins: {
        tailwindcss: path.resolve(__dirname, './tailwind.config.js'),
        autoprefixer: {},
      },
    },

    babel: {
      babelrc: false,
      cacheDirectory: undefined,
      presets: [
        '@nuxt/babel-preset-app',
      ],
      plugins: [
        '@babel/plugin-proposal-object-rest-spread',
      ],
    },
  },
}
