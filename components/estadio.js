import React, { useState, useEffect } from 'react'
import SimpleLoader from './simpleLoader'
import firebaseConfig from '../components/firebaseconfig'
import firebase from "firebase/app"
import "firebase/firestore"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'
import * as Facebook from 'fb-sdk-wrapper'
import axios from 'axios'

export default function Estadio({user, controlHeaderReduced, map, startWizardAction, apellido}) {

   let [loading, setLoading] = useState(false);
   let [estadioInfo, setEstadioInfo] = useState({});
   let [sharingEstadio, setSharingEstadio] = useState(false);
   let [shareUrl, setShareUrl] = useState('');

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

   const shareEstadio = ()=>{

      setSharingEstadio(true);

      axios.post('api/upload', {
         id: user,
         apellido: apellido
      }).then((res)=>{

         console.log(res);

         setShareUrl(`https://micasamiestadio.com/${encodeURIComponent(res.data.data.s3url)}/${apellido}/share`);

         Facebook.ui({
            method: 'share',
            href: `https://micasamiestadio.com/${encodeURIComponent(res.data.data.s3url)}/${apellido}/share`,
            quote: `Creé mi estadio en https://micasamiestadio.com/${encodeURIComponent(res.data.data.s3url)}/${apellido}/share`
         }, function(response){
            console.log(response);
         });

      }).catch((err)=>{

         console.log(err);

      }).finally(()=>{

         setSharingEstadio(false);

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
                     <div className="estadio-share">
                        {sharingEstadio ? (
                           <>
                              <SimpleLoader show={true} inline={true} size="2x"/>
                           </>
                        ) : (
                           <div className="d-flex flex-column justify-content-center align-items-center">
                              {shareUrl !== '' ? (
                                 <div className="mb-3">
                                    <h4 className="text-white">¡Gracias por compartir tu estadio!</h4>
                                 </div>
                              ) : ''}
                              <button onClick={shareEstadio}>
                                 <FontAwesomeIcon icon={faFacebookF} size="lg"/> Compartir estadio
                              </button>
                           </div>
                        )}
                     </div>
                  </div>

               )
         )}
      </>
   )
}
