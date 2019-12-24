import Vue from 'vue'
import moment from 'moment'

Vue.filter('localDate', function (date, dateOnly) {
  if (dateOnly) {
    return `${moment(date).format('L')}`
  }
  if (date) {
    return `${moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DD')} | ${moment(date).format('HH:mm')}`
  }
})

Vue.filter('currency', function (number) {
  if (number) {
    return number.toFixed(2);
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


