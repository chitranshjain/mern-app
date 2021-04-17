import React, { useRef, useEffect } from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax

import "./Map.css";

function MyMap(props) {
  const mapRef = useRef();
  
  const center= props.center;
  const zoom = props.zoom;
 
  useEffect(() => {
    console.log(props);
    console.log("Printing center");
    console.log(center);
    new window.ol.Map({
      target: mapRef.current.id,
      layers: [
        new window.ol.layer.Tile({
          source: new window.ol.source.OSM()
        })
      ],
      view: new window.ol.View({
        center: window.ol.proj.fromLonLat([center.lng, center.lat]),
        zoom: zoom
      })
    });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
      id="map"
    ></div>
  );
}

export default MyMap;
