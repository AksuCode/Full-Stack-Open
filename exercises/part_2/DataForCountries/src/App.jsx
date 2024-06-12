import { useState, useEffect } from 'react'

import countriesService from './services/countries'

const Search = ({input, handler}) => (
  <>
    <div>find countries <input value={input} onChange={handler}/></div>
  </>
)

const DisplayCountries = ({countriesToDIsplay, country, showHandler}) => {

  if (country !== null) return (<DisplayCountry country={country}/>)

  const countryListLength = countriesToDIsplay.length

  if (countryListLength > 10) return (<div>Too many matches, specifyi another filter</div>)

  if (countryListLength < 1) return (<div>No matches with this filter</div>)

  return (
    <div>
      {countriesToDIsplay.map(countryName => <div key={countryName}>{countryName} <button onClick={() => showHandler(countryName)}>show</button></div>)}
    </div>
  )
}

const DisplayCountry = ({country}) => {

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>{country.capital[0]}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>{Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}</ul>
      <img src={country.flags.png}/>
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState([])
  const [nameSearch, setNameSearch] = useState('')

  useEffect(() => {
    countriesService.getAll()
                    .then (response => {
                      console.log('Requested all countries from server')
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
                      })
    }
    else setCountry(null)
    setFilteredCountries(filteredCountries)
    setNameSearch(searchKeyWord)
  }

  const showHandler = (countryName) => {
    countriesService.getCountry(filteredCountries.find(country => country === countryName))
    .then(response => {
      setCountry(response.data)
    })
  }

  return (
    <>
      <Search input={nameSearch} handler={handleSearch}/>
      <DisplayCountries countriesToDIsplay={filteredCountries} searchKeyWord={nameSearch} country={country} showHandler={showHandler}/>
    </>
  )
}

export default App