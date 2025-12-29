import PropertyList from "../components/properties/PropertyList"; // import PropertyList component to render favorited properties
import { getUserId } from "../lib/actions"; // import server action to retrieve currently authenticated user id

const MyFavoritesPage = async () => { // define async page component to display user's favorite properties
    const userId = await getUserId(); // fetch current user id to verify authentication state

    if (!userId) { // check if user is not authenticated
        return (
            <main className="max-w-[1500px] max-auto px-6 py-12">
                <p>You need to be authenticated...</p>
            </main>
        )
    }

    return (
        <main className="max-w-[1500px] max-auto px-6 pb-12">
            <h1 className="my-6 text-2xl">My favorites</h1> {/* display page heading for favorites section */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PropertyList 
                    favorites={true} // instruct PropertyList to fetch and render only favorited properties
                />
            </div>
        </main>
    )
}

export default MyFavoritesPage;