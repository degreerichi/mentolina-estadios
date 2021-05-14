import React, { useEffect, useState } from 'react'
import firebaseConfig from '../../components/firebaseconfig'
import firebase from "firebase/app"
import "firebase/firestore"
import Head from 'next/head'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFutbol } from '@fortawesome/free-solid-svg-icons'

export async function getServerSideProps(context) {

   if(firebase.apps.length === 0)
      firebase.initializeApp(firebaseConfig);
   
   var db = firebase.firestore();

   var estadio = await db.collection('estadios').doc(`est${context.params.user}`).get();
   var imagen = await db.collection('imagenes').doc(`img${context.params.user}`).get();
   var user = await db.collection('registros').doc(`id${context.params.user}`).get();

   console.log(estadio.data());

   return {
      props: {
         estadio: JSON.stringify(estadio.data()),
         imagen: JSON.stringify(imagen.data()),
         user: JSON.stringify(user.data())
      }
   }
}

export default function Share({ estadio, imagen, user }) {

   useEffect(()=>{
      document.body.style.backgroundColor = "#0A2140";
   });

   return (
      <>
         <Head>
            <meta property="og:url" content={`https://micasamiestadio.com/${JSON.parse(user).id}/share`}/>
            <meta property="og:type" content="website"/>
            <meta property="og:title" content="Micasamiestadio"/>
            <meta property="og:description" content="Apoyemos a la H compartiendo nuestro propio estadio"/>
            <meta property="og:image" content='/media/post.png'/>
            <meta property="og:image:url" content='/media/post.png'/>
            <meta property="og:image:width" content="1000"/>
            <meta property="og:image:height" content="1000"/>
            <meta property="fb:app_id" content="827394434550474"/>
         </Head>
         <div className="container mt-5 mb-5 share-container">
            <div className="share-image-logo-wrapper">
               <Link href="/">
                  <a>
                     <img className="share-main-logo" src="/media/mi-casa-logo-test.svg" alt="" />
                  </a>
               </Link>
            </div>
            <img className="mentolina-logo-share" src="/media/lata-seleccion.png" alt="" />
            <img className="infarma-logo" src="/media/infarma-logo.svg" alt="" />
            <h2 className="text-white text-center mt-3 mb-2">Conoce el estadio</h2>
            <h1 className="text-center mb-4"><span className="text-orange text-uppercase">{JSON.parse(imagen).apellido}</span></h1>
            <div className="w-100 d-flex justify-content-center align-items-center my-4">
               <a className="button" href={`/?lng=${JSON.parse(estadio).ubicacion.longitude}&lat=${JSON.parse(estadio).ubicacion.latitude}`} target="_blank">Visitar estadio <FontAwesomeIcon icon={faFutbol}/></a>
            </div>
            <div className="share-image-wrapper">
               <img src={`https://mi-casa-mi-estadio.s3.us-east-2.amazonaws.com/${JSON.parse(imagen).s3key}`} alt=""/>
            </div>
         </div>
         <footer className="share-footer">
            <h4 className="text-white mb-5">Anímate a crear tu propio estadio en</h4>
            <Link href="/">
               <a>
                  <img className="share-main-logo" src="/media/mi-casa-logo-test.svg" alt="" />
               </a>
            </Link>
         </footer>
      </>
   )
}
