import BlockContent from '@sanity/block-content-to-react'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '../lib/sanity'

function urlFor (source) {
  return imageUrlBuilder(sanityClient).image(source).auto('format')
}

export function figure (node, width) {
  const paddingBottom = (
    node.lazyLoad.metadata.dimensions.height / node.lazyLoad.metadata.dimensions.width * 100
  ) + '%'

  const src = width ? urlFor(node.asset).width(width).url() : urlFor(node.asset).url()

  return (
    <figure key={node._key}>
      {/* <pre>{JSON.stringify(node, null, 2)}</pre> */}
      <div
        className='lqip'
        style={{
          backgroundImage: `url(${node.lazyLoad.metadata.lqip})`,
          paddingBottom
        }}
      >
        <img src={src} />
      </div>
      {node.caption && <figcaption>{node.caption}</figcaption>}
    </figure>
  )
}

export function newthought ({ children }) {
  return <span className='newthought'>{children}</span>
}

// SIDE NOTE

export function sidenote (props) {
  const serializers = {
    renderContainerOnSingleChild: true,

    container: ({ children }) => <>{children}</>,

    types: {
      block: props => {
        const { children, markDefs } = props.node

        const links = markDefs.reduce((marks, mark) => {
          if (mark._type === 'link') {
            marks[mark._key] = { href: mark.href, blank: mark.blank }
          }
          return marks
        }, {})

        const output = children.map(child => {
          return !child.marks.length > 0
            ? child.text
            : links[child.marks[0]].blank === true
              ? (
                <a
                  key={child._key}
                  href={links[child.marks[0]].href}
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  {child.text}
                </a>
              )
              : <a key={child._key} href={links[child.marks[0]].href}>{child.text}</a>
        })

        return <>{output} </>
      }
    }
  }

  return (
    <>
      <label htmlFor={props._key} className='margin-toggle sidenote-number' />
      <input type='checkbox' id={props._key} className='margin-toggle' />
      <span className='sidenote'>
        <BlockContent
          blocks={props.mark.content}
          serializers={serializers}
        />
      </span>
    </>
  )
}

// MARGIN NOTE

export function marginnote (props) {
  const serializers = {
    renderContainerOnSingleChild: true,

    container: ({ children }) => <>{children}</>,

    types: {
      figure: props => {
        return figure(props.node, 400)
      },
      block: props => {
        const { children, markDefs } = props.node

        const links = markDefs.reduce((marks, mark) => {
          if (mark._type === 'link') {
            marks[mark._key] = { href: mark.href, blank: mark.blank }
          }
          return marks
        }, {})

        const output = children.map(child => {
          const mark = child.marks.length > 0 ? child.marks[0] : null

          return mark === 'strong'
            ? <strong key={child._key}>{child.text}</strong>
            : mark === 'em'
              ? <em key={child._key}>{child.text}</em>
              : mark && links[child.marks[0]].blank === true
                ? (
                  <a
                    key={child._key}
                    href={links[child.marks[0]].href}
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    {child.text}
                  </a>
                )
                : mark
                  ? (
                    <a
                      key={child._key}
                      href={links[child.marks[0]].href}
                    >
                      {child.text}
                    </a>
                  )
                  : child.text
        })

        return <span className='block-span'>{output} </span>
      }
    }
  }

  return (
    <>
      <label htmlFor={props._key} className='margin-toggle'>⊕</label>
      <input type='checkbox' id={props._key} className='margin-toggle' />
      <span className='marginnote'>
        <BlockContent
          blocks={props.mark.content}
          serializers={serializers}
        />
      </span>
    </>
  )
}
