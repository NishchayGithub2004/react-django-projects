'use client';

import Select from 'react-select'; // import Select to render a customizable dropdown component
import useCountries from '@/app/hooks/useCountries'; // import useCountries to retrieve formatted country options

export type SelectCountryValue = { // define a type to represent the shape of a selected country option
    label: string; // store human-readable country name for display
    value: string; // store country identifier value used internally
}

interface SelectCountryProps { // define props interface to type selected value and change handler
    value?: SelectCountryValue; // optionally store the currently selected country value
    onChange: (value: SelectCountryValue) => void; // define callback to propagate selection changes to parent
}

const SelectCountry: React.FC<SelectCountryProps> = ({ // define a functional component named 'SelectCountry' to render a country selection dropdown which takes following props
    value, // receive currently selected country to control the Select component
    onChange // receive handler to update parent state when selection changes
}) => {
    const { getAll } = useCountries(); // extract getAll to retrieve the full list of country options

    return (
        <>
            <Select
                options={getAll()} // provide dynamically generated country options to the dropdown
                value={value} // control the selected option based on parent state
                onChange={(value) => onChange(value as SelectCountryValue)} // cast and forward selected option to parent handler
            />
        </>
    )
}

export default SelectCountry; // export component to enable reusable country selection across the application