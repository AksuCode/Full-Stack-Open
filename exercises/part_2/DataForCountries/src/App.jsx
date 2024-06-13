import { useState, useEffect } from 'react'

import countriesService from './services/countries'
import weatherService from './services/weather'

const Search = ({input, handler}) => (
  <>
    <div>find countries <input value={input} onChange={handler}/></div>
  </>
)

const Display = ({countriesToDIsplay, country, weather, showHandler}) => {

  if (country !== null) return (<DisplayCountry country={country} weather={weather}/>)

  const countryListLength = countriesToDIsplay.length

  if (countryListLength > 10) return (<div>Too many matches, specifyi another filter</div>)

  if (countryListLength < 1) return (<div>No matches with this filter</div>)

  return (<DisplayCountries countriesToDIsplay={countriesToDIsplay} showHandler={showHandler}/>)

}

const DisplayCountries = ({countriesToDIsplay, showHandler}) => (
  <div>
    {countriesToDIsplay.map(countryName => <div key={countryName}>{countryName} <button onClick={() => showHandler(countryName)}>show</button></div>)}
  </div>
)

const DisplayCountry = ({country, weather}) => (
  <div>
    <h2>{country.name.common}</h2>
    <div>{country.capital[0]}</div>
    <div>area {country.area}</div>
    <h3>languages:</h3>
    <ul>{Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}</ul>
    <img src={country.flags.png}/>
    <h2>Weather in {country.capital[0]}</h2>
    <DisplayCapitalWeather weather={weather}/>
  </div>
)

const DisplayCapitalWeather = ({weather}) => {

  if (weather === null) return

  const tempInC = (parseFloat(weather.main.temp) - 272.15).toFixed(2)
  const weatherIcon = weather.weather[0].icon
  const iconURL = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
  const windSpeed = weather.wind.speed

  return (
  <div>
    <div>temperature {tempInC} Celsius</div>
    <img src={iconURL}/>
    <div>wind {windSpeed} m/s</div>
  </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(null)
  const [weather, setWeather] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState([])
  const [nameSearch, setNameSearch] = useState('')

  useEffect(() => {
    countriesService.getAll()
                    .then (response => {
                      setCountries(response.data.map(countryObj => countryObj.name.common))
                    })
  }, [])

  const handleSearch = (event) => {

    event.preventDefault()

    const searchKeyWord = event.target.value
    const filteredCountries = countries.filter(countryName => countryName.slice(0, searchKeyWord.length).toLowerCase() === searchKeyWord.toLowerCase())
    if (filteredCountries.length === 1) {
      countriesService.getCountry(filteredCountries[0])
                      .then(response => {
                        setCountry(response.data)
                        weatherService.getLocationWeather(response.data.capitalInfo.latlng)
                                      .then(res => {
                                        setWeather(res.data)
                                      })
                      })
    } else {
      setCountry(null)
      setWeather(null)
    }
    setFilteredCountries(filteredCountries)
    setNameSearch(searchKeyWord)
  }

  const showHandler = (countryName) => {
    countriesService.getCountry(filteredCountries.find(country => country === countryName))
    .then(response => {
      setCountry(response.data)
      weatherService.getLocationWeather(response.data.capitalInfo.latlng)
      .then(res => {
        setWeather(res.data)
      })
    })
  }

  return (
    <>
      <Search input={nameSearch} handler={handleSearch}/>
      <Display countriesToDIsplay={filteredCountries} searchKeyWord={nameSearch} country={country} weather={weather} showHandler={showHandler}/>
    </>
  )
}

export default App