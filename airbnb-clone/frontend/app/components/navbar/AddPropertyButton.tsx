'use client';

import useLoginModal from "@/app/hooks/useLoginModal"; // import custom hook to control login modal visibility
import useAddPropertyModal from "@/app/hooks/useAddPropertyModal"; // import custom hook to control add property modal visibility

interface AddPropertyButtonProps { // define props interface to type data required by AddPropertyButton
    userId?: string | null; // store optional user id to determine authentication state
}

const AddPropertyButton: React.FC<AddPropertyButtonProps> = ({ // define a functional component named 'AddPropertyButton' to allow users to add a property which takes following props
    userId // receive user id to check whether the user is logged in
}) => {
    const loginModal = useLoginModal(); // initialize login modal hook to prompt authentication when required
    
    const addPropertyModal = useAddPropertyModal(); // initialize add property modal hook to open property creation flow

    const airbnbYourHome = () => { // define click handler to decide whether to open add property flow or login modal
        if (userId) { // check if user is authenticated
            addPropertyModal.open(); // open add property modal for authenticated users
        } else {
            loginModal.open(); // prompt login modal for unauthenticated users
        }
    }

    return (
        <div 
            onClick={airbnbYourHome} // attach click handler to trigger add property or login flow
            className="p-2 cursor-pointer text-sm font-semibold rounded-full hover:bg-gray-200"
        >
            Djangobnb your home
        </div>
    )
}

export default AddPropertyButton;