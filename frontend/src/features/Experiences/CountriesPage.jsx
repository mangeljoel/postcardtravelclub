import { Box, Text, Flex, Button, useToast, useBreakpointValue } from "@chakra-ui/react";
import { useState, useContext, useEffect, useCallback } from "react";
import AppContext from "../AppContext";
import useDebouncedInput from "../../hooks/useDebouncedInput";
import DebouncedAutoCompleteInput from "../../patterns/DebouncedAutoCompleteInput";
import axios from "axios";
import CountryGrid from "./CountryGrid";
import { useRouter } from "next/router";
import { FiShare2 } from "react-icons/fi";
import HeroBanner from "./HeroBanner";
import CountryFilter from "../TagResultPage/CountryFilter"; // Add this import

const CountriesPage = ({ type }) => {
    const router = useRouter();
    const toast = useToast();
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { profile } = useContext(AppContext);
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [inputValue, debouncedValue, handleInputChange, resetInput] = useDebouncedInput(1000);
    const [filter, setFilter] = useState({}); // Add this state

    const [autoCompleteItems, setAutoCompleteItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const handleShareClick = () => {
        const currentUrl = window.location.href;

        if (isMobile && navigator.share) {
            navigator.share({
                title: document.title,
                url: currentUrl,
            });
        } else {
            try {
                navigator.clipboard.writeText(currentUrl)
                    .then(() => {
                        toast({
                            title: `URL Copied`,
                            status: 'success',
                            isClosable: true,
                            position: 'top',
                            variant: "subtle"
                        });
                    })
                    .catch((err) => {
                        console.error('Error copying URL:', err);
                    });
            } catch (err) {
                console.error('Error:', err);
            }
        }
    };

    const handleAutoCompleteSelect = useCallback((value) => {
        handleInputChange({ target: { value } });
    }, [handleInputChange]);

    const resetDebouncedInput = useCallback(() => {
        resetInput();
        setAutoCompleteItems([]);
        setFilteredCountries(countries);
    }, [resetInput, countries]);

    const fetchAutoComplete = useCallback(async (newSearch, reset = false) => {
        setSearchLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/albums/getAutoCompleteItems`,
                {
                    params: {
                        type: type === "experiences" ? "postcards" : "albums",
                        search: newSearch?.trim()?.length > 1 ? newSearch.trim() : "",
                        page: reset ? 1 : page,
                        pageSize: 15
                    }
                }
            );

            const resultSet = response?.data?.resultSet ?? [];

            setAutoCompleteItems(prev =>
                reset ? resultSet : [...prev, ...resultSet]
            );

            setHasMore(resultSet.length >= 15);
            setPage(prev => reset ? 2 : prev + 1);
        } catch (error) {
            console.error("Error fetching autocomplete suggestions:", error);
            setHasMore(false);
        } finally {
            setSearchLoading(false);
        }
    }, [page, type]);

    // Modified to include filter
    const loadCountries = useCallback(async () => {
        setSearchLoading(true);
        try {
            let endpoint = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getAllStats?statsType=country`;

            // Add country filter if selected (and not "All Countries")
            if (filter?.country && filter?.country?.id !== -1) {
                endpoint += `&id=${filter.country.id}`;
            }

            console.log('Fetching countries from:', endpoint);

            const response = await axios.get(endpoint);

            if (response?.data?.data) {
                console.log('Countries data:', response.data.data);

                // Sort by experiences count (descending)
                const sortedCountries = [...response.data.data].sort((a, b) =>
                    b.stats.experiences - a.stats.experiences
                );

                setCountries(sortedCountries);
                setFilteredCountries(sortedCountries);
            }
        } catch (error) {
            console.error("Error fetching countries", error);
            toast({
                title: 'Error fetching countries',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setSearchLoading(false);
        }
    }, [toast, filter]); // Add filter to dependencies

    useEffect(() => {
        loadCountries();
    }, [loadCountries]);

    const loadMoreItems = useCallback(() => {
        if (!hasMore) return;
        fetchAutoComplete(inputValue);
    }, [fetchAutoComplete, hasMore, inputValue]);

    useEffect(() => {
        if (inputValue && inputValue.trim().length > 0) {
            fetchAutoComplete(inputValue, true);

            const filtered = countries.filter(country =>
                (country.name || "").toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredCountries(filtered);
        } else {
            setAutoCompleteItems([]);
            setFilteredCountries(countries);
        }
    }, [inputValue, countries]);

    const handleCountryClick = useCallback((country) => {
        const slug = country.slug || (country.name || "").toLowerCase().replace(/\s+/g, '-');
        router.push(`/experiences/countries/${encodeURIComponent(slug)}`);
    }, [router]);

    return (
        <Flex w={"100%"} flexDirection={"column"}>
            <HeroBanner
                title={"Postcard Countries"}
                subtitle={
                    "Discover curated experiences by boutique hotels that advance conscious luxury travel."
                } />

            <Box
                pos="relative"
                w={"100%"}
                pl={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
                pr={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
                mx="auto"
                textAlign="center"
            >
                {/* Add CountryFilter component */}
                {/* <CountryFilter
                    filter={filter}
                    setFilter={setFilter}
                    type={"hotels"}
                /> */}

                <Box w="100%" mb="1em" mt={["3em", "1em"]}>
                    <CountryGrid
                        profile={profile}
                        countries={filteredCountries}
                        onCountryClick={handleCountryClick}
                    />
                </Box>
            </Box>
        </Flex>
    );
};

export default CountriesPage;