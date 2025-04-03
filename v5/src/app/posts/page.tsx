import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import Link from 'next/link'
import styles from './page.module.scss'

interface Post {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt: string
}

const postsQuery = groq`
  *[_type == "post"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    excerpt
  }
`

export default async function PostsPage() {
  const posts: Post[] = await client.fetch(postsQuery)

  return (
    <div className={styles.container}>
      <h1>All Posts</h1>
      <div className={styles.posts}>
        {posts.map((post) => (
          <article key={post._id}>
            <h2>
              <Link href={`/posts/${post.slug.current}`}>
                {post.title}
              </Link>
            </h2>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  )
}