import Image from "next/image"; // import Next.js Image component to render optimized responsive images
import { PropertyType } from "./PropertyList"; // import PropertyType to strongly type the property data passed to this component
import { useRouter } from "next/navigation"; // import router hook to enable client-side navigation on click
import FavoriteButton from "../FavoriteButton"; // import FavoriteButton component to allow users to favorite a property

interface PropertyProps { // define props interface to strictly type inputs required by PropertyListItem
    property: PropertyType, // store property data used to render UI and navigation target
    markFavorite?: (is_favorite: boolean) => void; // optionally store callback to update favorite state when toggled
}

const PropertyListItem: React.FC<PropertyProps> = ({ // define a functional component named 'PropertyListItem' to display a single property card which takes following props
    property, // receive property object containing display and navigation data
    markFavorite // receive optional callback to handle favorite state updates
}) => {
    const router = useRouter(); // initialize router to navigate to property detail page on click

    return (
        <div
            className="cursor-pointer"
            onClick={() => router.push(`/properties/${property.id}`)} // navigate to the property detail page when the card is clicked
        >
            <div className="relative overflow-hidden aspect-square rounded-xl">
                <Image
                    fill
                    src={property.image_url}
                    sizes="(max-width: 768px) 768px, (max-width: 1200px): 768px, 768px"
                    className="hover:scale-110 object-cover transition h-full w-full"
                    alt="Beach house"
                />

                {markFavorite && ( // conditionally render favorite button only when a handler is provided
                    <FavoriteButton
                        id={property.id} // pass property id so favorite toggle targets the correct listing
                        is_favorite={property.is_favorite} // pass current favorite state to control button appearance
                        markFavorite={(is_favorite: boolean) => markFavorite(is_favorite)} // forward updated favorite state back to parent handler
                    />
                )}
            </div>

            <div className="mt-2">
                <p className="text-lg font-bold">{property.title} {/* render property title dynamically from property data */}</p>
            </div>

            <div className="mt-2">
                <p className="text-sm text-gray-500">
                    <strong>${property.price_per_night} {/* render nightly price dynamically from property data */}</strong> per night
                </p>
            </div>
        </div>
    )
}

export default PropertyListItem;