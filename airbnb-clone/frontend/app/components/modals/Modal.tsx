'use client';

import { 
    useCallback, // import useCallback to memoize callback functions and prevent unnecessary re-creations across renders
    useEffect, // import useEffect to perform side effects in response to state or prop changes
    useState // import useState to manage local component state within the functional component
} from "react";

interface ModalProps { // define a type named 'ModalProps' to represent the properties passed to the 'Modal' component
    label: string; // define label to represent the modal title text displayed in the header
    close: () => void; // define close as a callback function to notify parent component to close the modal
    content: React.ReactElement; // define content to render dynamic JSX content inside the modal body
    isOpen: boolean; // define isOpen to control whether the modal should be visible or hidden
}

const Modal: React.FC<ModalProps> = ({ // define a functional component named 'Modal' to render a reusable modal dialog which takes following props
    label, // receive label to display as modal heading text
    content, // receive content to inject custom JSX into the modal body
    isOpen, // receive isOpen to determine current open or closed state from parent
    close // receive close callback to trigger modal dismissal in parent
}) => {
    const [showModal, setShowModal] = useState(isOpen) // create internal state to control animation visibility based on open status

    useEffect(() => {
        setShowModal(isOpen) // synchronize internal animation state whenever external open state changes
    }, [isOpen]) // re-run effect only when isOpen value updates

    const handleClose = useCallback(() => {
        setShowModal(false); // update internal state to start modal close animation

        setTimeout(() => {
            close(); // invoke parent close callback after animation duration completes
        }, 300) // delay execution by 300 millisecond to match modal exit animation timing
    }, [close]) // memoize handler so it only changes when close reference changes

    if (!isOpen) return null; // prevent rendering modal markup when modal is not explicitly open

    return (
        <div className="flex items-center justify-center fixed inset-0 z-50 bg-black/60">
            <div className="relative w-[90%] md:w-[80%] lg:w-[700px] my-6 mx-auto h-auto">
                <div className={`translate duration-600 h-full ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-10'}`}> {/* dynamically toggle animation classes based on internal visibility state */}
                    <div className="w-full h-auto rounded-xl relative flex flex-col bg-white">
                        <header className="h-[60px] flex items-center p-6 rounded-t justify-center relative border-b">
                            <div
                                onClick={handleClose} // attach click handler to initiate modal close behavior
                                className="p-3 absolute left-3 hover:bg-gray-300 rounded-full cursor-pointer"
                            >
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>

                            <h2 className="text-lg font-bold">{label}</h2> {/* render modal title using label prop */}
                        </header>

                        <section className="p-6">
                            {content} {/* render injected JSX content provided by parent */}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;