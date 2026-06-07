import { authorSchema } from './author'
import { categorySchema } from './category'
import { articleSchema } from './article'
import { subscriberSchema } from './subscriber'
import { draftArticleSchema } from './draftArticle'

export const schemaTypes = [authorSchema, categorySchema, articleSchema, subscriberSchema, draftArticleSchema]
