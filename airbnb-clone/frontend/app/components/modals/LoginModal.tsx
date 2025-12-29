'use client';

import Modal from "./Modal"; // import Modal to render the login form inside a reusable modal dialog
import { useState } from "react"; // import useState to manage local component state
import { useRouter } from 'next/navigation'; // import useRouter to programmatically redirect after successful login
import useLoginModal from "@/app/hooks/useLoginModal"; // import custom hook to control login modal open and close state
import CustomButton from "../forms/CustomButton"; // import CustomButton to submit the login form with consistent styling
import { handleLogin } from "@/app/lib/actions"; // import handleLogin to persist authentication tokens and user session data
import apiService from "@/app/services/apiService"; // import apiService to communicate with backend authentication APIs

const LoginModal = () => { // define a functional component named 'LoginModal' to handle user authentication via modal
    const router = useRouter() // initialize router to redirect user after successful login
    const loginModal = useLoginModal() // initialize modal state controller for login modal
    const [email, setEmail] = useState(''); // store the email entered by the user
    const [password, setPassword] = useState(''); // store the password entered by the user
    const [errors, setErrors] = useState<string[]>([]); // store authentication or validation error messages

    const submitLogin = async () => { // define an async function to submit login credentials to the backend
        const formData = { // construct payload object containing user credentials
            email: email, // assign email value from component state
            password: password // assign password value from component state
        }

        const response = await apiService.postWithoutToken('/api/auth/login/', JSON.stringify(formData)) // send login request without auth token to backend endpoint

        if (response.access) { // check whether backend returned an access token indicating successful authentication
            handleLogin(response.user.pk, response.access, response.refresh); // persist user session data and authentication tokens
            loginModal.close(); // close the login modal after successful login
            router.push('/') // redirect user to homepage
        } else {
            setErrors(response.non_field_errors); // store backend error messages to display to the user
        }
    }

    const content = ( // define JSX content to be injected into the Modal component
        <>
            <form
                action={submitLogin} // bind form submission to the submitLogin handler
                className="space-y-4"
            >
                <input
                    onChange={(e) => setEmail(e.target.value)} // update email state when user types into input
                    placeholder="Your e-mail address"
                    type="email"
                    className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
                />

                <input
                    onChange={(e) => setPassword(e.target.value)} // update password state when user types into input
                    placeholder="Your password"
                    type="password"
                    className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
                />

                {errors.map((error, index) => { // iterate over authentication errors returned from backend
                    return (
                        <div
                            key={`error_${index}`} // provide stable unique key for each rendered error
                            className="p-5 bg-airbnb text-white rounded-xl opacity-80"
                        >
                            {error} {/* render error message text */}
                        </div>
                    )
                })}

                <CustomButton
                    label="Submit"
                    onClick={submitLogin} // trigger login submission when button is clicked
                />
            </form>
        </>
    )

    return (
        <Modal
            isOpen={loginModal.isOpen}
            close={loginModal.close}
            label="Log in"
            content={content}
        />
    )
}

export default LoginModal;