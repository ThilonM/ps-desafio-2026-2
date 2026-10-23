type ValidityElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement

/** Traduz a mensagem nativa do HTML5 (ex.: "Please fill out this field.") */
export function setPortugueseCustomValidity(element: ValidityElement) {
  element.setCustomValidity('')

  if (element.validity.valid) {
    return
  }

  if (element.validity.valueMissing) {
    element.setCustomValidity('Preencha este campo.')
    return
  }

  if (element.validity.typeMismatch) {
    const isEmail =
      element instanceof HTMLInputElement && element.type === 'email'
    element.setCustomValidity(
      isEmail ? 'Informe um e-mail válido.' : 'Informe um valor válido.',
    )
    return
  }

  if (element.validity.tooShort) {
    const min =
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
        ? element.minLength
        : 0
    element.setCustomValidity(`Use no mínimo ${min} caracteres.`)
    return
  }

  if (element.validity.tooLong) {
    const max =
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
        ? element.maxLength
        : 0
    element.setCustomValidity(`Use no máximo ${max} caracteres.`)
    return
  }

  if (element.validity.rangeUnderflow) {
    element.setCustomValidity('O valor é menor do que o permitido.')
    return
  }

  if (element.validity.rangeOverflow) {
    element.setCustomValidity('O valor é maior do que o permitido.')
    return
  }

  if (element.validity.stepMismatch || element.validity.badInput) {
    element.setCustomValidity('Informe um valor válido.')
    return
  }

  if (element.validity.patternMismatch) {
    element.setCustomValidity('O formato informado não é válido.')
  }
}

export function clearPortugueseCustomValidity(element: ValidityElement) {
  element.setCustomValidity('')
}
