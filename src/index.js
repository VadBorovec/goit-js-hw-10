import './css/styles.css'; // стилі
import debounce from 'lodash.debounce'; // бібліотека lodash.debounce
import Notiflix from 'notiflix'; // бібліотека Notiflix
import { fetchCountries } from './js/fetchCountries'; // робота з бекендом
// import countryCardTpl from './js/templates/country-card.hbs'; // розмітка (не вийшло реалізувати через шаблони 😔)
// import countryListTpl from './js/templates/country-list.hbs'; // розмітка (не вийшло реалізувати через шаблони 😔)

const DEBOUNCE_DELAY = 300;
const refs = {
  searchInput: document.querySelector('input#search-box'),
  cardList: document.querySelector('.country-list'),
  cardContainer: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

// Функція створення розмітки картки
function createCardMarkup(data) {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<div class="card">
        <div class="card-header">
          <img src="${flags.svg}" alt="${
        name.official
      }"  width="100" height="50">
          <h2 class="card-title">${name.official}</h2>
        </div>
        <div class="card-body">
          <p class="card-text"><span>Capital:</span> ${capital}</p>
          <p class="card-text"><span>Population:</span> ${population}</p>
          <p class="card-text"><span>Languages:</span> ${Object.values(
            languages
          )}</p>
        </div>
      </div>`
  );
}

// Функція створення розмітки списку
function createListMarkup(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li class="list-item" data-name="${name.official}">
                <img src="${flags.svg}" alt="${name.official}"  width="40" height="30">
                <p class="card-title">${name.official}</p>
        </li>`
    )
    .join('');
}

// Функція візуалізації інтерфейсу
function renderMarkup(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  } else if (data.length === 1) {
    clearMarkup(refs.cardList);
    const markup = createCardMarkup(data);
    refs.cardContainer.innerHTML = markup;
  } else {
    clearMarkup(refs.cardContainer);
    const markup = createListMarkup(data);
    refs.cardList.innerHTML = markup;
    onListHover();
    onListClick();
  }
}

// Функція очищення інтерфейсу
function clearMarkup(ref) {
  ref.innerHTML = '';
}

// Функція відображення помилки
function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

// !===================additionally======================
// Функція що відкриває картку країни при натиснені на елемент списку
function onListClick() {
  const listItems = document.querySelectorAll('.list-item');
  listItems.forEach(item => {
    item.addEventListener('click', () => {
      const countryName = item.dataset.name;
      fetchCountries(countryName).then(data => {
        clearMarkup(refs.cardList);
        const markup = createCardMarkup(data);
        refs.cardContainer.innerHTML = markup;
      });
    });
  });
}

// Функція ховеру на елемент сторінки
function onListHover() {
  const listItems = document.querySelectorAll('.list-item');
  listItems.forEach(item => {
    item.addEventListener('mouseover', () => {
      item.classList.add('hovered');
    });
    item.addEventListener('mouseout', () => {
      item.classList.remove('hovered');
    });
  });
}
// !===================

function onInput(evt) {
  evt.preventDefault();

  const inputText = evt.target.value.trim();
  //   console.log(inputText);

  // Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується, а розмітка списку країн або інформації про країну зникає.
  if (inputText === '') {
    clearMarkup(refs.cardList);
    clearMarkup(refs.cardContainer);

    return;
  }

  // Рендерить інтерфейс
  fetchCountries(inputText)
    .then(data => {
      renderMarkup(data);
    })
    .catch(onFetchError);
}
