import Head from 'next/head'

import '../tufte.min.css'

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
