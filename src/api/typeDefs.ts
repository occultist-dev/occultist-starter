import {makeTypeDef, makeTypeDefs} from "@occultist/occultist";

export const schemas = {
  scm: 'https://schema.org/',
  oct: 'https://schema.occultist.dev/',
  app: 'https://schema.example.com/',
} as const;

export const typeDefs = makeTypeDefs([
  makeTypeDef({ term: 'name', schema: schemas.oct }),
  makeTypeDef({ term: 'title', schema: schemas.oct }),
  makeTypeDef({ term: 'message', schema: schemas.oct }),
  makeTypeDef({ term: 'status', schema: schemas.oct }),
  makeTypeDef({ term: 'result', schema: schemas.oct }),
  makeTypeDef({ term: 'description', schema: schemas.oct }),
  makeTypeDef({ term: 'url', schema: schemas.oct }),
  makeTypeDef({ term: 'page', schema: schemas.oct }),
  makeTypeDef({ term: 'pageSize', schema: schemas.oct }),
  makeTypeDef({ term: 'members', schema: schemas.oct }),
  makeTypeDef({ term: 'actions', schema: schemas.oct, isIRI: true }),
  makeTypeDef({ term: 'potentialAction', schema: schemas.oct, isIRI: true }),
  makeTypeDef({ term: 'todoListing', schema: schemas.app, isIRI: true }),
  makeTypeDef({ term: 'GetTodosAction', schema: schemas.app }),
  makeTypeDef({ term: 'ListTodosAction', schema: schemas.app }),
  makeTypeDef({ term: 'CreateTodosAction', schema: schemas.app }),
  makeTypeDef({ term: 'UpdateTodosAction', schema: schemas.app }),
  makeTypeDef({ term: 'DeleteTodosAction', schema: schemas.app }),
]);

