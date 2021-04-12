import Cookies from 'cookies'
import { OAuth2Client } from 'google-auth-library'
import axios from 'axios';

// const CLIENT_ID = '30296681928-ni08nropiqef7hmsl9g0efm807ppvnsn.apps.googleusercontent.com';
const CLIENT_ID = '946992110205-ad22psdeoh529a4806s6rlj4he9hbpmj.apps.googleusercontent.com';
const ACCESS_TOKEN = 'EAALwgsdcSsoBAIBD9tiaPOwNsz2zn42htIXtzyGwrsJ7Yl1zDwNUbousZA5LRZA3rbc6xDjEZB47d01h4IbPV1mD1bSdiZBVzusM8KeCEi6ATbOvZA3VWPKXbF4PTtgwZBsbP6FrVTeoA0BjU2AD2o29yZCTDQVSaNelYzcqLQnHp3jOB9fdi4y6LO7s6PE7yPYuVDuZCDwbqMreQnnsnZCooHIkWMz98uaQEXhqiLWe1jgZDZD';

function handleGoogleAuthentication(req, res){

   const cookies = new Cookies(req, res);
   const client = new OAuth2Client(CLIENT_ID);

   async function verify() {
      const ticket = await client.verifyIdToken({
         idToken: cookies.get('token'),
         audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
         // Or, if multiple clients access the backend:
         //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
   }
   verify().then((result)=>{
      res.status(200).json({
         code: 200,
         result: 'ok'
      });
   }).catch((err)=>{
      res.status(200).json({
         code: 401,
         result: 'unauthorized'
      });
   });

}

function handleFacebookAuthentication(req, res){

   const cookies = new Cookies(req, res);

   axios.get(`graph.facebook.com/debug_token?input_token=${cookies.get('token')}&access_token=${ACCESS_TOKEN}`)
      .then((res)=>{
         console.log(res);
         res.status(200).json({
            code: 200,
            result: 'ok'
         });
      })
      .catch((err)=>{
         console.log(err);
         res.status(200).json({
            code: 401,
            result: 'unauthorized'
         });
      })

}

export default function handler(req, res){

   if(req.method === "POST"){

      if(req.body.platform === 'google'){
         handleGoogleAuthentication(req, res);
      }else if(req.body.platform === 'facebook'){
         handleFacebookAuthentication(req, res);
      }else{
         res.status(401);
      }

   }else{
      res.status(404);
   }

}