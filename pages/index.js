import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import Header from '../components/header'

var map;

var locations = [
   [-87.2866837, 14.284429],
   [-87.1971197, 14.084288],
   [-88.2390547, 14.923963],
   [-88.2475647, 14.926786]
];

export default function Home() {

   let headingRef = useRef();
   let [headerReduced, setHeaderReduced] = useState(false);

   useEffect(()=>{
      mapboxgl.accessToken = 'pk.eyJ1Ijoib2dpbHZ5aG4iLCJhIjoiY2tuNHZvemoxMWxlODJvbzhjcXJ2dXA0ZiJ9.-qM5P55gShtgXzKLXMbVqQ';
      map = new mapboxgl.Map({
         container: 'map',
         style: 'mapbox://styles/ogilvyhn/ckn4w7ba5023n17qz53gzncbj'
      });
      loadMarkers();
      // firebase.analytics();
   }, []);

   const loadMarkers = ()=>{
      locations.map((location)=>{
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
         <Header headerReduced={headerReduced}/>
         <div id="map" className="background-map-wrapper"></div>
         <div className="bottom-nav">
            {!headerReduced
               ? <a href="#!" className="button" onClick={toggleHeaderReduced}>Ver estadios <i className="fas fa-expand-arrows-alt"></i></a>
               : <a href="#!" className="button" onClick={toggleHeaderReduced}>Volver <i className="fas fa-compress-arrows-alt"></i></a>}
         </div>
      </>
   )
}
