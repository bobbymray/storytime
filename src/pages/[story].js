import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import BlockContent from '@sanity/block-content-to-react'
import { getStoryBySlug } from '../../lib/api'
import Skeleton from '../components/Skeleton'

import {
  figure,
  marginnote,
  newthought,
  sidenote
} from '../serializers'

const serializers = {
  container: ({ children }) => <section>{children}</section>,
  marks: { newthought, sidenote, marginnote },
  types: {
    figure: props => (
      <figure>
        {figure(props.node, 700)}
        {props.node.caption && <figcaption>{props.node.caption}</figcaption>}
      </figure>
    )
  }
}

export default function Story ({ story }) {
  const router = useRouter()
  return (
    <>
      <header>
        <nav style={{marginTop: '1rem'}}>
          <Link href='/'>
            <a>Story Time</a>
          </Link>
        </nav>
      </header>
      <article>
        <Head>
          {
            router.isFallback
              ? <title>Story Time</title>
              : <title>{story.title} | Story Time</title>
          }
        </Head>

        {
          router.isFallback
            ? <Skeleton />
            : (
              <>
                <h1>
                  {story.title}
                  {story.subtitle && <span>{story.subtitle}</span>}
                </h1>

                {story.author && <p className='subtitle'>{story.author}</p>}

                {story.content &&
                  <BlockContent
                    blocks={story.content}
                    serializers={serializers}
                  />
                }

                <style jsx>
                  {`
                    h1 {
                      max-width: 50rem;
                    }
                    h1 span {
                      display: block;
                      font-size: 76%;
                      margin-top: 0.4rem;
                      opacity: 0.78;
                    }
                  `}
                </style>
              </>
            )
        }
      </article>
    </>
  )
}

export async function getStaticPaths () {
  return { paths: [], fallback: true }
}

export async function getStaticProps ({ params }) {
  const story = await getStoryBySlug(params.story)

  if (story._type === 'longStory') {
    story.content = story.sections.reduce((a, section) => {
      return a = [...a, ...section.content]
    }, [])
    story.sections = []
  }
  return {
    props: { story },
    unstable_revalidate: 1
  }
}
