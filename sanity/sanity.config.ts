import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'it-auditors-notebook',
  title: "The IT Auditor's Notebook",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    // visionTool() can be added after installing @sanity/vision
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Articles').schemaType('article').child(
              S.documentTypeList('article').title('Articles')
            ),
            S.listItem().title('Categories').schemaType('category').child(
              S.documentTypeList('category').title('Categories')
            ),
            S.listItem().title('Authors').schemaType('author').child(
              S.documentTypeList('author').title('Authors')
            ),
            S.divider(),
            S.listItem().title('Newsletter Subscribers').schemaType('subscriber').child(
              S.documentTypeList('subscriber').title('Subscribers')
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
