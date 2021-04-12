import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function SimpleLoader({show, inline = false, className}) {
   return (
      <>
         {show ? (
            <div className={`simple-loader ${inline ? 'inline' : ''} ${className}`}>
               <FontAwesomeIcon icon={faSpinner} size="lg" spin/>
            </div>
         ) : ''}
      </>
   )
}
