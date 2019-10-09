export default function (req, res, next) {
    const ssrPaths = ['/']

    if (!ssrPaths.includes(req.originalUrl)) {
        res.spa = true
    }

    // Don't forget to call next in all cases!
    // Otherwise, your app will be stuck forever :|
    next()
}
