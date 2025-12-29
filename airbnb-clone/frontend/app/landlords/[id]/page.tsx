import Image from "next/image"; // import Next.js Image component to render optimized landlord avatar images
import ContactButton from "@/app/components/ContactButton"; // import ContactButton component to allow users to contact the landlord
import PropertyList from "@/app/components/properties/PropertyList"; // import PropertyList component to render landlord-owned properties
import apiService from "@/app/services/apiService"; // import API service abstraction to fetch landlord data from backend
import { getUserId } from "@/app/lib/actions"; // import server action to retrieve the currently authenticated user id

const LandlordDetailPage = async ({ params }: { params: { id: string }}) => { // define async page component to display landlord profile which takes route params
    const landlord = await apiService.get(`/api/auth/${params.id}`); // fetch landlord details using landlord id from route params
    
    const userId = await getUserId(); // fetch current logged-in user id to control conditional UI behavior

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <aside className="col-span-1 mb-4">
                    <div className="flex flex-col items-center p-6 rounded-xl border border-gray-300 shadow-xl">
                        <Image
                            src={landlord.avatar_url} // render landlord avatar dynamically from fetched landlord data
                            width={200}
                            height={200}
                            alt="Landlrod name"
                            className="rounded-full"
                        />

                        <h1 className="mt-6 text-2xl">{landlord.name} {/* display landlord name dynamically */}</h1>

                        {userId != params.id && ( // conditionally render contact button when viewer is not the landlord
                            <ContactButton 
                                userId={userId} // pass current user id to determine authentication state
                                landlordId={params.id} // pass landlord id to initiate conversation with correct user
                            />
                        )}
                    </div>
                </aside>

                <div className="col-span-1 md:col-span-3 pl-0 md:pl-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PropertyList 
                            landlord_id={params.id} // fetch and display only properties owned by this landlord
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default LandlordDetailPage;