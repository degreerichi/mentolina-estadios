import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import Header from '../components/header'
import SimpleLoader from '../components/simpleLoader'
import useIsLogged from '../components/hooks/isLogged'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpandArrowsAlt, faCompressArrowsAlt, faTrophy, faFileContract } from '@fortawesome/free-solid-svg-icons'
import firebaseConfig from '../components/firebaseconfig'
import firebase from "firebase/app"
import "firebase/firestore"
import Modal from '../components/modal'

var map;

export async function getServerSideProps(context) {
  
  return {
    props: {
       lng: context.query.lng !== undefined ? context.query.lng : null,
       lat: context.query.lat !== undefined ? context.query.lat : null
    }
  }
}

// var locations = [
//    [-87.2866837, 14.284429],
//    [-87.1971197, 14.084288],
//    [-88.2390547, 14.923963],
//    [-88.2475647, 14.926786]
// ];

export default function Home({lng, lat}) {

   // const router = useRouter();
   // const { lng, lat } = router.query;
   
   // let [isLogged, checkingLogged] = useIsLogged();

   // let headingRef = useRef();
   let [headerReduced, setHeaderReduced] = useState(false);
   let [buttonViewDisabled, setButtonViewDisabled] = useState(false);
   let [mapInstance, setMapInstance] = useState(null);
   let [estadios, setEstadios] = useState([]);
   let [loadingEstadios, setLoadingEstadios] = useState(false);
   let [modalEstadiosOpened, setModalEstadiosOpened] = useState(false);
   let [modalTerminosCondiciones, setModalTerminosCondiciones] = useState(false);

   useEffect(()=>{

      if(firebase.apps.length === 0)
         firebase.initializeApp(firebaseConfig);

      mapboxgl.accessToken = 'pk.eyJ1Ijoib2dpbHZ5aG4iLCJhIjoiY2tuNHZvemoxMWxlODJvbzhjcXJ2dXA0ZiJ9.-qM5P55gShtgXzKLXMbVqQ';
      map = new mapboxgl.Map({
         container: 'map',
         style: 'mapbox://styles/ogilvyhn/ckn4w7ba5023n17qz53gzncbj'
      });

      map.on('load', function() {
         
         setMapInstance(map);
         getEstadios(map);

         // console.log(router.query);
         console.log({lng, lat});

         if(lng !== null && lat !== null)
            viewLocationInMap(lng, lat);

      });

      // firebase.analytics();
   }, []);

   const viewLocationInMap = (longitude, latitude)=>{

      toggleHeaderReduced(false);

      map.flyTo({
         zoom: 15,
         center: [longitude, latitude],
         pitch: 0
      });

   }

   const getEstadios = (map)=>{

      var db = firebase.firestore();
      
      setLoadingEstadios(true);

      db.collection('estadios').get().then((docs)=>{
         var estadiosRaw = [];
         docs.forEach((doc) => {
            // let datos = doc.data();
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", datos);
            estadiosRaw.push(doc.data());
         });
         setEstadios(estadiosRaw);
         loadMarkers(map, estadiosRaw);
         setLoadingEstadios(false);
      }).catch((err)=>{
         console.log(err);
      });

   }

   const loadMarkers = (map, estadiosRaw)=>{
      estadiosRaw.map((estadio)=>{
         createEstadioMarker(estadio);
      });
   }

   const createEstadioMarker = (estadio)=>{
      var el = document.createElement('div');
      el.className = 'marker';
      var img = document.createElement('img');
      img.src = '/media/estadio-icon.svg';
      el.appendChild(img);

      var textoArriba = estadio.seudonimo !== undefined ? estadio.nombre : (
         estadio.prefijo !== undefined ? estadio.prefijo : ''
      );
      var textoAbajo = estadio.seudonimo !== undefined ? estadio.seudonimo : (
         estadio.nombre
      );

      var popup = new mapboxgl.Popup({
         offset: 25, 
         closeOnMove: true,
         className: 'marker-popup'
      }).setText(
         `${textoArriba} ${textoAbajo}`
      );

      new mapboxgl.Marker({
         element: el
      }).setLngLat([estadio.ubicacion.longitude, estadio.ubicacion.latitude])
         .setPopup(popup)
         .addTo(map);
   }

   const zoomIn = ()=>{
      if(map != null) map.zoomIn({duration: 500});
   }

   const zoomOut = ()=>{
      if(map != null) map.zoomOut({duration: 500});
   }

   const resetZoomAndLocation = ()=>{
      if(map != null){
         // map.setCenter([-86.153, 14.847]);
         // map.setZoom(6.5);
         map.flyTo({
            zoom: 8,
            center: [-86.153, 14.847],
            pitch: 0
         });
      }
   }

   const toggleHeaderReduced = (movingmap = true)=>{
      if(movingmap){
         !headerReduced ? zoomOut() : resetZoomAndLocation();
      }
      setHeaderReduced(!headerReduced);
   }

   const toggleModalPremios = ()=>{
      setModalEstadiosOpened(!modalEstadiosOpened);
   }
   const toggleModalTerminosCondiciones = ()=>{
      setModalTerminosCondiciones(!modalTerminosCondiciones);
   }

   return (
      <>
         <Head>
            <link href='https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css' rel='stylesheet' />
            {/* <script src="https://kit.fontawesome.com/fdb97cba60.js" crossOrigin="anonymous"></script> */}
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@200;400;600;900&display=swap" rel="stylesheet"/>
            <meta property="og:url" content={`https://micasamiestadio.com`}/>
            <meta property="og:type" content="website"/>
            <meta property="og:title" content="Mi Casa Mi Estadio"/>
            <meta property="og:description" content="Apoyemos a la H compartiendo nuestro propio estadio"/>
            <meta property="og:image" content='/media/share-v2.jpg'/>
            <meta property="og:image:url" content='/media/share-v2.jpg'/>
            <meta property="og:image:width" content="1000"/>
            <meta property="og:image:height" content="1000"/>
            <meta property="fb:app_id" content="827394434550474"/>
         </Head>
         <div className="bottom-nav">
            {!headerReduced
               ? <button href="#!" disabled={buttonViewDisabled} className="button" onClick={toggleHeaderReduced}>Ver estadios <FontAwesomeIcon icon={faExpandArrowsAlt}/></button>
               : <button href="#!" disabled={buttonViewDisabled} className="button" onClick={toggleHeaderReduced}>Volver <FontAwesomeIcon icon={faCompressArrowsAlt}/></button>}
         </div>
         <Header 
            className="position-relative"
            headerReduced={headerReduced}
            map={mapInstance} 
            controlHeaderReduced={setHeaderReduced}
            setButtonViewDisabled={setButtonViewDisabled}
            createMarkerAction={createEstadioMarker}
            cantidadEstadios={estadios.length}
            />
         <div id="map" className="background-map-wrapper"></div>
         <SimpleLoader show={loadingEstadios}/>
         <a href="#!" className="right-button premios" onClick={toggleModalPremios}><FontAwesomeIcon icon={faTrophy}/></a>
         <a href="#!" className="right-button terminos" onClick={toggleModalTerminosCondiciones}><FontAwesomeIcon icon={faFileContract}/></a>
         <img className="mentolina-logo" src="/media/mentolina-logo-test.png" alt=""/>
         <Modal modalOpened={modalEstadiosOpened} toggleModalAction={toggleModalPremios} smallwidth={false}>
            <h2 className="text-center mb-4">Premios</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque officiis ad consequatur omnis, molestias voluptatibus harum modi nostrum rem fugit. Voluptatem, totam. Commodi vel blanditiis dicta maxime doloribus. Eligendi, quis.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque officiis ad consequatur omnis, molestias voluptatibus harum modi nostrum rem fugit. Voluptatem, totam. Commodi vel blanditiis dicta maxime doloribus. Eligendi, quis.</p>
            {/* <div className="row">
               <div className="col-4">
                  <img className="w-100" src="/media/post.jpg" alt="" />
               </div>
               <div className="col-8">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio earum, architecto laudantium ducimus assumenda possimus, corporis suscipit deserunt vero maxime minima laborum cumque, sunt aperiam saepe esse quaerat. Doloribus, saepe.
               </div>
            </div> */}
         </Modal>
         <Modal modalOpened={modalTerminosCondiciones} toggleModalAction={toggleModalTerminosCondiciones} smallwidth={false}>
            <h2 className="text-center mb-4">Términos y condiciones</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id at accusantium corporis veritatis, ipsum saepe consectetur autem minima quaerat aspernatur, consequuntur nobis tempora recusandae voluptatum quos perspiciatis voluptate accusamus illum.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id at accusantium corporis veritatis, ipsum saepe consectetur autem minima quaerat aspernatur, consequuntur nobis tempora recusandae voluptatum quos perspiciatis voluptate accusamus illum.</p>
            {/* <div className="row">
               <div className="col-4">
                  <img className="w-100" src="/media/post.jpg" alt="" />
               </div>
               <div className="col-8">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio earum, architecto laudantium ducimus assumenda possimus, corporis suscipit deserunt vero maxime minima laborum cumque, sunt aperiam saepe esse quaerat. Doloribus, saepe.
               </div>
            </div> */}
         </Modal>
      </>
   )
}
