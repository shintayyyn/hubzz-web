import Vue from 'vue'
import moment from 'moment'

Vue.filter('localDate', function (date, time) {
  if (date && time) {
    return `${moment(date).format('L')} ${moment(date).format('HH:mm:ss')}`
  } else if (date) {
    return `${moment(date).format('L')}`
  } else {
    return
  }
})

Vue.filter('StringMaxLength', function (str, numLenth) {
  if (str) {
    return str.length > numLenth ? `${str.substring(0, numLenth)}..` : str
  }
})
