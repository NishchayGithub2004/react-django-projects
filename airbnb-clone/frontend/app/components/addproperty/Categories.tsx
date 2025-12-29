import Image from 'next/image'; // import Image to efficiently render optimized images in Next.js

interface CategoriesProps { // define props interface to type category state and updater passed to the component
    dataCategory: string; // store the currently selected category to control active UI state
    setCategory: (category: string) => void; // provide a setter function to update the selected category
}

const Categories: React.FC<CategoriesProps> = ({ // define a functional component named 'Categories' to render selectable property categories which takes following props
    dataCategory, // receive current category value to determine active styling
    setCategory // receive setter to update category based on user interaction
}) => {
    return (
        <>
            <div className="pt-3 cursor-pointer pb-6 flex item-center space-x-12">
                <div 
                    onClick={() => setCategory('beach')} // handle click to update selected category to beach
                    className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${dataCategory == 'Beach' ? 'border-gray-800' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`} // apply gray border when beach category is selected, white otherwise
                >
                    <Image
                        src="/icn_category_beach.jpeg"
                        alt="Category - Beach"
                        width={20}
                        height={20}
                    />

                    <span className='text-xs'>Beach</span>
                </div>

                <div 
                    onClick={() => setCategory('villas')} // handle click to update selected category to villas
                    className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${dataCategory == 'Villas' ? 'border-gray-800' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`} // apply gray border when villas category is selected, white otherwise
                >
                    <Image
                        src="/icn_category_beach.jpeg"
                        alt="Category - Beach"
                        width={20}
                        height={20}
                    />

                    <span className='text-xs'>Villas</span>
                </div>

                <div 
                    onClick={() => setCategory('cabins')} // handle click to update selected category to cabins
                    className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${dataCategory == 'Cabins' ? 'border-gray-800' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`} // apply gray border when cabins category is selected, white otherwise
                >
                    <Image
                        src="/icn_category_beach.jpeg"
                        alt="Category - Beach"
                        width={20}
                        height={20}
                    />

                    <span className='text-xs'>Cabins</span>
                </div>

                <div 
                    onClick={() => setCategory('tiny_homes')} // handle click to update selected category to tiny homes
                    className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${dataCategory == 'Tiny homes' ? 'border-gray-800' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`} // apply gray border when tiny homes category is selected, white otherwise
                >
                    <Image
                        src="/icn_category_beach.jpeg"
                        alt="Category - Beach"
                        width={20}
                        height={20}
                    />

                    <span className='text-xs'>Tiny homes</span>
                </div>
            </div>
        </>
    )
}

export default Categories;