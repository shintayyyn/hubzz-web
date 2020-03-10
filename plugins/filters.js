import Vue from 'vue'
import moment from 'moment'

Vue.filter('localDate', function (date, dateOnly) {
  if (dateOnly) {
    return `${moment(date).format('L')}`
  }
  if (date) {
    return `${moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').utc().format('YYYY-MM-DD')} | ${moment(date).utc().format('HH:mm')}`
  }
})

Vue.filter('currency', function (number) {
  if (number) {
    return Number.parseFloat(number).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")

  }
  return '0.00'
})

Vue.filter('StringMaxLength', function (str, numLength) {
  if (str) {
    return str.length > numLength ? `${str.substring(0, numLength)}..` : str
  }
})

Vue.filter('fileSize', function (fileSize, sizeType) {
  let sizeDivider = 0

  switch (sizeType) {
    case 'KB':
      sizeDivider = 1024
      break;
    case 'MB':
      sizeDivider = 1048576
      break;
    case 'GB':
      sizeDivider = 1073741824
      break;
    default:
      sizeDivider = 1048576
  }

  if (fileSize) {
    return `${(fileSize / sizeDivider).toFixed(2)} ${sizeType ? sizeType : 'MB'}`
  }
})

Vue.filter('minutes', function (min) {
  return moment.duration(min, 'hours')._data.minutes ? moment.duration(min, 'hours')._data.minutes + ` minute${moment.duration(min, 'hours')._data.minutes > 1 ? 's' : ''}` : ''
})

Vue.filter('hours', function (min) {
  return moment.duration(min, 'hours')._data.hours ? moment.duration(min, 'hours')._data.hours + ` hour${moment.duration(min, 'hours')._data.hours > 1 ? 's' : ''}` : ''
})

