import { useState, useEffect } from 'react'
import Country from './components/Country.jsx'
import countriesService from './services/countries.js'

const App = () => {
  const [countries, setCountries] = useState(0)
  const [countryDetails, setCountryDetails] = useState(null)
  const [countryMatches, setCountryMatches] = useState(0)
  const [searchTerm, setSearchTerm] = useState(0)

  useEffect(() => {
    countriesService.fetchCountries()
    .then((result) => {
      setCountries(result)
    })
  }, [])

  const startSearch = (event) => 
  {
    event.preventDefault()
    const value = event.target.value
    setSearchTerm(value)
    search(value)
  }

  const search = (value) =>
  {
    const regex = new RegExp(value, 'i')
    const countryMatches = countries.filter((country => {
      if (country.name.match(regex)) {
        return true;
      }
      return false;
    }))

    if (countryMatches.length === 1) {
      const country = countryMatches[0]
      countriesService.fetchCountryDetails(country)
      .then((result) => {
        setCountryDetails(result)
      })
    } else {
      setCountryDetails(null)
    }
    setCountryMatches(countryMatches)
  }

  return (
    <>
      <span>find countries</span>
      <input type="text" onChange={startSearch}/>

      <Country details={countryDetails} />

      <div>
        {countryMatches.length < 10 && countryMatches.length !== 1 &&
          <b>
            {countryMatches.length > 0 && countryMatches.map((country) => 
              <div key={country.fifa + country.capital}>
                <span>{country.name}</span> 
                <button onClick={() => search(country.name)}>show</button>
              </div>
            )}
          </b>
        }
        {searchTerm !== '' && countryMatches.length !== 1 && countryMatches.length > 10 && <p>Too many matches, specify another filter</p>}
      </div>
    </>
  )
}

export default App