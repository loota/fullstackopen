const Country = ({details}) => {

    if (!details) {
      return null
    }

    return (
        <>
        {<h1>{details.name}</h1>}
        {<p>Capital {details.capital} </p>}
        {<p>Area {details.area}</p>}
        <h2>Languages</h2>
          <ul>
            {Object.keys(details.languages).map((langKey, i) => (
                <li key={i}>{details.languages[langKey]}</li>
              ))
            }
          </ul>
        {<img src={details.flag} />}
        <p>Temperature {details.temperature} Celsius</p>
        <img src={details.weatherImage} />
        <p>Wind {details.wind}m/s</p>
        </>
    )
}

export default Country