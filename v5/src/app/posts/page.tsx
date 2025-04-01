/* eslint-disable @typescript-eslint/no-explicit-any */
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import Link from 'next/link'
import styles from './page.module.scss'
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'

const postsQuery = groq`
  *[_type == "post"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    excerpt
  }
`

export default async function PostsPage() {
  const posts = await client.fetch(postsQuery)

  return (
    <div className={styles.container}>
      <h1>All Posts</h1>
      <div className={styles.posts}>
        {posts.map((post: { _id: Key | null | undefined; slug: { current: any }; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | (string & ReactElement<unknown, string | JSXElementConstructor<any>>) | (string & Iterable<ReactNode>) | (string & ReactPortal) | (string & Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>) | (number & ReactElement<unknown, string | JSXElementConstructor<any>>) | (number & Iterable<ReactNode>) | (number & ReactPortal) | (number & Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>) | (bigint & ReactElement<unknown, string | JSXElementConstructor<any>>) | (bigint & Iterable<ReactNode>) | (bigint & ReactPortal) | (bigint & Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>) | (false & ReactElement<unknown, string | JSXElementConstructor<any>>) | (false & Iterable<ReactNode>) | (false & ReactPortal) | (false & Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>) | (true & ReactElement<unknown, string | JSXElementConstructor<any>>) | (true & Iterable<ReactNode>) | (true & ReactPortal) | (true & Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>) | (ReactElement<unknown, string | JSXElementConstructor<any>> & string) | (ReactElement<unknown, string | JSXElementConstructor<any>> & number) | (ReactElement<unknown, string | JSXElementConstructor<any>> & bigint) | (ReactElement<unknown, string | JSXElementConstructor<any>> & false) | (ReactElement<unknown, string | JSXElementConstructor<any>> & true) | (ReactElement<unknown, string | JSXElementConstructor<any>> & Iterable<ReactNode>) | (ReactElement<unknown, string | JSXElementConstructor<any>> & ReactPortal) | (ReactElement<unknown, string | JSXElementConstructor<any>> & Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>) | (Iterable<ReactNode> & string) | (Iterable<ReactNode> & number) | (Iterable<ReactNode> & bigint) | (Iterable<ReactNode> & false) | (Iterable<ReactNode> & true) | (Iterable<ReactNode> & ReactElement<unknown, string | JSXElementConstructor<any>>) | (Iterable<ReactNode> & ReactPortal) | (Iterable<ReactNode> & Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>) | (ReactPortal & string) | (ReactPortal & number) | (ReactPortal & bigint) | (ReactPortal & false) | (ReactPortal & true) | (ReactPortal & ReactElement<unknown, string | JSXElementConstructor<any>>) | (ReactPortal & Iterable<ReactNode>) | (ReactPortal & Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>) | (Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> & string) | (Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> & number) | (Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> & bigint) | (Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> & false) | (Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> & true) | (Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> & ReactElement<unknown, string | JSXElementConstructor<any>>) | (Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> & Iterable<ReactNode>) | (Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> & ReactPortal) | (Iterable<ReactNode> & string) | (Iterable<ReactNode> & number) | (Iterable<ReactNode> & bigint) | (Iterable<ReactNode> & false) | (Iterable<ReactNode> & true) | (Iterable<ReactNode> & ReactElement<unknown, string | JSXElementConstructor<any>>) | (Iterable<ReactNode> & Iterable<ReactNode>) | (Iterable<ReactNode> & ReactPortal) | (Iterable<ReactNode> & Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>) | null | undefined; excerpt: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | Iterable<ReactNode> | null | undefined }) => (
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