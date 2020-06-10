import Head from 'next/head'

import '../tufte.min.css'
import '../tufte_modifications.css'

export default function MyApp ({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Story Time</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
