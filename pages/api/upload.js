import firebaseConfig from '../../components/firebaseconfig'
import firebase from "firebase/app"
import "firebase/firestore"
import s3config from '../../components/s3config'
import S3 from 'aws-s3'
import { createCanvas, loadImage, registerFont }  from 'canvas'
import * as fs from 'fs';
import path from 'path'

registerFont(path.resolve('./public/fonts/MonumentExtended-Regular.ttf'), {
   family: 'monument',
   weight: 'bold'
});

export default function handler(req, res){

   if(req.method === 'POST'){

      if(firebase.apps.length === 0)
         firebase.initializeApp(firebaseConfig);
      
      var db = firebase.firestore();

      const S3Client = new S3(s3config);

      const newFileName = 'mentolina';


      loadImage('public/media/base.jpg').then((image) => {

         const canvas = createCanvas(1000, 1000);
         const ctx = canvas.getContext('2d');

         ctx.drawImage(image, 0, 0, 1000, 1000);
         ctx.fillStyle = '#00ff54';
         ctx.textAlign = "center";
         ctx.font = 'italic normal 700 100px 1.1 monument';
         ctx.fillText('VALLADARES', 490, 760);

         const out = fs.createWriteStream('public/media/test.png')
         const stream = canvas.createPNGStream();
         stream.pipe(out)
         out.on('finish', () =>  console.log('The PNG file was created.'));
         // canvas.toDataURL();

      });

      // var loadedImage;

      // Jimp.read('public/media/base.jpg').then(img => {
      //    loadedImage = img;
      //    return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
      // }).then((font)=>{
      //    loadedImage.print(font, 180, 750, 'Hello world!');
      //    loadedImage.write('public/media/base-writed.jpg'); // save
      // }).catch((err)=>{
      //    console.log(err);
      // });

      res.send({
         result: 'image',
         message: 'proceso completado, no se sabe de la imagen'
      });

      // S3Client
      //    .uploadFile(file, newFileName)
      //    .then(data => console.log(data))
      //    .catch(err => console.error(err))

      // let image = {
      //    id_registro: req.body.id,
      //    tipo: 'imagen_compartida',
      //    s3_key: '',
      //    s3_location: ''
      // }

   }else{
      res.status(404);
   }

}