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
import Slider from "react-slick"

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

   const sliderSettings = {
      arrows: false,
      dots: false,
      infinite: true,
      autoplay: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplaySpeed: 2500
    };

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
            <title>Mi Casa Mi Estadio</title>
            <meta name="description" content="Creá tu estadio desde tu propia casa y apoyá a la H en Mi Casa Mi Estadio" />
            <meta name="keywords" content="estadio,lah,conla12enelpecho,Honduras,mentolina,infarma,H" />
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZFH68VKKRS"></script>
            <script dangerouslySetInnerHTML={{
               __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-ZFH68VKKRS');
               `
            }}/>
            {/* <!-- Facebook Pixel Code --> */}
            <script dangerouslySetInnerHTML={{
               __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window,document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js';);
                  fbq('init', '305007251100756'); 
                  fbq('track', 'PageView');
               `
            }}>
            </script>
            <noscript>
            <img height="1" width="1" src="https://www.facebook.com/tr?id=305007251100756&ev=PageView&noscript=1"/>
            </noscript>
            {/* <!-- End Facebook Pixel Code --> */}
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
         <img className="mentolina-logo" src="/media/hashtag-logo-mentolina.png" alt=""/>
         <div className="cintillo">
            <Slider {...sliderSettings}>
               <div className="d-flex flex-row justify-content-center align-items-center">
                  <img className="cintillo-image-part" src="/media/row-1-col-1.png" alt="" />
               </div>
               <div className="d-flex flex-row justify-content-center align-items-center">
                  <img className="cintillo-image-part" src="/media/row-1-col-3.png" alt="" />
               </div>
               <div className="d-flex flex-row justify-content-center align-items-center">
                  <img className="cintillo-image-part" src="/media/row-1-col-3.png" alt="" />
               </div>
               <div className="d-flex flex-row justify-content-center align-items-center">
                  <img className="cintillo-image-part" src="/media/row-1-col-4.png" alt="" />
               </div>
               <div className="d-flex flex-row justify-content-center align-items-center">
                  <img className="cintillo-image-part" src="/media/row-2-col-1.png" alt="" />
               </div>
               <div className="d-flex flex-row justify-content-center align-items-center">
                  <img className="cintillo-image-part" src="/media/row-2-col-2.png" alt="" />
               </div>
               <div className="d-flex flex-row justify-content-center align-items-center">
                  <img className="cintillo-image-part" src="/media/row-2-col-3.png" alt="" />
               </div>
               <div className="d-flex flex-row justify-content-center align-items-center">
                  <img className="cintillo-image-part" src="/media/row-2-col-4.png" alt="" />
               </div>
            </Slider>
         </div>
         <Modal modalOpened={modalEstadiosOpened} toggleModalAction={toggleModalPremios} smallwidth={false}>
            <h1 className="text-center mb-4">Premios</h1>
            <div className="row">
               <div className="col-12 col-md-4">
                  <img className="img-fluid img-premio" src="/media/premios/camisa.png" alt="" />
               </div>
               <div className="col-12 col-md-4">
                  <img className="img-fluid img-premio" src="/media/premios/parrillada.png" alt="" />
               </div>
               <div className="col-12 col-md-4">
                  <img className="img-fluid img-premio" src="/media/premios/televisor.png" alt="" />
               </div>
            </div>
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
            <div className="container terminos">
               <h1 className="text-center mb-4">Términos y condiciones</h1>
               <h4 className="my-2">Vigencia del concurso:</h4>
               <p>Del 26 de mayo 2021 – 15 de noviembre 2021</p>

               <p>Concurso válido únicamente para: Honduras.</p>
               <h4 className="my-2">Requisitos:</h4>
               <ul>
                  <li>Residir en Honduras.</li>
                  <li>Ser mayor de 18 años.</li>
                  <li>Ser seguidor de INDUSTRIA FARMACÉUTICA S.A. (INFARMA) en la plataforma social de Facebook.</li>
                  <li>La información se validará a través de los agentes de marca INDUSTRIA FARMACÉUTICA S.A. (INFARMA).</li>
                  <li>Los participantes que califiquen con los términos previos deberán seguir las instrucciones de la dinámica de Mi Casa – Mi Estadio.</li>
               </ul>

               <h4 className="my-2">Dinámica:</h4>
               <h5 className="my-2"><b>PARA EL GRAN PREMIO</b></h5>
               <p>El concursante deberá compartir sus datos y crear su estadio en el sitio web Mi Casa – Mi Estadio y estará participando. Otras acciones que el participante puede realizar es compartir el post de forma pública en su perfil de Facebook.</p>
               <p><b>Premio:</b></p>
               <p>Televisores HD para disfrutar los partidos de la Selección.</p>

               <h5 className="my-2">PARA OTROS PREMIOS | DINÁMICAS</h5>
               <p>El concursante deberá seguir todos los pasos estipulados en la dinámica en la cual esté participando dentro del contenido Mi Casa – Mi Estadio). El concursante debe ser seguidor de la red social de INDUSTRIA FARMACÉUTICA S.A. (INFARMA) en la que esté participando, ya sea Facebook o Instagram. </p>
               <p><b>Otros premios:</b></p>
               <ul>
                  <li>3 parrilladas para 6 personas (por partido)</li>
                  <li>Camisetas de la Selección Nacional de Honduras (verificar cantidad de ganadores)</li>
               </ul>

               <h5 className="my-2">Reclamo de Premio:</h5>
               <p>El premio será entregado el día estipulado por los representantes de INDUSTRIA FARMACÉUTICA S.A. (INFARMA), los cuales se pondrán en contacto con el ganador y el premio será entregado a la fecha y hora indicada.</p>
               <p>Solo el ganador puede reclamar su premio presentando un documento de identificación válido. </p>
               <p>INDUSTRIA FARMACÉUTICA S.A. (INFARMA) reserva el derecho de realizar las modificaciones o anexos sobre la mecánica, vigencia y premios de Mi Casa – Mi Estadio.</p>

               <h4 className="my-2">Ganadores:</h4>
               <p>Los ganadores serán seleccionados por los agentes de marca de INDUSTRIA FARMACÉUTICA S.A. (INFARMA), según los términos y restricciones del concurso. </p>
               <h4 className="my-2">Restricciones del concurso:</h4>
               <ol>
                  <li>Al participar, de forma automática el participante acepta los términos y condiciones.</li>
                  <li>Al participar en la dinámica, se le otorga de manera automática la autorización a INDUSTRIA FARMACÉUTICA S.A. (INFARMA) para poder usar su información y el participante acepta que INDUSTRIA FARMACÉUTICA S.A. (INFARMA) no tienen ninguna obligación legal en proporcionar una compensación monetaria por el uso de su imagen ya sea en fotografías, videos y multimedia. </li>
                  <li>El premio no podrá ser canjeado por otro producto o dinero en efectivo.</li>
                  <li>El participante deberá contestar el mensaje enviado a través de su Facebook o las llamadas realizadas por representantes de la marca INDUSTRIA FARMACÉUTICA S.A. (INFARMA) en el tiempo indicado y presentarse con su identificación en la hora, fecha y lugar que INDUSTRIA FARMACÉUTICA S.A. (INFARMA) confirme. De lo contrario, el premio no se le entregará y será otorgado a otro participante que cumpla con los requisitos. </li>
                  <li>El participante que ganó la dinámica será la única persona que pueda reclamar el premio. </li>
               </ol>
               
               <h4 className="my-2">Anexos:</h4>
               <ol>
                  <li>INDUSTRIA FARMACÉUTICA S.A. (INFARMA) se reserva el derecho de realizar modificaciones o anexos sobre la mecánica, vigencia y premios siempre que estén justificados, no perjudiquen a los participantes o ganadores, y sean comunicados a estos debidamente por este medio.</li>
                  <li>Facebook no avala, patrocina ni administra de manera alguna esta promoción, ni se encuentra asociado con ella.</li>
               </ol>
         
            </div>            
         </Modal>
      </>
   )
}
