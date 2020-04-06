import { validateAll } from 'indicative/validator'

export default (ctx, inject) => {
  ctx.$validator = validateAll

  inject('validator', validateAll)
}
