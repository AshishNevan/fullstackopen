import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [countryList, setCountryList] = useState([]);
  const [country, setCountry] = useState("");
  const [currentWeather, setCurrentWeather] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const fetchAll = () => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => response.data)
      .then((responseData) =>
        responseData.reduce(
          (cl, countryObject) =>
            cl.concat({
              id: cl.length + 1,
              ...countryObject,
            }),
          []
        )
      )
      .then((cl) => {
        console.log(cl);
        setCountryList(cl);
      });
  };

  const RenderCountry = ({ country, currentWeather, setSelectedCountry }) => {
    console.log("filtering countries with substring", country);
    const filtered = countryList.filter((c) =>
      c.name.common.toLowerCase().includes(country.toLowerCase())
    );
    console.log("filtered countries", filtered);
    if (filtered.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    }
    if (filtered.length == 1) {
      const selectedCountry = filtered[0];
      setSelectedCountry(selectedCountry);
      console.log(selectedCountry);
      return (
        <div>
          <h1>{selectedCountry.name.common}</h1>
          <p>Capital {selectedCountry.capital[0]}</p>
          <p>Area {selectedCountry.area}</p>
          <h2>Languages</h2>
          <ul>
            {Object.entries(selectedCountry.languages).map(([k, v]) => (
              <li key={k}>{v}</li>
            ))}
          </ul>
          <img
            src={selectedCountry.flags.png}
            alt={selectedCountry.flags.alt}
          />
          <h2>Weather in {selectedCountry.name.common}</h2>
          <p>Temperature {currentWeather.temperature} Celcius</p>
          <p>Wind speed {currentWeather.windSpeed} m/s</p>
        </div>
      );
    } else {
      const items = filtered.map((f) => (
        <div key={f.id}>
          {f.name.common}{" "}
          <button
            onClick={() => {
              console.log(`clicked ${f.name.common}`);
              setCountry(f.name.common);
            }}
          >
            Show
          </button>
        </div>
      ));
      return <div>{items}</div>;
    }
  };

  useEffect(fetchAll, []);
  useEffect(() => {
    if (!selectedCountry) {
      return;
    }
    axios
      .get(
        `https://api.open-meteo.com/v1/forecast?latitude=${selectedCountry.latlng[0]}&longitude=${selectedCountry.latlng[1]}&current=temperature_2m,wind_speed_10m`
      )
      .then((response) => response.data)
      .then((responseData) => {
        console.log("response data from weather api", responseData);
        setCurrentWeather({
          temperature: responseData.current.temperature_2m,
          windSpeed: responseData.current.wind_speed_10m,
        });
      });
  }, [selectedCountry]);
  return (
    <div>
      find countries{" "}
      <input
        type="text"
        onChange={(e) => setCountry(e.target.value)}
        value={country}
      />
      <RenderCountry
        country={country}
        currentWeather={currentWeather}
        setSelectedCountry={setSelectedCountry}
      />
    </div>
  );
}

export default App;
