import "./style.css";
import { languages } from "./languages.js";
let offset = 0;

const APIKEY = import.meta.env.VITE_REST_COUNTRIES_API_KEY;
const flagImage = document.querySelector("#flagImage");
const countryName = document.querySelector("#countryName");
const greetingText = document.querySelector("#helloText");
const countryCardContainer = document.querySelector("#flagContainer");

const options = {
  headers: {
    Authorization: APIKEY,
  },
};

const uniqueLanguages = new Set();

function fetchCountries() {
  const URL = `https://api.restcountries.com/countries/v5?limit=100&offset=${offset}`;

  fetch(URL, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const countries = data.data.objects;
      console.log(countries.length);
      countries.forEach((country) => {
        const countryCard = document.createElement("div");
        countryCard.classList.add("countryCard");

        const flagArea = document.createElement("div");
        flagArea.classList.add("flagArea");
        const countryFlag = document.createElement("img");
        if (country.flag.url_svg) {
          countryFlag.src = country.flag.url_svg;
          flagArea.appendChild(countryFlag);
        } else {
          const flagPlaceholder = document.createElement("div");
          flagPlaceholder.classList.add("flagPlaceholder");
          flagPlaceholder.textContent = "🏳️";
          const missingFlagText = document.createElement("p");
          missingFlagText.textContent = "Flagga saknas!";
          countryCard.append(flagPlaceholder);
          flagPlaceholder.appendChild(missingFlagText);
          flagArea.appendChild(flagPlaceholder);
        }
        countryFlag.classList.add("countryFlag");
        countryCardContainer.appendChild(countryCard);

        const swedishName = country.names.translations.swe.common;
        const countryTitle = document.createElement("h1");
        countryTitle.textContent = swedishName;

        countryCard.append(flagArea, countryTitle);

        if (country.languages.length > 0) {
          for (const language of country.languages) {
            let languageCode = language.iso639_1;

            if (languageCode === "") {
              languageCode = language.iso639_3;
            }

            if (languageCode === "") {
              languageCode = language.bcp47;
            }

            uniqueLanguages.add(`${languageCode} - ${language.name}`);
            let languageName;
            const languageData = languages[languageCode];

            if (languageData === undefined) {
              languageName = language.name;
            } else {
              languageName = languageData.name;
            }

            let greeting;

            if (languageData !== undefined) {
              greeting = languageData.greeting;
            }

            const languageGreeting = document.createElement("p");
            if (greeting === undefined) {
              languageGreeting.textContent = `${languageName}: Hälsning saknas`;
            } else {
              languageGreeting.textContent = `${languageName}: ${greeting}`;
            }
            countryCard.appendChild(languageGreeting);
          }
        } else {
          const noLanguageText = document.createElement("p");
          noLanguageText.textContent = "Har ingen hälsningstext!";
          countryCard.appendChild(noLanguageText);
        }
      });

      if (data.data.meta.more === true) {
        offset += 100;
        fetchCountries();
      } else {
        console.log([...uniqueLanguages].join("\n"));
      }
    });
}

fetchCountries();
