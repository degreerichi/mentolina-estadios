import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

export default function Loader({show}) {
   return (
      <>
         <div className={`overlay ${show ? 'show' : ''}`}></div>
         <div className={`loader ${show ? 'show' : ''}`}>
            <FontAwesomeIcon icon={faCircleNotch} size="3x" spin/>
         </div>
      </>
   )
}
