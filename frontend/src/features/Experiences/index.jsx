import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { useState, useContext, useEffect, useRef } from "react";
import SearchResults from "./SearchResults";
import LoadingGif from "../../patterns/LoadingGif";
import AppContext from "../AppContext";
import LandingHeroSection from "../../patterns/LandingHeroSection";
import GuidedSearchPostcard from "../GuidedSearch/GuidedSearchPostcard";
import GuidedSearchAlbum from "../GuidedSearch/GuidedSearchAlbum";
import useDebouncedInput from "../../hooks/useDebouncedInput";
import DebouncedAutoCompleteInput from "../../patterns/DebouncedAutoCompleteInput";
import axios from "axios";
import SelectedTagList from "./SelectedTagList";
import PostcardModal from "../PostcardModal";
import CollectionForm from "../CollectionForm";
import CountryGrid from "./CountryGrid";
import AutoSlideshow from "../HomePage1/HeroSection/AutoSlideshow"
import { useRouter } from "next/router";
import { createDBEntry } from "../../queries/strapiQueries";

const Experiences = ({ type, filterType, initialFilter, searchQuery }) => {
    const router = useRouter();
    const { profile, canCreatePostcard } = useContext(AppContext);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const [filter, setFilter] = useState({});
    const [appliedTag, setAppliedTag] = useState(null);
    const [showCreateAlbum, setShowCreateAlbum] = useState(false);
    const [inputValue, debouncedValue, handleInputChange, resetInput, setValue] = useDebouncedInput(1000);

    const [autoCompleteItems, setAutoCompleteItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [hasInitialized, setHasInitialized] = useState(false);
    const isUpdatingFromUrl = useRef(false);
    const prevDebouncedValue = useRef(debouncedValue);

    const images = [
        "/assets/homepage/press_logo_1.png",
        "/assets/homepage/press_logo_2.png",
        "/assets/homepage/press_logo_3.png",
        "/assets/homepage/press_logo_4.png",
        "/assets/homepage/press_logo_5.png",
        "/assets/homepage/press_logo_6.png",
        "/assets/homepage/press_logo_7.png",
        "/assets/homepage/press_logo_8.png"
    ];


    // Initialize filter from props
    useEffect(() => {
        if (!hasInitialized) {
            if (searchQuery) {
                setValue(searchQuery);
                setFilter({ searchText: searchQuery });
            } else if (initialFilter) {
                setFilter(initialFilter);
                // Set input value if searchText exists in initialFilter
                if (initialFilter.searchText) {
                    setValue(initialFilter.searchText);
                }
            }
            setHasInitialized(true);
        }
    }, [searchQuery, initialFilter, setValue, hasInitialized]);

    // Sync URL query parameter when debounced value changes
    useEffect(() => {
        if (!hasInitialized) return;
        if (isUpdatingFromUrl.current) {
            isUpdatingFromUrl.current = false;
            return;
        }

        const currentPath = router.pathname;
        const currentQuery = { ...router.query };

        if (debouncedValue && debouncedValue.trim()) {
            currentQuery.search = debouncedValue.trim();
        } else {
            delete currentQuery.search;
        }

        // Check if URL actually needs updating
        const needsUpdate = debouncedValue?.trim()
            ? currentQuery.search !== router.query.search
            : router.query.search !== undefined;

        if (needsUpdate) {
            router.push(
                {
                    pathname: currentPath,
                    query: currentQuery,
                },
                undefined,
                { shallow: true }
            );
        }
    }, [debouncedValue, hasInitialized]);

    // Update filter when debounced value changes
    useEffect(() => {
        if (!hasInitialized) return;

        // Check if debouncedValue actually changed
        if (prevDebouncedValue.current !== debouncedValue) {
            prevDebouncedValue.current = debouncedValue;

            if (debouncedValue && debouncedValue.trim()) {
                // When search is active, clear all other filters
                setFilter({ searchText: debouncedValue.trim() });
            } else {
                // When search is cleared, remove searchText from filter
                setFilter((prev) => {
                    const newFilter = { ...prev };
                    delete newFilter.searchText;
                    return newFilter;
                });
            }
        }
    }, [debouncedValue, hasInitialized]);

    const handleAutoCompleteSelect = async (value) => {

        await createDBEntry("events", { event_master: 12, user: profile?.id, searchData: { searchText: value, type: "autocomplete", searchFor: type } });


        handleInputChange({ target: { value } });
    };

    const resetDebouncedInput = () => {
        resetInput();
        setFilter((prev) => {
            const newFilter = { ...prev };
            delete newFilter.searchText;
            return newFilter;
        });
        setAutoCompleteItems([]);
        prevDebouncedValue.current = '';
    };

    // Wrapper for setFilter that resets search when other filters are applied
    const handleFilterChange = (newFilter) => {
        // Check if the new filter has any keys other than searchText
        const hasOtherFilters = Object.keys(newFilter).some(key => key !== 'searchText');

        if (hasOtherFilters && inputValue) {
            // If other filters are being set and search input exists, reset search
            resetInput();
            setAutoCompleteItems([]);
            prevDebouncedValue.current = '';
        }

        setFilter(newFilter);
    };

    const fetchAutoComplete = async (newSearch, reset = false) => {
        setSearchLoading(true);
        try {
            const endpoint =
                type === "experiences"
                    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getAutoCompleteItems`
                    : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/albums/getAutoCompleteItems`;

            const response = await axios.get(endpoint, {
                params: {
                    search: newSearch.trim()?.length > 1 ? newSearch.trim() : "",
                    page: reset ? 1 : page,
                    pageSize: 15,
                },
            });

            if (response?.data) {
                // ✅ Handle both response formats
                const rawData = type === "experiences"
                    ? (response.data.data || [])      // Postcards use data.data
                    : (response.data.resultSet || []); // Albums use data.resultSet

                // ✅ Transform the data
                const transformedData = rawData.map((item) => ({
                    ...item,
                    text: item.name || item.text // Convert 'name' to 'text'
                }));

                setAutoCompleteItems((prev) =>
                    reset
                        ? transformedData
                        : [...(prev || []), ...transformedData]
                );
                setHasMore(rawData.length >= 15);
                setPage(reset ? 2 : (prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error fetching autocomplete suggestions:", error);
            setHasMore(false);
        } finally {
            setSearchLoading(false);
        }
    };


    const toggleHomePage = () => {

    }

    const loadCountries = async () => {
        setSearchLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/albums/getCountryStats`,
                {
                    params: {
                        type: "experience"
                    }
                }
            );
            if (response?.data) {
                setCountries(response.data.sort((a, b) =>
                    a.albums > b.albums
                        ? -1
                        : a.albums < b.albums
                            ? 1
                            : 0
                ))
            }
        } catch (error) {
            console.error("Error fetching countries", error);

        } finally {
            setSearchLoading(false);
        }
    }

    useEffect(() => { loadCountries() }, [])

    const loadMoreItems = () => {
        fetchAutoComplete(inputValue);
    };

    const fetchSingleAlbum = () => {
        // Add your fetch logic here if needed
    };

    useEffect(() => {
        if (!hasInitialized) return;
        fetchAutoComplete(inputValue, true);
    }, [inputValue, type, hasInitialized]);

    useEffect(() => setAppliedTag(null), [filter]);

    return (
        <Flex w={"100%"} flexDirection={"column"}>
            <Flex
                direction="column"
                align="center"
                justify="center"
                px={4}
                textAlign="center"
                mt={["6%", "2%"]}
                mb={["6%", "2vw"]}
                w={"100%"}
            >
                <Text fontSize={["8vw", "3.5vw"]} fontFamily={"lora"} fontWeight="bold" mb={6}>
                    {type === "experiences" ? "Postcard Experiences" : "Postcard Stays"}
                </Text>
                <Text fontSize={["4.5vw", "1.6vw"]} maxW={["90%", "55%"]} fontWeight="medium" fontFamily={"lora"}>
                    {type === "experiences"
                        ? "Find authentic experiences by boutique properties that advance conscious luxury travel."
                        : "Find boutique properties that curate authentic experiences and advance conscious luxury travel."}
                </Text>
            </Flex>
            <Box
                pos="relative"
                w={"100%"}
                pl={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
                pr={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
                mx="auto"
                textAlign="center"
            >
                <DebouncedAutoCompleteInput
                    inputValue={inputValue}
                    handleInputChange={handleInputChange}
                    resetInput={resetDebouncedInput}
                    autoCompleteItems={autoCompleteItems}
                    loading={searchLoading}
                    handleAutoCompleteSelect={handleAutoCompleteSelect}
                    loadMoreItems={loadMoreItems}
                    hasMore={hasMore}
                    placeholder={type === "experiences"
                        ? "Search by country, region or interest"
                        : "Search by country, region or property"}
                />

                {type === "experiences" ?
                    <GuidedSearchPostcard
                        type={filterType}
                        filter={filter}
                        setFilter={handleFilterChange}
                        callBeforeApply={() => resetInput()}
                    /> :
                    <GuidedSearchAlbum
                        filter={filter}
                        setFilter={handleFilterChange}
                        callBeforeApply={() => resetInput()}
                    />
                }

                {type !== "experiences" && (
                    <>
                        {/* <Button
                            onClick={() => {
                                setShowCreateAlbum(true);
                            }}
                            mt={4}
                        >
                            Create New
                        </Button> */}
                        <PostcardModal
                            size="3xl"
                            isShow={showCreateAlbum}
                            headerText={"Create"}
                            children={
                                <CollectionForm
                                    onClose={() => {
                                        setShowCreateAlbum(false);
                                    }}
                                    mode="create"
                                />
                            }
                            handleClose={() => setShowCreateAlbum(false)}
                        />
                    </>
                )}

                <SelectedTagList filter={filter} appliedTag={appliedTag} setAppliedTag={setAppliedTag} />

                {filter?.searchText && <Text
                    fontSize={["4vw", "1.46vw"]}
                    textAlign={"start"}
                    fontFamily={"lora"}
                    fontStyle={"italic"}
                    color={"#111111"}
                    mt={10}
                    mb={3}
                //px={["0%", "10%"]}
                >
                    {type === "experiences" ? "Things to do - " : "Places to stay - "}<Text as={"span"} fontWeight={"600"}>{inputValue}</Text>
                </Text>}

                <Box w="100%" mb="1em" mt={["0", "1em"]}>
                    <SearchResults
                        searchFilter={filter}
                        type={type}
                        profile={profile}
                        canCreatePostcard={canCreatePostcard}
                        loading={loading}
                        setLoading={setLoading}
                        appliedTag={appliedTag}
                    />
                </Box>


            </Box>
        </Flex >
    );
};

export default Experiences;