import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import Header from '../components/header'
import SimpleLoader from '../components/simpleLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpandArrowsAlt, faCompressArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import firebaseConfig from '../components/firebaseconfig'
import firebase from 'firebase'
import "firebase/firestore"

var map;

// var locations = [
//    [-87.2866837, 14.284429],
//    [-87.1971197, 14.084288],
//    [-88.2390547, 14.923963],
//    [-88.2475647, 14.926786]
// ];

export default function Home() {

   let headingRef = useRef();
   let [headerReduced, setHeaderReduced] = useState(false);
   let [buttonViewDisabled, setButtonViewDisabled] = useState(false);
   let [mapInstance, setMapInstance] = useState(null);
   let [gettingEstadios, setGettingEstadios] = useState(false);
   let [estadios, setEstadios] = useState([]);

   useEffect(()=>{

      if(firebase.apps.length === 0)
         firebase.initializeApp(firebaseConfig);

      mapboxgl.accessToken = 'pk.eyJ1Ijoib2dpbHZ5aG4iLCJhIjoiY2tuNHZvemoxMWxlODJvbzhjcXJ2dXA0ZiJ9.-qM5P55gShtgXzKLXMbVqQ';
      map = new mapboxgl.Map({
         container: 'map',
         style: 'mapbox://styles/ogilvyhn/ckn4w7ba5023n17qz53gzncbj'
      });
      setMapInstance(map);
      getEstadios();
      // firebase.analytics();
   }, []);

   const getEstadios = ()=>{

      var db = firebase.firestore();
      var locations = [];

      db.collection('estadios').get().then((docs)=>{
         docs.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            locations.push([doc.data().ubicacion.latitude, doc.data().ubicacion.longitude]);
        });
      });

      setEstadios(locations);
      loadMarkers();

   }

   const loadMarkers = ()=>{
      estadios.map((location)=>{
         new mapboxgl.Marker({
            color: "#ce3f3f"
         }).setLngLat(location)
         .addTo(map);
      });
   }

   const zoomIn = ()=>{
      if(map != null) map.zoomIn({duration: 500});
   }

   const zoomOut = ()=>{
      if(map != null) map.zoomOut({duration: 500});
   }

   const toggleHeaderReduced = ()=>{
      !headerReduced ? zoomIn() : zoomOut();
      setHeaderReduced(!headerReduced);
   }

   return (
      <>
         <Head>
            <link href='https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css' rel='stylesheet' />
            <script src="https://kit.fontawesome.com/fdb97cba60.js" crossOrigin="anonymous"></script>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@200;400;600;900&display=swap" rel="stylesheet"/>  
         </Head>
         <div className="bottom-nav">
            {!headerReduced
               ? <button href="#!" disabled={buttonViewDisabled} className="button" onClick={toggleHeaderReduced}>Ver estadios <FontAwesomeIcon icon={faExpandArrowsAlt}/></button>
               : <button href="#!" disabled={buttonViewDisabled} className="button" onClick={toggleHeaderReduced}>Volver <FontAwesomeIcon icon={faCompressArrowsAlt}/></button>}
         </div>
         <Header 
            headerReduced={headerReduced}
            map={mapInstance} 
            controlHeaderReduced={setHeaderReduced}
            setButtonViewDisabled={setButtonViewDisabled}
            />
         <div id="map" className="background-map-wrapper"></div>
         <SimpleLoader show={true}/>
      </>
   )
}
