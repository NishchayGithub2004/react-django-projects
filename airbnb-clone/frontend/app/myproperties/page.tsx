import { getUserId } from "../lib/actions"; // import server action to retrieve the currently authenticated user id
import PropertyList from "../components/properties/PropertyList"; // import PropertyList component to render properties owned by the user

const MyPropertiesPage = async () => { // define an async page component to display properties owned by the logged-in user
    const userId = await getUserId(); // fetch current user id to filter properties by landlord ownership

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl">My properties</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PropertyList
                    landlord_id={userId} // pass user id to fetch only properties created by this user
                />
            </div>
        </main>
    )
}

export default MyPropertiesPage;