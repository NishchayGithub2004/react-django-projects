'use client';

import Image from 'next/image'; // import Image to efficiently render and optimize images using Next.js built-in image handling
import { ChangeEvent, useState } from 'react'; // import ChangeEvent to type DOM input change events and useState to manage local component state
import Modal from './Modal'; // import Modal to display the add property form inside a reusable modal dialog
import CustomButton from '../forms/CustomButton'; // import CustomButton to trigger form actions with a consistent styled button
import Categories from '../addproperty/Categories'; // import Categories to allow users to select a property category
import useAddPropertyModal from '@/app/hooks/useAddPropertyModal'; // import custom hook to control add-property modal open and close state
import SelectCountry, { SelectCountryValue } from '../forms/SelectCountry'; // import SelectCountry to select a country and SelectCountryValue to type the selected country data
import apiService from '@/app/services/apiService'; // import apiService to handle backend API requests for property creation
import { useRouter } from 'next/navigation'; // import useRouter to programmatically navigate after successful property submission

const AddPropertyModal = () => { // define a functional component named 'AddPropertyModal' to manage the multi-step property creation flow
    const [currentStep, setCurrentStep] = useState(1); // store the current step number to control which form section is visible
    const [errors, setErrors] = useState<string[]>([]); // store validation or submission errors to display feedback to the user
    const [dataCategory, setDataCategory] = useState(''); // store the selected property category value
    const [dataTitle, setDataTitle] = useState(''); // store the property title entered by the user
    const [dataDescription, setDataDescription] = useState(''); // store the detailed property description text
    const [dataPrice, setDataPrice] = useState(''); // store the price value entered for the property
    const [dataBedrooms, setDataBedrooms] = useState(''); // store the number of bedrooms specified by the user
    const [dataBathrooms, setDataBathrooms] = useState(''); // store the number of bathrooms specified by the user
    const [dataGuests, setDataGuests] = useState(''); // store the maximum number of guests allowed
    const [dataCountry, setDataCountry] = useState<SelectCountryValue>(); // store the selected country object for property location
    const [dataImage, setDataImage] = useState<File | null>(null); // store the uploaded image file or null if no image is selected

    const addPropertyModal = useAddPropertyModal(); // initialize modal state controls for opening and closing the add property modal
    
    const router = useRouter(); // initialize router to redirect the user after property creation

    const setCategory = (category: string) => { // define a helper function to update the selected property category
        setDataCategory(category) // persist the chosen category into component state
    }

    const setImage = (event: ChangeEvent<HTMLInputElement>) => { // define a handler to capture image file input changes
        if (event.target.files && event.target.files.length > 0) { // ensure at least one file is present before accessing it
            const tmpImage = event.target.files[0]; // extract the first uploaded file from the input
            setDataImage(tmpImage); // store the selected image file in component state
        }
    }

    const submitForm = async () => { // define an async function to validate input data and submit the new property to the backend
        console.log('submitForm'); // log submission attempt for debugging and development visibility

        if ( // check that all mandatory fields required for property creation are present
            dataCategory &&
            dataTitle &&
            dataDescription &&
            dataPrice &&
            dataCountry &&
            dataImage
        ) {
            const formData = new FormData(); // create a FormData object to send mixed text and file data via multipart request
            formData.append('category', dataCategory);
            formData.append('title', dataTitle);
            formData.append('description', dataDescription);
            formData.append('price_per_night', dataPrice);
            formData.append('bedrooms', dataBedrooms);
            formData.append('bathrooms', dataBathrooms);
            formData.append('guests', dataGuests);
            formData.append('country', dataCountry.label);
            formData.append('country_code', dataCountry.value);
            formData.append('image', dataImage);

            const response = await apiService.post('/api/properties/create/', formData); // send property creation request to backend API endpoint

            if (response.success) { // check whether backend confirms successful property creation
                console.log('SUCCESS :-D'); // log success confirmation for debugging purposes
                router.push('/?added=true'); // redirect user to homepage with success indicator in query params
                addPropertyModal.close(); // close the add property modal after successful submission
            }
            
            else { // handle backend validation or server-side errors
                console.log('Error'); // log error state for debugging and diagnostics

                const tmpErrors: string[] = Object.values(response).map((error: any) => { // extract all error messages returned from backend response
                    return error; // normalize each error value into a string entry
                })

                setErrors(tmpErrors) // update local error state to display validation feedback to the user
            }
        }
    }

    const content = ( // define a JSX fragment variable to conditionally render modal content based on the current step
        <>
            {currentStep == 1 ? ( // render category selection UI when the current step equals 1
                <>
                    <h2 className='mb-6 text-2xl'>Choose category</h2>

                    <Categories
                        dataCategory={dataCategory} // pass currently selected category to highlight active choice
                        setCategory={(category) => setCategory(category)} // pass callback to update category state when user selects one
                    />

                    <CustomButton
                        label='Next'
                        onClick={() => setCurrentStep(2)} // advance to step 2 when user clicks next
                    />
                </>
            ) : currentStep == 2 ? ( // render property description form when the current step equals 2
                <>
                    <h2 className='mb-6 text-2xl'>Describe your place</h2>

                    <div className='pt-3 pb-6 space-y-4'>
                        <div className='flex flex-col space-y-2'>
                            <label>Title</label>
                            <input
                                type="text"
                                value={dataTitle} // bind input value to property title state
                                onChange={(e) => setDataTitle(e.target.value)} // update title state on user input
                                className='w-full p-4 border border-gray-600 rounded-xl'
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label>Description</label>
                            <textarea
                                value={dataDescription} // bind textarea value to property description state
                                onChange={(e) => setDataDescription(e.target.value)} // update description state on user input
                                className='w-full h-[200px] p-4 border border-gray-600 rounded-xl'
                            ></textarea>
                        </div>
                    </div>

                    <CustomButton
                        label='Previous'
                        className='mb-2 bg-black hover:bg-gray-800'
                        onClick={() => setCurrentStep(1)} // navigate back to category selection step
                    />

                    <CustomButton
                        label='Next'
                        onClick={() => setCurrentStep(3)} // advance to property details step
                    />
                </>
            ) : currentStep == 3 ? ( // render pricing and capacity details when the current step equals 3
                <>
                    <h2 className='mb-6 text-2xl'>Details</h2>

                    <div className='pt-3 pb-6 space-y-4'>
                        <div className='flex flex-col space-y-2'>
                            <label>Price per night</label>
                            <input
                                type="number"
                                value={dataPrice} // bind nightly price input to state
                                onChange={(e) => setDataPrice(e.target.value)} // update price state on user input
                                className='w-full p-4 border border-gray-600 rounded-xl'
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label>Bedrooms</label>
                            <input
                                type="number"
                                value={dataBedrooms} // bind bedrooms input to state
                                onChange={(e) => setDataBedrooms(e.target.value)} // update bedrooms count on user input
                                className='w-full p-4 border border-gray-600 rounded-xl'
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label>Bathrooms</label>
                            <input
                                type="number"
                                value={dataBathrooms} // bind bathrooms input to state
                                onChange={(e) => setDataBathrooms(e.target.value)} // update bathrooms count on user input
                                className='w-full p-4 border border-gray-600 rounded-xl'
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label>Maximum number of guests</label>
                            <input
                                type="number"
                                value={dataGuests} // bind guest capacity input to state
                                onChange={(e) => setDataGuests(e.target.value)} // update guest capacity on user input
                                className='w-full p-4 border border-gray-600 rounded-xl'
                            />
                        </div>
                    </div>

                    <CustomButton
                        label='Previous'
                        className='mb-2 bg-black hover:bg-gray-800'
                        onClick={() => setCurrentStep(2)} // navigate back to description step
                    />

                    <CustomButton
                        label='Next'
                        onClick={() => setCurrentStep(4)} // advance to location selection step
                    />
                </>
            ) : currentStep == 4 ? ( // render country selection UI when the current step equals 4
                <>
                    <h2 className='mb-6 text-2xl'>Location</h2>

                    <div className='pt-3 pb-6 space-y-4'>
                        <SelectCountry
                            value={dataCountry} // provide currently selected country value to the selector
                            onChange={(value) => setDataCountry(value as SelectCountryValue)} // update country state when selection changes
                        />
                    </div>

                    <CustomButton
                        label='Previous'
                        className='mb-2 bg-black hover:bg-gray-800'
                        onClick={() => setCurrentStep(3)} // navigate back to details step
                    />

                    <CustomButton
                        label='Next'
                        onClick={() => setCurrentStep(5)} // advance to image upload step
                    />
                </>
            ) : ( // render image upload and submission UI for the final step
                <>
                    <h2 className='mb-6 text-2xl'>Image</h2>

                    <div className='pt-3 pb-6 space-y-4'>
                        <div className='py-4 px-6 bg-gray-600 text-white rounded-xl'>
                            <input
                                type="file"
                                accept='image/*'
                                onChange={setImage} // capture selected image file and store it in state
                            />
                        </div>

                        {dataImage && ( // conditionally render image preview when an image file exists
                            <div className='w-[200px] h-[150px] relative'>
                                <Image
                                    fill
                                    alt="Uploaded image"
                                    src={URL.createObjectURL(dataImage)} // generate a temporary preview URL for the uploaded image
                                    className='w-full h-full object-cover rounded-xl'
                                />
                            </div>
                        )}
                    </div>

                    {errors.map((error, index) => { // iterate over error messages returned from submission attempt
                        return (
                            <div
                                key={index} // assign stable key for React list rendering
                                className='p-5 mb-4 bg-airbnb text-white rounded-xl opacity-80'
                            >
                                {error} {/* render individual error message text */}
                            </div>
                        )
                    })}

                    <CustomButton
                        label='Previous'
                        className='mb-2 bg-black hover:bg-gray-800'
                        onClick={() => setCurrentStep(4)} // navigate back to location step
                    />

                    <CustomButton
                        label='Submit'
                        onClick={submitForm} // trigger form submission and backend request
                    />
                </>
            )}
        </>
    )

    return (
        <>
            <Modal
                isOpen={addPropertyModal.isOpen}
                close={addPropertyModal.close}
                label="Add property"
                content={content}
            />
        </>
    )
}

export default AddPropertyModal;