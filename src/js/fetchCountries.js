// Робить HTTP-запит на ресурс name і повертає проміс з масивом країн - результатом запиту.
// Явно створює помилку для коду 404
export const fetchCountries = name => {
  const BASE_URL = 'https://restcountries.com/v3.1/name';
  const fields = 'fields=name,capital,population,flags,languages';

  return fetch(`${BASE_URL}/${name}?${fields}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json().catch(error => console.error(error));
  });
};
