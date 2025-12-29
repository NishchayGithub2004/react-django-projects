'use client';

import {
    DateRange, // import DateRange to render an interactive date range selection calendar
    Range, // import Range to type the currently selected date range value
    RangeKeyDict // import RangeKeyDict to type the change handler payload from the date picker
} from 'react-date-range';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface DatePickerProps { // define props interface to type inputs required by the date picker component
    value: Range; // store the currently selected date range to control the picker state
    onChange: (value: RangeKeyDict) => void; // define callback to propagate date range changes to parent state
    bookedDates?: Date[]; // optionally provide dates that should be disabled because they are already booked
}

const DatePicker: React.FC<DatePickerProps> = ({ // define a functional component named 'DatePicker' to render a controlled date range picker which takes following props
    value, // receive current date range selection to keep the picker controlled
    onChange, // receive change handler to update parent state when selection changes
    bookedDates // receive optional list of booked dates to prevent selection
}) => {
    return (
        <DateRange
            ranges={[value]} // pass the controlled date range to the picker for rendering
            date={new Date()} // set the reference date to today to anchor the calendar view
            onChange={onChange} // forward date range changes back to the parent via callback
            minDate={new Date()} // prevent selection of past dates by enforcing today as minimum
            disabledDates={bookedDates} // disable already booked dates to avoid invalid selections
        />
    )
}

export default DatePicker; // export component to allow reusable date range selection across the application