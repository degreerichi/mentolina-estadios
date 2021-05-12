import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
// import { createCanvas, loadImage } from 'canvas'

// registerFont('public/fonts/MonumentExtended-Regular.ttf', {
//    family: 'monument',
//    weight: 'bold'
// });

export default function Share() {

  const router = useRouter();
  const [theImage, setTheImage] = useState('');

  useEffect(()=>{

      // loadImage('/media/base.jpg').then((image) => {

      //    const canvas = createCanvas(800, 800);
      //    const ctx = canvas.getContext('2d');

      //    ctx.drawImage(image, 0, 0, 800, 800);
      //    ctx.fillStyle = '#00ff54';
      //    ctx.textAlign = "center";
      //    ctx.font = 'italic normal 700 100px 1.1 Arial';
      //    ctx.fillText('VALLADARES', 390, 580);

      //    setTheImage(canvas.toDataURL());

      // });

  });


   return (
      <>
         <Head>
            <meta property="og:url" content="https://micasamiestadio.com/share"/>
            <meta property="og:type" content="website"/>
            <meta property="og:title" content="Micasamiestadio"/>
            <meta property="og:description" content="Apoyemos a la H compartiendo nuestro propio estadio"/>
            <meta property="og:image" content={theImage}/>
            <meta property="fb:app_id" content="827394434550474"/>
         </Head>
         <div className="share-image-wrapper">
            <img src={theImage} alt="" />
         </div>
      </>
   )
}
