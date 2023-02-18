import * as React from 'react';
// import { useState, useEffect} from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";


function App() {
  const currentUser = "Jake";
  const [pins, setPins] = React.useState([]);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);
  const [viewState, setViewState] = React.useState({
    longitude: 30,
    latitude: 50,
    zoom: 3.5
  });

  React.useEffect(() => {
    const getPins = async () => {
      try {
        const responce = await axios.get("/pins");
        setPins(responce.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins()
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({...viewState, latitude: lat, longitude: long}) //...viewState, means everything inside this object will remain the same, кроме того что мы указываем после запятой.
  }

  const handleAddClick = (e) => {  //e for event
    //console.log(e);
    let lat = e.lngLat.lat;
    let lng = e.lngLat.lng;

    setNewPlace ({
      lat: lat,
      lng: lng
    });
  }

  return (
    <div className="App">
      <Map
        {...viewState}
        // container={"map"}
        // projection={"globe"}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onDblClick={handleAddClick}
        transitionDuration="200"
      >
        {pins.map(p => (
          <>
            <Marker latitude={p.lat} longitude={p.long}>
              <PlaceIcon
                style={{
                  fontSize: viewState.zoom * 8,
                  color: p.username === currentUser ? "#B3005E" : "slateblue",
                  cursor: "pointer"
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId &&
              <Popup
                latitude={p.lat}
                longitude={p.long}
                anchor="left"
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h3 className="place">{p.title}</h3>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="Stars">
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                  </div>
                  <label>Information</label>
                  <span className="username">Created by <b>{p.username}</b></span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            }
          </>
        ))};
        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.lng}
            anchor="left"
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >Test</Popup>
        )}
      </Map>
    </div>
  );
}

export default App;
