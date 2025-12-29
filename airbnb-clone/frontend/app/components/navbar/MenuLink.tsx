'use client';

interface MenuLinkProps { // define props interface to strictly type inputs required by MenuLink
    label: string; // store text label to be displayed inside the menu item
    onClick: () => void; // store click handler function to be executed when menu item is clicked
}

const MenuLink: React.FC<MenuLinkProps> = ({ // define a functional component named 'MenuLink' to render a clickable menu entry which takes following props
    label, // receive label text to render inside the menu item
    onClick // receive callback to handle click interactions
}) => {
    return (
        <div 
            onClick={onClick} // attach provided click handler to trigger parent-defined behavior
            className="px-5 py-4 cursor-pointer hover:bg-gray-100 transition"
        >
            {label /* render dynamic menu label text */} 
        </div>
    )
}

export default MenuLink;