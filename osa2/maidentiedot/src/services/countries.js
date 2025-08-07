import axios from 'axios'

const fetchCountries = () => {
    return (axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        return response.data.map((val => {
            return {
                name: val.name.common,
                officialName: val.name.official,
                fifa: val.fifa,
                capital: val.capital && val.capital[0] || null
            }
      }))
    }))
}
const fetchCountryDetails = (country) => {
    const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY
    return (axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country.name}`)
        .then(response => {
            if (country.capital === null) {
                return {
                    name: response.data.name.common,
                    capital: response.data.capital,
                    area: response.data.area,
                    languages: response.data.languages,
                    flag: response.data.flags.png,
                    temperature: null,
                    weatherImage: null,
                    wind: null
                }
            }
            return (axios
            .get(`http://api.openweathermap.org/geo/1.0/direct?q=${country.capital},,${country.fifa}&limit=10&appid=${WEATHER_API_KEY}`)
            .then((geoLocationResponse) => {
                const lon = geoLocationResponse.data[0].lon
                const lat = geoLocationResponse.data[0].lat
                return (axios
                .get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,hourly,alerts&units=metric&appid=${WEATHER_API_KEY}`)
                .then((weatherResponse) => {
                    const weatherImage = `https://openweathermap.org/img/wn/${weatherResponse.data.current.weather[0].icon}@2x.png`
                    return {
                        name: response.data.name.common,
                        capital: response.data.capital,
                        area: response.data.area,
                        languages: response.data.languages,
                        flag: response.data.flags.png,
                        temperature: weatherResponse.data.current.temp,
                        weatherImage: weatherImage,
                        wind: weatherResponse.data.current.wind_speed
                    }
                }))
            }))
        })
    )
}

export default {
    fetchCountryDetails,
    fetchCountries
}