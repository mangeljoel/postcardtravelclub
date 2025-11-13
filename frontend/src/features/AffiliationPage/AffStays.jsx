import React, { useCallback, useEffect, useState } from 'react'
import { fetchPaginatedResults } from '../../queries/strapiQueries';
import { apiNames, populateAlbumData } from '../../services/fetchApIDataSchema';
import LoadingGif from '../../patterns/LoadingGif';
import NewStoryList from '../TravelGuide/NewStoryList';
import { Box, Flex, Text } from '@chakra-ui/react';
import GuidedSearchAlbum from '../GuidedSearch/GuidedSearchAlbum';
import axios from 'axios';
import SelectedTagList from '../Experiences/SelectedTagList';
import useDebouncedInput from '../../hooks/useDebouncedInput';
import DebouncedAutoCompleteInput from '../../patterns/DebouncedAutoCompleteInput';

const AffStays = ({ aff }) => {
    const [stays, setStays] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [filter, setFilter] = useState({});
    const [appliedTag, setAppliedTag] = useState(null);

    const [inputValue, debouncedValue, handleInputChange, resetInput] = useDebouncedInput(
        1000, // Debounce time
        // setSearchText // Callback function
    );
    const [autoCompleteItems, setAutoCompleteItems] = useState([]);
    const [searchPage, setSearchPage] = useState(1);
    const [searchHasMore, setSearchHasMore] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);

    const fetchStays = useCallback(async () => {
        if (isFetching || !hasMore) return;

        setIsFetching(true);
        try {
            const queryParts = [];
            queryParts.push(`page=${page}`);
            queryParts.push(`pageSize=6`);
            if (aff) queryParts.push(`affiliation=${aff}`);
            if (filter?.searchText) queryParts.push(`searchText=${filter?.searchText}`);
            if (filter?.country && filter?.country?.id !== -1) queryParts.push(`country=${filter?.country?.id}`);
            if (filter?.environment && filter?.environment?.id !== -1) queryParts.push(`environment=${filter?.environment?.id}`);
            if (filter?.category && filter?.category?.id !== -1) queryParts.push(`category=${filter?.category?.id}`);
            if (filter?.tagGroup && filter?.tagGroup?.id !== -1) queryParts.push(`tagGroup=${filter?.tagGroup?.id}`);
            if (appliedTag) queryParts.push(`selectedTag=${appliedTag?.id}`);

            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/albums/getAlbums${queryParts.length > 0 ? `?${queryParts.join('&')}` : ''}`,
                {
                    tags: filter?.selectedTags?.map(tag => tag.id) || [],
                },
            );

            if (data?.length) {
                setStays((prev) => [...prev, ...data]);
                setPage((prev) => prev + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to fetch stays:", error);
        } finally {
            setIsFetching(false);
            setInitialLoading(false);  // Set initial loading to false after first fetch
        }
    }, [page, hasMore, isFetching, filter]);

    // Reset stays when slug or filter changes
    useEffect(() => {
        setStays([]);
        setPage(1);
        setHasMore(true);
        setInitialLoading(true);  // Reset initial loading when filter/slug changes
    }, [filter, appliedTag]);

    useEffect(() => setAppliedTag(null), [filter]);

    // Fetch stays whenever page resets to 0 after a filter or slug change
    useEffect(() => {
        if (page === 1 && hasMore) {
            fetchStays();
        }
    }, [page, hasMore]);

    const handleAutoCompleteSelect = (value) => {
        handleInputChange({ target: { value } })
        setFilter((prev) => ({ searchText: value }));
    };

    const resetDebouncedInput = () => {
        resetInput();
        setFilter((prev) => ({ ...prev, searchText: "" }));
        setAutoCompleteItems([]);
    }

    const fetchAutoComplete = async (newSearch, reset = false) => {
        // if (!newSearch.trim() || newSearch.length < 3) {
        //     setAutoCompleteItems([]);
        //     setHasMore(false);
        //     return;
        // }

        setSearchLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/albums/getAutoCompleteItems`,
                {
                    params: {
                        type: "albums",
                        search: newSearch.trim()?.length > 1 ? newSearch.trim() : "",
                        page: reset ? 1 : searchPage,
                        pageSize: 15,
                        affiliation: aff
                    }
                }
            );

            if (response?.data) {
                setAutoCompleteItems(prev =>
                    reset ? response.data.resultSet : [...prev, ...response.data.resultSet]
                );
                setSearchHasMore(response.data.length >= 15);
                if (reset) setSearchPage(2);
                else setSearchPage(prev => prev + 1);
            }
        } catch (error) {
            console.error("Error fetching autocomplete suggestions:", error);
            setSearchHasMore(false);
        } finally {
            setSearchLoading(false);
        }
    };

    const loadMoreItems = () => {
        fetchAutoComplete(inputValue);
    };

    useEffect(() => {
        // if (inputValue?.length < 3) {
        //     setAutoCompleteItems([]);
        //     return
        // }
        fetchAutoComplete(inputValue, true);
    }, [inputValue, aff]);

    const renderContent = () => {
        if (initialLoading) {
            return <LoadingGif />;
        }
        return stays?.length > 0 ?
            <NewStoryList mt={3} stories={stays} hasMore={hasMore} fetchMoreData={fetchStays} dataLength={stays?.length} isStoriesLoading={isFetching} />
            : <Flex
                w="100%"
                minH={["500px", "600px"]}
                py={["15%", 0]}
                justifyContent="center"
                alignItems={["flex-start", "center"]}
            >
                <Text
                    maxW={["50vw", "27vw"]}
                    fontSize={["4vw", "1.67vw"]}
                    fontFamily="lora"
                    fontStyle="italic"
                    textAlign="center"
                >
                    No Stays
                </Text>
            </Flex>
    };

    return <Box
        w="100%"
        pl={{ base: "5%", lg: "10%" }}
        pr={{ base: "5%", lg: "10%" }}
    >
        <DebouncedAutoCompleteInput inputValue={inputValue} handleInputChange={handleInputChange} resetInput={resetDebouncedInput} autoCompleteItems={autoCompleteItems} loading={searchLoading} handleAutoCompleteSelect={handleAutoCompleteSelect} loadMoreItems={loadMoreItems} hasMore={searchHasMore} />

        <GuidedSearchAlbum type={"hotels"} filter={filter} setFilter={setFilter} aff={aff} />

        <SelectedTagList filter={filter} appliedTag={appliedTag} setAppliedTag={setAppliedTag} />

        {filter?.searchText && <Text
            fontSize={["3vw", "1.46vw"]}
            textAlign={"start"}
            fontFamily={"lora"}
            fontStyle={"italic"}
            color={"#111111"}
            mt={10}
            mb={6}
            px={["0%", "10%"]}
        >
            Showing results for "<Text as={"span"} fontWeight={"600"}>{inputValue}...</Text>"
        </Text>}

        {renderContent()}
    </Box>
}

export default AffStays