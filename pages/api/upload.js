import firebaseConfig from '../../components/firebaseconfig'
import firebase from "firebase/app"
import "firebase/firestore"
import s3config from '../../compoments/s3config'
import S3 from 'aws-s3';

export default function handler(req, res){

   if(req.method === 'POST'){

      if(firebase.apps.length === 0)
         firebase.initializeApp(firebaseConfig);
      
      var db = firebase.firestore();

      const S3Client = new S3(s3config);

      const newFileName = 'mentolina';

      S3Client
         .uploadFile(file, newFileName)
         .then(data => console.log(data))
         .catch(err => console.error(err))

      let image = {
         id_registro: req.body.id,
         tipo: 'imagen_compartida',
         s3_key: '',
         s3_location: ''
      }

   }else{
      res.status(404);
   }

}