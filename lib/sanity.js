import sanityClient from '@sanity/client'

const options = {
  dataset: 'production',
  projectId: process.env.NEXT_PUBLIC_STORYTIME_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production'
}

export default sanityClient(options)
