import './css/styles.css'; // стилі
import debounce from 'lodash.debounce'; // бібліотека lodash.debounce
import Notiflix from 'notiflix'; // бібліотека Notiflix
import API from './js/fetchCountries'; // робота з бекендом
// import countryCardTpl from './js/templates/country-card.hbs'; // розмітка
// import countryListTpl from './js/templates/country-list.hbs'; // розмітка

const DEBOUNCE_DELAY = 300;
const refs = {
  searchInput: document.querySelector('#search-box'),
  cardList: document.querySelector('.country-list'),
  cardContainer: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

// !==================

function onInput(evt) {
  evt.preventDefault();

  const inputText = evt.target.value.trim();
  //   console.log(inputText);

  //   if (inputText === '') {
  //     clearMarkup();
  //     return;
  //   }

  API.fetchCountries(inputText)
    .then(data => {
      //   console.log(data);
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      //   console.log(data);
      renderMarkup(data);
    })
    .catch(onFetchError);
  // .finally(() => inputText.reset());
}

// !==================

function renderMarkup(data) {
  if (data.length === 1) {
    clearMarkup(refs.cardList);
    const markup = createCardMarkup(data);
    refs.cardContainer.innerHTML = markup;
  } else {
    clearMarkup(refs.cardContainer);
    const markup = createListMarkup(data);
    refs.cardList.innerHTML = markup;
  }
}

// !==================

function onFetchError(error) {
  //   clearMarkup();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

// !==================

function clearMarkup(ref) {
  ref.innerHTML = '';
}

// !=================

function createCardMarkup(data) {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<div class="card">
        <div class="card-img-top">
            <img src="${flags.svg}" alt="${
        name.official
      }"  width="200" height="100">
            <h2 class="card-title">${name.official}</h2>
        </div>
        <div class="card-body">
            <p class="card-text">Capital: ${capital}</p>
            <p class="card-text">Population: ${population}</p>
            <p class="card-text">Languages:
            ${Object.values(languages)}
            </p>
        </div>
     </div>`
  );
}

// !==================

function createListMarkup(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li class="list-group-item">
            <div>
                <img src="${flags.svg}" alt="${name.official}"  width="20" height="10">
                <p class="card-title">${name.official}</p>
            </div>
        </li>`
    )
    .join('');
}

// !==================
