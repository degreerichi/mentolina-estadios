import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Share() {

   const router = useRouter();

   return (
      <>
         <Head>
            <meta property="og:url" content={`https://micasamiestadio.com/share?url=${router.query.url}&apellido=${router.query.apellido}`}/>
            <meta property="og:type" content="website"/>
            <meta property="og:title" content="Micasamiestadio"/>
            <meta property="og:description" content="Apoyemos a la H compartiendo nuestro propio estadio"/>
            <meta property="og:image" content={router.query.url}/>
            <meta property="fb:app_id" content="827394434550474"/>
         </Head>
         <div className="share-image-wrapper">
            <img src={router.query.url} alt="" />
         </div>
      </>
   )
}
