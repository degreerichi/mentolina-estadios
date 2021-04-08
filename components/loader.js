import React from 'react'

export default function Loader({show}) {
   return (
      <>
         <div className={`overlay ${show ? 'show' : ''}`}></div>
         <div className={`loader ${show ? 'show' : ''}`}>
            <i className="fas fa-circle-notch fa-3x fa-spin"></i>
         </div>
      </>
   )
}
