interface CustomButtonProps { // define props interface to type button label, styling, and click behavior
    label: string; // store button text to be rendered inside the component
    className?: string; // allow optional custom classes to extend or override default styling
    onClick: () => void; // define click handler to execute when the button is pressed
}

const CustomButton: React.FC<CustomButtonProps> = ({ // define a functional component named 'CustomButton' to render a reusable clickable button which takes following props
    label, // receive text to display inside the button
    className, // receive optional custom styles to merge with default classes
    onClick // receive click handler to trigger external logic
}) => {
    return (
        <div 
            onClick={onClick} // attach click handler to trigger the provided callback when the button is clicked
            className={`w-full py-4 bg-airbnb hover:bg-airbnb-dark text-white text-center rounded-xl transition cursor-pointer ${className}`} // dynamically append optional custom classes to the base button styling
        >
            {label} {/* render dynamic button label provided via props */}
        </div>
    )
}

export default CustomButton; // export component to allow reuse of a consistent button UI across the application