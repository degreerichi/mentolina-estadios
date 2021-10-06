import firebaseConfig from '../../components/firebaseconfig'
import firebase from "firebase/app"
import "firebase/firestore"

export default function handler(req, res){

   if(req.method === "POST"){
      
      if(firebase.apps.length === 0)
         firebase.initializeApp(firebaseConfig);
      
      var db = firebase.firestore();

      let estadio = {
         id_registro: req.body.id,
         creador: req.body.creador,
         telefono_del_creador: req.body.telefono,
         nombre: req.body.nombre,
         prefijo: req.body.prefijo,
         fecha_registro: new Date(),
         ubicacion: {
            latitude: req.body.lat,
            longitude: req.body.long
         }
      }

      db.collection('estadios').doc(`est${req.body.id}`).set(estadio).then((response)=>{

         // res.send({
         //    result: 'ok',
         //    estadio: estadio
         // });
         db.collection('estadios_sorteo_miercoles_seis_octubre').doc(`est${req.body.id}`).set(estadio).then((response)=>{

            res.send({
               result: 'ok',
               estadio: estadio
            });
   
         }).catch(()=>{
   
            res.send({
               result: 'error',
               message: 'Error, no se pudo crear el estadio'
            });
   
         });
      }).catch(()=>{

         res.send({
            result: 'error',
            message: 'Error, no se pudo crear el estadio'
         });

      });
     
   }else{
      res.status(404);
   }

}