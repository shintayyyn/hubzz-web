import html2canvas from 'html2canvas'

export default (ctx, inject) => {
    ctx.$html2canvas = html2canvas

    inject('html2canvas', html2canvas)
}