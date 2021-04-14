import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'

export default function Usernav({user, actions}) {

   let [navOpened, setNavOpened] = useState(false);

   let actionsElements = actions.map((a, i)=>{
      return <a className="user-nav-button" href="#!" onClick={a.action} key={`a${i}`}>{a.text}</a>
   });

   return (
      <>
         {(
            user !== null &&
            user.hasOwnProperty('name') &&
            user.hasOwnProperty('platform') &&
            user.hasOwnProperty('pic')
         )
         ? (
            <div className="user-nav" onClick={()=>{setNavOpened(!navOpened)}}>
               <div className="user-info">
                  <h5 className="nombre">{user.name}</h5>
                  <span className="login-info">Logueado con {user.platform}</span>
               </div>
               <img className="user-pic" src={user.pic} alt=""/>
               <span className="arrow"><FontAwesomeIcon icon={faSortDown}/></span>
               <div className={`user-nav-actions ${navOpened ? 'show' : ''}`}>
                  {actionsElements}
               </div>
            </div>
         ) : ''}
      </>
   )
}
