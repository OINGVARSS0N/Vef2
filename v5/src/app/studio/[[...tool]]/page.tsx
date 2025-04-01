import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import styles from './studio.module.scss'

const homePageQuery = groq`
  *[_type == "page" && slug.current == "frontpage"][0] {
    title,
    content
  }
`

export default async function Home() {
  const page = await client.fetch(homePageQuery)

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{page.title}</h1>
      <div className={styles.content}>
        {page.content}
      </div>
    </main>
  )
}