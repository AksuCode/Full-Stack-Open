import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

const getAll = () => {
    return axios.get(baseUrl + 'api/all')
}

const getCountry = (countryName) => {
    return axios.get(baseUrl + 'api/name/' + countryName)
}

export default {getAll, getCountry}