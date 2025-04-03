import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import styles from './page.module.scss'

// Skilgreina týpu fyrir færslu
interface Post {
  _id: string
  title: string
  content: string
  slug: string
}

// GraphQL fyrir eina færslu
const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    content
  }
`

// Skilgreina hvaða slugs eru til fyrir Static Generation
export async function generateStaticParams() {
  const query = groq`*[_type == "post"]{ "slug": slug.current }`
  const posts: Post[] = await client.fetch(query)

  return posts.map((post) => ({ slug: post.slug }))
}

// Skilgreina týpu fyrir síðu
interface PostPageProps {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  // Await the params promise first
  const { slug } = await params
  
  // Sækja færslu byggt á slug
  const post: Post | null = await client.fetch(postQuery, { slug })

  if (!post) {
    return <p>Færsla fannst ekki</p>
  }

  return (
    <article className={styles.container}>
      <h1>{post.title}</h1>
      <div className={styles.content}>{post.content}</div>
    </article>
  )
}