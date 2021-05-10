import React, { useState } from "react";

export const useHasLocationPermissions = ()=>{

   const [hasPermissions, setHasPermissions] = useState(false);
   const [requestingPermissions, setRequestingPermissions] = useState(false);

   const requestPermissions = (callback) => {

      if(!navigator.geolocation){
         console.log('Geolocation not supported');
      }else{
         setRequestingPermissions(true);
         navigator.permissions.query({name: 'geolocation'}).then((res)=>{
            if(res.state === 'granted'){
               setHasPermissions(true);
               if(typeof callback === 'function') navigator.geolocation.getCurrentPosition(callback);
            }else if(res.state === 'prompt'){
               if(typeof callback === 'function') navigator.geolocation.getCurrentPosition((res)=>{
                  setHasPermissions(true);
                  callback(res);
               }, ()=>{
                  setHasPermissions(false);
                  callback(false);
               });
            }else{
               setRequestingPermissions(false);
               if(typeof callback === 'function') callback(false);
            }
         });
      }

   }

   return [
      hasPermissions,
      requestingPermissions,
      requestPermissions
   ];

}