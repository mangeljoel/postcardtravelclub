import { useEffect, useState } from "react";
import { fetchPaginatedResults } from "../queries/strapiQueries";

// Custom hook for country data
export const useCountries = (type, slug, aff, dependencies = []) => {
    const [countries, setCountries] = useState([]);
    let apiName = 'countries';
    switch (type) {
        case 'all':
            // this will fetch all countries
            apiName = 'countries';
            break;
        case 'albums':
            // this will fetch all countries that have albums
            apiName = 'albums/findcountries';
            break;
        case 'hotels':
            // this will fetch all countries that have stays/hotels
            apiName = `country/getCountries?type=hotels${aff ? `&affiliation=${aff}` : ''}`;
            break;
        case 'tours':
            // this will fetch all countries that have tours
            apiName = `country/getCountries?type=tours${aff ? `&affiliation=${aff}` : ''}`;
            break;
        case 'postcards':
            // this will fetch all countries that have postcards
            apiName = `country/getCountries?resultFor=postcards${aff ? `&affiliation=${aff}` : ''}`;
            break;
        case 'profile-postcards':
            // this will fetch all countries of postcards user has collected
            apiName = `country/getCountries?resultFor=postcards${slug ? `&profile=${slug}` : ''}`;
            break;
        case 'profile-stays':
            // this will fetch all countries of stays user has followed
            apiName = `country/getCountries?resultFor=albums&type=hotels&${slug ? `&profile=${slug}` : ''}`;
            break;
        case 'memories':
              apiName = `country/getCountries?type=memories&${slug ? `&profile=${slug}` : ''}`;
            break;
        default:
            apiName = 'countries';
            break;
    }

    useEffect(() => {
        fetchPaginatedResults(apiName, {}, undefined, 'name:ASC')
            .then(setCountries)
            .catch(console.error);
    }, dependencies);

    return countries;
};