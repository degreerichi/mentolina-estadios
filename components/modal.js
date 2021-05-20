import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default function Modal({modalOpened, toggleModalAction, children, smallwidth = true}) {
   return (
      <>
         <div className={`modal-overlay ${modalOpened ? 'show' : ''}`} onClick={toggleModalAction}></div>
         <div className={`le-modal ${modalOpened ? 'opened' : ''} ${smallwidth ? 'small-width' : ''}`} tabIndex="-1">
            <a href="#!" className="close-button" onClick={toggleModalAction}>
               <FontAwesomeIcon icon={faTimes}/>
            </a>
            {children}
         </div>
      </>
   )
}
