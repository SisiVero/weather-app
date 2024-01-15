import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

const apiKey = {
  key: 'd05c73470218f2bf377a47206afdc11d',
  base: 'https://api.openweathermap.org/data/2.5/',
}

export default function Home() {
  const [search, setSearch] = useState('')
  const [weather, setWeather] = useState({})
  const [temperatureUnit, setTemperatureUnit] = useState('metric')

  function convertTimeStamp(timestamp) {
    try {
      const date = new Date(timestamp * 1000)

      const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }

      return date.toLocaleString('en-US', options)
    } catch (error) {
      console.error('Error converting timestamp to local time:', error)
      return 'Invalid Date'
    }
  }

  const convertTemperature = (temperature) => {
    if (temperatureUnit === 'metric') {
      return `${temperature}°C`
    } else if (temperatureUnit === 'imperial') {
      const fahrenheit = (temperature * 9) / 5 + 32
      return `${fahrenheit.toFixed()}°F`
    }
  }

  const handleInput = (e) => {
    setSearch(e.target.value)
  }
  const handleSearch = (e) => {
    e.preventDefault()
    fetch(
      `${apiKey.base}weather?q=${search}&units=${temperatureUnit}&APPID=${apiKey.key}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather(data)
        setSearch('')
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error)
      })
  }

  const toggleTemperatureUnit = () => {
    setTemperatureUnit((prevUnit) =>
      prevUnit === 'metric' ? 'imperial' : 'metric',
    )
  }

  return (
    <div className="main-container">
      <form>
        <div className="search-input-cont">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="City name..."
            onChange={handleInput}
            value={search}
          />
        </div>
        <button onClick={handleSearch}>Search</button>
      </form>
      {typeof weather.main !== 'undefined' ? (
        <div>
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="date">{convertTimeStamp(weather.dt)}</p>
          <p className="icon-desc">{weather.weather[0].description}</p>
          <p className="degree">{convertTemperature(weather.main.temp)}</p>
          <div className="min-max">
            <p className="min">
              Min: {convertTemperature(weather.main.temp_min)}
            </p>
            <p className="max">
              Max: {convertTemperature(weather.main.temp_max)}
            </p>
          </div>
          <div className="humidity-cont1">
            <div>
              Feels like:
              <span>{convertTemperature(weather.main.feels_like)}</span>
            </div>
            <div>
              Humidity: <span>{weather.main.humidity}%</span>
            </div>
          </div>
          <div className="humidity-cont2">
            <div>
              Pressure: <span>{weather.main.pressure}</span>
              hPa
            </div>
            <div>
              Wind: <span>{weather.wind.speed} mph</span>
            </div>
          </div>
          <div className="btn-div">
            <button className="btn-one" onClick={toggleTemperatureUnit}>
              &deg;C
            </button>
            <button className="btn-one" onClick={toggleTemperatureUnit}>
              &deg;F
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
