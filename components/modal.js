import React from 'react'

export default function Modal({modalOpened, toggleModalAction, children}) {
   return (
      <>
         <div className={`modal-overlay ${modalOpened ? 'show' : ''}`} onClick={toggleModalAction}></div>
         <div className={`le-modal ${modalOpened ? 'opened' : ''}`} tabIndex="-1">
            <a href="#!" className="close-button" onClick={toggleModalAction}><i className="fas fa-times"></i></a>
            {children}
         </div>
      </>
   )
}
