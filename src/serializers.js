import BlockContent from '@sanity/block-content-to-react'
import imageUrl from '@sanity/image-url'
import sanityClient from '../lib/sanity'

function urlFor (source) {
  return imageUrl(sanityClient).image(source)
}

export function figure (props) {
  return <img src={urlFor(props.node)} />
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
          blocks={props.mark.portableText}
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
        return figure(props)
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

        return <>{output}</>
      }
    }
  }

  return (
    <>
      <label htmlFor={props._key} className='margin-toggle'>⊕</label>
      <input type='checkbox' id={props._key} className='margin-toggle' />
      <span className='marginnote'>
        <BlockContent
          blocks={props.mark.portableText}
          serializers={serializers}
        />
      </span>
    </>
  )
}
