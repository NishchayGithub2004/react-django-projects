'use client';

import { format } from 'date-fns'; // import date formatting utility to convert Date objects into API-compatible strings
import { useEffect, useState } from 'react'; // import React hooks to manage component state and side effects
import { useSearchParams } from 'next/navigation'; // import hook to read URL search parameters for reactive updates
import PropertyListItem from "./PropertyListItem"; // import component to render individual property cards
import apiService from '@/app/services/apiService'; // import API service abstraction to fetch property data from backend
import useSearchModal from '@/app/hooks/useSearchModal'; // import custom hook to access global search filter state

export type PropertyType = { // define a type to strictly describe the shape of a property object used in this list
    id: string; // store unique identifier for the property
    title: string; // store display title of the property
    image_url: string; // store URL of the main property image
    price_per_night: number; // store nightly price used for display and calculations
    is_favorite: boolean; // store whether the property is marked as favorite by the user
}

interface PropertyListProps { // define props interface to configure which properties should be fetched
    landlord_id?: string | null; // optionally restrict results to properties owned by a specific landlord
    favorites?: boolean | null; // optionally restrict results to only favorited properties
}

const PropertyList: React.FC<PropertyListProps> = ({ // define a functional component named 'PropertyList' to fetch and render a list of properties which takes following props
    landlord_id, // receive landlord id to filter properties by owner when provided
    favorites // receive favorites flag to fetch only favorited properties when enabled
}) => {
    const params = useSearchParams(); // read URL search params to refetch data when query string changes
    
    const searchModal = useSearchModal(); // initialize search modal hook to access current search filters
    
    // extract search filters from search state to use in API calls
    const country = searchModal.query.country;
    const numGuests = searchModal.query.guests;
    const numBathrooms = searchModal.query.bathrooms;
    const numBedrooms = searchModal.query.bedrooms;
    const checkinDate = searchModal.query.checkIn;
    const checkoutDate = searchModal.query.checkOut;
    const category = searchModal.query.category;
    
    const [properties, setProperties] = useState<PropertyType[]>([]); // store fetched properties to render and update UI reactively

    console.log('searchQUery:', searchModal.query); // log current search query for debugging filter behavior
    
    console.log('numBedrooms', numBedrooms); // log bedroom count to debug search parameter propagation

    const markFavorite = (id: string, is_favorite: boolean) => { // define a helper to update favorite state of a property locally
        const tmpProperties = properties.map((property: PropertyType) => { // iterate through properties to find the matching one
            if (property.id == id) { // check if current property matches the target id
                property.is_favorite = is_favorite; // update favorite flag to keep UI in sync with backend

                if (is_favorite) {
                    console.log('added to list of favorited propreties'); // log when a property is favorited for debugging
                } else {
                    console.log('removed from list'); // log when a property is unfavorited for debugging
                }
            }

            return property; // return property to rebuild updated array
        })

        setProperties(tmpProperties); // update state so the UI reflects the new favorite status
    }

    const getProperties = async () => { // define an async function to fetch properties based on active filters
        let url = '/api/properties/'; // initialize base API endpoint for property listing

        if (landlord_id) { // check if properties should be filtered by landlord
            url += `?landlord_id=${landlord_id}`; // append landlord filter query parameter
        } else if (favorites) { // check if only favorite properties should be fetched
            url += '?is_favorites=true'; // append favorites filter query parameter
        } else {
            let urlQuery = ''; // initialize query string builder for dynamic filters

            // append applied filter(s) as a query parameter to the URL if given
            
            if (country) {
                urlQuery += '&country=' + country;
            }

            if (numGuests) {
                urlQuery += '&numGuests=' + numGuests;
            }

            if (numBedrooms) {
                urlQuery += '&numBedrooms=' + numBedrooms;
            }

            if (numBathrooms) {
                urlQuery += '&numBathrooms=' + numBathrooms;
            }

            if (category) {
                urlQuery += '&category=' + category;
            }

            if (checkinDate) {
                urlQuery += '&checkin=' + format(checkinDate, 'yyyy-MM-dd');
            }

            if (checkoutDate) {
                urlQuery += '&checkout=' + format(checkoutDate, 'yyyy-MM-dd');
            }

            if (urlQuery.length) { // if any filters were applied
                console.log('Query:', urlQuery); // log final query string for debugging API calls
                urlQuery = '?' + urlQuery.substring(1); // convert accumulated params into a valid query string
                url += urlQuery; // append query string to base API URL
            }
        }

        const tmpProperties = await apiService.get(url); // fetch property data from backend using constructed URL

        setProperties(tmpProperties.data.map((property: PropertyType) => { // normalize favorite flags based on backend response
            if (tmpProperties.favorites.includes(property.id)) { // check if property id exists in favorites list
                property.is_favorite = true; // mark property as favorite
            } else {
                property.is_favorite = false; // mark property as not favorite
            }

            return property; // return normalized property object
        }));
    };

    useEffect(() => { // run side effect to fetch properties
        getProperties(); // trigger property fetch with updated filters
    }, [category, searchModal.query, params]); // re-run side effect to re-fetch properties when search filters or URL params change

    return (
        <>
            {properties.map((property) => { // iterate over fetched properties to render each one
                return (
                    <PropertyListItem 
                        key={property.id}
                        property={property}
                        markFavorite={(is_favorite: any) => markFavorite(property.id, is_favorite)} // pass callback to allow child to update favorite state
                    />
                )
            })}
        </>
    )
}

export default PropertyList;