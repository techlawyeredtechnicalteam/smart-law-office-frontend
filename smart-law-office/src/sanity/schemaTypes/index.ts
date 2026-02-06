// import { type SchemaTypeDefinition } from 'sanity'

// export const schema: { types: SchemaTypeDefinition[] } = {
//   types: [],
// }

import { type SchemaTypeDefinition } from 'sanity'
import legalContent from './legal'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [legalContent],
}