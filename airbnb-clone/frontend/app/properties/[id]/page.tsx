import Image from "next/image"; // import Next.js Image component to render optimized responsive images
import Link from "next/link"; // import Next.js Link component to enable client-side navigation
import ReservationSidebar from "@/app/components/properties/ReservationSidebar"; // import reservation sidebar to handle booking logic and pricing
import apiService from "@/app/services/apiService"; // import API service abstraction to fetch property data from backend
import { getUserId } from "@/app/lib/actions"; // import server action to retrieve currently authenticated user id

const PropertyDetailPage = async ({ params }: { params: { id: string } }) => { // define async page component to render property details using route params
    const property = await apiService.get(`/api/properties/${params.id}`); // fetch full property details using property id from URL

    const userId = await getUserId(); // retrieve current user id to control booking and contact behavior

    console.log('userId', userId); // log resolved user id for debugging authentication flow

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <div className="w-full h-[64vh] mb-4 overflow-hidden rounded-xl relative">
                <Image
                    fill
                    src={property.image_url} // render property image dynamically from fetched property data
                    className="object-cover w-full h-full"
                    alt="Beach house"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="py-6 pr-6 col-span-3">
                    <h1 className="mb-4 text-4xl">{property.title}</h1>

                    <span className="mb-6 block text-lg text-gray-600">
                        {property.guests} {/* render maximum number of guests allowed for this property */} guests - {property.bedrooms} {/* render total bedroom count for this property */} bedrooms - {property.bathrooms} {/* render total bathroom count for this property */} bathrooms
                    </span>

                    <hr />

                    <Link
                        href={`/landlords/${property.landlord.id}`} // navigate to landlord detail page using dynamic landlord id
                        className="py-6 flex items-center space-x-4"
                    >
                        {property.landlord.avatar_url && ( // conditionally render avatar only when landlord has an image
                            <Image
                                src={property.landlord.avatar_url} // render landlord avatar dynamically
                                width={50}
                                height={50}
                                className="rounded-full"
                                alt="The user name"
                            />
                        )}

                        <p>
                            <strong>{property.landlord.name} {/* render landlord name dynamically from property data */}</strong> is your host
                        </p>
                    </Link>

                    <hr />

                    <p className="mt-6 text-lg">
                        {property.description /* render full property description text provided by the landlord */}
                    </p>
                </div>

                <ReservationSidebar
                    property={property} // pass property data to calculate pricing, guests, and availability
                    userId={userId} // pass user id to control booking and login enforcement
                />
            </div>
        </main>
    )
}

export default PropertyDetailPage;