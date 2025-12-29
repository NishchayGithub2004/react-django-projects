import { create } from "zustand"; // import create to define a Zustand store for managing shared UI state

interface SignupModalStore { // define a TypeScript interface to describe signup modal state and actions
    isOpen: boolean; // represent whether the signup modal is currently visible
    open: () => void; // define an action to open the signup modal
    close: () => void; // define an action to close the signup modal
}

const useSignupModal = create<SignupModalStore>((set) => ({ // create a Zustand store hook to manage signup modal behavior
    isOpen: false, // initialize modal visibility as closed by default
    open: () => set({ isOpen: true }), // update state to open the signup modal
    close: () => set({ isOpen: false }) // update state to close the signup modal
}));

export default useSignupModal; // export the hook to allow signup modal control across the application