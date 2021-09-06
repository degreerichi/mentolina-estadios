import React, { useState, useEffect } from 'react'
import SimpleLoader from './simpleLoader'
import Loader from './loader'
import { USER_DATA } from './strings'

import firebaseConfig from '../components/firebaseconfig'
import firebase from "firebase/app"
import "firebase/firestore"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'
import * as Facebook from 'fb-sdk-wrapper'
import useIsLogged from '../components/hooks/isLogged'


import axios from 'axios'

export default function Estadio({ user, controlHeaderReduced, map, startWizardAction, telefono, email, name, idUsuario,picture, apellido }) {

   let [loading, setLoading] = useState(false);
   let [estadioInfo, setEstadioInfo] = useState({});
   let [showPreloader, setShowPreloader] = useState(false);
   let [userData, setUserData] = useState({});
   let [refreshCheck] = useIsLogged();

   let [sharingEstadio, setSharingEstadio] = useState(false);
   let [shareUrl, setShareUrl] = useState('');

   const loadEstadioInfo = () => {
      return new Promise((resolve, reject) => {
         var db = firebase.firestore();

         db.collection('estadios').doc(`est${user}`).get().then((doc) => {
            // console.log(doc.data());
            if (doc.data()) {
               setEstadioInfo(doc.data());
            }
            setLoading(false);
         }).catch((err) => {
            console.log(err);
         });

      });
   }

   const moveToMyEstadio = () => {

      controlHeaderReduced(true);

      map.flyTo({
         zoom: 14,
         center: [estadioInfo.ubicacion.longitude, estadioInfo.ubicacion.latitude],
         pitch: 0
      });

   }

   const deleteEstadio = () => {

      var db = firebase.firestore();

      db.collection('estadios').doc(`est${user}`).delete().then((doc) => {
         // console.log(doc.data());
         setEstadioInfo({});
         setLoading(false)
      }).catch((err) => {
         console.log(err);
      });

   }

   const shareEstadio = () => {

      setSharingEstadio(true);

      // axios.post('api/upload', {
      //    id: user,
      //    apellido: apellido
      // }).then((res)=>{

      // console.log(res);

      setShareUrl(`https://micasamiestadio.com/?lng=${estadioInfo.ubicacion.longitude}&lat=${estadioInfo.ubicacion.latitude}`);

      Facebook.ui({
         method: 'share',
         display: 'popup',
         href: `https://micasamiestadio.com/?lng=${estadioInfo.ubicacion.longitude}&lat=${estadioInfo.ubicacion.latitude}`,
         quote: `Creé mi estadio en https://micasamiestadio.com`,
         hashtag: '#ConLa12EnElPecho'
      }, (response) => {
         if (response && response.error_message) setShareUrl('');
         console.log('facebook response');
         console.log(response);
      });
      setSharingEstadio(false);

      // }).catch((err)=>{

      //    console.log(err);

      // }).finally(()=>{

      //    setSharingEstadio(false);

      // });

   }

   useEffect(() => {

      if (firebase.apps.length === 0)
         firebase.initializeApp(firebaseConfig);

      setLoading(true);
      loadEstadioInfo();

   }, []);

   // console.log(map);
   function FormularioIngresoTelefono() {
      const registrarTelefono = async event => {
         event.preventDefault()
         let data = {
            id: idUsuario,
            name: `${name}`,
            email: email,
            phone: event.target.phone.value,
            pic:picture,
            platform: 'manualmente'
         }

         registerManual(data);
         saveLocalData(data);
         
         console.log(data);
      }
      
   
      return (

         <form className="py-2  " onSubmit={registrarTelefono}>
            {/* <label htmlFor="name">Teléfono</label> */}
            <input id="number" placeholder="Teléfono" className="mb-2 form-control" name="phone" type="tel" autoComplete="phone" required />

            {/* <button type="submit" className="btn btn-primary btn-lg btn-block">Aceptar</button> */}
            <div className="container">
               <div className="row">
                  <div className="col text-center">
                     <button type="submit" className="btn btn-primary btn-lg btn-block">Aceptar</button>
                  </div>
               </div>
            </div>
         </form>
      )
   }
   const registerManual = (data) => {

      setShowPreloader(true);
      // data: {id, name, email, pic, platform, token}

      axios.post('api/register_manual', data).then((res) => {
         console.log(res);
         telefono = data.phone;
         setShowPreloader(false);
         // setModalRegisterOpened(false);
         // refreshCheck();
         window.location.reload();
      }).catch((err) => {
         console.log(err);
      });

   }
   const saveLocalData = (data) => {
      setUserData(data);
      localStorage.setItem(USER_DATA, JSON.stringify(data));
   }

   return (
      <>
         {loading || map === null ?
            <SimpleLoader className="mt-5" show={true} inline={true} /> : (
               telefono === "no disponible" || undefined ? <>

                  <h4 className="text-white mt-3">Ingresa tu número telefónico</h4>
                  {<FormularioIngresoTelefono />}
                  {/* <a href="#!" className="btn btn-info py-4 px-3 my-3 rounded-pill h5" onClick={startWizardAction}>Agregar Teléfono</a> */}
               </> :
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
                              <img src="/media/estadio-icon.svg" alt="" />
                           </div>
                           <div className="estadio-text ml-2">
                              <h5 className="nombre">{estadioInfo !== null ? (estadioInfo.prefijo !== undefined ? estadioInfo.prefijo : (estadioInfo.seudonimo !== undefined ? estadioInfo.seudonimo : '')) : ''}</h5>
                              <h5 className="apodo">{estadioInfo !== null ? estadioInfo.nombre : ''}</h5>
                              <div className="estadio-text-actions">
                                 <button className="button small mt-2 mr-2" onClick={moveToMyEstadio}>Ver <FontAwesomeIcon icon={faEye} /></button>
                                 <button className="button small mt-2" onClick={deleteEstadio}><FontAwesomeIcon icon={faTimes} /></button>
                              </div>
                              {/* <span className="direccion">Direccion</span> */}
                           </div>
                        </div>
                        <div className="estadio-share">
                           {sharingEstadio ? (
                              <>
                                 <SimpleLoader show={true} inline={true} size="2x" />
                              </>
                           ) : (
                              <div className="d-flex flex-column justify-content-center align-items-center">
                                 {shareUrl !== '' ? (
                                    <div className="mb-3">
                                       <h4 className="text-white">¡Gracias por compartir tu estadio!</h4>
                                    </div>
                                 ) : ''}
                                 <a className="btn-estadio-share" href="#!" target="_top" onClick={shareEstadio}>
                                    <FontAwesomeIcon icon={faFacebookF} size="lg" /> Compartir estadio
                                 </a>
                              </div>
                           )}
                        </div>
                     </div>

                  )
            )}
         <Loader show={showPreloader} />

      </>

   )
}
