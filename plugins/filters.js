import Vue from 'vue'
import moment from 'moment'

Vue.filter('localDate', function (date, dateOnly) {
    if (dateOnly) {
      return `${moment(date).format('L')}`
    }
    if (date) {
      return `${moment(date).format('L')} ${moment(date).format('HH:mm:ss')}`
    }
})

Vue.filter('currency', function (number) {
    if (number) {
      return  number.toFixed(2);
    }
    return '0.00'
})

Vue.filter('StringMaxLength', function (str, numLength) {
  if (str) {
    return str.length > numLength ? `${str.substring(0, numLength)}..` : str
  }
})

Vue.filter('stringMatch', function(str, matchLength) {
  if (str) {
    console.log(matchLength)
    return str
  }
})
