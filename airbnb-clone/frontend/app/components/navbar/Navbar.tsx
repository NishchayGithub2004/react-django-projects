import Image from 'next/image'; // import Next.js Image component to render optimized static images
import Link from 'next/link'; // import Next.js Link component to enable client-side navigation
import SearchFilters from './SearchFilters'; // import search filters component to render search UI in navbar
import UserNav from './UserNav'; // import user navigation component to handle auth-related actions
import { getUserId } from '@/app/lib/actions'; // import server action to retrieve currently authenticated user id
import AddPropertyButton from './AddPropertyButton'; // import button component to allow users to add a new property

const Navbar = async () => { // define an async server component named 'Navbar' to fetch user state before rendering
    const userId = await getUserId(); // fetch current user id from server-side cookies or session

    console.log('userId:', userId); // log resolved user id for debugging authentication flow

    return (
        <nav className="w-full fixed top-0 left-0 py-6 border-b bg-white z-10">
            <div className="max-w-[1500px] mx-auto px-6">
                <div className="flex justify-between items-center">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="DjangoBnb logo"
                            width={180}
                            height={38}
                        />
                    </Link>

                    <div className="flex space-x-6">
                        <SearchFilters />
                    </div>

                    <div className="flex items-center space-x-6">
                        <AddPropertyButton 
                            userId={userId} // pass resolved user id to control authenticated behavior in add property flow
                        />

                        <UserNav 
                            userId={userId} // pass resolved user id to render appropriate user navigation options
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;