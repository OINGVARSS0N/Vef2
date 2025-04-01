import { type SchemaTypeDefinition } from 'sanity'
import page from './page'
import post from './post'



export const schema: { types: SchemaTypeDefinition[] } = {
  types: [page,post],
}
