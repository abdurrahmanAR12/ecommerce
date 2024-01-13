import Head from "next/head"
import Script from "next/script"
import { ContextState } from "../Components/context/context"


function MyApp({ Component, pageProps }) {

  return (
    <>
      <Head>
        <title>Millionairo - The Ecommerce King</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/images/logo.png" />
        <link rel="stylesheet" href="/css/flowbite.css" />
        <link rel="stylesheet" href="/css/styles.css" />
      </Head>
      <div id="toaster" className="toastContainer"></div>
      <div id="backdrop" className="backdrop-hidden"></div>
      <Script src='/js/main.js' />
      <ContextState>
        <Component {...pageProps} />
      </ContextState>
    </>
  )
}

export default MyApp
