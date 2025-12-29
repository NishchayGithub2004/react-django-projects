import countries from 'world-countries'; // import country metadata list to derive standardized country options

const formattedCountries = countries.map((country) => ({ // transform raw country data into a simplified value-label structure
    value: country.cca2, // extract ISO alpha-2 country code to use as a stable identifier
    label: country.name.common // extract common country name for human-readable display
}));

const useCountries = () => { // define a reusable hook to access country lookup utilities
    const getAll = () => formattedCountries; // expose all formatted countries for list-based consumption

    const getByValue = (value: string) => { // define a helper to retrieve a single country by its ISO code
        return formattedCountries.find((item) => item.value === value); // locate and return the matching country entry
    }

    return { // return country utility functions to consumers of the hook
        getAll, // provide access to full country list
        getByValue // provide access to single country lookup by value
    }
}

export default useCountries; // export the hook to enable country utilities across the application