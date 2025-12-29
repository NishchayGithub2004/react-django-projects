'use client';

import Modal from "./Modal"; // import Modal to render the signup form inside a reusable modal dialog
import { useState } from "react"; // import useState to manage local component state
import { useRouter } from "next/navigation"; // import useRouter to redirect user after successful signup
import useSignupModal from "@/app/hooks/useSignupModal"; // import custom hook to control signup modal open and close state
import CustomButton from "../forms/CustomButton"; // import CustomButton to submit the signup form with consistent styling
import apiService from "@/app/services/apiService"; // import apiService to communicate with backend authentication APIs
import { handleLogin } from "@/app/lib/actions"; // import handleLogin to persist authentication tokens and user session data

const SignupModal = () => { // define a functional component named 'SignupModal' to handle user registration flow
    const router = useRouter(); // initialize router to navigate user after successful signup
    
    const signupModal = useSignupModal(); // initialize modal state controller for signup modal
    
    const [email, setEmail] = useState(''); // store the email entered by the user
    const [password1, setPassword1] = useState(''); // store the primary password entered by the user
    const [password2, setPassword2] = useState(''); // store the confirmation password entered by the user
    const [errors, setErrors] = useState<string[]>([]); // store validation or backend error messages

    const submitSignup = async () => { // define an async function to submit signup data to the backend
        const formData = { // construct payload object containing registration credentials
            email: email, // assign email value from component state
            password1: password1, // assign primary password from component state
            password2: password2 // assign confirmation password from component state
        }

        const response = await apiService.postWithoutToken('/api/auth/register/', JSON.stringify(formData)); // send registration request without auth token to backend endpoint

        if (response.access) { // check whether backend returned an access token indicating successful registration
            handleLogin(response.user.pk, response.access, response.refresh); // persist user session data and authentication tokens
            signupModal.close(); // close the signup modal after successful registration
            router.push('/') // redirect user to homepage
        } else {
            const tmpErrors: string[] = Object.values(response).map((error: any) => { // extract all error messages returned by backend response
                return error; // normalize each error value into a string
            })

            setErrors(tmpErrors); // update local error state to display feedback to the user
        }
    }

    const content = ( // define JSX content to be injected into the Modal component
        <>
            <form
                action={submitSignup} // bind form submission to the submitSignup handler
                className="space-y-4"
            >
                <input onChange={(e) => setEmail(e.target.value)} placeholder="Your e-mail address" type="email" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" /> {/* capture and store user email input */}
                <input onChange={(e) => setPassword1(e.target.value)} placeholder="Your password" type="password" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" /> {/* capture and store primary password input */}
                <input onChange={(e) => setPassword2(e.target.value)} placeholder="Repeat password" type="password" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" /> {/* capture and store password confirmation input */}
            
                {errors.map((error, index) => { // iterate over signup error messages returned from backend
                    return (
                        <div 
                            key={`error_${index}`} // provide stable unique key for each rendered error
                            className="p-5 bg-airbnb text-white rounded-xl opacity-80"
                        >
                            {error} {/* render individual error message text */}
                        </div>
                    )
                })}

                <CustomButton
                    label="Submit"
                    onClick={submitSignup} // trigger signup submission when button is clicked
                />
            </form>
        </>
    )

    return (
        <Modal
            isOpen={signupModal.isOpen}
            close={signupModal.close}
            label="Sign up"
            content={content}
        />
    )
}

export default SignupModal;