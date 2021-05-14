import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Modal from './modal'
import Loader from './loader'
import Usernav from './usernav'
import Estadios from './estadios'
import { USER_DATA }  from './strings'
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons'
import GoogleLogin from 'react-google-login'
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFutbol } from '@fortawesome/free-solid-svg-icons'
import useIsLogged from '../components/hooks/isLogged'
import * as Facebook from 'fb-sdk-wrapper'

export default function Header({headerReduced, map, controlHeaderReduced, setButtonViewDisabled, className, createMarkerAction}) {

   const router = useRouter();

   let [isLogged, checkingLogged, refreshCheck] = useIsLogged();
   let [modalRegisterOpened, setModalRegisterOpened] = useState(false);
   let [showPreloader, setShowPreloader] = useState(false);
   // let [checkingLoginStatus, setCheckingLoginStatus] = useState(true);
   let [userData, setUserData] = useState({});
   let [isAuthenticated, setIsAuthenticated] = useState(false);
   let [wizardActive, setWizardActive] = useState(false);

   // Facebook stuff
   let [facebookLoaded, setFacebookLoaded] = useState(false);

   const toggleModalRegister = ()=>{
      setModalRegisterOpened(!modalRegisterOpened);
   }

   const facebookLoginCallback = (res)=>{

      Facebook.login({
         scope: 'public_profile,email',
      })
         .then((response) => {
            if (response.status === 'connected') {
               console.log('connected');
               FB.api('/me', {fields: 'name,picture,email'}, function(res) {
                  let data = {
                     id: res.id,
                     name: res.name,
                     email: res.email,
                     pic: res.picture.data.url,
                     platform: 'facebook'
                  }
                  register({...data, token: response.authResponse.accessToken});
                  saveLocalData(data);
               });
            } else {
               console.log('not connected');
               // not logged in
            }
            console.log(response);
         });
      // console.log(res);
      // if(!res.hasOwnProperty('status')){
      //    let data = {
      //       id: res.id,
      //       name: res.name,
      //       email: res.email,
      //       pic: res.picture.data.url,
      //       platform: 'facebook'
      //    }
      //    register({...data, token: res.tokenId});
      //    saveLocalData(data);
      // }
   }

   const googleLoginCallback = (res)=>{
      // console.log(res);
      if(!res.hasOwnProperty('error')){
         let data = {
            id: res.googleId,
            name: `${res.profileObj.givenName} ${res.profileObj.familyName}`,
            email: res.profileObj.email,
            pic: res.profileObj.imageUrl,
            platform: 'google'
         }
         register({...data, token: res.tokenId});
         saveLocalData(data);
      }
   }

   const register = (data)=>{
 
      setShowPreloader(true);
      // data: {id, name, email, pic, platform, token}

      axios.post('api/register', data).then((res)=>{
         console.log(res);
         setShowPreloader(false);
         setModalRegisterOpened(false);
         refreshCheck();
      }).catch((err)=>{
         console.log(err);
      });

   }

   const saveLocalData = (data)=>{
      setUserData(data);
      localStorage.setItem(USER_DATA, JSON.stringify(data));
   }

   const logout = ()=>{
      
      setShowPreloader(true);

      axios.post('api/logout').then((res)=>{
         localStorage.removeItem(USER_DATA);
         setUserData({});
         refreshCheck();
         router.reload();
      })
      .catch((err)=>{
         console.log(err);
      });

   }

   useEffect(()=>{
      // checkLoginStatus();
      setUserData(JSON.parse(localStorage.getItem(USER_DATA)));
      // firebase.initializeApp(firebaseConfig);

      // facebook stuff
      Facebook.load()
         .then(() => {
            Facebook.init({
               appId: 827394434550474
            });
            setFacebookLoaded(true);
      });

   }, []);

   return (
      <div className={className}>
         <Usernav user={userData} actions={[{text: "Cerrar Sesión", action: logout}]}/>
         <div className={`the-heading ${headerReduced ? 'reduced' : ''}`}>
            <div className="header-background-video-wrapper">
               <video className="header-background-video" autoPlay muted loop poster="/media/video/fondo-nuevo-placeholder.jpg">
                  <source src="/media/video/fondo-nuevo.mp4" type="video/mp4"/>
               </video>
            </div>
            {!isLogged && !headerReduced ? (
               <>
                  <img className="lata-mentolina" src="/media/lata-seleccion.png" alt="" />
                  <h4 className="mb-3 text-white"><i>PRESENTA</i></h4>
               </>
            ) : ''}
            {headerReduced ? (
               <>
                  <img className="mentolina-logo" src="/media/lata-seleccion.png" alt="" />
                  {!isLogged ? (
                     <img className="infarma-logo" src="/media/infarma-logo.svg" alt="" />
                  ) : ''}
               </>
            ) : ''}
            <img className="mi-casa-logo" src="/media/mi-casa-logo.svg" alt=""/>
            {
               isLogged ? (
                  <Estadios 
                     map={map}
                     reduced={headerReduced} 
                     controlHeaderReduced={controlHeaderReduced} 
                     wizardActive={wizardActive} 
                     setWizardActive={setWizardActive}
                     setButtonViewDisabled={setButtonViewDisabled}
                     createMarkerAction={createMarkerAction}/>
               ) : (!headerReduced ? <a href="#!" className="button mt-5" onClick={toggleModalRegister}>Registra tu estadio <FontAwesomeIcon icon={faFutbol}/></a> : '')}
            {/* <a href="#!" className="button mt-2" onClick={zoomIn}><i className="fas fa-plus"></i></a> */}
            {/* <a href="#!" className="button mt-2" onClick={zoomOut}><i className="fas fa-minus"></i></a> */}
            {/* <a href="#!" className="button mt-2" onClick={toggleHeaderReduced}><i className="fas fa-toggle-on"></i></a> */}
         </div>
         <Modal modalOpened={modalRegisterOpened} toggleModalAction={toggleModalRegister}>
            <h2 className="mb-5">Registrate para participar</h2>
            <GoogleLogin
               clientId="946992110205-ad22psdeoh529a4806s6rlj4he9hbpmj.apps.googleusercontent.com"
               // secret=glBbrQI_aavwbS25xElecBr7
               buttonText="Login"
               onSuccess={googleLoginCallback}
               onFailure={googleLoginCallback}
               cookiePolicy={'single_host_origin'}
               render={renderProps => (
                  <GoogleLoginButton onClick={renderProps.onClick} disabled={renderProps.disabled} text="Continuar con Google"/>
                  // <button >This is my custom Google button</button>
               )}
            />
            {/* <FacebookLogin
               appId="827394434550474"
               fields="name,email,picture"
               callback={facebookLoginCallback}
               render={renderProps => (
                  <FacebookLoginButton onClick={renderProps.onClick} disabled={renderProps.disabled} text="Continuar con Facebook"/>
                  // <button onClick={renderProps.onClick}>This is my custom FB button</button>
               )}
            /> */}
            {facebookLoaded ? <FacebookLoginButton onClick={facebookLoginCallback} text="Continuar con Facebook"/> : ''}
            {/* <a href="#!" className="button mb-3">Registrarse con Google</a> */}
            {/* <a href="#!" className="button">Registrarse con Facebook</a> */}
         </Modal>
         <Loader show={showPreloader || checkingLogged}/>
      </div>
   )
}
