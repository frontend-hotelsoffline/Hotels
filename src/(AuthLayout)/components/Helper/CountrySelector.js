
import React, { useState } from 'react';
import { countries } from 'countries-list';
import { Checkbox } from 'antd';

// Function to group countries by regions
const groupCountriesByRegion = () => {
    const regions = {
        GCC: ['Bahrain', 'Kuwait', 'Oman', 'Qatar', 'Saudi Arabia', 'United Arab Emirates'],
        EU: ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic'],
        Africa: ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi'],
        CIS: ['Armenia', 'Azerbaijan', 'Belarus', 'Kazakhstan', 'Kyrgyzstan', 'Moldova']
    };

    const groupedCountries = {};
    Object.entries(countries).forEach(([code, info]) => {
        const countryName = info.name;
        for (const [region, countries] of Object.entries(regions)) {
            if (countries.includes(countryName)) {
                if (!groupedCountries[region]) {
                    groupedCountries[region] = [];
                }
                groupedCountries[region].push({ code, name: countryName });
                break;
            }
        }
    });

    return groupedCountries;
};

const CountrySelector = () => {
    const [selectedCountries, setSelectedCountries] = useState([]);
    const regions = groupCountriesByRegion();

    const handleCountryChange = (country) => {
        const isSelected = selectedCountries.some(c => c.code === country.code);
        if (isSelected) {
            setSelectedCountries(selectedCountries.filter(c => c.code !== country.code));
        } else {
            setSelectedCountries([...selectedCountries, country]);
        }
    };

    const onCheckAllChange = (e, countries) => {
        setSelectedCountries(e.target.checked ? countries : []);
    };

    console.log(selectedCountries);

    return (
        <div className='h-[100px] overflow-auto w-[550px]'>
            {Object.entries(regions).map(([region, countryList]) => (
                <div className='mb-5' key={region}>
                    <Checkbox
                        onChange={(e) => onCheckAllChange(e, countryList)}
                        checked={selectedCountries.filter(country => countryList.some(c => c.code === country.code)).length === countryList.length}
                    >
                        {region}
                    </Checkbox>
                    <div className='grid grid-cols-4 items-start gap-2 text-start'>
                        {countryList.map(country => (
                            <div className='w-full whitespace-nowrap' key={country.code}>
                                <Checkbox
                                    checked={selectedCountries.some(c => c.code === country.code)}
                                    onChange={() => handleCountryChange(country)}
                                />
                                <label>{country.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CountrySelector;
