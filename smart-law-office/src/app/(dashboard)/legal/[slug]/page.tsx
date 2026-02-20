import { getLegalContent, getAllLegalSlugs } from "@/sanity/queries";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  try {
    const slugs = await getAllLegalSlugs();    
    if (!Array.isArray(slugs)) return [];

    return slugs.map((item: { slug: string }) => ({
      slug: item.slug
    }));
  } catch (error) {
    console.error("Sanity build error (Slugs):", error);
    return [];
  }
}

export default async function LegalPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const data = await getLegalContent(slug);

    if (!data) return notFound();

    return (
      <div className="max-w-4xl mx-auto p-10 prose prose-purple dark:prose-invert">
        <h1>{data.title}</h1>
        <p className="text-sm text-gray-500">
          Last Updated: {new Date(data.lastUpdated).toLocaleDateString()}
        </p>
        <hr />
        <PortableText value={data.content} />
      </div>
    );
  } catch (error) {
    console.error("Sanity build error (Content):", error);
    // If it fails during build, return a 404 or a simplified error
    return notFound();
  }
}

// import { getLegalContent, getAllLegalSlugs } from '@/sanity/queries'
// import { PortableText } from '@portabletext/react'

// export async function generateStaticParams() {
//   const slugs = await getAllLegalSlugs()
//   return slugs.map((item: { slug: string }) => ({
//     slug: item.slug,
//   }))
// }

// export default async function LegalPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }) {
//   const { slug } = await params
//   const data = await getLegalContent(slug)

//   if (!data) {
//     return (
//       <div className="max-w-4xl mx-auto p-10">
//         <h1 className="text-2xl font-bold">Document not found</h1>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-10 prose prose-purple dark:prose-invert">
//       <h1>{data.title}</h1>
//       <p className="text-sm text-gray-500">
//         Last Updated: {new Date(data.lastUpdated).toLocaleDateString()}
//       </p>
//       <hr />
//       <PortableText value={data.content} />
//     </div>
//   )
// }
