import { create } from "zustand"; // import create to define a Zustand store for managing shared search modal state

export type SearchQuery = { // define a type describing all search filter parameters used by the search modal to store the following things
    country: string | undefined; // selected country code or undefined when not selected
    checkIn: Date | undefined; // check-in date or undefined when not set
    checkOut: Date | undefined; // check-out date or undefined when not set
    guests: Number; // number of guests included in the search
    bathrooms: Number; // number of bathrooms required in the search
    bedrooms: Number; // number of bedrooms required in the search
    category: string; // selected category identifier for filtering results
}

interface SearchModalStore { // define the shape of the Zustand store for search modal state and actions
    isOpen: boolean; // represent whether the search modal is currently visible
    step: string; // track the current step of the multi-step search flow
    open: (step: string) => void; // define an action to open the modal at a specific step
    close: () => void; // define an action to close the search modal
    query: SearchQuery; // store the current search query state
    setQuery: (query: SearchQuery) => void; // define an action to replace the current search query
}

const useSearchModal = create<SearchModalStore>((set) => ({ // create a Zustand store hook to manage search modal behavior and data
    isOpen: false, // initialize modal visibility as closed
    step: '', // initialize step as empty before modal is opened
    open: (step) => set({ isOpen: true, step: step }), // open the modal and set the active step in the search flow
    close: () => set({ isOpen: false }), // close the modal without mutating other state
    setQuery: (query: SearchQuery) => set({ query: query }), // replace the stored search query with new filter values
    query: { // define default search query values used on initial load
        country: '',
        checkIn: undefined,
        checkOut: undefined,
        guests: 1,
        bedrooms: 0,
        bathrooms: 0,
        category: ''
    }
}));

export default useSearchModal; // export the hook to allow global access to search modal state