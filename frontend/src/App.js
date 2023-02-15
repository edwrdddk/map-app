import * as React from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PlaceIcon from '@mui/icons-material/Place';

function App() {
  const [viewState, setViewState] = React.useState({
    longitude: 30,
    latitude: 50,
    zoom: 3.5
  });
  return (
    <div className="App">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      >;
        <Marker longitude={40} latitude={2}/>

      </Map>;
    </div>
  );
}

export default App;
