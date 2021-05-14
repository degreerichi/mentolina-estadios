import { createCanvas, loadImage, registerFont }  from 'canvas'
import firebaseConfig from '../../components/firebaseconfig'
import firebase from "firebase/app"
import "firebase/firestore"
import path from 'path'
import fs from 'fs'
import { uploadFile } from '../../components/s3'

registerFont(path.resolve('./public/fonts/MonumentExtended-Regular.ttf'), {
   family: 'monument',
   weight: 'bold'
});

export default function handler(req, res){

   if(req.method === 'POST'){

      if(firebase.apps.length === 0)
         firebase.initializeApp(firebaseConfig);

      if(!req.body.id) res.send(400);
      if(!req.body.apellido) res.send(400);
      
      var db = firebase.firestore();

      const filename = `img-${req.body.id}-${new Date().getTime()}.png`;
      const tempNewImageLocation = `/vercel/path0/public/media/${filename}`;
      const templateFile = "/vercel/path0/public/media/base.jpg";

      const returnData = {
         id: req.body.id,
         apellido: req.body.apellido,
         s3url: '',
         s3key: ''
      }

      // const s3client = new S3Client({
      //    accessKeyId: s3config.accessKeyId,
      //    secretAccessKey: s3config.secretAccessKey,
      //    region: s3config.region,
      // });

      // load the base image
      loadImage(templateFile).then((image) => {

         // create the image
         const canvas = createCanvas(1000, 1000);
         const ctx = canvas.getContext('2d');

         ctx.drawImage(image, 0, 0, 1000, 1000);
         ctx.fillStyle = '#00ff54';
         ctx.textAlign = "center";
         ctx.font = 'italic normal 700 100px 1.1 monument';
         ctx.fillText(req.body.apellido.toUpperCase(), 490, 760);

         // save the image
         const out = fs.createWriteStream(tempNewImageLocation);
         const stream = canvas.createPNGStream();
         stream.pipe(out);

         out.on('finish', ()=>{
            
            console.log('The image was created.');

            uploadFile(tempNewImageLocation, filename).then((response)=>{

               console.log('The image was uploaded.');

               const imagen = {
                  id_registro: req.body.id,
                  nombre: filename,
                  s3url: response.Location,
                  s3key: response.Key,
                  s3bucket: response.Bucket,
                  apellido: req.body.apellido
               }

               returnData.s3url = response.Location;
               returnData.s3key = response.Key;

               return db.collection('imagenes').doc(`img${req.body.id}`).set(imagen);

               // res.send({
               //    result: 'success',
               //    message: 'File succesfully uploaded.',
               //    response: response
               // });

            }).then((response)=>{

               res.send({
                  result: 'ok',
                  data: returnData
               });

            }).catch((err)=>{

               console.log('The file coud not be uploaded');

               res.send({
                  result: 'error',
                  message: 'Error al guardar el archivo.',
                  response: err
               });
               
            });

         });

      });

   }else{

      res.status(404);

   }

}