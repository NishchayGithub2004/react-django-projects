import { create } from "zustand"; // import create to define a Zustand store for managing shared UI state

interface LoginModalStore { // define a TypeScript interface to describe login modal state and actions
    isOpen: boolean; // represent whether the login modal is currently visible
    open: () => void; // define an action to open the login modal
    close: () => void; // define an action to close the login modal
}

const useLoginModal = create<LoginModalStore>((set) => ({ // create a Zustand store hook to manage login modal behavior
    isOpen: false, // initialize modal visibility as closed by default
    open: () => set({ isOpen: true }), // update state to open the login modal
    close: () => set({ isOpen: false }) // update state to close the login modal
}));

export default useLoginModal; // export the hook to allow login modal control across the application