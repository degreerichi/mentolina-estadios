import firebaseConfig from '../../components/firebaseconfig'
import firebase from 'firebase'
import "firebase/firestore"
import Cookies from 'cookies'

export default function handler(req, res){

   if(req.method === "POST"){

      const cookies = new Cookies(req, res);

      if(firebase.app() === null || firebase.app() === undefined)
         firebase.initializeApp(firebaseConfig);
      
      var db = firebase.firestore();

      db.collection('registros').doc(`id${req.body.id}`).set({
         id: req.body.id,
         nombre: req.body.name,
         correo: req.body.email,
         pic: req.body.pic,
         fecha_registro: new Date(),
         plataforma: req.body.platform
      }).then(()=>{

         cookies.set('token', req.body.token, {
            httpOnly: true
         });

         res.send({
            result: 'ok'
         });

      }).catch(()=>{

         res.send({
            result: 'error',
            message: 'Error, no se pudo registrar'
         });

      });

   }else{
      res.status(404);
   }


}