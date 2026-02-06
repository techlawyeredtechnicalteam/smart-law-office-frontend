import { client } from '@/sanity/lib/client'

export interface LegalContent {
  title: string
  slug: { current: string }
  content: any[]
  lastUpdated: string
}

export async function getLegalContent(slug: string): Promise<LegalContent | null> {
  return client.fetch(
    `*[_type == "legalContent" && slug.current == $slug][0]{
      title,
      slug,
      content,
      lastUpdated
    }`,
    { slug }
  )
}

export async function getAllLegalSlugs() {
  return client.fetch(`*[_type == "legalContent"]{ "slug": slug.current }`)
}