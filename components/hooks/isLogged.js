import { useState, useEffect } from 'react'
import { USER_DATA } from '../strings'

const checkLoginStatus = ()=>{

   return new Promise((resolve, reject)=>{

      if(localStorage.getItem(USER_DATA) === null){
         resolve(false);
         // setCheckingLoginStatus(false);
      }else{

         var userData = JSON.parse(localStorage.getItem(USER_DATA));
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