import Cookies from 'cookies'

export default function handler(req, res){

   const cookies = new Cookies(req, res);

   cookies.set('token', null, {
      maxAge: -1
   });

   res.send({
      result: 'ok'
   });

}