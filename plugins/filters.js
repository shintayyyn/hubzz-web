import Vue from 'vue'
import moment from 'moment'

Vue.filter('localDate', function (date, dateOnly) {
  const formattedDate = moment(date, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY')

  if (dateOnly) {
    return formattedDate
  }
  
  if (date) {
    const formattedTime = moment(date, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('HH:mm')
    return `${formattedDate} | ${formattedTime}`
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
      break
    case 'MB':
      sizeDivider = 1048576
      break
    case 'GB':
      sizeDivider = 1073741824
      break
    default:
      sizeDivider = 1048576
  }

  if (fileSize) {
    return `${(fileSize / sizeDivider).toFixed(2)} ${sizeType ? sizeType : 'MB'}`
  }
})

Vue.filter('minutes', function (min) {
  return min % 60 ? min % 60 + 'm' : ''
  // return min % 60 ? min % 60 + `min${min % 60 > 1 ? 's' : ''}` : ''
})

Vue.filter('hours', function (min) {
  return Math.floor(min / 60) ? Math.floor(min / 60) + 'h' : ''
  // return Math.floor(min / 60) ? Math.floor(min / 60) + `hr${Math.floor(min / 60) > 1 ? 's' : ''}` : ''
})

Vue.filter('hoursMinutes', function (num) {
  let hours = Math.floor(num / 60)
  let minutes = Math.floor(num % 60)
  let hrDisplay = `${hours > 0 ? `${hours}h` : ''}`
  let minDisplay = `${minutes > 0 ? `${minutes}m` : ''}`
  return `${hrDisplay} ${minDisplay}`
})

Vue.filter('trim', function (text) {
  return text.replace(/^\s*/, "").replace(/\s*$/, "")
})

