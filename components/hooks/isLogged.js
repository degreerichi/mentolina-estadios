import { useState, useEffect } from 'react'
import { USER_DATA } from '../strings'
import * as Facebook from 'fb-sdk-wrapper'

const checkGoogleLoginStatus = (userData)=>{

   return new Promise((resolve, reject)=>{

      axios.post('api/check', userData)
         .then((res)=>{
            // setCheckingLoginStatus(false);
            // setIsAuthenticated(true);
            console.log(res);
            resolve(true, res);
         })
         .catch((err)=>{
            reject(false, err);
            console.log(err);
         });

   });
}

const checkFacebookLoginStatus = (userData)=>{

   return new Promise((resolve, reject)=>{

      Facebook.load()
         .then(() => {
            Facebook.init({
               appId: 827394434550474
            });
            Facebook.getLoginStatus()
               .then((response) => {
                  if (response.status === 'connected') {
                     // logged in
                     console.log('connected');
                     resolve(true, response);
                  } else {
                     // not logged in
                     console.log('not connected');
                     resolve(false, response);
                  }
               }).catch(err => reject(err));
         });
   });

}

const checkLoginStatus = ()=>{

   return new Promise((resolve, reject)=>{

      if(localStorage.getItem(USER_DATA) === null){
         resolve(false);
         // setCheckingLoginStatus(false);
      }else{

         var userData = JSON.parse(localStorage.getItem(USER_DATA));
         
         if(userData.platform === 'google' || userData.platform === 'manualmente'){
            checkGoogleLoginStatus(userData).then(res => resolve(res)).catch(err => reject(err));
         }else if(userData.platform === 'facebook'){
            checkFacebookLoginStatus(userData).then(res => resolve(res)).catch(err => reject(err));
         }else {
            reject(false);
         }

      }
   });

}

function useIsLogged(){

   const [isLogged, setIsLogged] = useState(false);
   const [loadingCheck, setLoadingCheck] = useState(false);

   const refreshCheck = ()=>{
      
      setLoadingCheck(true);
      checkLoginStatus().then((logged, res)=>{
         setIsLogged(logged);
      }).catch((logged, err)=>{
         setIsLogged(logged);
      }).finally(()=>{
         setLoadingCheck(false);
      });
      
   }

   useEffect(()=>{
      refreshCheck();
   }, []);

   return [isLogged, loadingCheck, refreshCheck]

}

export default useIsLogged;