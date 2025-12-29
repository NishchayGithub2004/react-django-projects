'use client';

import apiService from "../services/apiService"; // import API service abstraction to perform backend requests related to favorites

interface FavoriteButtonProps { // define props interface to strongly type data and callbacks required by FavoriteButton
    id: string; // store the property id to identify which listing to toggle as favorite
    is_favorite: boolean; // store current favorite state to control UI appearance
    markFavorite: (is_favorite: boolean) => void; // store callback to update parent state after favorite status changes
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ // define a functional component named 'FavoriteButton' to toggle property favorite status which takes following props
    id, // receive property id to send with favorite toggle request
    is_favorite, // receive current favorite state to determine icon color
    markFavorite // receive callback to update favorite state in parent component
}) => {
    const toggleFavorite = async (e: React.MouseEvent<HTMLDivElement>) => { // define an async click handler to toggle favorite state for the property
        e.stopPropagation(); // prevent click event from bubbling up to parent elements like property cards
        const response = await apiService.post(`/api/properties/${id}/toggle_favorite/`, {}); // send request to backend to toggle favorite status for the given property
        markFavorite(response.is_favorite); // update parent state using the favorite value returned by the backend
    }

    return (
        <div
            onClick={toggleFavorite} // attach click handler to trigger favorite toggle logic
            className={`absolute top-2 right-2 ${is_favorite ? 'text-airbnb' : 'text-white'} hover:text-airbnb`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
        </div>
    )
}

export default FavoriteButton;