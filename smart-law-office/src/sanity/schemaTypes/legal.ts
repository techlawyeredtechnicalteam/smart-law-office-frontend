import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'legalContent',
  type: 'document',
  title: 'Legal Content',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title'
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [{ type: 'block' }]
    }),
    defineField({
      name: 'lastUpdated',
      type: 'datetime',
      title: 'Last Updated',
      validation: Rule => Rule.required()
    })
  ]
})