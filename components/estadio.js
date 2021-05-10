import React, { useState, useEffect } from 'react'
import SimpleLoader from './simpleLoader'
import firebaseConfig from '../components/firebaseconfig'
import firebase from "firebase/app"
import "firebase/firestore"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faTimes } from '@fortawesome/free-solid-svg-icons'

export default function Estadio({user, controlHeaderReduced, map, startWizardAction}) {

   let [loading, setLoading] = useState(false);
   let [estadioInfo, setEstadioInfo] = useState({});

   const loadEstadioInfo = ()=>{
      return new Promise((resolve, reject)=>{
         var db = firebase.firestore();

         db.collection('estadios').doc(`est${user}`).get().then((doc)=>{
            // console.log(doc.data());
            if(doc.data()){
               setEstadioInfo(doc.data());
            }
            setLoading(false);
         }).catch((err)=>{
            console.log(err);
         });

      });
   }

   const moveToMyEstadio = ()=>{
      controlHeaderReduced(true);
      map.flyTo({
         zoom: 10,
         center: [estadioInfo.ubicacion.longitude, estadioInfo.ubicacion.latitude],
         pitch: 0
      });
   }

   const deleteEstadio = ()=>{

      var db = firebase.firestore();

      db.collection('estadios').doc(`est${user}`).delete().then((doc)=>{
         // console.log(doc.data());
         setEstadioInfo({});
         setLoading(false)
      }).catch((err)=>{
         console.log(err);
      });
   }

   useEffect(()=>{
      
      if(firebase.apps.length === 0)
         firebase.initializeApp(firebaseConfig);

      setLoading(true);
      loadEstadioInfo();

   }, []);

   // console.log(map);

   return (
      <>
         {loading || map === null ? 
            <SimpleLoader className="mt-5" show={true} inline={true}/> : (
               Object.keys(estadioInfo).length === 0 ? (
                  <>
                     <h4 className="text-white mt-3">No tienes estadios registrados</h4>
                     <a href="#!" className="button mt-3" onClick={startWizardAction}>Agregar estadio</a>
                  </>
               ) : (
                  <div className="mt-5">
                     <h1 className="text-center mb-3 text-white">Tu estadio</h1>
                     <div className="estadio-wrapper mt-2">
                        <div className="estadion-img">
                           <img src="/media/estadio-icon.svg" alt=""/>
                        </div>
                        <div className="estadio-text ml-2">
                           <h5 className="nombre">{estadioInfo !== null ? estadioInfo.nombre : ''}</h5>
                           <h5 className="apodo">{estadioInfo !== null ? estadioInfo.seudonimo : ''}</h5>
                           <div className="estadio-text-actions">
                              <button className="button small mt-2 mr-2" onClick={moveToMyEstadio}>Ver <FontAwesomeIcon icon={faEye}/></button>
                              <button className="button small mt-2" onClick={deleteEstadio}><FontAwesomeIcon icon={faTimes}/></button>
                           </div>
                           {/* <span className="direccion">Direccion</span> */}
                        </div>
                     </div>
                  </div>

               )
         )}
      </>
   )
}
