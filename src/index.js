import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

function handleSearch(e) {
  e.preventDefault();

  const inputValue = e.target.value.trim();

  // exit if input value is empty
  if (inputValue == '') {
    resetMarkup();
    return;
  }

  fetchCountries(searchRef.value)
    .then(data => {
      console.log(data);

      if (data.length > 10) {
        resetMarkup();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (data.length >= 2 && data.length <= 10) {
        resetMarkup();
        data.forEach(renderCountryList);
        return;
      }

      if (data.length == 1) {
        resetMarkup();
        renderCountryInfo(...data);
      }
    })
    .catch(() => {
      resetMarkup();
      Notify.failure('Oops, there is no country with that name');
      console.log('Error. check the entered country name!');
    });
}

function renderCountryList({ name, flags }) {
  const markup = `
    <li class="countries-item">
      <img class="countries-img" src="${flags.svg}" alt="flag" width=24/>
      <p class="countries-names">${name.official}</p>
    </li>
    `;
  countryListRef.insertAdjacentHTML('beforeend', markup);
}

function renderCountryInfo({ name, capital, population, flags, languages }) {
  const markup = `
    <div class="сountry-found">
      <div class="country-title">
        <img class="country-img" src="${flags.svg}" alt="flag" width=30 >
        <h1 class="country-name">${name.official}</h1>
      </div>
      <ul class="country-info-list">
        <li class="country-item"> 
			    <p class="country-info"> <b>Capital:</b> ${capital}</p>
        </li>
        <li class="country-item">
          <p class="country-info"><b>Population:</b> ${population}</p>
        </li>
        <li class="country-item"> 
          <p class="country-info">
            <b>Languages:</b> ${Object.values(languages).join(', ')} 
          </p>
        </li>
      </ul>
		</div>
  `;
  countryInfoRef.insertAdjacentHTML('beforeend', markup);
}

function resetMarkup() {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
}

searchRef.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));
