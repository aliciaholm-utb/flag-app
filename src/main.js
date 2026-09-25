import "./style.css";

const URL = "https://api.restcountries.com/countries/v5";
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

const greetings = {
  sv: "Hej!",
  en: "Hello!",
  es: "¡Hola!",
  fr: "Bonjour!",
};

fetch(URL, options)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    const countries = data.data.objects;
    countries.forEach((country) => {
      console.log(country);
      const countryCard = document.createElement("div");
      const countryFlag = document.createElement("img");

      countryCardContainer.appendChild(countryCard, countryFlag);

      flagImage.src = country.flag.url_svg;
      const swedishName = country.names.translations.swe.common;
      console.log(swedishName);
      countryName.textContent = swedishName;

      if (country.languages.length > 0) {
        const languageCode = country.languages[0].iso639_1;
        console.log(languageCode);

        const greeting = greetings[languageCode];

        if (greeting === undefined) {
          greetingText.textContent = "Hälsning saknas";
        } else {
          greetingText.textContent = greeting;
        }
      } else {
        console.log("Detta land har ingen språkkod");
      }
    });
  });
