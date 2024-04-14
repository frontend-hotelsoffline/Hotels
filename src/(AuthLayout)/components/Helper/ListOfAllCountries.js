
import { continents, countries, languages } from 'countries-list'
export const countryList = Object.entries(countries).map(([code, country]) => ({
    value: country.name,
    label: country.name,
  }));

  export const currencyList = [];
  const uniqueCurrencies = new Set();
  
  Object.entries(countries).forEach(([countryCode, country]) => {
    const currency = country.currency ? country.currency[0] : '';
  
    if (!uniqueCurrencies.has(currency)) {
      uniqueCurrencies.add(currency);
  
      currencyList.push({
        value: currency,
        label: currency,
      });
    }
  });