import Head from 'next/head'
import Link from 'next/link'
import BlockContent from '@sanity/block-content-to-react'
import { getHomeContent, getStoryList } from '../../lib/api'

import { figure } from '../serializers'

const serializers = {
  container: ({ children }) => <section>{children}</section>,
  types: {
    figure: props => (
      <figure>
        {figure(props)}
        {props.node.caption && <figcaption>{props.node.caption}</figcaption>}
      </figure>
    )
  }
}

export default function Index ({ home: { content }, stories }) {
  return (
    <article>
      <Head>
        <title>Story Time</title>
      </Head>
      <h1>Story Time</h1>

      <BlockContent blocks={content} serializers={serializers} />

      {stories && (
        <ul>
          {stories.map(story => (
            <li key={story._id}>
              <Link href='/[story]' as={`/${story.slug.current}`}>
                <a>{story.title}</a>
              </Link>
              , by {story.author}
            </li>
          ))}
        </ul>
      )}

      <style jsx>
        {`
          h1 {
            max-width: 50rem;
          }
        `}
      </style>
    </article>
  )
}

export async function getStaticProps () {
  const homePromise = getHomeContent()
  const storiesPromise = getStoryList()

  const [home, stories] = await Promise.all([homePromise, storiesPromise])

  stories.sort((a, b) => {
    const articleFreeA = a.title.replace(/^(an?|the) /i, '')
    const articleFreeB = b.title.replace(/^(an?|the) /i, '')
    return (articleFreeA > articleFreeB) ? 1 : -1
  })

  return {
    props: { home, stories },
    unstable_revalidate: 1
  }
}
