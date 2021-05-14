import React from 'react'
import Head from 'next/head'

export async function getServerSideProps(context) {
  return {
    props: {
       image: context.params.image,
       apellido: context.params.apellido
    }
  }
}

export default function Share({ image, apellido }) {

   return (
      <>
         <Head>
            <meta property="og:url" content={`https://micasamiestadio.com/${image}/${apellido}/share`}/>
            <meta property="og:type" content="website"/>
            <meta property="og:title" content="Micasamiestadio"/>
            <meta property="og:description" content="Apoyemos a la H compartiendo nuestro propio estadio"/>
            <meta property="og:image" content={image}/>
            <meta property="fb:app_id" content="827394434550474"/>
         </Head>
         <div className="share-image-wrapper">
            <img src={image} alt="" />
         </div>
      </>
   )
}
