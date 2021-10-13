import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Modal from './modal'
import Loader from './loader'
import Usernav from './usernav'
import Estadios from './estadios'
import { USER_DATA } from './strings'
// import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons'
import { GoogleLoginButton, FacebookLoginButton} from 'react-social-login-buttons'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFutbol } from '@fortawesome/free-solid-svg-icons'
import useIsLogged from '../components/hooks/isLogged'
import firebase from "firebase/app"
import "firebase/firestore"
import * as Facebook from 'fb-sdk-wrapper'

export default function Header({ headerReduced, map, controlHeaderReduced, setButtonViewDisabled, className, createMarkerAction, cantidadEstadios }) {

   const router = useRouter();

   let [isLogged, checkingLogged, refreshCheck] = useIsLogged();
   let [modalRegisterOpened, setModalRegisterOpened] = useState(false);
   let [showPreloader, setShowPreloader] = useState(false);
   // let [checkingLoginStatus, setCheckingLoginStatus] = useState(true);
   let [userData, setUserData] = useState({});
   let [isAuthenticated, setIsAuthenticated] = useState(false);
   let [wizardActive, setWizardActive] = useState(false);

   // Facebook stuff
   // let [facebookLoaded, setFacebookLoaded] = useState(false);

   const toggleModalRegister = () => {
      setModalRegisterOpened(!modalRegisterOpened);
   }

   // const facebookLoginCallback = (res)=>{

   //    Facebook.login({
   //       scope: 'public_profile,email',
   //    })
   //       .then((response) => {
   //          if (response.status === 'connected') {
   //             console.log('connected');
   //             FB.api('/me', {fields: 'name,picture,email'}, function(res) {
   //                let data = {
   //                   id: res.id,
   //                   name: res.name,
   //                   email: res.email,
   //                   pic: res.picture.data.url,
   //                   platform: 'facebook'
   //                }
   //                register({...data, token: response.authResponse.accessToken});
   //                saveLocalData(data);
   //             });
   //          } else {
   //             console.log('not connected');
   //             // not logged in
   //          }
   //          console.log(response);
   //       });
   //    // console.log(res);
   //    // if(!res.hasOwnProperty('status')){
   //    //    let data = {
   //    //       id: res.id,
   //    //       name: res.name,
   //    //       email: res.email,
   //    //       pic: res.picture.data.url,
   //    //       platform: 'facebook'
   //    //    }
   //    //    register({...data, token: res.tokenId});
   //    //    saveLocalData(data);
   //    // }
   // }
   function FormularioRegistro() {
      const registerUser = async event => {
         event.preventDefault()
         let data = {
            id: Math.floor(Math.random() * 99999),
            name: `${event.target.name.value}`,
            email: event.target.email.value,
            phone: event.target.phone.value,
            // 
            // pic: 'https://firebasestorage.googleapis.com/v0/b/mentolina-estadios.appspot.com/o/placeholder%2Fno_picture.jpg?alt=media&token=1d04832d-90d4-43d4-aead-fdb4f827f13f',
            pic: '/media/lata-seleccion.png',
            platform: 'manualmente'
         }

         registerManual({ ...data });
         saveLocalData(data);
         //   const res = await fetch('/api/register', {
         //     body: JSON.stringify({
         //       name: event.target.name.value
         //     }),
         //     headers: {
         //       'Content-Type': 'application/json'
         //     },
         //     method: 'POST'
         //   })

         //   const result = await res.json()
         // result.user => 'Ada Lovelace'
      }

      return (
         <form className="py-2" onSubmit={registerUser}>
            <label htmlFor="name">Nombre</label>
            <input id="name" className="mb-2 form-control" name="name" type="text" autoComplete="name" required />
            <label htmlFor="name">Teléfono</label>
            <input id="number" className="mb-2 form-control" name="phone" type="text" autoComplete="phone" required />
            <label htmlFor="name">Correo</label>
            <input id="email" className="mb-2 form-control" name="email" type="email" autoComplete="email" required />
            {/* <button type="submit">Registrarme</button> */}
            <button type="submit" className="btn btn-primary">Aceptar</button>
         </form>
      )
   }

   const googleLoginCallback = (res) => {
      // console.log(res);
      if (!res.hasOwnProperty('error')) {
         // codigo para convertir un objeto en array
         // var result = Object.keys(res.profileObj).map((key) => ["Key= "+key, res.profileObj[key]]);
         // console.log("Resul = " + result);

         let data = {
            id: res.googleId,
            name: `${res.profileObj.givenName} ${res.profileObj.familyName}`,
            email: res.profileObj.email,
            pic: res.profileObj.imageUrl,
            phone: "no disponible",
            platform: 'google'
         }
         if (firebase.apps.length === 0)
            firebase.initializeApp(firebaseConfig);

         var db = firebase.firestore();
         var algo = db.collection('registros').doc(`id${res.profileObj.email}`).get().then((doc) => {
            if (doc.data() === undefined) {
               console.log("No se encotro los datos del usuario");
               registerManual({ ...data, token: res.tokenId });
               saveLocalData(data);
            } else {
               console.log("Si se encontro los datos del usuario");
               if(doc.data().telefono !== undefined){
                  data.phone = doc.data().telefono;
               }
               data.platform = "manualmente";
               if (firebase.apps.length === 0)
                  firebase.initializeApp(firebaseConfig);

               var db = firebase.firestore();
               // register({ ...data, token: res.tokenId });
               registerManual({ ...data, token: res.tokenId });
               saveLocalData(data);
            }



         });

      }
   }

   const register = (data) => {

      setShowPreloader(true);
      // data: {id, name, email, pic, platform, token}

      axios.post('api/register', data).then((res) => {
         console.log(res);
         setShowPreloader(false);
         setModalRegisterOpened(false);
         refreshCheck();
      }).catch((err) => {
         console.log(err);
      });

   }

   const registerManual = (data) => {

      setShowPreloader(true);
      // data: {id, name, email, pic, platform, token}

      axios.post('api/register_manual', data).then((res) => {
         console.log(res);
         setShowPreloader(false);
         setModalRegisterOpened(false);
         refreshCheck();
      }).catch((err) => {
         console.log(err);
      }).then((data)=>{
         location.reload();
      });

   }

   const saveLocalData = (data) => {
      setUserData(data);
      localStorage.setItem(USER_DATA, JSON.stringify(data)); // Nombre con el cual se guarda el localStorage  "user_data"
   }

   const logout = () => {

      setShowPreloader(true);

      axios.post('api/logout').then((res) => {
         localStorage.removeItem(USER_DATA);
         setUserData({});
         refreshCheck();
         router.reload();
      })
         .catch((err) => {
            console.log(err);
         });

   }

   useEffect(() => {
      // checkLoginStatus();
      setUserData(JSON.parse(localStorage.getItem(USER_DATA)));
      // firebase.initializeApp(firebaseConfig);

      // facebook stuff
      // Facebook.load()
      //    .then(() => {
      //       Facebook.init({
      //          appId: 827394434550474
      //       });
      //       setFacebookLoaded(true);
      // });

   }, []);
   // console.log("Datos del userData");
   // console.log(userData);
   return (
      <div className={className}>
         <Usernav user={userData} actions={[{ text: "Cerrar Sesión", action: logout }]} />
         <div className={`the-heading ${headerReduced ? 'reduced' : ''}`}>
            <div className="header-background-video-wrapper">
               <video className="header-background-video" autoPlay muted loop poster="/media/video/fondo-nuevo-placeholder.jpg">
                  <source src="/media/video/fondo-nuevo.mp4" type="video/mp4" />
               </video>
            </div>
            {!isLogged && !headerReduced ? (
               <>
                  <img className="lata-mentolina" src="/media/lata-seleccion-doble.png" alt="" />
                  <h4 className="mb-3 text-white"><i>PRESENTA</i></h4>
               </>
            ) : ''}
            {!isLogged ? (
               <img className="infarma-logo" src="/media/infarma-logo.svg" alt="" />
            ) : ''}
            {headerReduced ? (
               <>
                  <div className="mentolina-logo-wrapper">
                     <img className="" src="/media/lata-seleccion.png" alt="" />
                     <img className="" src="/media/mento-sport.png" alt="" />
                     <img className="" src="/media/mento-seleccion.png" alt="" />
                  </div>
                  {/* <img className="mentolina-logo" src="/media/lata-seleccion.png" alt="" />
                  <img className="mentolina-logo" src="/media/lata-seleccion.png" alt="" /> */}
               </>
            ) : ''}
            <img className="mi-casa-logo" src="/media/mi-casa-logo.svg" alt="" />
            {
               isLogged ? (
                  <>
                     <Estadios
                        map={map}
                        reduced={headerReduced}
                        controlHeaderReduced={controlHeaderReduced}
                        wizardActive={wizardActive}
                        setWizardActive={setWizardActive}
                        setButtonViewDisabled={setButtonViewDisabled}
                        createMarkerAction={createMarkerAction} />
                     {!headerReduced ? (
                        <div className="estadios-counter text-center"><span className="estadios-number">{cantidadEstadios > 0 ? cantidadEstadios : '-'}</span> <br /> Estadios registrados</div>
                     ) : ''}
                  </>
               ) : (!headerReduced ? (
                  <>
                     <a href="#!" className="button big mt-5" onClick={toggleModalRegister}>Registra tu estadio <FontAwesomeIcon icon={faFutbol} /></a>
                     <div className="estadios-counter text-center"><span className="estadios-number">{cantidadEstadios > 0 ? cantidadEstadios : '-'}</span> <br /> Estadios registrados</div>
                  </>
               ) : '')}
            {/* <a href="#!" className="button mt-2" onClick={zoomIn}><i className="fas fa-plus"></i></a> */}
            {/* <a href="#!" className="button mt-2" onClick={zoomOut}><i className="fas fa-minus"></i></a> */}
            {/* <a href="#!" className="button mt-2" onClick={toggleHeaderReduced}><i className="fas fa-toggle-on"></i></a> */}
         </div>
         <Modal modalOpened={modalRegisterOpened} toggleModalAction={toggleModalRegister}>
            <h2 className="mb-5">Registrate para participar.</h2>
            {<FormularioRegistro />}

            <GoogleLogin
               clientId="946992110205-ad22psdeoh529a4806s6rlj4he9hbpmj.apps.googleusercontent.com"
               // secret=glBbrQI_aavwbS25xElecBr7
               buttonText="Login"
               // scope="openid profile email phone"

               scope="https://www.googleapis.com/auth/user.phonenumbers.read"
               onSuccess={googleLoginCallback}
               onFailure={googleLoginCallback}
               cookiePolicy={'single_host_origin'}
               render={renderProps => (
                  <GoogleLoginButton onClick={renderProps.onClick} disabled={renderProps.disabled} text="Continuar con Google" />
                  // <button >This is my custom Google button</button>
               )}
            />
            {/* Aqui  */}
            {/* <FacebookLogin
               appId="827394434550474"
               fields="name,email,picture"
               callback={facebookLoginCallback}
               render={renderProps => (
                  <FacebookLoginButton onClick={renderProps.onClick} disabled={renderProps.disabled} text="Continuar con Facebook"/>
                  // <button onClick={renderProps.onClick}>This is my custom FB button</button>
               )}
            /> */}
            {/* {facebookLoaded ? <FacebookLoginButton onClick={facebookLoginCallback} text="Continuar con Facebook"/> : ''} */}
            {/* <a href="#!" className="button mb-3">Registrarse con Google</a> */}
            {/* <a href="#!" className="button">Registrarse con Facebook</a> */}

         </Modal>
         <Loader show={showPreloader || checkingLogged} />
      </div>
   )
}
