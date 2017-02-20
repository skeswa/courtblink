
const plainTransformer = payloadKey => payload => payload[payloadKey]

export const Num = plainTransformer
export const Text = plainTransformer
export const Bool = plainTransformer
export function DTO(schema) {
  const formatter = formatWithSchema.bind(this, schema)
  const result = payloadKey => payload => {
    const payloadData = payloadKey ? payload[payloadKey] : payload
    return Array.isArray(payloadData)
        ? payloadData.map(formatter)
        : formatter(payloadData)
  }
  result.buildFrom = result()

  return result
}

function formatWithSchema(schema, payload) {
  const output = {}

  Object
    .keys(schema)
    .forEach(schemaKey => output[schemaKey] = schema[schemaKey](payload))

  return output
}
