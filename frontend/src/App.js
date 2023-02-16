import * as React from 'react';
// import { useState, useEffect} from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import "./app.css"
const axios = require('axios').default;


function App() {
  const [pins, setPins] = React.useState([]);
  const [viewState, setViewState] = React.useState({
    longitude: 30,
    latitude: 50,
    zoom: 3.5
  });

  React.useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins()
  }, []);

  return (
    <div className="App">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      >
        {pins.map(p => (
          <>
            <Marker latitude={p.lat} longitude={p.long}>
              <PlaceIcon style={{ fontSize: viewState.zoom * 8, color: "slateblue" }} />
            </Marker>
            <Popup latitude={p.lat} longitude={p.long} anchor="left" closeOnClick={false}>
              <div className="card">
                <label>Place</label>
                <h3>Le Café des Chats</h3>
                <label>Review</label>
                <p className="desc">Nice place.</p>
                <label>Rating</label>
                <div className="Stars">
                  <StarIcon className="star" />
                  <StarIcon className="star" />
                  <StarIcon className="star" />
                  <StarIcon className="star" />
                  <StarIcon className="star" />
                </div>
                <label>Information</label>
                <span className="username">Created by <b>Finn</b></span>
                <span className="date">1 hour ago</span>
              </div>
            </Popup>
          </>
        ))};
      </Map>
    </div>
  );
}

export default App;
