const BASE_URL = 'https://restcountries.com/v3.1';
const fields = 'fields=name,capital,population,flags,languages';

function fetchCountries(name) {
  return fetch(`${BASE_URL}/name/${name}?${fields}`).then(response =>
    response.json().catch(error => console.error(error))
  );
}

export default { fetchCountries };
