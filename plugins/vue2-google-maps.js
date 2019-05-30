import Vue from 'vue'

import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCqkvPPMK1lBnOF1NpxUggGFzkfcoaHV24',
    libraries: 'places,geometry', // This is required if you use the Autocomplete plugin
  },
})
