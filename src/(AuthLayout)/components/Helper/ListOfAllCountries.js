import { Country, State, City } from "country-state-city";

// Convert countries to a list compatible with your existing structure
export const countryList = Country.getAllCountries().map((country) => ({
  value: country.name,
  label: country.name,
  code: country.isoCode, // You might need the isoCode for fetching cities
}));

// Generate a unique list of currencies
export const currencyList = [];
const uniqueCurrencies = new Set();

Country.getAllCountries().forEach((country) => {
  const currency = country.currency;

  if (currency && !uniqueCurrencies.has(currency)) {
    uniqueCurrencies.add(currency);

    currencyList.push({
      value: currency,
      label: currency,
    });
  }
});

// Get all cities of a country
export const getAllCitiesOfCountry = (countryCode) => {
  const states = State.getStatesOfCountry(countryCode);
  const cities = states.flatMap((state) =>
    City.getCitiesOfState(countryCode, state.isoCode)
  );
  return cities.map((city) => ({
    value: city.name,
    label: city.name,
  }));
};
