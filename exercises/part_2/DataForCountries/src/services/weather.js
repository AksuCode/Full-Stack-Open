import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const getLocationWeather = (coordinates) => {
    const [lat, lon] = coordinates

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`

    return axios.get(url)
}

export default {getLocationWeather}