import firebaseConfig from '../../components/firebaseconfig'
import firebase from "firebase/app"
import "firebase/firestore"
import Cookies from 'cookies'

export default function handler(req, res){

   if(req.method === "POST"){

      const cookies = new Cookies(req, res);

      if(firebase.apps.length === 0)
         firebase.initializeApp(firebaseConfig);
      
      var db = firebase.firestore();
      db.collection('registros').doc(`id${req.body.email}`).set({
         id: "id"+req.body.email,
         nombre: req.body.name,
         correo: req.body.email,
         pic: req.body.pic,
         fecha_registro: new Date(),
         telefono: req.body.phone,
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