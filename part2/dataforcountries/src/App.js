import axios from 'axios'
import { useState, useEffect } from 'react'

const WeatherDisplay = ({ cityName, cityLatLon }) => {
  const [ lat, lon ] = cityLatLon
  const [weather, setWeather ] = useState(null)

  // fetch the weather data for the current city
  useEffect(() => {
    const apiKey = process.env.REACT_APP_API_KEY
    axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`).then(response => {
      console.log(response.data)
      setWeather(response.data)
    })
  }, [lat, lon])


  if (weather == null) {
    return null

  } else {
    return (
      <div>
        <h3>Weather in {cityName}</h3>
        <p>temperature {(weather.current.temp - 273.15).toFixed(2)} Celsius</p>
        <img src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`} style={{marginTop: 10, marginBottom: 10}} alt="weather icon display"/>
        <p>wind {weather.current.wind_speed} m/s</p>
      </div>
    )
  }
}

const CountryInfo = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <div>
        <p><b>languages:</b></p>
        <div>
          {Object.values(country.languages).map((language, index) => <li key={index}>{language}</li>)}
        </div>
      </div>
      <img src={country.flags.png} style={{marginTop: 20}} alt=""/>
      <WeatherDisplay cityName={country.capital} cityLatLon={country.capitalInfo.latlng}/>
    </div>
  )
}

const Country = ({ country }) => {
  const [showInfo, setShowInfo] = useState(false)

  if (showInfo) {
    return <CountryInfo country={country} />

  } else {
    return (
      <p>
        {country.name.common} <button onClick={() => setShowInfo(true)}>show</button>
      </p>
    )
  }
}

const CountryDisplay = ({ countries, search }) => {
  let filtered = countries.filter(
    country => country.name.common.toLowerCase().indexOf(search.trim().toLowerCase()) > -1)

  if (filtered.length === 0) {
    return null

  } else if (filtered.length === 1) {
    return <CountryInfo country={filtered[0]} />

  } else if (filtered.length <= 10) {
    return (
      <div>
        {filtered.map((country, index) => <Country key={index} country={country} />)}
      </div>
    )

  } else {
    return (
      <div>
        <h2> Too many matches. Please apply a more specific filter. </h2>
      </div>
    )
  }
}


const App = () => {

  const [search, setSearch] = useState('')
  const [countryData, setCountryData] = useState([])

  const countriesEndpoint = 'https://studies.cs.helsinki.fi/restcountries/api/all'
  
  // fetch the country data from the server
  useEffect(() => {
    axios.get(countriesEndpoint).then(response => {
      console.log(response.data)
      setCountryData(response.data)
    })
  }, [])


  const searchChange = event => {
    setSearch(event.target.value)
  }

  return (
    <div>
      <h1> Country data </h1>
      search: <input value={search} onChange={searchChange}/>
      <CountryDisplay countries={countryData} search={search}/>
    </div>
  )
}

export default App
