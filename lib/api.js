import client from './sanity'

export async function getHomeContent () {
  const data = await client.fetch('*[_type == "home"]')
  return data[0]
}

export async function getStoryList () {
  const data = await client.fetch('*[_type in ["story","longStory"]]{_id, author, slug, title}')
  return data
}

export async function getStoryBySlug (slug) {
  const data = await client.fetch(
    `*[_type in ["story","longStory"] && slug.current == $slug]{
      'sections': *[_type=="longStorySection" && references(^._id)] | order(sectionNumber asc),
      ...
    }`,
    { slug }
  )
  return data[0]
}
