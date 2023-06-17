import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import countries from "./asset/countries.json";
import SearchBox from "./SearchBox";
import { useState,useEffect } from "react";
import axios from 'axios';


const center = [28.14520533292357, 77.33696476491173];
function App() {
  
  const [country,setCountry] = useState(null);

  const [searchValue, setSearchValue] = useState();
  // altSpellings
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  function searchHandler(val) {
    setLoading(true);
    axios
      .get(`https://restcountries.com/v3.1/name/${val}?fullText=true`)
      .then((res) => {
        setResult(res.data);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
      });
  }
 

  return (
    <div className="container">
   <div className="firstDiv">
   <MapContainer
      center={center}
      zoom={100}
      style={{ width: "50vw", height: "100vh" }}
    >
      <TileLayer
        url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=0QIpaWLcBWzFTLZObSe6"
        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
      />
      {countries &&
        countries.features.map((country,index) => {
          const coordinate = country.geometry.coordinates[0].map((item)=>[item[1],item[0]])
          return (
            <Polygon key={index}
            pathOptions={{
              fillColor:'#FD8D3C',
              fillOpacity:0.7,
              weight:2,
              opacity:1,
              dashArray:3,
              color:'white',
            }}
            positions={coordinate}
            eventHandlers={{
              mouseover:(e)=>{
                const layer = e.target;
                layer.setStyle({
                  fillOpacity:0.7,
                  weight:5,
                  dashArray:'',
                  color:"#666",
                  fillColor:'#FACDCC'
                })
              },
              mouseout:(e)=>{
                const layer = e.target;
                layer.setStyle({
                  fillOpacity:0.7,
                  weight:2,
                  dashArray:'3',
                  color:"#white"
                })
              },

              click:(e)=>{
                const url = `http://api.geonames.org/countryCodeJSON?lat=${e.latlng.lat}&lng=${e.latlng.lng}&username=akki03`
                axios.get(url)
                .then(res=>{
                  setCountry(res.data.countryName)
                })
                .catch(err=>console.log(err))

                country && searchHandler(country.properties.ADMIN)
                {
                  document.getElementById('inputField').value = country.properties.ADMIN;
                }
              }
            }}
            />
          )
        })}
    </MapContainer>
   </div>
   <div className="secondDiv">
   <div className="searchBox">
      <div class="input-group mb-3">
        <input
          type="text"
          className="form-control"
          id="inputField"
          aria-label="Sizing example input"
          placeholder="search country"
          onKeyUp={(e) => setSearchValue(e.target.value)}
          aria-describedby="inputGroup-sizing-default"
        />
      </div>

      <button type="button" onClick={()=>searchHandler(searchValue)} className="btn btn-success">
        Search
      </button>

      {loading ? (
        "Loading..."
      ) : (
        <div className="card">
          {result && (
            <>
              <img src={result[0].flags.png} />
              <h3>Name:{result[0].altSpellings[1]}</h3>
              <h4>Symbol:{result[0].fifa}</h4>
              <h4>population:{result[0].population}</h4>
              <h4>capital:{result[0].capital[0]}</h4>
            </>
          )}
          {error ? (
            <div class="alert alert-danger" role="alert">
              something went wrong
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
   </div>
    </div>
  );
}

export default App;
