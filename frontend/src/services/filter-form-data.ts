import { imageCompress } from './image-compress'
import { parseDateBrToIso } from './formatter'

const DATE_FIELDS = new Set([
  'data_inicio',
  'data_fim',
  'data_aniversario',
])

export async function filterFormData(form: FormData) {
  const newFormData = new FormData()

  let hasIdField = false

  for (const [key, value] of Array.from(form.entries())) {
    if (key === 'id') {
      hasIdField = true
    }

    if (
      (value instanceof File && value.size > 0) ||
      (typeof value === 'string' && value.trim() !== '')
    ) {
      if (value instanceof File && value.type.startsWith('image/')) {
        newFormData.append(key, await imageCompress(value))
      } else if (typeof value === 'string' && DATE_FIELDS.has(key)) {
        newFormData.append(key, parseDateBrToIso(value))
      } else {
        newFormData.append(key, value)
      }
    }
  }

  if (hasIdField) {
    newFormData.append('_method', 'PUT')
  }

  return newFormData
}
