import { create } from "zustand"; // import create to define a Zustand store for shared state management

interface AddPropertyModalStore { // define a TypeScript interface to strongly type the modal state and actions
    isOpen: boolean; // represent whether the add property modal is currently visible
    open: () => void; // define an action to open the modal by updating state
    close: () => void; // define an action to close the modal by updating state
}

const useAddPropertyModal = create<AddPropertyModalStore>((set) => ({ // create a Zustand store hook to manage add property modal state
    isOpen: false, // initialize modal state as closed by default
    open: () => set({ isOpen: true }), // update state to mark the modal as open
    close: () => set({ isOpen: false }) // update state to mark the modal as closed
}));

export default useAddPropertyModal; // export the custom hook to allow modal state access across the application