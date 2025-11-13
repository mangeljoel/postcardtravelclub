import { Text, Box, Flex } from "@chakra-ui/react";
import NewStoryList from "../TravelGuide/NewStoryList";
import { useEffect, useContext, useState } from "react";
import AppContext from "../AppContext";
import LandingHeroSection from "../../patterns/LandingHeroSection";
import CountryFilter from "../TagResultPage/CountryFilter";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import { apiNames, populateAlbumData } from "../../services/fetchApIDataSchema";
import useDebouncedInput from "../../hooks/useDebouncedInput";
import LoadingGif from "../../patterns/LoadingGif";
import DebouncedAutoCompleteInput from "../../patterns/DebouncedAutoCompleteInput";

const AllHotels = ({ isHotel, post, countryName }) => {
    const { isTabletOrMobile } = useContext(AppContext);
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const [searchFilter, setSearchFilter] = useState({});
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('')
    const [inputValue, handleInputChange, resetInput] = useDebouncedInput(
        1000, // Debounce time
        setSearchText // Callback function
    );
    const [autoCompleteItems, setAutoCompleteItems] = useState([]);

    const pageSize = 6;

    const fetchAlbums = async (currentPage, reset = false, useSearchText = false) => {
        if (isLoading) return; // Prevent multiple fetches
        setIsLoading(true);
        try {
            let response = await fetchPaginatedResults(
                apiNames.album,
                {
                    ...(searchFilter?.country ? { country: searchFilter.country } : {}), // Include current filters
                    isFeatured: true,
                    isActive: true,
                    directories: {
                        slug: {
                            $in: ["mindful-luxury-tours"]
                        }
                    },
                    ...(searchText && useSearchText ? {
                        $or: [{
                            name: { $containsi: searchText }
                        },
                        { news_article: { title: { $containsi: searchText } } }]
                    } : {})
                },
                populateAlbumData,
                undefined,
                currentPage * 6,
                pageSize
            );

            response = Array.isArray(response) ? response : [response]

            // Determine if there are more results
            if (response.length < pageSize) {
                setHasMore(false);
            }

            // Update albums and reset if necessary
            setFilteredAlbums((prev) => (reset ? response : [...prev, ...response]));
        } catch (error) {
            console.error("Failed to fetch albums:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Fetch data when search filter changes, resetting the list
        setIsLoading(true);
        setPage(0);
        setFilteredAlbums([]);
        setHasMore(true);
        fetchAlbums(0, true, false);
        setSearchText('')
        resetInput()
    }, [searchFilter]);

    useEffect(() => {
        // Fetch data when search filter changes, resetting the list
        setIsLoading(true);
        setPage(0);
        setFilteredAlbums([]);
        setHasMore(true);
        fetchAlbums(0, true, true);
    }, [searchText])

    useEffect(() => {
        if (searchText) {
            const searchLower = searchText.toLowerCase()
            const tags = new Set()
            const names = new Set()
            for (const item of filteredAlbums) {
                if (item?.name.toLowerCase().includes(searchLower)) {
                    names.add(item.name)
                }
            }
            setAutoCompleteItems([...tags, ...names])
        }
        else {
            setAutoCompleteItems([])
        }
    }, [filteredAlbums, searchText])

    const fetchMoreData = () => {
        if (!hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchAlbums(nextPage, false, true);
    };

    return (
        <Flex flexDirection={"column"} w={"100%"}>
            <LandingHeroSection type="tours" />
            <Box
                w={"100%"}
                pl={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
                pr={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
                mx="auto"
                textAlign="center"
            >
                <DebouncedAutoCompleteInput inputValue={inputValue} handleInputChange={handleInputChange} resetInput={resetInput} autoCompleteItems={autoCompleteItems} loading={isLoading} />

                <CountryFilter filter={searchFilter} setFilter={setSearchFilter} type={"tours"} />
                {isLoading ? <LoadingGif /> : filteredAlbums && filteredAlbums?.length > 0 ? (
                    <>
                        <NewStoryList
                            stories={filteredAlbums}
                            isStoriesLoading={isLoading}
                            fetchMoreData={fetchMoreData}
                            hasMore={hasMore} // Pass hasMore flag
                            dataLength={filteredAlbums?.length} // Pass the length of the data
                        />
                    </>
                ) : (
                    <Text
                        w={["100%", "100%"]}
                        mt={["6%", "3%"]}
                        mx="auto"
                        textAlign="center"
                        variant="subHeading"
                    >
                        No Tours for now...
                    </Text>
                )}
            </Box>
        </Flex>
    );
};

export default AllHotels;
