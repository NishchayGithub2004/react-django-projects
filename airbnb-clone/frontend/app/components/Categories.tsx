'use client';

import { useState } from 'react'; // import useState hook to manage local component state for selected category
import Image from 'next/image'; // import Next.js Image component to render optimized images
import useSearchModal, { SearchQuery } from '../hooks/useSearchModal'; // import custom search modal hook and SearchQuery type to read and update global search filters

const Categories = () => { // define a functional component named 'Categories' to allow users to filter listings by category
    const searchModal = useSearchModal(); // initialize search modal hook to access and mutate the shared search query state
    
    const [category, setCategory] = useState(''); // store the currently selected category to control active UI state and filtering

    const _setCategory = (_category: string) => { // define a helper function to update selected category and synchronize it with search query state
        setCategory(_category); // update local state so the UI reflects the newly selected category

        // build a new search query object by reusing existing filters and overriding only the category
        const query: SearchQuery = {
            country: searchModal.query.country,
            checkIn: searchModal.query.checkIn,
            checkOut: searchModal.query.checkOut,
            guests: searchModal.query.guests,
            bedrooms: searchModal.query.bedrooms,
            bathrooms: searchModal.query.bathrooms,
            category: _category
        }

        searchModal.setQuery(query); // persist the updated query to the global search modal state to trigger filtering
    }

    return (
        <div className="pt-3 cursor-pointer pb-6 flex items-center space-x-12">
            <div 
                onClick={() => _setCategory('')} // handle click to reset category filter and show all listings
                className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${category == '' ? 'border-black' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`}>
                <Image
                    src="/icn_category_beach.jpeg"
                    alt="Category - Beach"
                    width={20}
                    height={20}
                />

                <span className='text-xs'>All</span>
            </div>
            
            <div 
                onClick={() => _setCategory('beach')} // handle click to apply the beach category filter
                className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${category == 'beach' ? 'border-black' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`}>
                <Image
                    src="/icn_category_beach.jpeg"
                    alt="Category - Beach"
                    width={20}
                    height={20}
                />

                <span className='text-xs'>Beach</span>
            </div>

            <div 
                onClick={() => _setCategory('villas')} // handle click to apply the villas category filter
                className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${category == 'villas' ? 'border-black' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`}>
                <Image
                    src="/icn_category_beach.jpeg"
                    alt="Category - Beach"
                    width={20}
                    height={20}
                />

                <span className='text-xs'>Villas</span>
            </div>

            <div 
                onClick={() => _setCategory('cabins')} // handle click to apply the cabins category filter
                className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${category == 'cabins' ? 'border-black' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`}>
                <Image
                    src="/icn_category_beach.jpeg"
                    alt="Category - Beach"
                    width={20}
                    height={20}
                />

                <span className='text-xs'>Cabins</span>
            </div>

            <div
                onClick={() => _setCategory('tiny_homes')} // handle click to apply the tiny homes category filter
                className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${category == 'tiny_homes' ? 'border-black' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`}>
                <Image
                    src="/icn_category_beach.jpeg"
                    alt="Category - Beach"
                    width={20}
                    height={20}
                />

                <span className='text-xs'>Tiny homes</span>
            </div>
        </div>
    )
}

export default Categories;