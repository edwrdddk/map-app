import * as React from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
import Register from './components/Register';


function App() {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [pins, setPins] = React.useState([]);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [desc, setDesc] = React.useState(null);
  const [rating, setRaiting] = React.useState(0);
  const [viewState, setViewState] = React.useState({
    longitude: 30,
    latitude: 50,
    zoom: 3.5
  });

  //fetching pins from backend 
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
    setViewState({ ...viewState, latitude: lat, longitude: long });
  }

  const handleAddClick = (e) => {
    //console.log(e);
    let lat = e.lngLat.lat;
    let lng = e.lngLat.lng;

    setNewPlace({
      lat: lat,
      lng: lng
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title: title,
      desc: desc,
      rating: rating,
      lat: newPlace.lat,
      long: newPlace.lng
    }

    try {
      const responce = await axios.post("/pins", newPin);
      setPins([...pins, responce.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <Map
        {...viewState}
        container={"map"}
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
                  fontSize: viewState.zoom * 9,
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
                    {Array(p.rating).fill(<StarIcon className="star" />)}
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
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Tell us about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRaiting(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">Add Pin</button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <button className="button logout">Log out</button>
        ) : (
          <div className="dumDiv">
            <button className="button login">Login</button>
            <button className="button register">Register</button>
          </div>
        )}
        <Register />
      </Map>
    </div>
  );
}

export default App;
